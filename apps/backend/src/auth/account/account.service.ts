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
    userId: number,
  ) {
    return await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId_userId: {
          provider,
          providerAccountId,
          userId,
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
    accessToken: string,
    refreshToken: string,
    userId: number,
  ) {
    return await this.prisma.account.create({
      data: {
        provider,
        providerAccountId,
        type: 'oauth',
        access_token: accessToken,
        refresh_token: refreshToken,
        userId,
      },
    });
  }

  async createWithUser(
    email: string,
    name: string,
    userType: UserType,
    provider: string,
    providerAccountId: string,
    accessToken: string,
    refreshToken: string,
  ) {
    return await this.prisma.user.create({
      data: {
        email: email,
        name: name,
        type: userType,
        emailVerified: new Date(),
        accounts: {
          create: {
            provider: provider,
            providerAccountId: providerAccountId,
            type: 'oauth',
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        },
      },
    });
  }
}
