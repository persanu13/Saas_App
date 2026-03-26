import { IsEmail, IsEnum, IsStrongPassword } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserType } from 'generated/prisma/client';

export class EmailDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsEnum(UserType)
  type: UserType;
}
