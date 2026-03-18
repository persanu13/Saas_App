import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { SesionService } from './auth/sesion/sesion.service';
import { PasswordResetTokenService } from './auth/password-reset-token/password-reset-token.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
  ],
  providers: [PasswordResetTokenService],
})
export class AppModule {}
