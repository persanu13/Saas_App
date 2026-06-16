import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MeController } from './me/me.controller';
import { OrganizationsModule } from 'src/organizations/organizations.module';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [MeController, UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
