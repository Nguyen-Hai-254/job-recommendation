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
exports.JobPosting = void 0;
const typeorm_1 = require("typeorm");
const Employer_1 = require("./Employer");
const enum_1 = require("../utils/enum");
const Application_1 = require("./Application");
const Employee_1 = require("./Employee");
let JobPosting = class JobPosting extends typeorm_1.BaseEntity {
};
exports.JobPosting = JobPosting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JobPosting.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "contactAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "workAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "jobTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.employmentType,
        default: enum_1.employmentType.Other
    }),
    __metadata("design:type", String)
], JobPosting.prototype, "employmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.degree,
        default: enum_1.degree.Other
    }),
    __metadata("design:type", String)
], JobPosting.prototype, "degree", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.experience,
        default: enum_1.experience.OverFive
    }),
    __metadata("design:type", String)
], JobPosting.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.positionLevel,
        default: enum_1.positionLevel.Employee
    }),
    __metadata("design:type", String)
], JobPosting.prototype, "positionLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPosting.prototype, "minAge", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPosting.prototype, "maxAge", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.sex,
        nullable: true
    }),
    __metadata("design:type", Object)
], JobPosting.prototype, "sex", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPosting.prototype, "numberOfVacancies", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPosting.prototype, "trialPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], JobPosting.prototype, "applicationDeadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPosting.prototype, "minSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPosting.prototype, "maxSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "jobDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "jobRequirements", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "benefits", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], JobPosting.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], JobPosting.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPosting.prototype, "submissionCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPosting.prototype, "view", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], JobPosting.prototype, "isHidden", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.approvalStatus,
        default: enum_1.approvalStatus.pending
    }),
    __metadata("design:type", String)
], JobPosting.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "requiredSkills", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], JobPosting.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", Object)
], JobPosting.prototype, "check", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employer_1.Employer, (employer) => employer.jobPostings, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    __metadata("design:type", Employer_1.Employer)
], JobPosting.prototype, "employer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Application_1.Application, (application) => application.jobPosting),
    __metadata("design:type", Array)
], JobPosting.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Employee_1.Employee, (employee) => employee.jobs),
    __metadata("design:type", Array)
], JobPosting.prototype, "employee", void 0);
exports.JobPosting = JobPosting = __decorate([
    (0, typeorm_1.Entity)()
], JobPosting);
//# sourceMappingURL=JobPosting.js.map