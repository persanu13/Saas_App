import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';

export class ServiceSelectionDto {
  @IsInt()
  serviceId: number;

  @IsOptional()
  @IsInt()
  memberId?: number | null;
}

export class GetAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceSelectionDto)
  services: ServiceSelectionDto[];
}
