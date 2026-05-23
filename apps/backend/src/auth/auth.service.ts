import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import { Session, UserType } from 'generated/prisma/client';
import { SessionService } from './session/session.service';
import { JwtPayload } from './interfaces/payload';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { AccountService } from './account/account.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sesionService: SessionService,
    private accountService: AccountService,
  ) {}

  async email(email: string, type: UserType) {
    const user = await this.usersService.findByEmail(email, type);

    if (!user) {
      return { exists: false };
    }

    if (!user.isActive) {
      throw new ForbiddenException('Your account was deactivate!');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Your email is not verified! Please verified your email.',
      );
    }

    if (!user.hashPassword) {
      return {
        exists: true,
        accounts: await this.accountService.findMany(user.id),
      };
    }
    return { exists: true };
  }

  async validateUser(
    email: string,
    password: string,
    type: UserType,
  ): Promise<any> {
    const user = await this.usersService.findByEmail(email, type);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.hashPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.hashPassword);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'Your account has been deactivated. Contact support.',
      );
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(payload: JwtPayload) {
    const { accessToken, refreshToken } = await this.createTokens(payload);

    const expiresMs = parseInt(
      this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
    );
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.sesionService.create(refreshTokenHash, payload.sub, expiresMs);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    this.sesionService.deactivateSession(tokenHash);
  }

  async createTokens(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_ACCESS_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async rotateTokens(sessionToken: string, payload: JwtPayload) {
    const { accessToken, refreshToken } = await this.createTokens(payload);
    const expiresMs = parseInt(
      this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
    );
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.sesionService.updateSesion(
      sessionToken,
      expiresMs,
      refreshTokenHash,
    );

    return { accessToken, refreshToken };
  }

  async verificationSession(refreshToken: string, payload: JwtPayload) {
    const sessions = await this.sesionService.findUserActiveSessions(
      payload.sub,
    );

    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    for (const session of sessions) {
      const isMatch = session.sessionToken === tokenHash;
      if (isMatch) {
        return session;
      }
    }

    throw new UnauthorizedException('Invalid session!');
  }
}
