import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsObject,
  ValidateNested,
  Min,
} from 'class-validator';

export class ServiceSelectionDto {
  @IsInt()
  serviceId: number;

  @IsOptional()
  @IsInt()
  memberId?: number | null;
}

export class DateTimeSelectionDto {
  @IsDateString()
  date: string;

  @IsInt()
  @Min(0)
  startMin: number;
}

export class CreateAppointmentFromAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceSelectionDto)
  services: ServiceSelectionDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => DateTimeSelectionDto)
  dateTime: DateTimeSelectionDto;

  // optional - clientul care face programarea
  @IsOptional()
  @IsInt()
  clientId?: number | null;

  @IsOptional()
  clientName?: string;

  @IsOptional()
  clientPhone?: string;

  @IsOptional()
  notes?: string;
}
