import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SesionService {
  constructor(private prisma: PrismaService) {}

  async create(sesionToken: string, userId: number, expires: number) {
    return await this.prisma.session.create({
      data: {
        sessionToken: sesionToken,
        userId: userId,
        expires: new Date(Date.now() + expires),
      },
    });
  }

  async findUserSesions(userId: number) {
    return await this.prisma.session.findMany({
      where: {
        userId: userId,
        isActive: true,
        expires: { gt: new Date() },
      },
    });
  }

  async deactivateSession(sesionToken: string) {
    return await this.prisma.session.update({
      where: { sessionToken: sesionToken },
      data: { isActive: false },
    });
  }
}
