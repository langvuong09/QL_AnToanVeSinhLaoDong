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
exports.ViewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const response_1 = __importDefault(require("../../commons/response"));
const typeorm_2 = require("typeorm");
const view_entity_1 = require("./view.entity");
const baseService_1 = require("../../commons/bases/baseService");
let ViewService = class ViewService extends baseService_1.BaseService {
    viewRepository;
    dataSource;
    manager;
    constructor(viewRepository, dataSource) {
        super(viewRepository, view_entity_1.View);
        this.viewRepository = viewRepository;
        this.dataSource = dataSource;
        this.manager = this.dataSource.manager;
    }
    async getViewsByRoleId(roleId) {
        try {
            const data = await this.manager.query(`
  select * from views v, jsonb_array_elements(v.activities) a
  where a->>'roleId' = $1::text and "deletedAt" is null
`, [roleId]);
            const items = data.map((x) => {
                const activities = x.activities.filter((y) => y.roleId === roleId);
                return {
                    ...x,
                    activities,
                };
            });
            const list = {
                items,
                count: items.length,
            };
            return response_1.default.getList(list);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
};
exports.ViewService = ViewService;
exports.ViewService = ViewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(view_entity_1.View)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], ViewService);
//# sourceMappingURL=view.service.js.map