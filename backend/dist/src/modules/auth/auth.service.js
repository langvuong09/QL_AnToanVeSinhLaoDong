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
const Domain_1 = require("../../helper/Domain");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const argon = __importStar(require("argon2"));
const Email_1 = __importDefault(require("../../helper/Email"));
let AuthService = class AuthService {
    jwtService;
    viewService;
    dataSource;
    constructor(jwtService, viewService, dataSource) {
        this.jwtService = jwtService;
        this.viewService = viewService;
        this.dataSource = dataSource;
    }
    async login(data, doet) {
        try {
            const _doet = doet && doet.id ? doet.id : null;
            const user = new auth_model_1.CurrentUser({
                ...data,
                doet: _doet
            });
            const roleId = user.role?.id ?? 0;
            const [views, token] = await Promise.all([
                await this.viewService.getViewsByRoleId(roleId),
                await this.jwtService.sign({ ...user })
            ]);
            const rs = new auth_model_1.LoginModel(token, {
                views: (0, lodash_1.get)(views, "data.items", [])
            });
            return response_1.default.get(rs);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async validateToken(token, doet) {
        try {
            const _doet = doet && doet.id ? doet.id : null;
            const decodedData = await this.jwtService.verifyAsync(token);
            const user = new auth_model_1.CurrentUser({
                ...decodedData,
                doet: _doet
            });
            const roleId = user.role?.id ?? 0;
            const views = await this.viewService.getViewsByRoleId(roleId);
            const rs = new auth_model_1.LoginModel(token, {
                user,
                views: (0, lodash_1.get)(views, "data.items", [])
            });
            return response_1.default.get(rs);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async forgotPassword(email, domain) {
        try {
            const manage = this.dataSource.manager;
            const user = await manage.findOne(user_entity_1.User, {
                where: {
                    email: email
                }
            });
            if (!user) {
                return response_1.default.errorNotFound("Not found email");
            }
            const _domain = (0, Domain_1.extractHostname)(domain);
            const codeEmail = this.jwtService.sign({
                email: email,
                id: user.id
            }, {
                expiresIn: "5m"
            });
            const URLReset = `https://${_domain}/reset-password?code=${codeEmail}`;
            const template = fs.readFileSync(path.resolve(__dirname, `${process.env.dirTemp}/forgot-password.html`), {
                encoding: "utf-8"
            });
            await Email_1.default.sendMail(email, "Lấy lại mật khẩu", template
                .replace(/\$1/g, user.fullName)
                .replace(/\$2/g, user.username)
                .replace(/\$3/g, URLReset));
            return response_1.default.SUCCESSFULLY;
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async resetPassword(code) {
        try {
            const data = this.jwtService.decode(code);
            const manage = this.dataSource.manager;
            const user = await manage.findOne(user_entity_1.User, {
                where: {
                    id: data.id
                }
            });
            if (!user) {
                return response_1.default.errorNotFound("Not found email");
            }
            const _newPassword = await argon.hash('12345678');
            await manage.query(`update users
                                set password = '${_newPassword}'
                                where id = '${data.id}'`);
            return response_1.default.SUCCESSFULLY;
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        view_service_1.ViewService,
        typeorm_1.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map