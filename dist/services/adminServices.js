"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const jobPostingRepository = connectDB_1.myDataSource.getRepository(JobPosting_1.JobPosting);
const userRepository = connectDB_1.myDataSource.getRepository(Users_1.User);
const online_profileRepository = connectDB_1.myDataSource.getRepository(OnlineProfile_1.OnlineProfile);
const attachedDocumentRepository = connectDB_1.myDataSource.getRepository(AttachedDocument_1.AttachedDocument);
class AdminServices {
}
_a = AdminServices;
AdminServices.handleGetJobPostingsReport = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
    const getReport = yield jobPostingRepository.createQueryBuilder('job-postings')
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
});
AdminServices.handleCandidateStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    const getAllOnlineProfile = yield online_profileRepository.createQueryBuilder('profile')
        .select('profile.profession AS profession, COUNT(*) AS userCount')
        .groupBy('profile.profession')
        .getRawMany();
    const getAllAttachedDocument = yield attachedDocumentRepository.createQueryBuilder('profile')
        .select('profile.profession AS profession, COUNT(*) AS userCount')
        .groupBy('profile.profession')
        .getRawMany();
    const resultOnlineProlife = (0, utilsFunction_1.countCandidatesbyProfession)(getAllOnlineProfile);
    const resultAttachedDocument = (0, utilsFunction_1.countCandidatesbyProfession)(getAllAttachedDocument);
    const totalResult = (0, utilsFunction_1.mergerTwoObject)(resultOnlineProlife, resultAttachedDocument);
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
});
AdminServices.handleGetAllUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, num, role } = req.query;
    let query = userRepository.createQueryBuilder('user');
    if (role) {
        query = query.where('user.role = :role', { role: enum_1.userRole[role] });
    }
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    const findAllUser = yield query.getMany();
    return ({
        message: 'OK',
        status: 200,
        data: findAllUser
    });
});
AdminServices.handleGetTotalUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.query;
    let query = userRepository.createQueryBuilder('user');
    if (role) {
        query = query.where('user.role = :role', { role: enum_1.userRole[role] });
    }
    const findAllUser = yield query.getCount();
    return ({
        message: 'OK',
        status: 200,
        data: findAllUser
    });
});
AdminServices.handleSendEmail = (emails, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield utilsFunction_1.transporter.sendMail({
        from: 'itbachkhoa.hcmut@gmail.com',
        to: emails,
        subject: subject,
        html: html
    });
    return ({
        message: 'OK',
        status: 200,
        data: { accepted: info.accepted, rejected: info.rejected }
    });
});
AdminServices.handleSearchEmailOrName = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield userRepository.find({
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
});
exports.default = AdminServices;
//# sourceMappingURL=adminServices.js.map