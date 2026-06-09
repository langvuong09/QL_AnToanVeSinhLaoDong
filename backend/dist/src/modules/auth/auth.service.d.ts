import { JwtService } from '@nestjs/jwt';
import { ResponseData } from "../../commons/response";
import { ViewService } from '../view/view.service';
import { LoginModel } from './auth.model';
import { DataSource } from 'typeorm';
import { Doet } from '../doet/doet.entity';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { EmailService } from "../../helper/Email";
export declare class AuthService {
    private readonly jwtService;
    private readonly viewService;
    private readonly dataSource;
    private readonly configService;
    private readonly emailService;
    private readonly redis;
    constructor(jwtService: JwtService, viewService: ViewService, dataSource: DataSource, configService: ConfigService, emailService: EmailService, redis: Redis);
    login(data: any, doet: Doet | null): Promise<ResponseData<LoginModel>>;
    validateToken(token: string, doet: Doet | null): Promise<ResponseData<LoginModel>>;
    forgotPassword(email: string): Promise<import("../../commons/error").NotFoundException | {
        code: import("@nestjs/common").HttpStatus;
        message: string;
        success: boolean;
    }>;
    verifyOtp(email: string, otp: string): Promise<import("../../commons/error").NotFoundException | import("../../commons/error").SomethingException | ResponseData<{
        resetToken: string;
    }>>;
    resetPassword(resetToken: string, newPassword: string, confirmPassword: string): Promise<import("../../commons/error").SomethingException | {
        code: import("@nestjs/common").HttpStatus;
        message: string;
        success: boolean;
    }>;
    logout(token: string): Promise<import("../../commons/error").SomethingException | {
        code: import("@nestjs/common").HttpStatus;
        message: string;
        success: boolean;
    }>;
    refreshToken(oldRefreshToken: string): Promise<import("../../commons/error").NotFoundException | ResponseData<{
        accessToken: string;
    }>>;
}
