import { applicationType, approvalStatus, degree, employmentType, experience, positionLevel, sex, userRole } from "./enum";

export const EnumDegree = (x) => {
    let y = degree.Other
    switch (x) {
        case 'highSchool': case degree.highSchool:
            y = degree.highSchool;
            break;
        case 'intermediate': case degree.intermediate:
            y = degree.intermediate;
            break;
        case 'associate': case degree.associate:
            y = degree.associate;
            break;
        case 'bachelor': case degree.bachelor:
            y = degree.bachelor;
            break;
        case 'doctor': case degree.doctor:
            y = degree.doctor;
            break;
        case 'master': case degree.master:
            y = degree.master;
            break;
        default:
            y = degree.Other;
    }
    return y;
}

export const EnumUserRole = (x) => {
    let y = userRole.Employee
    switch (x) {
        case 'EMPLOYER':
            y = userRole.Employer;
            break;
        case 'ADMIN':
            y = userRole.Admin;
            break;
        default:
            y = userRole.Employee;
    }
    return y;
}

export const EnumSex = (x) => {
    let y = sex.Other
    switch (x) {
        case 'Male': case sex.Male:
            y = sex.Male;
            break;
        case 'Female': case sex.Female:
            y = sex.Female;
            break;
        default:
            y = sex.Other;
    }
    return y;
}

export const EnumEmploymentType = (x) => {
    let y = employmentType.Other
    switch (x) {
        case employmentType.FulltimePermanent:
            y = employmentType.FulltimePermanent;
            break;
        case employmentType.FulltimeTemporary:
            y = employmentType.FulltimeTemporary;
            break;
        case employmentType.ParttimePermanent:
            y = employmentType.ParttimePermanent;
            break;
        case employmentType.ParttimeTemporary:
            y = employmentType.ParttimeTemporary;
            break;
        case employmentType.ConsultingContract:
            y = employmentType.ConsultingContract;
            break;
        case employmentType.Internship:
            y = employmentType.Internship;
            break;
        default:
            y = employmentType.Other;
    }
    return y;
}

export const EnumExperience = (x) => {
    let y = experience.OverFive
    switch (x) {
        case 'Zero': case experience.Zero:
            y = experience.Zero;
            break;
        case 'UnderOne': case experience.UnderOne:
            y = experience.UnderOne;
            break;
        case 'One': case experience.One:
            y = experience.One;
            break;
        case 'Two': case experience.Two:
            y = experience.Two;
            break;
        case 'Three': case experience.Three:
            y = experience.Three;
            break;
        case 'Four': case experience.Four:
            y = experience.Four;
            break;
        case 'Five': case experience.Five:
            y = experience.Five;
            break;
        default:
            y = experience.OverFive;
    }
    return y;
}

export const EnumPositionLevel = (x) => {
    let y = positionLevel.Employee;
    switch (x) {
        case 'ExecutiveManagement': case positionLevel.ExecutiveManagement:
            y = positionLevel.ExecutiveManagement;
            break;
        case 'MiddleManagement': case positionLevel.MiddleManagement:
            y = positionLevel.MiddleManagement;
            break;
        case 'TeamLeader': case positionLevel.TeamLeader:
            y = positionLevel.TeamLeader;
            break;
        case 'Specialist': case positionLevel.Specialist:
            y = positionLevel.Specialist;
            break;
        case 'Contributor': case positionLevel.Contributor:
            y = positionLevel.Contributor;
            break;
        default:
            y = positionLevel.Employee;

    }
    return y;
}

export const EnumApprovalStatus = (status) => {
    let y = approvalStatus.pending;
    switch (status) {
        case 'approved': case approvalStatus.approved:
            y = approvalStatus.approved;
            break;
        case 'rejected': case approvalStatus.rejected:
            y = approvalStatus.rejected;
            break;
        case 'expired': case approvalStatus.expired:
            y = approvalStatus.expired;
            break;
        default:
            y = approvalStatus.pending;
    }
    return y;
}

export const EnumApplicationType = (type) => {
    let y = applicationType.online_profile;
    switch (type) {
        case 'attached_document': case applicationType.attached_document:
            y = applicationType.attached_document;
            break;
        case 'cv_enclosed': case applicationType.cv_enclosed:
            y = applicationType.cv_enclosed;
            break;
        default:
            y = applicationType.online_profile;
    }
    return y;
}