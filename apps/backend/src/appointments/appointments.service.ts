import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentFromAvailabilityDto } from './dto/create-appointment-from-availability.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}
  async create(createAppointmentDto: CreateAppointmentDto, bookedById: number) {
    const services = await this.prisma.service.findMany({
      where: { id: { in: createAppointmentDto.serviceIds } },
      select: { id: true, durationMin: true },
    });

    if (services.length !== createAppointmentDto.serviceIds.length) {
      throw new BadRequestException('One or more services do not exist');
    }

    const totalDuration = services.reduce((sum, s) => sum + s.durationMin, 0);
    const endMin = createAppointmentDto.startMin + totalDuration;

    return this.prisma.appointment.create({
      data: {
        memberId: createAppointmentDto.memberId,
        bookedById,
        clientId: createAppointmentDto.clientId,
        clientName: createAppointmentDto.clientName,
        clientPhone: createAppointmentDto.clientPhone,
        date: new Date(createAppointmentDto.date),
        startMin: createAppointmentDto.startMin,
        endMin,
        notes: createAppointmentDto.notes,
        services: {
          create: services.map((s) => ({ serviceId: s.id })),
        },
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
        member: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        client: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  async createFromAvailability(
    dto: CreateAppointmentFromAvailabilityDto,
    bookedById: number,
  ) {
    const { services, dateTime } = dto;
    const date = new Date(dateTime.date);

    // 1. iei detaliile serviciilor (durata)
    const serviceIds = services.map((s) => s.serviceId);
    const serviceDetails = await this.prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, durationMin: true, organizationId: true },
    });
    const serviceMap = new Map(serviceDetails.map((s) => [s.id, s]));

    // 2. pentru fiecare serviciu, rezolvi membrul — fie cel specificat, fie primul disponibil
    const resolvedServices: {
      serviceId: number;
      memberId: number;
      startMin: number;
      endMin: number;
    }[] = [];
    let cursor = dateTime.startMin;

    for (const sel of services) {
      const service = serviceMap.get(sel.serviceId);
      if (!service) {
        throw new BadRequestException(`Service ${sel.serviceId} not found`);
      }

      const neededStart = cursor;
      const neededEnd = cursor + service.durationMin;

      let resolvedMemberId: number;

      if (sel.memberId) {
        // verifica ca membrul specificat e disponibil in intervalul necesar
        const isAvailable = await this.isMemberAvailable(
          sel.memberId,
          date,
          neededStart,
          neededEnd,
        );

        if (!isAvailable) {
          throw new ConflictException(
            `Member ${sel.memberId} is not available for service ${sel.serviceId} at the requested time`,
          );
        }

        resolvedMemberId = sel.memberId;
      } else {
        // gasesti primul membru care face serviciul asta si e disponibil
        const memberServices = await this.prisma.memberService.findMany({
          where: { serviceId: sel.serviceId },
          select: { memberId: true },
        });

        const availableMember = await this.findFirstAvailableMember(
          memberServices.map((m) => m.memberId),
          date,
          neededStart,
          neededEnd,
        );

        if (!availableMember) {
          throw new ConflictException(
            `No available member found for service ${sel.serviceId} at the requested time`,
          );
        }

        resolvedMemberId = availableMember;
      }

      resolvedServices.push({
        serviceId: sel.serviceId,
        memberId: resolvedMemberId,
        startMin: neededStart,
        endMin: neededEnd,
      });

      cursor = neededEnd;
    }

    // 3. grupezi serviciile pe membru — daca doi membri diferiti,
    //    creezi doua programari separate (fiecare cu intervalul sau)
    const byMember = new Map<number, typeof resolvedServices>();
    for (const rs of resolvedServices) {
      if (!byMember.has(rs.memberId)) {
        byMember.set(rs.memberId, []);
      }
      byMember.get(rs.memberId)!.push(rs);
    }

    // 4. creezi programarile intr-o tranzactie
    return this.prisma.$transaction(async (tx) => {
      const appointments: any = [];

      for (const [memberId, memberServices] of byMember.entries()) {
        const startMin = Math.min(...memberServices.map((s) => s.startMin));
        const endMin = Math.max(...memberServices.map((s) => s.endMin));

        const appointment = await tx.appointment.create({
          data: {
            memberId,
            bookedById,
            clientId: dto.clientId,
            clientName: dto.clientName,
            clientPhone: dto.clientPhone,
            notes: dto.notes,
            date,
            startMin,
            endMin,
            services: {
              create: memberServices.map((s) => ({ serviceId: s.serviceId })),
            },
          },
          include: {
            services: { include: { service: true } },
            member: { include: { user: { select: { id: true, name: true } } } },
          },
        });

        appointments.push(appointment);
      }

      if (dto.clientId) {
        await tx.organizationClient.upsert({
          where: {
            userId_organizationId: {
              userId: dto.clientId,
              organizationId: serviceDetails[0].organizationId,
            },
          },
          create: {
            userId: dto.clientId,
            organizationId: serviceDetails[0].organizationId,
          },
          update: {},
        });
      }

      return appointments;
    });
  }

  private async isMemberAvailable(
    memberId: number,
    date: Date,
    startMin: number,
    endMin: number,
  ): Promise<boolean> {
    const dayOfWeek = this.getDayOfWeek(date);

    // verifica programul de lucru
    const schedule = await this.prisma.weeklySchedule.findFirst({
      where: {
        memberId,
        isActive: true,
        validFrom: { lte: date },
        OR: [{ validUntil: null }, { validUntil: { gte: date } }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        slots: { where: { day: dayOfWeek } },
      },
    });

    const isInWorkingHours = (schedule?.slots ?? []).some(
      (slot) => slot.startMin <= startMin && slot.endMin >= endMin,
    );

    if (!isInWorkingHours) return false;

    // verifica suprapuneri cu programari existente
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        memberId,
        isActive: true,
        date,
        startMin: { lt: endMin },
        endMin: { gt: startMin },
      },
    });

    if (conflictingAppointment) return false;

    // verifica timpi blocati
    const conflictingBlock = await this.prisma.blockedTime.findFirst({
      where: {
        memberId,
        date,
        startMin: { lt: endMin },
        endMin: { gt: startMin },
      },
    });

    return !conflictingBlock;
  }

  private async findFirstAvailableMember(
    memberIds: number[],
    date: Date,
    startMin: number,
    endMin: number,
  ): Promise<number | null> {
    for (const memberId of memberIds) {
      const available = await this.isMemberAvailable(
        memberId,
        date,
        startMin,
        endMin,
      );
      if (available) return memberId;
    }
    return null;
  }

  private getDayOfWeek(date: Date) {
    const days = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ] as const;
    return days[date.getDay()];
  }

  private async getApoinmentsByMemberIdDate(memberId: number, date: Date) {
    return await this.prisma.appointment.findMany({
      where: { memberId, date },
    });
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  async remove(id: number) {
    return await this.prisma.appointment.update({
      data: { isActive: false },
      where: { id },
    });
  }
}
