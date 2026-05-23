import { Injectable } from '@nestjs/common';
import { UserType } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findOneByProvider(
    provider: string,
    providerAccountId: string,
    userType: UserType,
  ) {
    return await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
        user: {
          type: userType,
        },
      },
      include: { user: true },
    });
  }

  async findMany(userId: number) {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }

  async create(
    provider: string,
    providerAccountId: string,
    accesToken: string,
    refreshToken: string,
    userId: number,
  ) {
    return await this.prisma.account.create({
      data: {
        provider,
        providerAccountId,
        type: 'oauth',
        access_token: accesToken,
        refresh_token: refreshToken,
        userId,
      },
    });
  }
}
