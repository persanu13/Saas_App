import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async create(sessionToken: string, userId: number, expires: number) {
    return await this.prisma.session.create({
      data: {
        sessionToken: sessionToken,
        userId: userId,
        expires: new Date(Date.now() + expires),
      },
    });
  }

  async findUserSessions(userId: number) {
    return await this.prisma.session.findMany({
      where: {
        userId: userId,
        isActive: true,
        expires: { gt: new Date() },
      },
    });
  }

  async deactivateSession(sessionToken: string) {
    return await this.prisma.session.updateMany({
      where: { sessionToken },
      data: { isActive: false },
    });
  }
}
