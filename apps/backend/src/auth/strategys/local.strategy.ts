import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { UserType } from 'generated/prisma/enums';
import { User } from 'generated/prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    const validTypes = Object.values(UserType);
    const type = req.body?.type;

    if (!type || !validTypes.includes(type)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user: User = await this.authService.validateUser(
      email,
      password,
      type,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      sub: user.id,
      email: user.email,
      type: user.type,
    };
  }
}
