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
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const _1 = require("./");
let Employee = class Employee extends typeorm_1.BaseEntity {
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Employee.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Employee.prototype, "isMarried", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => _1.User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({
        name: 'userId',
        referencedColumnName: 'userId'
    }),
    __metadata("design:type", _1.User)
], Employee.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => _1.OnlineProfile, (onlineprofile) => onlineprofile.employee),
    __metadata("design:type", _1.OnlineProfile)
], Employee.prototype, "online_profile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => _1.AttachedDocument, (attacheddocument) => attacheddocument.employee),
    __metadata("design:type", _1.AttachedDocument)
], Employee.prototype, "attached_document", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => _1.Application, (application) => application.employee),
    __metadata("design:type", Array)
], Employee.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => _1.Follow, (follow) => follow.employee),
    __metadata("design:type", Array)
], Employee.prototype, "follow", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => _1.JobPosting, (jobPosting) => jobPosting.employee, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'follow-job',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'userId'
        },
        inverseJoinColumn: {
            name: 'postId',
            referencedColumnName: 'postId'
        }
    }),
    __metadata("design:type", Array)
], Employee.prototype, "jobs", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)()
], Employee);
//# sourceMappingURL=Employee.js.map