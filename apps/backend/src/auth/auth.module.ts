import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategys/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategys/jwt.strategy';
import { VerificationTokenService } from './verification-token.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { SessionService } from './session/session.service';
import { JwtRefreshStrategy } from './strategys/jwt-refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleStrategy } from './google/google.strategy';
import { AccountService } from './account/account.service';
import { RegistrationService } from './registration/registration.service';
import { RegistrationController } from './registration/registration.controller';
import { PasswordController } from './password/password.controller';
import { PasswordService } from './password/password.service';
import { GoogleController } from './google/google.controller';
import { GoogleService } from './google/google.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PrismaModule,
    MailModule,
    JwtModule.register({}),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    VerificationTokenService,
    SessionService,
    AccountService,
    RegistrationService,
    PasswordService,
    GoogleService,
  ],
  controllers: [
    AuthController,
    RegistrationController,
    PasswordController,
    GoogleController,
  ],
})
export class AuthModule {}
