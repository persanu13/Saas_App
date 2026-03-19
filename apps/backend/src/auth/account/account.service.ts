import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findOneByProvider(provider: string, providerAccountId: string) {
    return await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: { user: true },
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
