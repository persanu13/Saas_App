import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SendInvitationDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;
}

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
