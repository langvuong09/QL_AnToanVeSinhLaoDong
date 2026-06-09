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
let Doet = class Doet extends baseAddressEntity_1.BaseAddressEntity {
    constructor(doet) {
        super(doet);
        const keys = [
            "id",
            "name",
            "name2",
            "parentId",
            "domain",
            "logo",
            "favicon",
            "province",
            "province2",
        ];
        doet &&
            keys.forEach((key) => {
                doet[key] !== undefined && (this[key] = doet[key]);
            });
    }
    id;
    name;
    name2;
    domain;
    parentId;
    logo;
    favicon;
    province2;
};
exports.Doet = Doet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Doet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Doet.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Doet.prototype, "name2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Doet.prototype, "domain", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Doet.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Doet.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Doet.prototype, "favicon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", baseAddressEntity_1.KeyValue)
], Doet.prototype, "province2", void 0);
exports.Doet = Doet = __decorate([
    (0, typeorm_1.Entity)("doets"),
    __metadata("design:paramtypes", [Object])
], Doet);
//# sourceMappingURL=doet.entity.js.map