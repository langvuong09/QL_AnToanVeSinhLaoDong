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
exports.DoetController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const authGuard_1 = require("../../commons/guards/authGuard");
const doet_service_1 = require("./doet.service");
const baseAddressEntity_1 = require("../../commons/bases/baseAddressEntity");
const response_interceptor_1 = __importDefault(require("../../interceptors/response.interceptor"));
const bases_1 = require("../../commons/bases");
let DoetController = class DoetController extends bases_1.BaseController {
    doetService;
    constructor(doetService) {
        super(doetService);
        this.doetService = doetService;
    }
    async getSetting(req) {
        return await this.doetService.getSetting(req.doet);
    }
    async updateSetting(req, name, logo, favicon, province) {
        return await this.doetService.updateSetting(req.doet, name, logo, favicon, province);
    }
};
exports.DoetController = DoetController;
__decorate([
    (0, common_1.Get)("/setting"),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: "Update setting" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoetController.prototype, "getSetting", null);
__decorate([
    (0, common_1.Post)("/setting"),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: "Get setting" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)("name")),
    __param(2, (0, common_1.Body)("logo")),
    __param(3, (0, common_1.Body)("favicon")),
    __param(4, (0, common_1.Body)("province")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, baseAddressEntity_1.KeyValue]),
    __metadata("design:returntype", Promise)
], DoetController.prototype, "updateSetting", null);
exports.DoetController = DoetController = __decorate([
    (0, swagger_1.ApiTags)("Doets"),
    (0, common_1.Controller)("doets"),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __metadata("design:paramtypes", [doet_service_1.DoetService])
], DoetController);
//# sourceMappingURL=doet.controller.js.map