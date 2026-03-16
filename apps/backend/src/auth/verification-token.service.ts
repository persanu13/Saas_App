import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VerificationTokenService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, token: string) {
    await this.prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minute
      },
    });
  }

  async findOne(email: string, token: string) {
    return await this.prisma.verificationToken.findFirst({
      where: { identifier: email, token: token },
    });
  }

  async delete(email: string, token: string) {
    await this.prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    });
  }

  async deleteAllByEmail(email: string) {
    await this.prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });
  }
}
