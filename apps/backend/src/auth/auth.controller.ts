import {
  Controller,
  Post,
  UseGuards,
  Get,
  Query,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
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

    return { acces_token: accessToken };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
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

    return { acces_token: accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Post('logout')
  async logout(@Req() req) {
    return req.logout();
  }

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

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgetPasswordDto) {
    return await this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
