"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const response_1 = __importDefault(require("../../commons/response"));
const view_service_1 = require("../view/view.service");
const auth_model_1 = require("./auth.model");
const lodash_1 = require("lodash");
const user_entity_1 = require("../user/user.entity");
const typeorm_1 = require("typeorm");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const argon = __importStar(require("argon2"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis_module_1 = require("../../redis/redis.module");
const otp_enum_1 = require("../../commons/enums/otp.enum");
const config_1 = require("@nestjs/config");
const Email_1 = require("../../helper/Email");
let AuthService = class AuthService {
    jwtService;
    viewService;
    dataSource;
    configService;
    emailService;
    redis;
    constructor(jwtService, viewService, dataSource, configService, emailService, redis) {
        this.jwtService = jwtService;
        this.viewService = viewService;
        this.dataSource = dataSource;
        this.configService = configService;
        this.emailService = emailService;
        this.redis = redis;
    }
    async login(data, doet) {
        try {
            const _doet = doet && doet.id ? doet.id : null;
            const user = new auth_model_1.CurrentUser({
                ...data,
                doet: _doet,
            });
            const roleId = user.role?.id ?? 0;
            const userPayload = JSON.parse(JSON.stringify(user));
            const accessTtl = this.configService.get('JWT_ACCESS_EXPIRES_IN') || '15m';
            const refreshTtl = this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';
            const accessToken = this.jwtService.sign(userPayload, {
                expiresIn: accessTtl,
            });
            const refreshToken = this.jwtService.sign({ id: user.id }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: refreshTtl,
            });
            const viewsResponse = await this.viewService.getViewsByRoleId(roleId);
            const rs = new auth_model_1.LoginModel(accessToken, refreshToken, {
                views: (0, lodash_1.get)(viewsResponse, 'data.items', []),
            });
            return response_1.default.get(rs);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async validateToken(token, doet) {
        try {
            const isBlacklisted = await this.redis.get(`blacklist:${token}`);
            if (isBlacklisted) {
                throw new Error('Token đã bị thu hồi (đăng xuất)');
            }
            const decodedData = await this.jwtService.verifyAsync(token);
            const _doet = doet && doet.id ? doet.id : null;
            const user = new auth_model_1.CurrentUser({
                ...decodedData,
                doet: _doet,
            });
            const roleId = user.role?.id ?? 0;
            const views = await this.viewService.getViewsByRoleId(roleId);
            const rs = new auth_model_1.LoginModel(token, null, {
                user,
                views: (0, lodash_1.get)(views, 'data.items', []),
            });
            return response_1.default.get(rs);
        }
        catch (error) {
            throw response_1.default.errorInternal('Token không hợp lệ hoặc đã hết hạn');
        }
    }
    async forgotPassword(email) {
        try {
            const manage = this.dataSource.manager;
            const user = await manage.findOne(user_entity_1.User, {
                where: {
                    email: email,
                },
            });
            if (!user) {
                return response_1.default.errorNotFound('Not found email');
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const redisKey = (0, otp_enum_1.getOtpKey)(otp_enum_1.OtpType.FORGOT_PASSWORD, user.id);
            const ttl = this.configService.get('OTP_EXPIRATION_TIME') || 300;
            await this.redis.set(redisKey, otp, 'EX', ttl);
            const templatePath = path.join(process.cwd(), 'src', 'templates', 'forgot-password.html');
            let template = fs.readFileSync(templatePath, { encoding: 'utf-8' });
            template = template.split('$1').join(user.fullName);
            template = template.split('$2').join(otp);
            template = template.split('$3').join((ttl / 60).toString());
            await this.emailService.sendMail(email, 'Mã xác thực lấy lại mật khẩu', template);
            return response_1.default.SUCCESSFULLY;
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async verifyOtp(email, otp) {
        const user = await this.dataSource.manager.findOne(user_entity_1.User, {
            where: { email },
        });
        if (!user) {
            return response_1.default.errorNotFound('Not found email');
        }
        const redisKey = (0, otp_enum_1.getOtpKey)(otp_enum_1.OtpType.FORGOT_PASSWORD, user.id);
        const savedOtp = await this.redis.get(redisKey);
        if (!savedOtp || savedOtp !== otp) {
            return response_1.default.errorInternal('OTP không đúng hoặc đã hết hạn');
        }
        const resetToken = this.jwtService.sign({ email, id: user.id }, { expiresIn: '3m' });
        return response_1.default.get({ resetToken });
    }
    async resetPassword(resetToken, newPassword, confirmPassword) {
        try {
            const decoded = this.jwtService.verify(resetToken);
            if (newPassword !== confirmPassword) {
                return response_1.default.errorInternal('Mật khẩu xác nhận không khớp');
            }
            const hashedPassword = await argon.hash(newPassword);
            await this.dataSource.manager.update(user_entity_1.User, decoded.id, {
                password: hashedPassword,
            });
            return response_1.default.SUCCESSFULLY;
        }
        catch (e) {
            return response_1.default.errorInternal('Token không hợp lệ hoặc đã hết hạn');
        }
    }
    async logout(token) {
        try {
            const decoded = this.jwtService.decode(token);
            if (!decoded || !decoded.exp)
                return response_1.default.errorInternal('Token không hợp lệ');
            const ttl = Math.floor(decoded.exp - Date.now() / 1000);
            if (ttl > 0) {
                await this.redis.set(`blacklist:${token}`, 'true', 'EX', ttl);
            }
            return response_1.default.SUCCESSFULLY;
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async refreshToken(oldRefreshToken) {
        try {
            const decoded = this.jwtService.verify(oldRefreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.dataSource.manager.findOne(user_entity_1.User, {
                where: { id: decoded.id },
            });
            if (!user)
                return response_1.default.errorNotFound('User không tồn tại');
            const newAccessToken = this.jwtService.sign({
                id: user.id,
                email: user.email,
            });
            return response_1.default.get({ accessToken: newAccessToken });
        }
        catch (error) {
            throw response_1.default.errorInternal('Refresh token đã hết hạn hoặc không hợp lệ');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        view_service_1.ViewService,
        typeorm_1.DataSource,
        config_1.ConfigService,
        Email_1.EmailService,
        ioredis_1.default])
], AuthService);
//# sourceMappingURL=auth.service.js.map