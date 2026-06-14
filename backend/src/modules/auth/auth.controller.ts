import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  Body,
  Req,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../commons/guards/localAuthGuard';
import { LoginModel } from './auth.model';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Res } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config/dist/config.service';
import ms from 'ms';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}


  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(req.user, req.doet);

    const expiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    const refreshToken = result.data?.refreshToken;

    if (refreshToken) {
      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: ms(expiresIn as ms.StringValue),
      });
    }

    return result;
  }

  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOperation({ summary: 'Gửi mã OTP về email' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('verify-otp')
  @ApiBody({ type: VerifyOtpDto })
  @ApiOperation({ summary: 'Xác thực mã OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  @ApiOperation({ summary: 'Đổi mật khẩu bằng Reset Token' })
  async resetPassword(
   @Body() resetPasswordDto: ResetPasswordDto
  ) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword, resetPasswordDto.confirmPassword);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Lấy Access Token mới bằng Refresh Token' })
  async refreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const oldRefreshToken = req.cookies['refreshToken'];
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Refresh token không tồn tại');
    }
    if (!oldRefreshToken) {
      return { success: false, message: 'Missing refresh token' };
    }
    return this.authService.refreshToken(oldRefreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất và đưa token vào blacklist' })
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.authService.logout(token);
    }
    response.clearCookie('refreshToken');
    return { success: true, message: 'Logged out successfully' };
  }

  @Post('verify-reset-email-otp')
  @ApiOperation({ summary: '🎯 Bước 2: Xác thực mã OTP đổi email (Public)' })
  async verifyResetEmailOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    return await this.authService.verifyResetEmailOtp(email, otp);
  }

  @Post('confirm-reset-email')
  @ApiOperation({ summary: '🎯 Bước 3: Xác nhận lưu địa chỉ Email mới vào hệ thống (Public)' })
  async confirmResetEmail(
    @Body('resetToken') resetToken: string,
    @Body('newEmail') newEmail: string,
  ) {
    return await this.authService.confirmResetEmail(resetToken, newEmail);
  }
}
