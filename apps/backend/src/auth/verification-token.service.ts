import { Injectable } from '@nestjs/common';
import { VerificationTokenType } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VerificationTokenService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, token: string, type: VerificationTokenType) {
    await this.prisma.verificationToken.create({
      data: {
        token,
        userId,
        type,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
  }

  async findOne(token: string) {
    return await this.prisma.verificationToken.findUnique({
      where: { token },
    });
  }

  async delete(token: string) {
    await this.prisma.verificationToken.delete({
      where: { token },
    });
  }

  async deleteAllByUserId(userId: number, type: VerificationTokenType) {
    await this.prisma.verificationToken.deleteMany({
      where: { userId, type },
    });
  }
}
