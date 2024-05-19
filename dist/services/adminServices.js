"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const JobPosting_1 = require("../entity/JobPosting");
const connectDB_1 = require("../config/connectDB");
const enum_1 = require("../utils/enum");
const Users_1 = require("../entity/Users");
const OnlineProfile_1 = require("../entity/OnlineProfile");
const AttachedDocument_1 = require("../entity/AttachedDocument");
const utilsFunction_1 = require("../utils/utilsFunction");
const typeorm_1 = require("typeorm");
const mailServices_1 = __importDefault(require("./mailServices"));
const jobPostingRepository = connectDB_1.myDataSource.getRepository(JobPosting_1.JobPosting);
const userRepository = connectDB_1.myDataSource.getRepository(Users_1.User);
const online_profileRepository = connectDB_1.myDataSource.getRepository(OnlineProfile_1.OnlineProfile);
const attachedDocumentRepository = connectDB_1.myDataSource.getRepository(AttachedDocument_1.AttachedDocument);
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
    return ({
        message: 'OK',
        status: 200,
        data: formattedResults
    });
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
    return ({
        message: 'OK',
        status: 200,
        data: top5AndOther
    });
};
AdminServices.handleGetAllUser = async (req) => {
    const { page, num, role } = req.query;
    let query = userRepository.createQueryBuilder('user');
    if (role) {
        query = query.where('user.role = :role', { role });
    }
    // Pagination
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    const findAllUser = await query.getMany();
    return ({
        message: 'OK',
        status: 200,
        data: findAllUser
    });
};
AdminServices.handleGetTotalUser = async (req) => {
    const { role } = req.query;
    let query = userRepository.createQueryBuilder('user');
    if (role) {
        query = query.where('user.role = :role', { role });
    }
    const findAllUser = await query.getCount();
    return ({
        message: 'OK',
        status: 200,
        data: findAllUser
    });
};
AdminServices.handleSendEmail = async (emails, subject, html) => {
    const info = await mailServices_1.default.sendEmailForUsers(emails, subject, html);
    return ({
        message: 'OK',
        status: 200,
        data: { accepted: info.accepted, rejected: info.rejected }
    });
};
AdminServices.handleSearchEmailOrName = async (keyword) => {
    const findUser = await userRepository.find({
        where: [
            {
                name: (0, typeorm_1.ILike)(`%${keyword}%`)
            },
            {
                email: (0, typeorm_1.ILike)(`%${keyword}%`)
            }
        ],
        select: ['userId', 'email', 'name', 'role'],
        take: 6
    });
    return ({
        message: 'OK',
        status: 200,
        data: findUser
    });
};
AdminServices.handleGetJobPostingsReportByQuery = async (year, month) => {
    if (!month) {
        const getReport = await jobPostingRepository.createQueryBuilder('job-postings')
            .select('DATE_FORMAT(job-postings.createAt, "%b") AS time, COUNT(*) AS value')
            .where('YEAR(job-postings.createAt) = :year and (job-postings.status = :approved or job-postings.status = :expired)', { year, approved: enum_1.approvalStatus.approved, expired: enum_1.approvalStatus.expired })
            .groupBy('time')
            .orderBy('job-postings.createAt')
            .getRawMany();
        return ({
            message: 'OK',
            status: 200,
            data: getReport
        });
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
        return ({
            message: 'OK',
            status: 200,
            data: daysInMonth
        });
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
    if (getAllOnlineProfile.length === 0 && getAllAttachedDocument.length === 0)
        return ({
            message: 'OK',
            status: 200,
            data: []
        });
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
    return ({
        message: 'OK',
        status: 200,
        data: top5AndOther
    });
};
exports.default = AdminServices;
//# sourceMappingURL=adminServices.js.map