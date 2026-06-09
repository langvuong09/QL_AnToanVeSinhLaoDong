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
exports.ResetPasswordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ResetPasswordDto {
    token;
    newPassword;
    confirmPassword;
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGci...', description: 'Reset Token nhận được từ email' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Token không được để trống' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NewPassword123!', description: 'Mật khẩu mới' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mật khẩu mới không được để trống' }),
    (0, class_validator_1.MinLength)(8, { message: 'Mật khẩu phải có tối thiểu 8 ký tự' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NewPassword123!', description: 'Xác nhận mật khẩu mới' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Vui lòng xác nhận mật khẩu' }),
    (0, class_validator_1.MinLength)(8, { message: 'Mật khẩu xác nhận phải có tối thiểu 8 ký tự' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "confirmPassword", void 0);
//# sourceMappingURL=reset-password.dto.js.map