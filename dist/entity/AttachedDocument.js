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
exports.AttachedDocument = void 0;
const typeorm_1 = require("typeorm");
const Employee_1 = require("./Employee");
const enum_1 = require("../utils/enum");
let AttachedDocument = class AttachedDocument extends typeorm_1.BaseEntity {
};
exports.AttachedDocument = AttachedDocument;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], AttachedDocument.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "jobTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.positionLevel,
        default: enum_1.positionLevel.Employee
    }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "currentPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.positionLevel,
        default: enum_1.positionLevel.Employee
    }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "desiredPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AttachedDocument.prototype, "desiredSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.degree,
        default: enum_1.degree.Other
    }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "degree", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "workAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.experience,
        default: enum_1.experience.OverFive
    }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.employmentType,
        default: enum_1.employmentType.Other
    }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "employmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "careerGoal", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "CV", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AttachedDocument.prototype, "view", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AttachedDocument.prototype, "isHidden", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], AttachedDocument.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Employee_1.Employee, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({
        name: 'userId',
        referencedColumnName: 'userId'
    }),
    __metadata("design:type", Employee_1.Employee)
], AttachedDocument.prototype, "employee", void 0);
exports.AttachedDocument = AttachedDocument = __decorate([
    (0, typeorm_1.Entity)()
], AttachedDocument);
//# sourceMappingURL=AttachedDocument.js.map