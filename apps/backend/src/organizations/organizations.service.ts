import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrgRole, Prisma } from 'generated/prisma/client';
import {
  DEFAULT_SCHEDULE_SLOTS,
  DEFAULT_SERVICES,
} from './organizations.constants';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto, userId: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // create organization with owner
        const organization = await tx.organization.create({
          data: {
            name: createOrganizationDto.name,
            slug: createOrganizationDto.slug,
            members: {
              create: {
                userId,
                role: OrgRole.OWNER,
              },
            },
          },
          include: { members: true },
        });

        const member = organization.members[0];

        // create schedule
        await tx.weeklySchedule.create({
          data: {
            memberId: member.id,
            validFrom: new Date(),
            validUntil: null,
            slots: {
              create: DEFAULT_SCHEDULE_SLOTS,
            },
          },
        });

        // create default services
        await tx.service.createMany({
          data: DEFAULT_SERVICES.map((service) => ({
            ...service,
            organizationId: organization.id,
          })),
        });

        const services = await tx.service.findMany({
          where: { organizationId: organization.id },
          select: { id: true },
        });

        await tx.memberService.createMany({
          data: services.map((service) => ({
            memberId: member.id,
            serviceId: service.id,
          })),
        });

        //update user last organization
        await tx.user.update({
          where: { id: userId },
          data: { lastActiveOrganizationId: organization.id },
        });

        return organization;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This slug is already used!');
      }
      throw error;
    }
  }

  async findManyByUserId(userId: number) {
    return this.prisma.organizationMember.findMany({
      where: { userId },
      include: {
        organization: true,
      },
    });
  }

  async getLastOrganization(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        lastActiveOrganization: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    return user?.lastActiveOrganization ?? null;
  }

  async getMemberByUserAndOrganization(userId: number, organizationId: number) {
    return await this.prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
    });
  }

  async getServices(organizationId: number) {
    return await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { services: true },
    });
  }

  async getMemberById(memberId: number) {
    return await this.prisma.organizationMember.findUnique({
      where: { id: memberId },
    });
  }

  async getAllOrganizationMembers(organizationId: number) {
    const members = await this.prisma.organizationMember.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      select: {
        id: true,
        role: true,
        userId: true,
        organizationId: true,
        isActive: true,

        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return members.map(({ user, ...member }) => ({
      ...member,
      name: user.name,
    }));
  }
}
