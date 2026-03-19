import {
  Controller,
  Post,
  UseGuards,
  Get,
  Query,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from './decorators/public.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res) {
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

    return { access_token: accessToken };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    const refreshToken = req.cookies['Refresh'];
    if (!refreshToken) return { message: 'Logout succesful!' };

    await this.authService.logout(refreshToken);

    res.clearCookie('Refresh', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
    });
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken } = await this.authService.rotateTokens(
      req.user.session.sessionToken,
      req.user,
    );

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: parseInt(
        this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
      ),
    });

    return { access_token: accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Query('email') email: string,
  ) {
    await this.authService.verifyEmail(email, token);
    return {
      message: 'Verification succesful!',
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgetPasswordDto) {
    return await this.authService.forgotPassword(dto.email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
