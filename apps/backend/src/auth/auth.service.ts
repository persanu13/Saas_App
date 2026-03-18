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
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { VerificationTokenService } from './verification-token.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { Role, Session } from 'generated/prisma/client';
import { SesionService } from './sesion/sesion.service';
import { JwtPayload } from './interfaces/payload';
import * as crypto from 'crypto';
import { PasswordResetTokenService } from './password-reset-token/password-reset-token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private verificationTokenService: VerificationTokenService,
    private mailService: MailService,
    private configService: ConfigService,
    private sesionService: SesionService,
    private passwordResetTokenService: PasswordResetTokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Your account has been deactivated.');
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
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
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

  async verifyRefreshToken(refreshToken: string, payload: JwtPayload) {
    const sessions = await this.sesionService.findUserSesions(payload.sub);

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

  async rotateTokens(sessionToken: string, user: JwtPayload) {
    await this.sesionService.deactivateSession(sessionToken);

    const { accessToken, refreshToken } = await this.createTokens(
      user.sub,
      user.email,
      user.role,
    );

    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    // Verification if email is already used
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      if (!existingUser.isActive) {
        throw new ForbiddenException(
          'This account has been disabled. Contact support.',
        );
      }
      if (!existingUser.emailVerified) {
        await this.sendVerificationEmail(existingUser.email, registerDto.name);
        return {
          message:
            'Account already exists. I have resent your verification email.',
        };
      }
      throw new ConflictException('The email is already in use.');
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      hashPassword,
    });

    // Send verification email
    this.sendVerificationEmail(registerDto.email, registerDto.name);

    return user;
  }

  async sendVerificationEmail(email: string, name: string) {
    const token = crypto.randomBytes(32).toString('hex');
    await this.verificationTokenService.deleteAllByEmail(email);
    await this.verificationTokenService.create(email, token);

    const verificationLink = `${this.configService.get('APP_URL')}/auth/verify-email?token=${token}&email=${email}`;

    await this.mailService.sendEmail({
      to: email,
      subject: 'Welcome to the realm of NestJS',
      template: 'signup-confirmation-email',
      context: {
        name,
        verificationLink,
      },
    });
  }

  async verifyEmail(email: string, token: string) {
    const existed = await this.verificationTokenService.findOne(email, token);
    if (!existed) {
      throw new NotFoundException('Invalid token.');
    }
    if (existed.expires < new Date()) {
      await this.verificationTokenService.delete(email, token);
      throw new GoneException('Expiret Token.');
    }
    await this.verificationTokenService.deleteAllByEmail(email);
    return this.usersService.updateEmailVerification(email);
  }

  async forgotPassword(email: string) {
    const existed = await this.usersService.findByEmail(email);
    if (!existed) {
      return {
        message:
          'If this email exists in the system, you will receive a reset link.',
      };
    }
    const token = crypto.randomBytes(32).toString('hex');

    await this.passwordResetTokenService.deactivateMany(existed.id);
    await this.passwordResetTokenService.create(token, existed.id);

    const resetLink = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${token}`;

    await this.mailService.sendEmail({
      to: email,
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        name: existed.name,
        resetLink,
      },
    });
    return {
      message:
        'If this email exists in the system, you will receive a reset link.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.passwordResetTokenService.findOne(token);

    if (!record || record.expiresAt < new Date() || record.used) {
      throw new BadRequestException('Invalid token');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(record.userId, newPasswordHash);

    await this.passwordResetTokenService.deactivateMany(record.userId);

    return { message: 'Password reseted succesful!' };
  }
}
