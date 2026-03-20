import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Public } from '../decorators/public.decorator';
import { GoogleAuthGuard } from '../guards/google-auth.guard';

@Controller('auth/google')
export class GoogleController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get()
  async googleAuth() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('callback')
  async googleCallback(@Req() req, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );
    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: parseInt(
        this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
      ),
    });

    res.redirect(
      `${this.configService.get('FRONTEND_URL')}/auth/callback?accessToken=${accessToken}`,
    );
  }
}
