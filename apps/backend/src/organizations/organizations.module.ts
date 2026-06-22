import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { AvailabilityService } from './availability.service';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, AvailabilityService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
