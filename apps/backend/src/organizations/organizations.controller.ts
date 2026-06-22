import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from 'generated/prisma/enums';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/payload';
import { CurrentOrganization } from 'src/common/decorators/current-organization.decorator';
import type { Organization } from 'generated/prisma/client';
import { OrganizationContextGuard } from 'src/common/guards/organization-context.guard';
import {
  AcceptInvitationDto,
  SendInvitationDto,
} from './dto/send-invitation.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetAvailabilityDto } from './dto/get-availability.dto';
import { AvailabilityService } from './availability.service';
import { CreateAppointmentFromAvailabilityDto } from 'src/appointments/dto/create-appointment-from-availability.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Post()
  @Roles(UserType.PROFESSIONAL)
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Req() req,
  ) {
    return this.organizationsService.create(
      createOrganizationDto,
      req.user.sub,
    );
  }

  @Roles(UserType.PROFESSIONAL)
  @Get('last-organization')
  getLastOrganization(@CurrentUser() user: JwtPayload) {
    return this.organizationsService.getLastOrganization(user.sub);
  }

  @UseGuards(OrganizationContextGuard)
  @Roles(UserType.PROFESSIONAL)
  @Get('services')
  async getServices(@CurrentOrganization() organization: Organization) {
    return await this.organizationsService.getServices(organization.id);
  }

  @UseGuards(OrganizationContextGuard)
  @Roles(UserType.PROFESSIONAL)
  @Get('all-members')
  async getAllOrganizationMembers(
    @CurrentOrganization() organization: Organization,
  ) {
    return await this.organizationsService.getAllOrganizationMembers(
      organization.id,
    );
  }

  @UseGuards(OrganizationContextGuard)
  @Roles(UserType.PROFESSIONAL)
  @Post('send-invitation')
  async sendInvitation(
    @CurrentUser() user: JwtPayload,
    @CurrentOrganization() organization: Organization,
    @Body() sendInvitationDto: SendInvitationDto,
  ) {
    return await this.organizationsService.sendInvitation(
      organization,
      sendInvitationDto.email,
      user,
    );
  }

  @Roles(UserType.PROFESSIONAL)
  @UseGuards(OrganizationContextGuard)
  @Get('clients')
  async getClients(@CurrentOrganization() organization: Organization) {
    return await this.organizationsService.getOrganizationClients(
      organization.id,
    );
  }

  @Roles(UserType.PROFESSIONAL)
  @Post('accept-invitation')
  async acceptInvitation(
    @CurrentUser() user: JwtPayload,
    @Body() acceptInvitationDto: AcceptInvitationDto,
  ) {
    return await this.organizationsService.acceptInvite(
      acceptInvitationDto.token,
      user.sub,
    );
  }

  @Public()
  @Get('all-with-slug')
  async getAllWithSlug() {
    return await this.organizationsService.getAllWithSlug();
  }

  @Public()
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    return await this.organizationsService.getBySlug(slug);
  }

  @Public()
  @Post('availability')
  getAvailability(@Body() dto: GetAvailabilityDto) {
    return this.availabilityService.getAvailability(dto.services);
  }
}
