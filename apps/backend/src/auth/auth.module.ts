import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategys/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategys/jwt.strategy';
import { VerificationTokenService } from './verification-token.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { SessionService } from './session/session.service';
import { JwtRefreshStrategy } from './strategys/jwt-refresh.strategy';
import { PasswordResetTokenService } from './password-reset-token/password-reset-token.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleStrategy } from './strategys/google.strategy';
import { AccountService } from './account/account.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PrismaModule,
    MailModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    VerificationTokenService,
    SessionService,
    PasswordResetTokenService,
    AccountService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
