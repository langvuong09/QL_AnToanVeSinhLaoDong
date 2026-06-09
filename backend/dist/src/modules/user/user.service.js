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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const response_1 = __importDefault(require("../../commons/response"));
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const argon = __importStar(require("argon2"));
let UserService = class UserService {
    dataSource;
    userRepository;
    manager;
    constructor(dataSource, userRepository) {
        this.dataSource = dataSource;
        this.userRepository = userRepository;
        this.manager = this.dataSource.createEntityManager();
    }
    async checkUsername(username) {
        try {
            const foundedUser = await this.userRepository.findOne({
                where: {
                    username,
                },
            });
            const result = !!foundedUser;
            return {
                username,
                existed: result,
            };
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async import(currentUser, users) {
        try {
            let result = {
                success: 0,
                err: 0,
                username: [],
            };
            for (const user of users) {
                const existed = await this.checkUsername(user.username);
                if (existed.existed) {
                    result.err += 1;
                    result.username.push(user.username);
                }
                else {
                    await this.userRepository.save(Object.assign(new user_entity_1.User(), {
                        ...user,
                        password: user.password,
                        createdBy: currentUser.id,
                        createdAt: new Date(),
                    }));
                    result.success += 1;
                }
            }
            return result;
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async getAll(query) {
        try {
            let { pageSize, pageNumber, order } = query;
            const select = (query.select && JSON.parse(query.select)) || null;
            let relations = (query.relation && JSON.parse(query.relation)) || null;
            if (Array.isArray(relations)) {
                relations = relations.reduce((acc, curr) => {
                    acc[curr] = true;
                    return acc;
                }, {});
            }
            const province = (query.province && JSON.parse(query.province)) || null;
            const where = (query.where && JSON.parse(query.where)) || {};
            if (where instanceof Array) {
                for (const item of where) {
                    Object.keys(item).forEach((key) => {
                        if (item[key].operation === 'like') {
                            item[key] = (0, typeorm_2.ILike)(item[key].value);
                        }
                        else if (item[key].operation === 'in') {
                            item[key] = (0, typeorm_2.In)(item[key].value);
                        }
                        else if (item[key].operation === 'notIn') {
                            item[key] = (0, typeorm_2.Not)((0, typeorm_2.In)(item[key].value));
                        }
                    });
                }
            }
            else {
                Object.keys(where).forEach((key) => {
                    if (where[key].operation === 'like') {
                        where[key] = (0, typeorm_2.ILike)(where[key].value);
                    }
                    else if (where[key].operation === 'in') {
                        where[key] = (0, typeorm_2.In)(where[key].value);
                    }
                    else if (where[key].operation === 'notIn') {
                        where[key] = (0, typeorm_2.Not)((0, typeorm_2.In)(where[key].value));
                    }
                });
            }
            let [items, count] = await this.userRepository.findAndCount({
                where,
                relations,
                select,
                order: { ...JSON.parse(order || '{}') },
                skip: pageNumber,
                take: pageSize,
                withDeleted: true,
            });
            if (!!province) {
                items = items.filter((x) => x.province?.key === province.key);
            }
            return response_1.default.getList({
                items: items,
                count,
                pageSize: +pageSize,
                pageNumber: +pageNumber,
            });
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
    async recovery(user_id) {
        await this.manager.query(`update users
                              set "deletedBy" = NULL,
                                  "deletedAt" = null
                              where id = '${user_id}'`);
        return {
            success: true,
        };
    }
    async resetPassword(user_id) {
        const _newPassword = await argon.hash('12345678');
        await this.manager.query(`update users
              set password = '${_newPassword}'
              where id = '${user_id}'`);
        return {
            success: true,
        };
    }
    async get(query) {
        try {
            const where = (query.where && JSON.parse(query.where)) || {};
            let relations = (query.relation && JSON.parse(query.relation)) || null;
            if (Array.isArray(relations)) {
                relations = relations.reduce((acc, curr) => {
                    acc[curr] = true;
                    return acc;
                }, {});
            }
            const [items, count] = await this.userRepository.findAndCount({
                where,
                relations,
                take: 1,
            });
            return {
                data: {
                    items,
                    count,
                },
            };
        }
        catch (error) {
            throw response_1.default.errorInternal(error);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map