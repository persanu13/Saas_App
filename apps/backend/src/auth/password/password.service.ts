import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async forgotPassword(email: string) {
    // const existed = await this.usersService.findByEmail(email);
    // if (!existed) {
    //   return {
    //     message:
    //       'If this email exists in the system, you will receive a reset link.',
    //   };
    // }
    // const token = crypto.randomBytes(32).toString('hex');
    // await this.prisma.passwordResetToken.deleteMany({
    //   where: { userId: existed.id },
    // });
    // await this.prisma.passwordResetToken.create({
    //   data: {
    //     token,
    //     userId: existed.id,
    //     expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    //   },
    // });
    // const resetLink = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${token}`;
    // await this.mailService.sendEmail({
    //   to: email,
    //   subject: 'Reset your password',
    //   template: 'reset-password',
    //   context: {
    //     name: existed.name,
    //     resetLink,
    //   },
    // });
    // return {
    //   message:
    //     'If this email exists in the system, you will receive a reset link.',
    // };
  }

  async resetPassword(token: string, newPassword: string) {
    // const record = await this.prisma.passwordResetToken.findFirst({
    //   where: { token },
    // });
    // if (!record || record.expiresAt < new Date() || record.used) {
    //   throw new BadRequestException('Invalid token');
    // }
    // const newPasswordHash = await bcrypt.hash(newPassword, 10);
    // await this.usersService.updatePassword(record.userId, newPasswordHash);
    // await this.prisma.passwordResetToken.deleteMany({
    //   where: { userId: record.userId },
    // });
    // return { message: 'Password reseted succesful!' };
  }
}
