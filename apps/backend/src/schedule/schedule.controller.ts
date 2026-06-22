import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from 'generated/prisma/enums';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/payload';
import { OrganizationContextGuard } from 'src/common/guards/organization-context.guard';
import { CurrentOrganization } from 'src/common/decorators/current-organization.decorator';
import type { Organization } from 'generated/prisma/client';
import { GetCalendarDto } from './dto/get-calendar.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('current-user-base-schedule')
  @Roles(UserType.PROFESSIONAL)
  async currentUserBaseSchedule(@CurrentUser() user: JwtPayload) {
    return this.scheduleService.getCurrentUserBaseSchedule(user.sub);
  }

  @UseGuards(OrganizationContextGuard)
  @Get('calendar')
  @Roles(UserType.PROFESSIONAL)
  async getCalendar(
    @CurrentOrganization() organization: Organization,
    @Query() query: GetCalendarDto,
  ) {
    return await this.scheduleService.getCalendar(organization.id, query);
  }

  @UseGuards(OrganizationContextGuard)
  @Post()
  @Roles(UserType.PROFESSIONAL)
  async createSchedule(
    @CurrentOrganization() organization: Organization,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return await this.scheduleService.createSchedule(
      organization.id,
      createScheduleDto,
    );
  }
}
