"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const localAuthGuard_1 = require("../../commons/guards/localAuthGuard");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const common_2 = require("@nestjs/common");
const config_service_1 = require("@nestjs/config/dist/config.service");
const ms_1 = __importDefault(require("ms"));
let AuthController = class AuthController {
    authService;
    configService;
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    async login(req, response) {
        const result = await this.authService.login(req.user, req.doet);
        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';
        const refreshToken = result.data?.refreshToken;
        if (refreshToken) {
            response.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: (0, ms_1.default)(expiresIn),
            });
        }
        return result;
    }
    async forgotPassword(email) {
        return this.authService.forgotPassword(email);
    }
    async verifyOtp(email, otp) {
        return this.authService.verifyOtp(email, otp);
    }
    async resetPassword(token, newPassword, confirmPassword) {
        return this.authService.resetPassword(token, newPassword, confirmPassword);
    }
    async refreshToken(req, response) {
        const oldRefreshToken = req.cookies['refreshToken'];
        if (!oldRefreshToken) {
            throw new common_1.UnauthorizedException('Refresh token không tồn tại');
        }
        if (!oldRefreshToken) {
            return { success: false, message: 'Missing refresh token' };
        }
        return this.authService.refreshToken(oldRefreshToken);
    }
    async logout(req, response) {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            await this.authService.logout(token);
        }
        response.clearCookie('refreshToken');
        return { success: true, message: 'Logged out successfully' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(localAuthGuard_1.LocalAuthGuard),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Login with username and password' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_2.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Gửi mã OTP về email' }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_1.ApiBody)({ type: verify_otp_dto_1.VerifyOtpDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Xác thực mã OTP' }),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('otp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiBody)({ type: reset_password_dto_1.ResetPasswordDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Đổi mật khẩu bằng Reset Token' }),
    __param(0, (0, common_1.Body)('token')),
    __param(1, (0, common_1.Body)('newPassword')),
    __param(2, (0, common_1.Body)('confirmPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy Access Token mới bằng Refresh Token' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_2.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng xuất và đưa token vào blacklist' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_2.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_service_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map