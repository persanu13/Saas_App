import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/payload';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateAppointmentFromAvailabilityDto } from './dto/create-appointment-from-availability.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from 'generated/prisma/client';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return await this.appointmentsService.create(
      createAppointmentDto,
      user.sub,
    );
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(+id);
  }

  @Post('book')
  @Roles(UserType.PROFESSIONAL, UserType.CUSTOMER)
  createFromAvailability(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateAppointmentFromAvailabilityDto,
  ) {
    return this.appointmentsService.createFromAvailability(dto, user.sub);
  }
}
