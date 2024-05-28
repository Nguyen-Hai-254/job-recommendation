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
exports.OnlineProfile = void 0;
const typeorm_1 = require("typeorm");
const _1 = require("./");
const enum_1 = require("../utils/enum");
let OnlineProfile = class OnlineProfile extends typeorm_1.BaseEntity {
};
exports.OnlineProfile = OnlineProfile;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], OnlineProfile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.applicationType,
        default: enum_1.applicationType.online_profile,
        nullable: false,
        update: false,
        insert: true
    }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "applicationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "jobTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.positionLevel,
        default: enum_1.positionLevel.Employee
    }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "currentPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.positionLevel,
        default: enum_1.positionLevel.Employee
    }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "desiredPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], OnlineProfile.prototype, "desiredSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.degree,
        default: enum_1.degree.Other
    }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "degree", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "workAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.experience,
        default: enum_1.experience.OverFive
    }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.employmentType,
        default: enum_1.employmentType.Other
    }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "employmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "careerGoal", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], OnlineProfile.prototype, "view", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], OnlineProfile.prototype, "isHidden", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], OnlineProfile.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date
    // Properties of Chat GPT
    )
], OnlineProfile.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], OnlineProfile.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => _1.Employee, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({
        name: 'userId',
        referencedColumnName: 'userId'
    }),
    __metadata("design:type", _1.Employee)
], OnlineProfile.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => _1.WorkExperience, (workexperience) => workexperience.online_profile),
    __metadata("design:type", Array)
], OnlineProfile.prototype, "work_experiences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => _1.EducationInformation, (educationinformation) => educationinformation.online_profile),
    __metadata("design:type", Array)
], OnlineProfile.prototype, "education_informations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => _1.AnotherDegree, (anotherdegree) => anotherdegree.online_profile),
    __metadata("design:type", Array)
], OnlineProfile.prototype, "another_degrees", void 0);
exports.OnlineProfile = OnlineProfile = __decorate([
    (0, typeorm_1.Entity)()
], OnlineProfile);
//# sourceMappingURL=OnlineProfile.js.map