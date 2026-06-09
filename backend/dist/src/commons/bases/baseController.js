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
exports.BaseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const baseDto_1 = require("./baseDto");
const response_interceptor_1 = __importDefault(require("../../interceptors/response.interceptor"));
class BaseController {
    baseService;
    constructor(baseService) {
        this.baseService = baseService;
    }
    async get(getAllDto, req) {
        return await this.baseService.get(getAllDto, req.doet);
    }
    async getDetail(getAllDto, id, req) {
        return await this.baseService.getDetail(getAllDto, id, req.doet);
    }
    async post(req, itemDto) {
        return await this.baseService.post(req.user, itemDto, req.doet);
    }
    async put(req, id, itemDto) {
        return await this.baseService.put(req.user, id, itemDto);
    }
    async putRelations(req, id, itemDto) {
        return await this.baseService.putRelations(req.user, id, itemDto);
    }
    async deletes(req, ids) {
        return await this.baseService.deletes(req.user, ids, req.doet);
    }
    async detroys(req, ids) {
        return await this.baseService.destroys(req.user, ids, req.doet);
    }
    async delete(req, id) {
        return await this.baseService.delete(req.user, id);
    }
    async destroy(id) {
        await this.baseService.destroy(id);
    }
}
exports.BaseController = BaseController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Get items' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [baseDto_1.GetAllDto, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "get", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Get detail item' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [baseDto_1.GetAllDto, String, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "getDetail", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Create item' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "post", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Edit item' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "put", null);
__decorate([
    (0, common_1.Put)(':id/relations'),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Edit relations of item' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "putRelations", null);
__decorate([
    (0, common_1.Delete)('/deletes'),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Delete items' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "deletes", null);
__decorate([
    (0, common_1.Delete)('/destroys'),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Detroy items' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "detroys", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Delete item' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('/destroy/:id'),
    (0, common_1.UseInterceptors)(response_interceptor_1.default, common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Destroy item' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "destroy", null);
//# sourceMappingURL=baseController.js.map