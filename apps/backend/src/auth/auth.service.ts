import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { VerificationTokenService } from './verification-token.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private verificationTokenService: VerificationTokenService,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // const user = await this.usersService.findByEmail(email);
    // if (user && user.hashPassword === pass) {
    //   const { hashPassword, ...result } = user;
    //   return result;
    // }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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
    const token = crypto.randomUUID();
    await this.verificationTokenService.deleteAllByEmail(email);
    await this.verificationTokenService.create(email, token);

    const verificationLink = `${this.config.get('APP_URL')}/auth/verify-email?token=${token}&email=${email}`;

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
}
