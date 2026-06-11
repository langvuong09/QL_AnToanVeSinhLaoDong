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
exports.Doet = void 0;
const baseAddressEntity_1 = require("../../commons/bases/baseAddressEntity");
const typeorm_1 = require("typeorm");
const media_entity_1 = require("../media/media.entity");
const business_type_entity_1 = require("../bussinessType/business-type.entity");
const industry_entity_1 = require("../industry/industry.entity");
const report_entity_1 = require("../report/report.entity");
let Doet = class Doet extends baseAddressEntity_1.BaseAddressEntity {
    id;
    name;
    taxCode;
    issuedDate;
    businessTypeId;
    businessType;
    industryId;
    industry;
    foreignName;
    representative;
    repPhone;
    files;
    reports;
};
exports.Doet = Doet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Doet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Doet.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Doet.prototype, "taxCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Doet.prototype, "issuedDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Doet.prototype, "businessTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_type_entity_1.BusinessType, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'businessTypeId' }),
    __metadata("design:type", business_type_entity_1.BusinessType)
], Doet.prototype, "businessType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Doet.prototype, "industryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => industry_entity_1.Industry, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'industryId' }),
    __metadata("design:type", industry_entity_1.Industry)
], Doet.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Doet.prototype, "foreignName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Doet.prototype, "representative", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Doet.prototype, "repPhone", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => media_entity_1.FileEntity, (file) => file.doet),
    __metadata("design:type", Array)
], Doet.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_entity_1.Report, (report) => report.doet),
    __metadata("design:type", Array)
], Doet.prototype, "reports", void 0);
exports.Doet = Doet = __decorate([
    (0, typeorm_1.Entity)("doets")
], Doet);
//# sourceMappingURL=doet.entity.js.map