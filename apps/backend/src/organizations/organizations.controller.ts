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

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

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
}
