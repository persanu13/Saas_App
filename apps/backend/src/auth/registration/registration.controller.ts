import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { Public } from '../decorators/public.decorator';
import { RegisterClientDto } from './dto/register-client.dto';
import { EmailDto } from '../dto/email.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { RegisterProfessionalDto } from './dto/register-professional.dto';

@Controller('auth/registration')
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register-client')
  async registerClient(@Body() dto: RegisterClientDto) {
    return await this.registrationService.registerClient(dto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register-professional')
  async registerProfessional(@Body() dto: RegisterProfessionalDto) {
    return await this.registrationService.registerProfessional(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    await this.registrationService.verifyEmailToken(token);
    return {
      message: 'Verification succesful!',
    };
  }

  @Throttle({ short: { ttl: 30000, limit: 1 } })
  @SkipThrottle({ mediu: true, long: true })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('resend-email')
  async resendEmail(@Body() dto: EmailDto) {
    await this.registrationService.sendVerificationEmail(dto.email, dto.type);
    return {
      message: 'Resend verification email succesful!',
    };
  }
}
