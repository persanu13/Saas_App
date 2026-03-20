import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ConfigService } from '@nestjs/config';
import { Role, Session } from 'generated/prisma/client';
import { SessionService } from './session/session.service';
import { JwtPayload } from './interfaces/payload';
import * as crypto from 'crypto';
import { AccountService } from './account/account.service';
import { EmailNotVerifiedException } from './exceptions/unverified-email.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sesionService: SessionService,
    private accountService: AccountService,
  ) {}

  async login(user: JwtPayload) {
    const { accessToken, refreshToken } = await this.createTokens(
      user.sub,
      user.email,
      user.role,
    );

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

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.hashPassword) {
      throw new BadRequestException(
        'This account use OAuth. Connect with Google/GitHub.',
      );
    }

    const isMatch = await bcrypt.compareSync(password, user.hashPassword);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new EmailNotVerifiedException();
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'Your account has been deactivated. Contact support.',
      );
    }

    return user;
  }

  async createTokens(userId: number, email: string, role: Role) {
    const payload: JwtPayload = { sub: userId, email: email, role: role };

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

    const expiresMs = parseInt(
      this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
    );

    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.sesionService.create(refreshTokenHash, userId, expiresMs);

    return {
      accessToken,
      refreshToken,
    };
  }

  async rotateTokens(sessionToken: string, user: JwtPayload) {
    await this.sesionService.deactivateSession(sessionToken);

    const { accessToken, refreshToken } = await this.createTokens(
      user.sub,
      user.email,
      user.role,
    );

    return { accessToken, refreshToken };
  }

  async verificationSession(refreshToken: string, payload: JwtPayload) {
    const sessions = await this.sesionService.findUserSessions(payload.sub);

    let validSession: Session | null = null;
    for (const session of sessions) {
      const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');
      const isMatch = session.sessionToken === tokenHash;
      if (isMatch) {
        validSession = session;
        break;
      }
    }

    if (!validSession) {
      throw new UnauthorizedException('Invalid session!');
    }

    return validSession;
  }

  async validateGoogleUser(googleUser: {
    provider: string;
    providerAccountId: any;
    email: any;
    name: any;
    picture: any;
    accessToken: string;
    refreshToken: string;
  }) {
    const existingAccount = await this.accountService.findOneByProvider(
      googleUser.provider,
      googleUser.providerAccountId,
    );

    if (existingAccount) {
      return existingAccount.user;
    }

    const existingUser = await this.usersService.findByEmail(googleUser.email);

    if (existingUser) {
      await this.accountService.create(
        googleUser.provider,
        googleUser.providerAccountId,
        googleUser.accessToken,
        googleUser.refreshToken,
        existingUser.id,
      );
      return existingUser;
    }

    const newUser = await this.usersService.create(
      googleUser.email,
      googleUser.name,
      googleUser.picture,
    );

    await this.accountService.create(
      googleUser.provider,
      googleUser.providerAccountId,
      googleUser.accessToken,
      googleUser.refreshToken,
      newUser.id,
    );

    return newUser;
  }
}
