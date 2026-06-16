import { IsEnum, IsInt, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export enum CalendarView {
  DAY = 'DAY',
  WEEK = 'WEEK',
}

export class GetCalendarDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsEnum(CalendarView)
  view: CalendarView;

  @Type(() => Number)
  @IsInt()
  memberId: number;
}
