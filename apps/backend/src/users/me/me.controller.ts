import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UsersService } from '../users.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Controller('users/me')
export class MeController {
  constructor(
    private readonly usersService: UsersService,
    private organizationsService: OrganizationsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getMe(@Req() req) {
    const user = await this.usersService.findOne(req.user.sub);
    return {
      me: {
        name: user?.name,
        email: user?.email,
        image: user?.image,
        phone: user?.phone,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/organizations')
  async getMyOrganizations(@Req() req) {
    return {
      organizations: await this.organizationsService.findManyByUserId(
        req.user.sub,
      ),
    };
  }
}
