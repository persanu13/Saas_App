import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: number, dto: CreateServiceDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.memberIds?.length) {
        const members = await tx.organizationMember.findMany({
          where: {
            id: { in: dto.memberIds },
            organizationId,
            isActive: true,
          },
        });

        if (members.length !== dto.memberIds.length) {
          throw new BadRequestException(
            'One or more members do not belong to this organization',
          );
        }
      }

      return tx.service.create({
        data: {
          organizationId,
          name: dto.name,
          description: dto.description,
          durationMin: dto.durationMin,
          price: dto.price,
          members: dto.memberIds?.length
            ? {
                create: dto.memberIds.map((memberId) => ({ memberId })),
              }
            : undefined,
        },
        include: {
          members: {
            include: {
              member: {
                include: { user: { select: { id: true, name: true } } },
              },
            },
          },
        },
      });
    });
  }

  async getServicesByMemberId(memberId: number) {
    return this.prisma.service.findMany({
      where: {
        isActive: true,
        members: {
          some: {
            memberId,
          },
        },
      },
    });
  }

  async remove(id: number) {
    console.log(id);
    try {
      return await this.prisma.service.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Service not found`);
      }

      throw e;
    }
  }

  async update(id: number, dto: UpdateServiceDto) {
    return this.prisma.$transaction(async (tx) => {
      const service = await tx.service.findUnique({
        where: { id },
        include: { members: true },
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      if (dto.memberIds?.length) {
        const members = await tx.organizationMember.findMany({
          where: {
            id: { in: dto.memberIds },
            organizationId: service.organizationId,
            isActive: true,
          },
        });

        if (members.length !== dto.memberIds.length) {
          throw new BadRequestException(
            'One or more members do not belong to this organization',
          );
        }
      }

      const updatedService = await tx.service.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          durationMin: dto.durationMin,
          price: dto.price,
        },
      });

      if (dto.memberIds) {
        await tx.memberService.deleteMany({
          where: { serviceId: id },
        });

        if (dto.memberIds.length) {
          await tx.memberService.createMany({
            data: dto.memberIds.map((memberId) => ({
              serviceId: id,
              memberId,
            })),
          });
        }
      }

      return tx.service.findUnique({
        where: { id },
        include: {
          members: {
            include: {
              member: {
                include: {
                  user: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      });
    });
  }
}
