import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(5)
  durationMin: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  memberIds?: number[];
}
