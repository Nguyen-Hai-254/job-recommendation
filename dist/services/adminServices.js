"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const connectDB_1 = require("../config/connectDB");
const entities_1 = require("../entities");
const enum_1 = require("../utils/enum");
const utilsFunction_1 = require("../utils/utilsFunction");
const mailServices_1 = __importDefault(require("./mailServices"));
const sort_direction_enum_1 = require("../utils/enums/sort-direction.enum");
const httpException_1 = require("../exceptions/httpException");
const jobPostingRepository = connectDB_1.myDataSource.getRepository(entities_1.JobPosting);
const userRepository = connectDB_1.myDataSource.getRepository(entities_1.User);
const online_profileRepository = connectDB_1.myDataSource.getRepository(entities_1.OnlineProfile);
const attachedDocumentRepository = connectDB_1.myDataSource.getRepository(entities_1.AttachedDocument);
class AdminServices {
}
_a = AdminServices;
AdminServices.handleGetJobPostingsReport = async () => {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
    const getReport = await jobPostingRepository.createQueryBuilder('job-postings')
        .select('DATE_FORMAT(job-postings.createAt, "%Y-%m") AS monthYear, COUNT(*) AS count')
        .where('job-postings.createAt <= :currentDate AND job-postings.createAt > :sixMonthsAgo', {
        currentDate: currentDate.toISOString(),
        sixMonthsAgo: sixMonthsAgo.toISOString(),
    })
        .groupBy('monthYear')
        .orderBy('monthYear')
        .getRawMany();
    const formattedResults = getReport.map((result) => {
        const [year, month] = result.monthYear.split('-');
        const monthAbbreviation = enum_1.monthMap[month];
        return { name: `${monthAbbreviation}`, value: result.count };
    });
    return formattedResults ? formattedResults : [];
};
AdminServices.handleCandidateStatistics = async () => {
    const getAllOnlineProfile = await online_profileRepository.createQueryBuilder('profile')
        .select('profile.profession AS profession, COUNT(*) AS userCount')
        .groupBy('profile.profession')
        .getRawMany();
    const getAllAttachedDocument = await attachedDocumentRepository.createQueryBuilder('profile')
        .select('profile.profession AS profession, COUNT(*) AS userCount')
        .groupBy('profile.profession')
        .getRawMany();
    const resultOnlineProlife = (0, utilsFunction_1.countCandidatesbyProfession)(getAllOnlineProfile);
    const resultAttachedDocument = (0, utilsFunction_1.countCandidatesbyProfession)(getAllAttachedDocument);
    const totalResult = (0, utilsFunction_1.mergerTwoObject)(resultOnlineProlife, resultAttachedDocument);
    // Chuyển đổi totalResult thành mảng objects
    let result = Object.entries(totalResult).map(([profession, count]) => ({
        name: profession,
        value: count
    }));
    const sortedData = result.sort((a, b) => b.value - a.value);
    const top5 = sortedData.slice(0, 5);
    const otherSum = sortedData.reduce((sum, currenItem) => sum + currenItem.value, 0) - top5.reduce((sum, currenItem) => sum + currenItem.value, 0);
    const top5AndOther = [...top5, { "name": "Khác", value: otherSum }];
    return top5AndOther ? top5AndOther : [];
};
AdminServices.handleGetAllUser = async (reqQuery) => {
    const { page, num, role, keyword, orderBy, sort } = reqQuery;
    let query = userRepository.createQueryBuilder('user');
    if (role) {
        query = query.where('user.role = :role', { role });
    }
    if (keyword) {
        query = query.andWhere(new typeorm_1.Brackets(qb => qb.where('user.name LIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('user.email LIKE :keyword', { keyword: `%${keyword}%` })));
    }
    // sort
    if (orderBy) {
        if (!sort_direction_enum_1.SortDirection.hasOwnProperty(sort))
            throw new httpException_1.HttpException(400, 'Invalid sort');
        switch (orderBy) {
            case 'name':
            case 'email':
            case 'dob':
            case 'phone':
            case 'sex':
            case 'role':
                query = query.orderBy(`user.${orderBy}`, sort);
                break;
            default:
                throw new httpException_1.HttpException(400, 'Invalid order by');
        }
    }
    else {
        query = query.orderBy(`user.name`, "ASC");
    }
    // Pagination
    query = query.skip((Number(page) - 1) * Number(num)).take(Number(num));
    const [items, totalItems] = await query.getManyAndCount();
    const totalPages = Math.ceil(totalItems / num);
    return {
        items: items,
        meta: {
            totalItems,
            itemCount: items.length,
            itemsPerPage: num,
            totalPages,
            currentPage: page
        }
    };
};
AdminServices.handleGetAllEmail = async (reqQuery) => {
    const { page, num, role, keyword } = reqQuery;
    let query = userRepository.createQueryBuilder('user')
        .select(['user.email']);
    if (role) {
        query = query.where('user.role = :role', { role });
    }
    if (keyword) {
        query = query.andWhere(new typeorm_1.Brackets(qb => qb.where('user.name LIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('user.email LIKE :keyword', { keyword: `%${keyword}%` })));
    }
    // Pagination
    if (num && page)
        query = query.skip((Number(page) - 1) * Number(num)).take(Number(num));
    const [items, totalItems] = await query.getManyAndCount();
    const totalPages = (num && page) ? Math.ceil(totalItems / num) : 1;
    return {
        items: items,
        meta: {
            totalItems,
            itemCount: items.length,
            itemsPerPage: (num && page) ? parseInt(num) : totalItems,
            totalPages,
            currentPage: (num && page) ? parseInt(page) : 1
        }
    };
};
AdminServices.handleSendEmail = async (emails, subject, html) => {
    const info = await mailServices_1.default.sendEmailForUsers(emails, subject, html);
    return { accepted: info.accepted, rejected: info.rejected };
};
AdminServices.handleGetJobPostingsReportByQuery = async (year, month) => {
    if (!month) {
        const getReport = await jobPostingRepository.createQueryBuilder('job-postings')
            .select('DATE_FORMAT(job-postings.createAt, "%b") AS time, COUNT(*) AS value')
            .where('YEAR(job-postings.createAt) = :year and (job-postings.status = :approved or job-postings.status = :expired)', { year, approved: enum_1.approvalStatus.approved, expired: enum_1.approvalStatus.expired })
            .groupBy('time')
            .orderBy('job-postings.createAt')
            .getRawMany();
        return getReport;
    }
    else {
        const getReport = await jobPostingRepository.createQueryBuilder('job-postings')
            .select('DATE_FORMAT(job-postings.createAt, "%e") AS time, COUNT(*) AS value')
            .where('YEAR(job-postings.createAt) = :year and MONTH(job-postings.createAt) = :month and (job-postings.status = :approved or job-postings.status = :expired)', { year, month, approved: enum_1.approvalStatus.approved, expired: enum_1.approvalStatus.expired })
            .groupBy('time')
            .orderBy('job-postings.createAt')
            .getRawMany();
        const daysInMonth = (0, utilsFunction_1.createArrayForDate)(month, year); // Tạo một mảng các ngày
        getReport.map(day => {
            daysInMonth[day.time - 1].value = day.value;
        });
        return daysInMonth;
    }
};
AdminServices.handleCandidateStatisticsByQuery = async (year, month) => {
    let queryAllOnlineProfile = online_profileRepository.createQueryBuilder('profile')
        .select('profile.profession AS profession, COUNT(*) AS userCount')
        .where('YEAR(profile.updateAt) = :year', { year })
        .groupBy('profile.profession');
    let queryAllAttachedDocument = attachedDocumentRepository.createQueryBuilder('profile')
        .select('profile.profession AS profession, COUNT(*) AS userCount')
        .where('YEAR(profile.updateAt) = :year', { year })
        .groupBy('profile.profession');
    if (month) {
        queryAllOnlineProfile = queryAllOnlineProfile.andWhere('MONTH(profile.updateAt) = :month', { month });
        queryAllAttachedDocument = queryAllAttachedDocument.andWhere('MONTH(profile.updateAt) = :month', { month });
    }
    let getAllOnlineProfile = await queryAllOnlineProfile.getRawMany();
    let getAllAttachedDocument = await queryAllAttachedDocument.getRawMany();
    if (getAllOnlineProfile.length === 0 && getAllAttachedDocument.length === 0) {
        return [];
    }
    const resultOnlineProlife = (0, utilsFunction_1.countCandidatesbyProfession)(getAllOnlineProfile);
    const resultAttachedDocument = (0, utilsFunction_1.countCandidatesbyProfession)(getAllAttachedDocument);
    const totalResult = (0, utilsFunction_1.mergerTwoObject)(resultOnlineProlife, resultAttachedDocument);
    // Chuyển đổi totalResult thành mảng objects
    let result = Object.entries(totalResult).map(([profession, count]) => ({
        name: profession,
        value: count
    }));
    const sortedData = result.sort((a, b) => b.value - a.value);
    const top5 = sortedData.slice(0, 5);
    const otherSum = sortedData.reduce((sum, currenItem) => sum + currenItem.value, 0) - top5.reduce((sum, currenItem) => sum + currenItem.value, 0);
    const top5AndOther = [...top5, { "name": "Khác", value: otherSum }];
    return top5AndOther ? top5AndOther : [];
};
exports.default = AdminServices;
//# sourceMappingURL=adminServices.js.map