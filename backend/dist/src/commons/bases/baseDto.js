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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetAllDto {
    pageSize;
    pageNumber;
    order;
    where;
    select;
    relation;
    province;
    district;
    ward;
}
exports.GetAllDto = GetAllDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Page size`,
        name: 'pageSize',
        required: false,
    }),
    __metadata("design:type", Number)
], GetAllDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Page number`,
        name: 'pageNumber',
        required: false,
    }),
    __metadata("design:type", Number)
], GetAllDto.prototype, "pageNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Sort`,
        name: 'order',
        required: false,
    }),
    __metadata("design:type", String)
], GetAllDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Filter`,
        name: 'where',
        required: false,
    }),
    __metadata("design:type", String)
], GetAllDto.prototype, "where", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Select`,
        name: 'select',
        required: false,
    }),
    __metadata("design:type", String)
], GetAllDto.prototype, "select", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Relation`,
        name: 'relation',
        required: false,
    }),
    __metadata("design:type", String)
], GetAllDto.prototype, "relation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Province`,
        name: 'province',
        required: false,
    }),
    __metadata("design:type", String)
], GetAllDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `district`,
        name: 'district',
        required: false,
    }),
    __metadata("design:type", String)
], GetAllDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `ward`,
        name: 'ward',
        required: false,
    }),
    __metadata("design:type", String)
], GetAllDto.prototype, "ward", void 0);
//# sourceMappingURL=baseDto.js.map