import { applicationType, approvalStatus, degree, employmentType, experience, positionLevel, sex, userRole } from "./enum";

export const EnumDegree = (x) => {
    let y = degree.Other
    switch (x) {
        case 'highSchool':
            y = degree.highSchool;
            break;
        case 'intermediate':
            y = degree.intermediate;
            break;
        case 'associate':
            y = degree.associate;
            break;
        case 'bachelor':
            y = degree.bachelor;
            break;
        case 'doctor':
            y = degree.doctor;
            break;
        case 'master':
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
        case 'Male':
            y = sex.Male;
            break;
        case 'Female':
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
        case 'FulltimePermanent':
            y = employmentType.FulltimePermanent;
            break;
        case 'FulltimeTemporary':
            y = employmentType.FulltimeTemporary;
            break;
        case 'ParttimePermanent':
            y = employmentType.ParttimePermanent;
            break;
        case 'ParttimeTemporary':
            y = employmentType.ParttimeTemporary;
            break;
        case 'ConsultingContract':
            y = employmentType.ConsultingContract;
            break;
        case 'Internship':
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
        case 'Zero':
            y = experience.Zero;
            break;
        case 'UnderOne':
            y = experience.UnderOne;
            break;
        case 'One':
            y = experience.One;
            break;
        case 'Two':
            y = experience.Two;
            break;
        case 'Three':
            y = experience.Three;
            break;
        case 'Four':
            y = experience.Four;
            break;
        case 'Five':
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
        case 'ExecutiveManagement':
            y = positionLevel.ExecutiveManagement;
            break;
        case 'MiddleManagement':
            y = positionLevel.MiddleManagement;
            break;
        case 'TeamLeader':
            y = positionLevel.TeamLeader;
            break;
        case 'Specialist':
            y = positionLevel.Specialist;
            break;
        case 'Contributor':
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
        case 'approved':
            y = approvalStatus.approved;
            break;
        case 'rejected':
            y = approvalStatus.rejected;
            break;
        case 'expired':
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
        case 'attached_document':
            y = applicationType.attached_document;
            break;
        case 'cv_enclosed':
            y = applicationType.cv_enclosed;
            break;
        default:
            y = applicationType.online_profile;
    }
    return y;
}