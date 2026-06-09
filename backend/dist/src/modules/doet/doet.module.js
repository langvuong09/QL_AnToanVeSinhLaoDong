"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoetModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const doet_controller_1 = require("./doet.controller");
const doet_entity_1 = require("./doet.entity");
const doet_service_1 = require("./doet.service");
const media_module_1 = require("../media/media.module");
let DoetModule = class DoetModule {
};
exports.DoetModule = DoetModule;
exports.DoetModule = DoetModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([doet_entity_1.Doet]), media_module_1.MediaModule],
        providers: [doet_service_1.DoetService],
        controllers: [doet_controller_1.DoetController],
    })
], DoetModule);
//# sourceMappingURL=doet.module.js.map