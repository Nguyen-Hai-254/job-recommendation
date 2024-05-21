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
exports.Save = void 0;
const typeorm_1 = require("typeorm");
const _1 = require("./");
let Save = class Save extends typeorm_1.BaseEntity {
};
exports.Save = Save;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Save.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Save.prototype, "employerId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Save.prototype, "isOnlineProfile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Save.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => _1.Employee, (employee) => employee.follow),
    (0, typeorm_1.JoinColumn)({
        name: 'employeeId',
        referencedColumnName: 'userId'
    }),
    __metadata("design:type", _1.Employee)
], Save.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => _1.Employer, (employer) => employer.saveEmployee, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({
        name: 'employerId',
        referencedColumnName: 'userId'
    }),
    __metadata("design:type", _1.Employer)
], Save.prototype, "employer", void 0);
exports.Save = Save = __decorate([
    (0, typeorm_1.Entity)()
], Save);
//# sourceMappingURL=Save.js.map