// availability.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DayOfWeek } from 'generated/prisma/enums';

interface Interval {
  start: number; // minute absolute, de la inceputul ferestrei (ziua 0, minutul 0)
  end: number;
}

interface ServiceSelection {
  serviceId: number;
  memberId?: number | null;
}

const DAYS: DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

const SLOT_STEP = 15; // granularitate in minute
const WEEKS_AHEAD = 4;
const DAY_MIN = 24 * 60;

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getAvailability(selections: ServiceSelection[]) {
    if (!selections.length) return { data: [] };

    const today = new Date(
      new Date().toLocaleDateString('en-CA', {
        timeZone: 'Europe/Bucharest',
      }),
    );
    today.setDate(today.getDate() + 1);
    console.log(today);

    const rangeEnd = new Date(today);
    rangeEnd.setDate(rangeEnd.getDate() + WEEKS_AHEAD * 7);

    // 1. iei detaliile serviciilor (durata)
    const serviceIds = selections.map((s) => s.serviceId);
    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, durationMin: true, organizationId: true },
    });
    const serviceMap = new Map(services.map((s) => [s.id, s]));

    // 2. pentru fiecare serviciu, determini candidatii (membrii eligibili)
    const candidatesPerService = await Promise.all(
      selections.map(async (sel) => {
        if (sel.memberId) {
          return { ...sel, candidateMemberIds: [sel.memberId] };
        }
        const memberServices = await this.prisma.memberService.findMany({
          where: { serviceId: sel.serviceId },
          select: { memberId: true },
        });
        return {
          ...sel,
          candidateMemberIds: memberServices.map((m) => m.memberId),
        };
      }),
    );

    const allMemberIds = [
      ...new Set(candidatesPerService.flatMap((c) => c.candidateMemberIds)),
    ];

    // 3. precalculezi disponibilitatea (intervale libere) pt fiecare membru, pe toata perioada
    const availabilityByMember = await this.getFreeIntervalsForMembers(
      allMemberIds,
      today,
      rangeEnd,
    );

    // 4. pentru fiecare slot posibil de start (din 15 in 15 min, pe toata perioada)
    //    verifici daca lantul de servicii poate fi plasat
    const totalRangeMin = WEEKS_AHEAD * 7 * DAY_MIN;
    const possibleStarts: { date: string; startMin: number }[] = [];

    for (let absMin = 0; absMin < totalRangeMin; absMin += SLOT_STEP) {
      const assignment = this.tryAssign(
        absMin,
        candidatesPerService,
        serviceMap,
        availabilityByMember,
      );

      if (assignment) {
        const dayIndex = Math.floor(absMin / DAY_MIN);
        const startMinOfDay = absMin % DAY_MIN;
        const date = new Date(today);
        date.setDate(date.getDate() + dayIndex);

        possibleStarts.push({
          date: date.toISOString().split('T')[0],
          startMin: startMinOfDay,
        });
      }
    }

    const dayMap = new Map<string, number[]>();
    for (let i = 0; i < WEEKS_AHEAD * 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dayMap.set(dateStr, []);
    }

    // populezi cu sloturile gasite
    for (const { date, startMin } of possibleStarts) {
      dayMap.get(date)?.push(startMin);
    }

    const grouped = Array.from(dayMap.entries()).map(([date, startMin]) => ({
      date,
      startMin,
    }));

    return grouped;
  }

  /**
   * Incearca sa plaseze secvential toate serviciile incepand de la absStart (minut absolut).
   * Pentru fiecare serviciu, alege un membru candidat care e liber in tot intervalul necesar.
   * Returneaza true/false.
   */
  private tryAssign(
    absStart: number,
    candidatesPerService: (ServiceSelection & {
      candidateMemberIds: number[];
    })[],
    serviceMap: Map<number, { id: number; durationMin: number }>,
    availabilityByMember: Map<number, Interval[]>,
  ): boolean {
    let cursor = absStart;

    for (const sel of candidatesPerService) {
      const service = serviceMap.get(sel.serviceId);
      if (!service) return false;

      const neededEnd = cursor + service.durationMin;

      // gasesti un membru candidat liber in intervalul [cursor, neededEnd)
      const hasFreeMember = sel.candidateMemberIds.some((memberId) => {
        const freeIntervals = availabilityByMember.get(memberId) ?? [];
        return freeIntervals.some(
          (interval) => interval.start <= cursor && interval.end >= neededEnd,
        );
      });

      if (!hasFreeMember) return false;

      cursor = neededEnd; // urmatorul serviciu incepe cand termina precedentul
    }

    return true;
  }

  /**
   * Returneaza intervalele libere (in minute absolute fata de inceputul ferestrei)
   * pentru fiecare membru, combinand programul de lucru, exceptiile, programarile
   * existente si timpii blocati.
   */
  private async getFreeIntervalsForMembers(
    memberIds: number[],
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<Map<number, Interval[]>> {
    const result = new Map<number, Interval[]>();
    if (!memberIds.length) return result;

    const [schedules, appointments, blockedTimes] = await Promise.all([
      this.prisma.weeklySchedule.findMany({
        where: {
          memberId: { in: memberIds },
          isActive: true,
          validFrom: { lte: rangeEnd },
          OR: [{ validUntil: null }, { validUntil: { gte: rangeStart } }],
        },
        orderBy: { createdAt: 'desc' },
        include: { slots: true },
      }),
      this.prisma.appointment.findMany({
        where: {
          memberId: { in: memberIds },
          isActive: true,
          date: { gte: rangeStart, lte: rangeEnd },
        },
        select: { memberId: true, date: true, startMin: true, endMin: true },
      }),
      this.prisma.blockedTime.findMany({
        where: {
          memberId: { in: memberIds },
          date: { gte: rangeStart, lte: rangeEnd },
        },
        select: { memberId: true, date: true, startMin: true, endMin: true },
      }),
    ]);

    const totalDays = Math.round(
      (rangeEnd.getTime() - rangeStart.getTime()) / DAY_MIN / 60000,
    );

    for (const memberId of memberIds) {
      const memberSchedules = schedules.filter((s) => s.memberId === memberId);
      const freeIntervals: Interval[] = [];

      for (let dayIndex = 0; dayIndex <= totalDays; dayIndex++) {
        const date = new Date(rangeStart);
        date.setDate(date.getDate() + dayIndex);
        const dayOfWeek = DAYS[date.getDay()];

        const activeSchedule = memberSchedules.find(
          (s) =>
            s.validFrom <= date &&
            (s.validUntil === null || s.validUntil >= date),
        );

        const daySlots = (activeSchedule?.slots ?? []).filter(
          (slot) => slot.day === dayOfWeek,
        );

        // ocupate (programari + blocked) pentru aceasta zi
        const dayStr = date.toISOString().split('T')[0];
        const busy: Interval[] = [
          ...appointments
            .filter(
              (a) =>
                a.memberId === memberId &&
                a.date.toISOString().split('T')[0] === dayStr,
            )
            .map((a) => ({ start: a.startMin, end: a.endMin })),
          ...blockedTimes
            .filter(
              (b) =>
                b.memberId === memberId &&
                b.date.toISOString().split('T')[0] === dayStr,
            )
            .map((b) => ({ start: b.startMin, end: b.endMin })),
        ];

        for (const slot of daySlots) {
          const dayBase = dayIndex * DAY_MIN;
          const free = this.subtractIntervals(
            { start: slot.startMin, end: slot.endMin },
            busy,
          );
          for (const f of free) {
            freeIntervals.push({
              start: dayBase + f.start,
              end: dayBase + f.end,
            });
          }
        }
      }

      result.set(memberId, freeIntervals);
    }

    return result;
  }

  /** Scade intervalele "busy" dintr-un interval de baza, returnand bucatile ramase libere. */
  private subtractIntervals(base: Interval, busy: Interval[]): Interval[] {
    let segments = [base];

    for (const b of busy) {
      const next: Interval[] = [];
      for (const seg of segments) {
        if (b.end <= seg.start || b.start >= seg.end) {
          next.push(seg); // nu se suprapun
          continue;
        }
        if (b.start > seg.start) {
          next.push({ start: seg.start, end: Math.min(b.start, seg.end) });
        }
        if (b.end < seg.end) {
          next.push({ start: Math.max(b.end, seg.start), end: seg.end });
        }
      }
      segments = next;
    }

    return segments.filter((s) => s.end > s.start);
  }
}
