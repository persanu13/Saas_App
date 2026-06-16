import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

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

  findAll() {
    return `This action returns all services`;
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
