import { LoginModel } from './auth.model';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config/dist/config.service';
export declare class AuthController {
    private readonly authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    login(req: any, response: Response): Promise<import("../../commons").ResponseData<LoginModel>>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        code: import("@nestjs/common").HttpStatus;
        message: string;
        success: boolean;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<import("../../commons").ResponseData<{
        resetToken: string;
    }>>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        code: import("@nestjs/common").HttpStatus;
        message: string;
        success: boolean;
    }>;
    refreshToken(req: any, response: Response): Promise<import("../../commons").ResponseData<{
        accessToken: string;
    }>>;
    logout(req: any, response: Response): Promise<{
        success: boolean;
        message: string;
    }>;
}
