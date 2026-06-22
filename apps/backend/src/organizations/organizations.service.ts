import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Organization, OrgRole, Prisma } from 'generated/prisma/client';
import {
  DEFAULT_SCHEDULE_SLOTS,
  DEFAULT_SERVICES,
} from './organizations.constants';
import { randomBytes } from 'node:crypto';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/interfaces/payload';
import { format } from 'date-fns';

@Injectable()
export class OrganizationsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

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
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        services: {
          where: { isActive: true },
          include: {
            members: {
              include: {
                member: true,
              },
            },
          },
        },
      },
    });

    return organization?.services.map((service) => ({
      ...service,
      members: service.members.map((ms) => ms.member),
    }));
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
            email: true,
            phone: true,
          },
        },
      },
    });
    return members.map(({ user, ...member }) => ({
      ...member,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }));
  }

  async sendInvitation(
    organization: Organization,
    email: string,
    invitedBy: JwtPayload,
  ) {
    const existing = await this.prisma.organizationInvite.findFirst({
      where: {
        organizationId: organization.id,
        email,
        status: 'PENDING',
      },
    });

    if (existing) {
      throw new ConflictException(
        'An invitation is already pending for this email',
      );
    }

    const token = randomBytes(32).toString('hex');

    const invite = await this.prisma.organizationInvite.create({
      data: {
        organizationId: organization.id,
        email,
        role: 'STAFF',
        token,
        invitedById: invitedBy.sub,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const frontendUrl = this.configService.get('FRONTEND_URL');
    const invitationLink = `${frontendUrl}/invites/accept?token=${token}&email=${encodeURIComponent(email)}&organization_id=${organization.id}`;

    await this.mailService.sendEmail({
      to: invite.email,
      subject: `Invitation to join ${organization.name}`,
      template: 'member-invitation',
      context: {
        organizationName: organization.name,
        invitedByName: invitedBy.email,
        invitationLink,
        expiresAt: format(invite.expiresAt, 'PPP'),
        currentYear: new Date().getFullYear(),
      },
    });

    return invite;
  }

  async acceptInvite(token: string, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const invite = await tx.organizationInvite.findUnique({
        where: { token },
      });

      if (!invite || invite.status !== 'PENDING') {
        throw new BadRequestException('Invalid or expired invitation');
      }

      if (invite.expiresAt < new Date()) {
        await tx.organizationInvite.update({
          where: { id: invite.id },
          data: { status: 'EXPIRED' },
        });
        throw new BadRequestException('This invitation has expired');
      }

      const member = await tx.organizationMember.create({
        data: {
          userId,
          organizationId: invite.organizationId,
          role: 'STAFF',
        },
      });

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

      const services = await tx.service.findMany({
        where: { organizationId: invite.organizationId },
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
        data: { lastActiveOrganizationId: invite.organizationId },
      });

      await tx.organizationInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' },
      });

      return invite;
    });
  }

  async getAllWithSlug() {
    return await this.prisma.organization.findMany({
      where: {
        slug: {
          not: null,
        },
      },
    });
  }

  async getBySlug(slug: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
      include: {
        services: {
          where: { isActive: true },
          include: {
            members: {
              include: {
                member: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        members: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            services: {
              select: { serviceId: true },
            },
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const members = organization.members.map((m) => ({
      id: m.id,
      role: m.role,
      userId: m.userId,
      organizationId: m.organizationId,
      isActive: m.isActive,
      name: m.user.name,
      email: m.user.email,
      phone: m.user.phone,
    }));

    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      services: organization.services.map((service) => ({
        ...service,
        members: service.members.map((m) => ({
          ...m.member,
          name: m.member.user.name,
        })),
      })),
      members,
    };
  }

  async getOrganizationClients(organizationId: number) {
    return this.prisma.organizationClient.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
