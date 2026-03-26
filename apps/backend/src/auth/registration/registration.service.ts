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
    const user = await this.usersService.create(
      registerDto.email,
      registerDto.name,
      'CUSTOMER',
      hashPassword,
    );
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
    // const existed = await this.verificationTokenService.findOne(email, token);
    // if (!existed) {
    //   throw new NotFoundException('Invalid token.');
    // }
    // if (existed.expires < new Date()) {
    //   await this.verificationTokenService.delete(email, token);
    //   throw new GoneException('Expiret Token.');
    // }
    // await this.verificationTokenService.deleteAllByEmail(email);
    // return this.usersService.updateEmailVerification(email);
  }
}
