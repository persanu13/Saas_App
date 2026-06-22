import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { DayOfWeek } from 'generated/prisma/enums';
import { getMondayOfWeek } from 'src/common/utility';
import { GetCalendarDto } from './dto/get-calendar.dto';
import { DEFAULT_SCHEDULE_SLOTS } from 'src/organizations/organizations.constants';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    private organizationsService: OrganizationsService,
  ) {}

  async getCurrentUserBaseSchedule(userId: number) {
    const organization =
      await this.organizationsService.getLastOrganization(userId);
    if (!organization) return null;
    const member =
      await this.organizationsService.getMemberByUserAndOrganization(
        userId,
        organization?.id,
      );
    if (!member) return null;
    return await this.prisma.weeklySchedule.findFirst({
      where: { memberId: member.id, validUntil: null },
      select: {
        id: true,
        validFrom: true,
        validUntil: true,
        createdAt: true,
        slots: {
          orderBy: { startMin: 'asc' },
          select: {
            id: true,
            day: true,
            startMin: true,
            endMin: true,
          },
        },
      },
    });
  }

  async getCalendar(organizationId: number, query: GetCalendarDto) {
    const member = await this.organizationsService.getMemberById(
      query.memberId,
    );
    if (member?.organizationId !== organizationId) {
      throw new ForbiddenException();
    }

    return {
      slots:
        query.view == 'DAY'
          ? await this.getDaySlots(query.memberId, query.date)
          : await this.getWeekSlots(query.memberId, query.date),
      appoinments: await this.prisma.appointment.findMany({
        where: { memberId: query.memberId, date: query.date, isActive: true },
        include: {
          client: true,
          bookedBy: true,
          services: { include: { service: true } },
        },
      }),
    };
  }

  async getWeekSlots(memberId: number, date: Date) {
    const weekStart = getMondayOfWeek(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const schedules = await this.prisma.weeklySchedule.findMany({
      where: {
        memberId,
        isActive: true,
        validFrom: { lte: weekEnd },
        OR: [{ validUntil: null }, { validUntil: { gte: weekStart } }],
      },
      orderBy: { createdAt: 'desc' },
      include: { slots: true },
    });

    const days: DayOfWeek[] = [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ];

    type SlotWithDate = {
      id: number;
      scheduleId: number;
      day: DayOfWeek;
      startMin: number;
      endMin: number;
      date: Date;
    };

    const result: SlotWithDate[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(currentDate.getDate() + i);

      const day = days[i];

      const activeSchedule = schedules.find(
        (s) =>
          s.validFrom <= currentDate &&
          (s.validUntil === null || s.validUntil >= currentDate),
      );

      const slots = (activeSchedule?.slots ?? [])
        .filter((slot) => slot.day === day)
        .sort((a, b) => a.startMin - b.startMin);

      result.push(
        ...slots.map((slot) => ({
          ...slot,
          date: new Date(currentDate),
        })),
      );
    }

    return result;
  }

  async getDaySlots(memberId: number, date: Date) {
    const days: DayOfWeek[] = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];

    const day = days[date.getDay()];

    const schedule = await this.prisma.weeklySchedule.findFirst({
      where: {
        memberId,
        isActive: true,
        validFrom: { lte: date },
        OR: [{ validUntil: null }, { validUntil: { gte: date } }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        slots: {
          where: { day },
          orderBy: { startMin: 'asc' },
        },
      },
    });

    return (schedule?.slots ?? []).map((slot) => ({
      ...slot,
      date: date,
    }));
  }

  async createSchedule(
    organizationId: number,
    createScheduleDto: CreateScheduleDto,
  ) {
    console.log(createScheduleDto);
    return await this.prisma.$transaction(async (tx) => {
      const lastWeeklySchedule = await tx.weeklySchedule.findFirst({
        where: {
          memberId: createScheduleDto.memberId,
          isActive: true,
          validUntil: null,
        },
      });

      if (lastWeeklySchedule && createScheduleDto.validUntil == null) {
        const newValidUntil = new Date(createScheduleDto.validFrom);
        newValidUntil.setDate(newValidUntil.getDate() - 1);

        await tx.weeklySchedule.update({
          where: { id: lastWeeklySchedule.id },
          data: {
            validUntil: newValidUntil,
          },
        });
      }

      return await tx.weeklySchedule.create({
        data: {
          memberId: createScheduleDto.memberId,
          validFrom: createScheduleDto.validFrom,
          validUntil: createScheduleDto.validUntil,
          slots: {
            create: createScheduleDto.slots,
          },
        },
      });
    });
  }
}
