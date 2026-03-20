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
import { ConfigService } from '@nestjs/config';
import { Public } from '../decorators/public.decorator';
import { RegisterClientDto } from './dto/register-client.dto';

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
  @HttpCode(HttpStatus.OK)
  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Query('email') email: string,
  ) {
    await this.registrationService.verifyEmail(email, token);
    return {
      message: 'Verification succesful!',
    };
  }
}
