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
exports.Employer = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const JobPosting_1 = require("./JobPosting");
const save_1 = require("./save");
let Employer = class Employer extends typeorm_1.BaseEntity {
};
exports.Employer = Employer;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Employer.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employer.prototype, "taxCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employer.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employer.prototype, "companyLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employer.prototype, "careerField", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employer.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employer.prototype, "banner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], Employer.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Users_1.User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({
        name: 'userId',
        referencedColumnName: 'userId'
    }),
    __metadata("design:type", Users_1.User)
], Employer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => JobPosting_1.JobPosting, (jobPosting) => jobPosting.employer),
    __metadata("design:type", Array)
], Employer.prototype, "jobPostings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => save_1.Save, (save) => save.employer),
    __metadata("design:type", Array)
], Employer.prototype, "saveEmployee", void 0);
exports.Employer = Employer = __decorate([
    (0, typeorm_1.Entity)()
], Employer);
//# sourceMappingURL=Employer.js.map