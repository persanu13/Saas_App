import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { OrgRole, UserType } from 'generated/prisma/client';
import type { Organization, OrganizationMember } from 'generated/prisma/client';
import type { JwtPayload } from 'src/auth/interfaces/payload';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { OrganizationContextGuard } from 'src/common/guards/organization-context.guard';
import { CurrentOrganization } from 'src/common/decorators/current-organization.decorator';
import { CurrentMember } from 'src/common/decorators/current-member.decorator';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private organizationsService: OrganizationsService,
  ) {}

  @UseGuards(OrganizationContextGuard)
  @Roles(UserType.PROFESSIONAL)
  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @CurrentOrganization() organization: Organization,
    @CurrentMember() member: OrganizationMember,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    if (member.role === OrgRole.STAFF && createServiceDto.memberIds?.length) {
      const hasOthers = createServiceDto.memberIds.some(
        (id) => id !== member.id,
      );
      if (hasOthers) {
        throw new ForbiddenException(
          'Staff can only assign services to themselves',
        );
      }
    }
    return this.servicesService.create(organization.id, createServiceDto);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
