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
exports.Mimetype = exports.FileUploadDto = exports.UploadResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class UploadResponse {
    width;
    height;
    format;
    created_at;
    type;
    url;
    secure_url;
    access_mode;
    original_filename;
    public_id;
    public_url;
    constructor(uploadResponse) {
        Object.assign(this, uploadResponse);
    }
}
exports.UploadResponse = UploadResponse;
class FileUploadDto {
    file;
}
exports.FileUploadDto = FileUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], FileUploadDto.prototype, "file", void 0);
var Mimetype;
(function (Mimetype) {
    Mimetype["png"] = "image/png";
    Mimetype["jpeg"] = "image/jpeg";
    Mimetype["pdf"] = "application/pdf";
    Mimetype["vnd.openxmlformats-officedocument.wordprocessingml.document"] = ".docx";
    Mimetype["msword"] = "doc";
})(Mimetype || (exports.Mimetype = Mimetype = {}));
//# sourceMappingURL=media.model.js.map