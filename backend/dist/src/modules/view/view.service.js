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
const permission_service_1 = require("../permission/permission.service");
let ViewService = class ViewService extends baseService_1.BaseService {
    viewRepository;
    dataSource;
    permissionService;
    manager;
    constructor(viewRepository, dataSource, permissionService) {
        super(viewRepository, view_entity_1.View);
        this.viewRepository = viewRepository;
        this.dataSource = dataSource;
        this.permissionService = permissionService;
        this.manager = this.dataSource.manager;
    }
    async getViewsByRoleCode(roleCode) {
        const allViews = await this.viewRepository.find({
            relations: { requiredPermissions: true },
            order: { order: 'ASC' },
        });
        const rolePermissions = await this.permissionService.getPermissionsByRoleCode(roleCode);
        const rolePermissionIds = rolePermissions.map((p) => p.id);
        const hasPermission = (view) => {
            if (!view.requiredPermissions || view.requiredPermissions.length === 0) {
                return false;
            }
            const hasAccess = view.requiredPermissions.some((p) => rolePermissionIds.includes(p.id));
            console.log(`View: ${view.name} (ID: ${view.id})`);
            console.log(`Role Permission IDs:`, rolePermissionIds);
            console.log(`View Required IDs:`, view.requiredPermissions.map(p => p.id));
            console.log(`Has Access: ${hasAccess}`);
            return hasAccess;
        };
        const pruneTree = (parentId) => {
            return allViews
                .filter((view) => view.parentId === parentId)
                .map((view) => {
                if (view.parentId === null) {
                    return { ...view, children: pruneTree(view.id) };
                }
                if (hasPermission(view)) {
                    return { ...view, children: pruneTree(view.id) };
                }
                return null;
            })
                .filter((view) => view !== null);
        };
        const tree = pruneTree(null);
        return response_1.default.get({ items: tree });
    }
};
exports.ViewService = ViewService;
exports.ViewService = ViewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(view_entity_1.View)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        permission_service_1.PermissionService])
], ViewService);
//# sourceMappingURL=view.service.js.map