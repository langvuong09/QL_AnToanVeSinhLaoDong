import { JwtService } from "@nestjs/jwt";
import { ResponseData } from "../../commons/response";
import { ViewService } from "../view/view.service";
import { LoginModel } from "./auth.model";
import { DataSource } from "typeorm";
import { Doet } from "../doet/doet.entity";
export declare class AuthService {
    private readonly jwtService;
    private readonly viewService;
    private readonly dataSource;
    constructor(jwtService: JwtService, viewService: ViewService, dataSource: DataSource);
    login(data: any, doet: Doet | null): Promise<ResponseData<LoginModel>>;
    validateToken(token: string, doet: Doet | null): Promise<ResponseData<LoginModel>>;
    forgotPassword(email: string, domain: string): Promise<import("../../commons/error").NotFoundException | {
        code: import("@nestjs/common").HttpStatus;
        message: string;
        success: boolean;
    }>;
    resetPassword(code: string): Promise<import("../../commons/error").NotFoundException | {
        code: import("@nestjs/common").HttpStatus;
        message: string;
        success: boolean;
    }>;
}
