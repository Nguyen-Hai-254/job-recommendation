"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumApplicationType = exports.EnumApprovalStatus = exports.EnumPositionLevel = exports.EnumExperience = exports.EnumEmploymentType = exports.EnumSex = exports.EnumUserRole = exports.EnumDegree = void 0;
const enum_1 = require("./enum");
const EnumDegree = (x) => {
    let y = enum_1.degree.Other;
    switch (x) {
        case 'highSchool':
        case enum_1.degree.highSchool:
            y = enum_1.degree.highSchool;
            break;
        case 'intermediate':
        case enum_1.degree.intermediate:
            y = enum_1.degree.intermediate;
            break;
        case 'associate':
        case enum_1.degree.associate:
            y = enum_1.degree.associate;
            break;
        case 'bachelor':
        case enum_1.degree.bachelor:
            y = enum_1.degree.bachelor;
            break;
        case 'doctor':
        case enum_1.degree.doctor:
            y = enum_1.degree.doctor;
            break;
        case 'master':
        case enum_1.degree.master:
            y = enum_1.degree.master;
            break;
        default:
            y = enum_1.degree.Other;
    }
    return y;
};
exports.EnumDegree = EnumDegree;
const EnumUserRole = (x) => {
    let y = enum_1.userRole.Employee;
    switch (x) {
        case 'EMPLOYER':
            y = enum_1.userRole.Employer;
            break;
        case 'ADMIN':
            y = enum_1.userRole.Admin;
            break;
        default:
            y = enum_1.userRole.Employee;
    }
    return y;
};
exports.EnumUserRole = EnumUserRole;
const EnumSex = (x) => {
    let y = enum_1.sex.Other;
    switch (x) {
        case 'Male':
        case enum_1.sex.Male:
            y = enum_1.sex.Male;
            break;
        case 'Female':
        case enum_1.sex.Female:
            y = enum_1.sex.Female;
            break;
        default:
            y = enum_1.sex.Other;
    }
    return y;
};
exports.EnumSex = EnumSex;
const EnumEmploymentType = (x) => {
    let y = enum_1.employmentType.Other;
    switch (x) {
        case enum_1.employmentType.FulltimePermanent:
            y = enum_1.employmentType.FulltimePermanent;
            break;
        case enum_1.employmentType.FulltimeTemporary:
            y = enum_1.employmentType.FulltimeTemporary;
            break;
        case enum_1.employmentType.ParttimePermanent:
            y = enum_1.employmentType.ParttimePermanent;
            break;
        case enum_1.employmentType.ParttimeTemporary:
            y = enum_1.employmentType.ParttimeTemporary;
            break;
        case enum_1.employmentType.ConsultingContract:
            y = enum_1.employmentType.ConsultingContract;
            break;
        case enum_1.employmentType.Internship:
            y = enum_1.employmentType.Internship;
            break;
        default:
            y = enum_1.employmentType.Other;
    }
    return y;
};
exports.EnumEmploymentType = EnumEmploymentType;
const EnumExperience = (x) => {
    let y = enum_1.experience.OverFive;
    switch (x) {
        case 'Zero':
        case enum_1.experience.Zero:
            y = enum_1.experience.Zero;
            break;
        case 'UnderOne':
        case enum_1.experience.UnderOne:
            y = enum_1.experience.UnderOne;
            break;
        case 'One':
        case enum_1.experience.One:
            y = enum_1.experience.One;
            break;
        case 'Two':
        case enum_1.experience.Two:
            y = enum_1.experience.Two;
            break;
        case 'Three':
        case enum_1.experience.Three:
            y = enum_1.experience.Three;
            break;
        case 'Four':
        case enum_1.experience.Four:
            y = enum_1.experience.Four;
            break;
        case 'Five':
        case enum_1.experience.Five:
            y = enum_1.experience.Five;
            break;
        default:
            y = enum_1.experience.OverFive;
    }
    return y;
};
exports.EnumExperience = EnumExperience;
const EnumPositionLevel = (x) => {
    let y = enum_1.positionLevel.Employee;
    switch (x) {
        case 'ExecutiveManagement':
        case enum_1.positionLevel.ExecutiveManagement:
            y = enum_1.positionLevel.ExecutiveManagement;
            break;
        case 'MiddleManagement':
        case enum_1.positionLevel.MiddleManagement:
            y = enum_1.positionLevel.MiddleManagement;
            break;
        case 'TeamLeader':
        case enum_1.positionLevel.TeamLeader:
            y = enum_1.positionLevel.TeamLeader;
            break;
        case 'Specialist':
        case enum_1.positionLevel.Specialist:
            y = enum_1.positionLevel.Specialist;
            break;
        case 'Contributor':
        case enum_1.positionLevel.Contributor:
            y = enum_1.positionLevel.Contributor;
            break;
        default:
            y = enum_1.positionLevel.Employee;
    }
    return y;
};
exports.EnumPositionLevel = EnumPositionLevel;
const EnumApprovalStatus = (status) => {
    let y = enum_1.approvalStatus.pending;
    switch (status) {
        case 'approved':
        case enum_1.approvalStatus.approved:
            y = enum_1.approvalStatus.approved;
            break;
        case 'rejected':
        case enum_1.approvalStatus.rejected:
            y = enum_1.approvalStatus.rejected;
            break;
        case 'expired':
        case enum_1.approvalStatus.expired:
            y = enum_1.approvalStatus.expired;
            break;
        default:
            y = enum_1.approvalStatus.pending;
    }
    return y;
};
exports.EnumApprovalStatus = EnumApprovalStatus;
const EnumApplicationType = (type) => {
    let y = enum_1.applicationType.online_profile;
    switch (type) {
        case 'attached_document':
        case enum_1.applicationType.attached_document:
            y = enum_1.applicationType.attached_document;
            break;
        case 'cv_enclosed':
        case enum_1.applicationType.cv_enclosed:
            y = enum_1.applicationType.cv_enclosed;
            break;
        default:
            y = enum_1.applicationType.online_profile;
    }
    return y;
};
exports.EnumApplicationType = EnumApplicationType;
//# sourceMappingURL=enumAction.js.map