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
exports.ViewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bases_1 = require("../../commons/bases");
const authGuard_1 = require("../../commons/guards/authGuard");
const response_interceptor_1 = __importDefault(require("../../interceptors/response.interceptor"));
const view_service_1 = require("./view.service");
let ViewController = class ViewController extends bases_1.BaseController {
    viewService;
    constructor(viewService) {
        super(viewService);
        this.viewService = viewService;
    }
    async getViewsByRoleId(id) {
        return await this.viewService.getViewsByRoleId(id);
    }
};
exports.ViewController = ViewController;
__decorate([
    (0, common_1.Get)('roles/:id'),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Get items by roleId' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "getViewsByRoleId", null);
exports.ViewController = ViewController = __decorate([
    (0, swagger_1.ApiTags)('Views'),
    (0, common_1.Controller)('views'),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __metadata("design:paramtypes", [view_service_1.ViewService])
], ViewController);
//# sourceMappingURL=view.controller.js.map