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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainMiddleware = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const Domain_1 = require("../helper/Domain");
const doet_entity_1 = require("../modules/doet/doet.entity");
const response_1 = __importDefault(require("../commons/response"));
let DomainMiddleware = class DomainMiddleware {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async use(req, res, next) {
        const fullDomain = req.get("origin") || req.get("host");
        if (fullDomain) {
            const domain = (0, Domain_1.extractHostname)(fullDomain);
            if (domain != "admin-dev.rcp.com.vn" && domain != "admin.rcp.com.vn") {
                const manage = this.dataSource.manager;
                req.doet = await manage.findOne(doet_entity_1.Doet, {
                    where: {
                        domain: domain
                    }
                });
            }
        }
        else {
            throw response_1.default.errorInternal("Cannot get domain");
        }
        next();
    }
};
exports.DomainMiddleware = DomainMiddleware;
exports.DomainMiddleware = DomainMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DomainMiddleware);
//# sourceMappingURL=domain.middleware.js.map