export const DEFAULT_SERVICES = [
  { name: 'Tuns', durationMin: 30, price: 50 },
  { name: 'Bărbierit', durationMin: 20, price: 30 },
  { name: 'Tuns + Bărbierit', durationMin: 45, price: 70 },
  { name: 'Contur', durationMin: 15, price: 20 },
] as const;

import { DayOfWeek } from 'generated/prisma/client';

export const DEFAULT_SCHEDULE_SLOTS = [
  { day: DayOfWeek.MONDAY, startMin: 540, endMin: 1140 },
  { day: DayOfWeek.TUESDAY, startMin: 540, endMin: 1140 },
  { day: DayOfWeek.WEDNESDAY, startMin: 540, endMin: 1140 },
  { day: DayOfWeek.THURSDAY, startMin: 540, endMin: 1140 },
  { day: DayOfWeek.FRIDAY, startMin: 540, endMin: 1140 },
  { day: DayOfWeek.SATURDAY, startMin: 540, endMin: 1020 },
];
