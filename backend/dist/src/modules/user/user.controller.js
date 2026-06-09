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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const authGuard_1 = require("../../commons/guards/authGuard");
const response_interceptor_1 = __importDefault(require("../../interceptors/response.interceptor"));
const swagger_1 = require("@nestjs/swagger");
const commons_1 = require("../../commons");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async checkUsername(username) {
        return await this.userService.checkUsername(username);
    }
    async getAll(query) {
        return await this.userService.getAll(query);
    }
    async import(req, users) {
        return await this.userService.import(req.user, users);
    }
    async recovery(user_id) {
        return await this.userService.recovery(user_id);
    }
    async resetPassword(id) {
        return await this.userService.resetPassword(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)("checkUsername"),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: "Get items" }),
    __param(0, (0, common_1.Query)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkUsername", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get items" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [commons_1.GetAllDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)("import"),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: "Get items" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("users")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "import", null);
__decorate([
    (0, common_1.Post)("recovery"),
    (0, swagger_1.ApiOperation)({ summary: "recovery account" }),
    __param(0, (0, common_1.Body)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "recovery", null);
__decorate([
    (0, common_1.Get)(":id/reset-password"),
    (0, swagger_1.ApiOperation)({ summary: "reset password account" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)("Users"),
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map