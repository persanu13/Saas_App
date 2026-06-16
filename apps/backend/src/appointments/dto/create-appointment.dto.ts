import {
  IsInt,
  IsDateString,
  IsOptional,
  IsString,
  IsArray,
  IsPhoneNumber,
  Min,
  ArrayMinSize,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  memberId: number;

  @IsInt()
  @IsOptional()
  clientId?: number;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsString()
  @IsOptional()
  clientPhone?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  serviceIds: number[];

  @IsDateString()
  date: string;

  @IsInt()
  @Min(0)
  startMin: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
