"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const response_1 = __importDefault(require("../response"));
const argon = __importStar(require("argon2"));
const ignoreDoet = [
    "ethnic",
    "years",
    "doets",
    "profiles",
    "preferentials",
    "views",
    "categories",
    "roles",
    "infoBeneficiaries",
    "users"
];
let BaseService = class BaseService {
    baseRepository;
    newEntity;
    constructor(baseRepository, newEntity) {
        this.baseRepository = baseRepository;
        this.newEntity = newEntity;
    }
    async get(getAllDto, doet = null) {
        try {
            const pageSize = Number(getAllDto.pageSize || 10);
            const pageNumber = Number(getAllDto.pageNumber || 0);
            const order = getAllDto.order;
            const select = (getAllDto.select && JSON.parse(getAllDto.select)) || null;
            const relations = (getAllDto.relation && JSON.parse(getAllDto.relation)) || null;
            const where = (getAllDto.where && JSON.parse(getAllDto.where)) || {};
            if (where instanceof Array) {
                for (const item of where) {
                    Object.keys(item).forEach((key) => {
                        if (item[key].operation === "like") {
                            item[key] = (0, typeorm_1.ILike)(item[key].value);
                        }
                        else if (item[key].operation === "in") {
                            item[key] = (0, typeorm_1.In)(item[key].value);
                        }
                        else if (item[key].operation === "notIn") {
                            item[key] = (0, typeorm_1.Not)((0, typeorm_1.In)(item[key].value));
                        }
                        else if (item[key].operation === "=") {
                            item[key] = item[key].value;
                        }
                        else if (item[key].operation === "between") {
                            item[key] = (0, typeorm_1.Between)(item[key].value[0], item[key].value[1]);
                        }
                    });
                }
            }
            else {
                Object.keys(where).forEach((key) => {
                    if (where[key]?.operation === "like") {
                        where[key] = (0, typeorm_1.ILike)(where[key].value);
                    }
                    else if (where[key]?.operation === "in") {
                        where[key] = (0, typeorm_1.In)(where[key].value);
                    }
                    else if (where[key]?.operation === "notIn") {
                        where[key] = (0, typeorm_1.Not)((0, typeorm_1.In)(where[key].value));
                    }
                    else if (where[key]?.operation === "=") {
                        where[key] = where[key].value;
                    }
                    else if (where[key]?.operation === "between") {
                        where[key] = (0, typeorm_1.Between)(where[key].value[0], where[key].value[1]);
                    }
                });
            }
            if (doet && doet.id && !ignoreDoet.includes(this.baseRepository.metadata.tableName) && !where.doet_id) {
                where.doet_id = doet.id;
            }
            let [items, count] = await this.baseRepository.findAndCount({
                where,
                relations,
                select,
                order: { ...JSON.parse(order || "{}") },
                skip: pageSize * pageNumber,
                take: pageSize
            });
            const list = {
                items,
                count,
                pageSize: +pageSize,
                pageNumber: +pageNumber
            };
            return response_1.default.getList(list);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async getDetail(getAllDto, id, doet) {
        try {
            const relations = (getAllDto.relation && JSON.parse(getAllDto.relation)) || null;
            const _where = {
                id: id
            };
            if (doet && doet.id && !ignoreDoet.includes(this.baseRepository.metadata.tableName)) {
                _where.doet_id = doet.id;
            }
            const product = await this.baseRepository.findOne({
                where: _where,
                relations
            });
            if (!product) {
                throw response_1.default.errorNotFound(response_1.default.NOT_FOUND("Item"));
            }
            return response_1.default.get(product);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async post(currentUser, itemDto, doet) {
        try {
            if (itemDto.password) {
                itemDto.password = await argon.hash(itemDto.password);
            }
            const _entity = {
                ...itemDto,
                createdAt: new Date(),
                createdBy: currentUser.id
            };
            if (doet && doet.id && !ignoreDoet.includes(this.baseRepository.metadata.tableName)) {
                _entity.doet_id = doet.id;
            }
            const item = await this.baseRepository.save(this.newEntity(_entity));
            return response_1.default.get(item);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async put(currentUser, id, itemDto) {
        try {
            if (itemDto.password) {
                itemDto.password = await argon.hash(itemDto.password);
            }
            const result = await this.baseRepository.update(id, this.newEntity({
                ...itemDto,
                updatedAt: new Date(),
                updatedBy: currentUser.id
            }));
            return response_1.default.get(result);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async putRelations(currentUser, id, itemDto) {
        try {
            const item = await this.baseRepository.findOne({ where: { id } });
            if (!item) {
                throw response_1.default.errorNotFound(response_1.default.NOT_FOUND("Item"));
            }
            const updateItem = item;
            Object.keys(itemDto).forEach((x) => {
                updateItem[x] = [...itemDto[x]];
            });
            const result = await this.baseRepository.save({
                ...item,
                updatedAt: new Date(),
                updatedBy: currentUser.id
            });
            return response_1.default.get(result);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async delete(currentUser, id) {
        try {
            const result = await this.baseRepository.update(id, this.newEntity({
                deletedAt: new Date(),
                deletedBy: currentUser.id
            }));
            return response_1.default.get(result);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async destroy(id) {
        try {
            const result = await this.baseRepository.delete(id);
            return response_1.default.get(result);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async deletes(currentUser, ids, doet) {
        try {
            const result = await this.baseRepository.update(ids, this.newEntity({
                deletedAt: new Date(),
                deletedBy: currentUser.id
            }));
            return response_1.default.get(result);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async destroys(currentUser, ids, doet) {
        try {
            const result = await this.baseRepository.delete(ids);
            return response_1.default.get(result);
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
};
exports.BaseService = BaseService;
exports.BaseService = BaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.Repository, Function])
], BaseService);
//# sourceMappingURL=baseService.js.map