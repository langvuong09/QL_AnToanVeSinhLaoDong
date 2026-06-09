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
const browser_1 = require("typeorm/browser");
let View = class View {
    constructor(view, keys = ["id", "name", "activities", "url", "icon", "parentId", "doet_id", "order"]) {
        view && keys.forEach(key => {
            view[key] !== undefined && (this[key] = view[key]);
        });
    }
    id;
    name;
    activities;
    url;
    icon;
    parentId;
    doet_id;
    order;
};
exports.View = View;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], View.prototype, "id", void 0);
__decorate([
    (0, browser_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], View.prototype, "name", void 0);
__decorate([
    (0, browser_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], View.prototype, "activities", void 0);
__decorate([
    (0, browser_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], View.prototype, "url", void 0);
__decorate([
    (0, browser_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], View.prototype, "icon", void 0);
__decorate([
    (0, browser_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], View.prototype, "parentId", void 0);
__decorate([
    (0, browser_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], View.prototype, "doet_id", void 0);
__decorate([
    (0, browser_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], View.prototype, "order", void 0);
exports.View = View = __decorate([
    (0, typeorm_1.Entity)("views"),
    __metadata("design:paramtypes", [Object, Array])
], View);
//# sourceMappingURL=view.entity.js.map