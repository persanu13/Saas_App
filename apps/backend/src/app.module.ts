import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { SessionService } from './auth/session/session.service';
import { PasswordResetTokenService } from './auth/password-reset-token/password-reset-token.service';
import { AccountService } from './auth/account/account.service';

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
})
export class AppModule {}
