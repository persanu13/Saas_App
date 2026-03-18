import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PasswordResetTokenService {
  constructor(private prisma: PrismaService) {}

  async create(token: string, userId: number) {
    return await this.prisma.passwordResetToken.create({
      data: { token, userId, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
    });
  }

  async deactivateMany(userId: number) {
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }

  async findOne(token: string) {
    return await this.prisma.passwordResetToken.findFirst({
      where: { token: token },
    });
  }
}
