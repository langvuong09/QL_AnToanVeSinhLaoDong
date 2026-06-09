import { LoginModel } from "./auth.model";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<import("../../commons").ResponseData<LoginModel>>;
    forgotPassword(email: string, req: any): Promise<import("../../commons/error").NotFoundException | {
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
