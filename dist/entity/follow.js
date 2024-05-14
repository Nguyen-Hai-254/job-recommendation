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
exports.Follow = void 0;
const typeorm_1 = require("typeorm");
const Employer_1 = require("./Employer");
const Employee_1 = require("./Employee");
let Follow = class Follow extends typeorm_1.BaseEntity {
};
exports.Follow = Follow;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Follow.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Follow.prototype, "employerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Follow.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.Employee, (employee) => employee.follow, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({
        name: 'employeeId',
        referencedColumnName: 'userId'
    }),
    __metadata("design:type", Employee_1.Employee)
], Follow.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employer_1.Employer, (employer) => employer.saveEmployee),
    (0, typeorm_1.JoinColumn)({
        name: 'employerId',
        referencedColumnName: 'userId'
    }),
    __metadata("design:type", Employer_1.Employer)
], Follow.prototype, "employer", void 0);
exports.Follow = Follow = __decorate([
    (0, typeorm_1.Entity)()
], Follow);
//# sourceMappingURL=follow.js.map