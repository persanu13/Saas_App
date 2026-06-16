import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { DayOfWeek } from 'generated/prisma/enums';
import { getMondayOfWeek } from 'src/common/utility';
import { GetCalendarDto } from './dto/get-calendar.dto';

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

    const result: Record<
      string,
      {
        date: Date;
        slots: { day: DayOfWeek; startMin: number; endMin: number }[];
      }
    > = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);

      const day = days[i];

      const activeSchedule = schedules.find(
        (s) =>
          s.validFrom <= date &&
          (s.validUntil === null || s.validUntil >= date),
      );

      const slots = (activeSchedule?.slots ?? [])
        .filter((slot) => slot.day === day)
        .sort((a, b) => a.startMin - b.startMin);

      result[day] = { date, slots };
    }
    return result;
  }

  async getDaySlots(memberId: number, date: Date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const days: DayOfWeek[] = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    const day = days[targetDate.getDay()];

    const schedule = await this.prisma.weeklySchedule.findFirst({
      where: {
        memberId,
        isActive: true,
        validFrom: { lte: targetDate },
        OR: [{ validUntil: null }, { validUntil: { gte: targetDate } }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        slots: {
          where: { day },
          orderBy: { startMin: 'asc' },
        },
      },
    });

    return {
      date: targetDate,
      slots: schedule?.slots ?? [],
    };
  }
}
