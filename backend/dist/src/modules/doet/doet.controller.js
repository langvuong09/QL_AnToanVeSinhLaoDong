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
exports.DoetController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const authGuard_1 = require("../../commons/guards/authGuard");
const doet_service_1 = require("./doet.service");
const bases_1 = require("../../commons/bases");
let DoetController = class DoetController extends bases_1.BaseController {
    doetService;
    constructor(doetService) {
        super(doetService);
        this.doetService = doetService;
    }
};
exports.DoetController = DoetController;
exports.DoetController = DoetController = __decorate([
    (0, swagger_1.ApiTags)("Doets"),
    (0, common_1.Controller)("doets"),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __metadata("design:paramtypes", [doet_service_1.DoetService])
], DoetController);
//# sourceMappingURL=doet.controller.js.map