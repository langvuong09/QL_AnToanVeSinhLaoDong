import { LoginModel } from './auth.model';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config/dist/config.service';
export declare class AuthController {
    private readonly authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    login(req: any, response: Response): Promise<import("../../commons").ResponseData<LoginModel>>;
    forgotPassword(email: string): Promise<import("../../commons/error").NotFoundException | {
        code: import("@nestjs/common").HttpStatus;
        message: string;
        success: boolean;
    }>;
    verifyOtp(email: string, otp: string): Promise<import("../../commons/error").NotFoundException | import("../../commons/error").SomethingException | import("../../commons").ResponseData<{
        resetToken: string;
    }>>;
    resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<import("../../commons/error").SomethingException | {
        code: import("@nestjs/common").HttpStatus;
        message: string;
        success: boolean;
    }>;
    refreshToken(req: any, response: Response): Promise<import("../../commons/error").NotFoundException | import("../../commons").ResponseData<{
        accessToken: string;
    }>>;
    logout(req: any, response: Response): Promise<{
        success: boolean;
        message: string;
    }>;
}
