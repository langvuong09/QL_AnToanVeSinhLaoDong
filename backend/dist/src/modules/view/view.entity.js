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
exports.View = void 0;
const typeorm_1 = require("typeorm");
const permission_entity_1 = require("../permission/permission.entity");
let View = class View {
    id;
    name;
    url;
    requiredPermissions;
    parentId;
    parent;
    children;
    icon;
    order;
};
exports.View = View;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], View.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], View.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], View.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => permission_entity_1.Permission, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinTable)({
        name: 'view_permissions',
        joinColumn: { name: 'viewId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], View.prototype, "requiredPermissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], View.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => View, (view) => view.children),
    (0, typeorm_1.JoinColumn)({ name: 'parentId' }),
    __metadata("design:type", View)
], View.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => View, (view) => view.parent),
    __metadata("design:type", Array)
], View.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], View.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], View.prototype, "order", void 0);
exports.View = View = __decorate([
    (0, typeorm_1.Entity)('views')
], View);
//# sourceMappingURL=view.entity.js.map