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
exports.DoetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bases_1 = require("../../commons/bases");
const typeorm_2 = require("typeorm");
const doet_entity_1 = require("./doet.entity");
const response_1 = __importDefault(require("../../commons/response"));
const media_service_1 = require("../media/media.service");
let DoetService = class DoetService extends bases_1.BaseService {
    dataSource;
    mediaService;
    doetRepository;
    manager;
    constructor(dataSource, mediaService, doetRepository) {
        super(doetRepository, (data) => new doet_entity_1.Doet(data));
        this.dataSource = dataSource;
        this.mediaService = mediaService;
        this.doetRepository = doetRepository;
        this.manager = this.dataSource.manager;
    }
    async getSetting(doet) {
        if (doet && doet.id) {
            return {
                name: doet.name2,
                province: doet.province2,
                logo: doet.logo ? await this.mediaService.generateUrl(doet.logo) : null,
                favicon: doet.favicon ? await this.mediaService.generateUrl(doet.favicon) : null
            };
        }
        throw response_1.default.errorNotFound(response_1.default.NOT_FOUND("doet_id"));
    }
    async updateSetting(doet, name, logo, favicon, province) {
        try {
            if (doet && doet.id) {
                const data = {
                    name2: name,
                    province2: province,
                };
                if (logo) {
                    data.logo = logo;
                }
                if (favicon) {
                    data.favicon = favicon;
                }
                await this.doetRepository.update({
                    id: doet.id
                }, data);
                return response_1.default.SUCCESSFULLY;
            }
            throw response_1.default.errorNotFound(response_1.default.NOT_FOUND("doet_id"));
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
};
exports.DoetService = DoetService;
exports.DoetService = DoetService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(doet_entity_1.Doet)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        media_service_1.MediaService,
        typeorm_2.Repository])
], DoetService);
//# sourceMappingURL=doet.service.js.map