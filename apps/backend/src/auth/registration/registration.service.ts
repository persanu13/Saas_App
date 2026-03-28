import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterClientDto } from './dto/register-client.dto';
import { UsersService } from 'src/users/users.service';
import { VerificationTokenService } from '../verification-token.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class RegistrationService {
  constructor(
    private usersService: UsersService,
    private verificationTokenService: VerificationTokenService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async registerClient(registerDto: RegisterClientDto) {
    // Verification if email is already used
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
      'CUSTOMER',
    );
    if (existingUser) {
      if (!existingUser.isActive) {
        throw new ForbiddenException(
          'This account has been disabled. Contact support.',
        );
      }
      if (!existingUser.emailVerified) {
        return {
          message: 'Account already exists. You need to verified your email.',
        };
      }
      throw new ConflictException('The email is already in use.');
    }
    // Hash the password
    const hashPassword = await bcrypt.hash(registerDto.password, 10);
    // Create user
    const user = await this.usersService.create(
      registerDto.email,
      registerDto.name,
      'CUSTOMER',
      registerDto.phone,
      hashPassword,
    );
    // Send verification email
    this.sendVerificationEmail(registerDto.email);
    return user;
  }

  async sendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email, 'CUSTOMER');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');

    await this.verificationTokenService.deleteAllByUserId(user.id, 'EMAIL');

    await this.verificationTokenService.create(user.id, token, 'EMAIL');

    const verificationLink = `${this.configService.get('FRONTEND_URL')}/auth/email-verification?token=${token}&email=${encodeURIComponent(email)}`;

    await this.mailService.sendEmail({
      to: email,
      subject: 'Welcome to Trimly',
      template: 'signup-confirmation-email',
      context: {
        name: user.name,
        verificationLink,
      },
    });
  }

  async verifyEmailToken(token: string) {
    const existed = await this.verificationTokenService.findOne(token);
    if (!existed) {
      throw new NotFoundException('Invalid token.');
    }
    if (existed.expiresAt < new Date()) {
      await this.verificationTokenService.delete(token);
      throw new GoneException('Expiret Token.');
    }
    await this.verificationTokenService.deleteAllByUserId(
      existed.userId,
      'EMAIL',
    );
    return this.usersService.updateEmailVerification(existed.userId);
  }
}
