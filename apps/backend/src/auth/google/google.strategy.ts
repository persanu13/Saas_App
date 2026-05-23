import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserType } from 'generated/prisma/enums';
import { Request } from 'express';
import { GoogleService } from './google.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly googleService: GoogleService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;
    console.log(req.query.state);
    const type = req.query.state as UserType;

    const user = await this.googleService.validateGoogleUser({
      provider: 'google',
      providerAccountId: id,
      email: emails[0].value,
      type: type,
      name: displayName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    });

    return {
      sub: user.id,
      email: user.email,
      type: user.type,
    };
  }
}
