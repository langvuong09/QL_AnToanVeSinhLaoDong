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
exports.BaseAddressEntity = exports.KeyValue = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const _1 = require(".");
class KeyValue {
    key;
    value;
    constructor(keyValue) {
        Object.assign(this, keyValue);
    }
}
exports.KeyValue = KeyValue;
class BaseAddressEntity extends _1.BaseEntity {
    constructor(baseEntity) {
        super(baseEntity);
        const keys = [
            'phone',
            'address',
            'ward',
            'quarter',
            'district',
            'province',
        ];
        baseEntity &&
            keys.forEach((key) => {
                baseEntity[key] !== undefined && (this[key] = baseEntity[key]);
            });
    }
    phone;
    address;
    quarter;
    ward;
    district;
    province;
}
exports.BaseAddressEntity = BaseAddressEntity;
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsPhoneNumber)('VN'),
    __metadata("design:type", String)
], BaseAddressEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BaseAddressEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BaseAddressEntity.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", KeyValue)
], BaseAddressEntity.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", KeyValue)
], BaseAddressEntity.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", KeyValue)
], BaseAddressEntity.prototype, "province", void 0);
//# sourceMappingURL=baseAddressEntity.js.map