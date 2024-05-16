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
exports.Application = void 0;
const typeorm_1 = require("typeorm");
const Employee_1 = require("./Employee");
const JobPosting_1 = require("./JobPosting");
const enum_1 = require("../utils/enum");
let Application = class Application extends typeorm_1.BaseEntity {
};
exports.Application = Application;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Application.prototype, "application_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.applicationType,
        default: enum_1.applicationType.online_profile
    }),
    __metadata("design:type", String)
], Application.prototype, "applicationType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date
    // Optional properties while applicationType = cv_enclosed
    )
], Application.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "CV", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Application.prototype, "matchingScore", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.approvalStatus,
        default: enum_1.approvalStatus.pending
    }),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.Employee, (employee) => employee.applications, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    // @JoinColumn({
    //     name: 'userId',
    //     referencedColumnName: 'userId'
    // })
    ,
    __metadata("design:type", Employee_1.Employee)
], Application.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => JobPosting_1.JobPosting, (jobPosting) => jobPosting.applications, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    // @JoinColumn({
    //     name: 'postId',
    //     referencedColumnName: 'postId'
    // })
    ,
    __metadata("design:type", JobPosting_1.JobPosting)
], Application.prototype, "jobPosting", void 0);
exports.Application = Application = __decorate([
    (0, typeorm_1.Entity)()
], Application);
//# sourceMappingURL=Application.js.map