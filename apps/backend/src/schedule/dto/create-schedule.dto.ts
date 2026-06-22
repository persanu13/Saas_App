import {
  IsDate,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek } from 'generated/prisma/client';

export class CreateScheduleSlotDto {
  @IsEnum(DayOfWeek)
  day: DayOfWeek;

  @IsInt()
  @Min(0)
  startMin: number;

  @IsInt()
  @Min(1)
  endMin: number;
}

export class CreateScheduleDto {
  @IsInt()
  memberId: number;

  @IsDate()
  @Type(() => Date)
  validFrom: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  validUntil?: Date | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleSlotDto)
  slots: CreateScheduleSlotDto[];
}
