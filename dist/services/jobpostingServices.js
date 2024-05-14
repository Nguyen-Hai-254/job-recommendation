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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const connectDB_1 = require("../config/connectDB");
const Employee_1 = require("../entity/Employee");
const Employer_1 = require("../entity/Employer");
const Users_1 = require("../entity/Users");
const enum_1 = require("../utils/enum");
const JobPosting_1 = require("../entity/JobPosting");
const moment_1 = __importDefault(require("moment"));
const enumAction_1 = require("../utils/enumAction");
const Notification_1 = require("../entity/Notification");
const typeorm_1 = require("typeorm");
const userRepository = connectDB_1.myDataSource.getRepository(Users_1.User);
const employerRepository = connectDB_1.myDataSource.getRepository(Employer_1.Employer);
const employeeRepository = connectDB_1.myDataSource.getRepository(Employee_1.Employee);
const jobPostingRepository = connectDB_1.myDataSource.getRepository(JobPosting_1.JobPosting);
const notificationRepository = connectDB_1.myDataSource.getRepository(Notification_1.Notification);
class JobPostingServices {
}
_a = JobPostingServices;
JobPostingServices.handleGetAllJobPostings = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, employerId, keywords, num, page } = req.query;
    let query = jobPostingRepository.createQueryBuilder('job-postings');
    query = query.leftJoinAndSelect("job-postings.employer", "employer")
        .where('job-postings.status = :status', { status: enum_1.approvalStatus.approved });
    if (workAddress) {
        query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        query = query.andWhere('job-postings.profession LIKE :profession', { profession: `%${profession}%` });
    }
    if (employmentType) {
        query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType });
    }
    if (degree) {
        query = query.andWhere('job-postings.degree = :degree', { degree });
    }
    if (experience) {
        query = query.andWhere('job-postings.experience = :experience', { experience });
    }
    if (positionLevel) {
        query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel });
    }
    if (sex) {
        query = query.andWhere(new typeorm_1.Brackets(qb => qb.where('job-postings.sex = :sex', { sex })
            .orWhere('job-postings.sex IS NULL')));
    }
    if (salary) {
        query = query.andWhere(':salary BETWEEN job-postings.minSalary AND job-postings.maxSalary', { salary });
    }
    if (employerId) {
        query = query.andWhere('job-postings.employer.userId = :employerId', { employerId });
    }
    if (keywords) {
        const keywordArray = keywords.split(',');
        const conditions = keywordArray.map((keyword, index) => {
            query.setParameter(`keyword${index}`, `%${keyword}%`);
            return `job-postings.keywords LIKE :keyword${index}`;
        });
        query.andWhere(`(${conditions.join(' OR ')})`);
        const orderByConditions = keywordArray.map((keyword, index) => {
            query.setParameter(`keyword${index}`, `%${keyword}%`);
            return `IF(job-postings.keywords LIKE :keyword${index}, 1, 0)`;
        });
        query.orderBy(`(${orderByConditions.join(' + ')})`, 'DESC');
    }
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    query = query.orderBy('job-postings.updateAt', 'DESC');
    const jobPostings = yield query.getMany();
    if (!jobPostings || jobPostings.length === 0) {
        return ({
            message: 'No jobPostings found',
            status: 204,
            data: null
        });
    }
    return ({
        message: 'Find all jobPostings success',
        status: 200,
        data: jobPostings
    });
});
JobPostingServices.handleGetLengthOfAllJobPostings = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, employerId, keywords } = req.query;
    let query = jobPostingRepository.createQueryBuilder('job-postings');
    query = query.leftJoinAndSelect("job-postings.employer", "employer")
        .where('job-postings.status = :status', { status: enum_1.approvalStatus.approved });
    if (workAddress) {
        query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        query = query.andWhere('job-postings.profession LIKE :profession', { profession: `%${profession}%` });
    }
    if (employmentType) {
        query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType });
    }
    if (degree) {
        query = query.andWhere('job-postings.degree = :degree', { degree });
    }
    if (experience) {
        query = query.andWhere('job-postings.experience = :experience', { experience });
    }
    if (positionLevel) {
        query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel });
    }
    if (sex) {
        query = query.andWhere(new typeorm_1.Brackets(qb => qb.where('job-postings.sex = :sex', { sex })
            .orWhere('job-postings.sex IS NULL')));
    }
    if (salary) {
        query = query.andWhere(':salary BETWEEN job-postings.minSalary AND job-postings.maxSalary', { salary });
    }
    if (employerId) {
        query = query.andWhere('job-postings.employer.userId = :employerId', { employerId });
    }
    if (keywords) {
        const keywordArray = keywords.split(',');
        const conditions = keywordArray.map((keyword, index) => {
            query.setParameter(`keyword${index}`, `%${keyword}%`);
            return `job-postings.keywords LIKE :keyword${index}`;
        });
        query.andWhere(`(${conditions.join(' OR ')})`);
        const orderByConditions = keywordArray.map((keyword, index) => {
            query.setParameter(`keyword${index}`, `%${keyword}%`);
            return `IF(job-postings.keywords LIKE :keyword${index}, 1, 0)`;
        });
        query.orderBy(`(${orderByConditions.join(' + ')})`, 'DESC');
    }
    const totalResults = yield query.getCount();
    return ({
        message: 'Find length of jobPostings success',
        status: 200,
        data: { totalResults: totalResults }
    });
});
JobPostingServices.handleGetAllJobPostingsByAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, status, num, page } = req.query;
    let query = jobPostingRepository.createQueryBuilder('job-postings');
    query = query.leftJoinAndSelect("job-postings.employer", "employer");
    query = query.leftJoinAndSelect("job-postings.applications", "applications");
    if (status) {
        query = query.where('job-postings.status = :status', { status });
    }
    if (workAddress) {
        query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        query = query.andWhere('job-postings.profession LIKE :profession', { profession: `%${profession}%` });
    }
    if (employmentType) {
        query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType });
    }
    if (degree) {
        query = query.andWhere('job-postings.degree = :degree', { degree });
    }
    if (experience) {
        query = query.andWhere('job-postings.experience = :experience', { experience });
    }
    if (positionLevel) {
        query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel });
    }
    if (sex) {
        query = query.andWhere(new typeorm_1.Brackets(qb => qb.where('job-postings.sex = :sex', { sex })
            .orWhere('job-postings.sex IS NULL')));
    }
    if (salary) {
        query = query.andWhere(':salary BETWEEN job-postings.minSalary AND job-postings.maxSalary', { salary });
    }
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    else {
        query = query.skip(0).take(10);
    }
    query = query.orderBy('job-postings.updateAt', 'DESC');
    const jobPostings = yield query.getMany();
    if (!jobPostings || jobPostings.length === 0) {
        return ({
            message: 'No jobPostings found',
            status: 204,
            data: null
        });
    }
    return ({
        message: 'Find all jobPostings success',
        status: 200,
        data: jobPostings.map(job => (Object.assign(Object.assign({}, job), { submissionCount: job.applications.length })))
    });
});
JobPostingServices.handleGetLengthOfAllJobPostingsByAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, status } = req.query;
    let query = jobPostingRepository.createQueryBuilder('job-postings');
    query = query.leftJoinAndSelect("job-postings.employer", "employer");
    if (status) {
        query = query.where('job-postings.status = :status', { status });
    }
    if (workAddress) {
        query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        query = query.andWhere('job-postings.profession LIKE :profession', { profession: `%${profession}%` });
    }
    if (employmentType) {
        query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType });
    }
    if (degree) {
        query = query.andWhere('job-postings.degree = :degree', { degree });
    }
    if (experience) {
        query = query.andWhere('job-postings.experience = :experience', { experience });
    }
    if (positionLevel) {
        query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel });
    }
    if (sex) {
        query = query.andWhere(new typeorm_1.Brackets(qb => qb.where('job-postings.sex = :sex', { sex })
            .orWhere('job-postings.sex IS NULL')));
    }
    if (salary) {
        query = query.andWhere(':salary BETWEEN job-postings.minSalary AND job-postings.maxSalary', { salary });
    }
    const totalResults = yield query.getCount();
    return ({
        message: 'Find length of jobPostings success',
        status: 200,
        data: { totalResults: totalResults }
    });
});
JobPostingServices.handleGetTotalResultsOfProfession = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jobPostingRepository
        .createQueryBuilder('jobPosting')
        .where('jobPosting.status = :status', { status: enum_1.approvalStatus.approved })
        .select(`SUBSTRING_INDEX(SUBSTRING_INDEX(jobPosting.profession, ',', 1), ',', -1)`, 'profession_value')
        .addSelect('COUNT(*)', 'count')
        .andWhere(`LENGTH(jobPosting.profession) - LENGTH(REPLACE(jobPosting.profession, ',', '')) + 1 >= 1`)
        .groupBy('profession_value')
        .getRawMany();
    return ({
        message: `Find job postings successful!`,
        status: 200,
        data: result
    });
});
JobPostingServices.handleGetTotalResultsOfProfessionByAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.query;
    let query = jobPostingRepository.createQueryBuilder('jobPosting');
    if (status) {
        query = query.where('jobPosting.status = :status', { status });
    }
    query = query.select(`SUBSTRING_INDEX(SUBSTRING_INDEX(jobPosting.profession, ',', 1), ',', -1)`, 'profession_value')
        .addSelect('COUNT(*)', 'count')
        .andWhere(`LENGTH(jobPosting.profession) - LENGTH(REPLACE(jobPosting.profession, ',', '')) + 1 >= 1`)
        .groupBy('profession_value');
    const result = yield query.getRawMany();
    return ({
        message: `Find job postings successful!`,
        status: 200,
        data: result
    });
});
JobPostingServices.handleGetJobPostingsByEmployer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, num, page } = req.query;
    let query = jobPostingRepository
        .createQueryBuilder('jobPosting')
        .leftJoin('jobPosting.employer', 'employer')
        .leftJoinAndSelect("jobPosting.applications", "applications")
        .where('employer.userId = :userId', { userId: req.user.userId });
    if (status) {
        query = query.andWhere('jobPosting.status = :status', { status });
    }
    const totalResults = yield query.getCount();
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    else {
        query = query.skip(0).take(10);
    }
    query = query.orderBy('jobPosting.updateAt', 'DESC');
    const jobPostings = yield query.getMany();
    return ({
        message: `Find job postings successful!`,
        status: 200,
        data: {
            totalResults: totalResults,
            result: jobPostings.map(job => (Object.assign(Object.assign({}, job), { submissionCount: job.applications.length })))
        }
    });
});
JobPostingServices.handleGetJobPosting = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.postId)) {
        return ({
            message: 'postId is required',
            status: 400,
            data: null
        });
    }
    const jobPosting = yield jobPostingRepository.findOne({
        where: { postId: req.params.postId },
        relations: ['employer']
    });
    if (!jobPosting) {
        return ({
            message: `No Job posting matches postId: ${req.params.postId}`,
            status: 400,
            data: null
        });
    }
    jobPosting.view += 1;
    yield jobPosting.save();
    return ({
        message: `Find Job posting has postId: ${req.params.postId} successes`,
        status: 200,
        data: jobPosting
    });
});
JobPostingServices.handleGetJobPostingByEmployer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (!((_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.postId)) {
        return ({
            message: 'postId is required',
            status: 400,
            data: null
        });
    }
    const jobPosting = yield jobPostingRepository.findOne({
        where: { postId: req.params.postId },
        relations: ['employer', 'applications'],
    });
    if (!jobPosting) {
        return ({
            message: `No Job posting matches postId: ${req.params.postId}`,
            status: 400,
            data: null
        });
    }
    return ({
        message: `Find Job posting has postId: ${req.params.postId} successes`,
        status: 200,
        data: jobPosting
    });
});
JobPostingServices.handleUpdateJobPosting = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    if (!((_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.postId)) {
        return ({
            message: 'postId is required',
            status: 400,
            data: null
        });
    }
    const jobPosting = yield jobPostingRepository.findOne({
        where: { postId: req.params.postId },
        relations: ['employer.user']
    });
    if (!jobPosting) {
        return ({
            message: `No Job posting matches postId: ${req.params.postId}`,
            status: 400,
            data: null
        });
    }
    if (jobPosting.employer.userId !== req.user.userId) {
        return ({
            message: `You aren't a owner of jobPosting with postId: ${jobPosting.postId}`,
            status: 403,
            data: null
        });
    }
    if ((_e = req.body) === null || _e === void 0 ? void 0 : _e.name)
        jobPosting.name = req.body.name;
    if ((_f = req.body) === null || _f === void 0 ? void 0 : _f.email)
        jobPosting.email = req.body.email;
    if ((_g = req.body) === null || _g === void 0 ? void 0 : _g.phone)
        jobPosting.phone = req.body.phone;
    if ((_h = req.body) === null || _h === void 0 ? void 0 : _h.contactAddress)
        jobPosting.contactAddress = req.body.contactAddress;
    if ((_j = req.body) === null || _j === void 0 ? void 0 : _j.workAddress)
        jobPosting.workAddress = req.body.workAddress;
    if ((_k = req.body) === null || _k === void 0 ? void 0 : _k.jobTitle)
        jobPosting.jobTitle = req.body.jobTitle;
    if ((_l = req.body) === null || _l === void 0 ? void 0 : _l.profession)
        jobPosting.profession = req.body.profession;
    if ((_m = req.body) === null || _m === void 0 ? void 0 : _m.employmentType)
        jobPosting.employmentType = (0, enumAction_1.EnumEmploymentType)(req.body.employmentType);
    if ((_o = req.body) === null || _o === void 0 ? void 0 : _o.degree)
        jobPosting.degree = (0, enumAction_1.EnumDegree)(req.body.degree);
    if ((_p = req.body) === null || _p === void 0 ? void 0 : _p.experience)
        jobPosting.experience = (0, enumAction_1.EnumExperience)(req.body.experience);
    if ((_q = req.body) === null || _q === void 0 ? void 0 : _q.positionLevel)
        jobPosting.positionLevel = (0, enumAction_1.EnumPositionLevel)(req.body.positionLevel);
    if ((_r = req.body) === null || _r === void 0 ? void 0 : _r.minAge)
        jobPosting.minAge = req.body.minAge;
    if ((_s = req.body) === null || _s === void 0 ? void 0 : _s.maxAge)
        jobPosting.maxAge = req.body.maxAge;
    if ((_t = req.body) === null || _t === void 0 ? void 0 : _t.sex)
        jobPosting.sex = (0, enumAction_1.EnumSex)(req.body.sex);
    else if (((_u = req.body) === null || _u === void 0 ? void 0 : _u.sex) === null)
        jobPosting.sex = null;
    if ((_v = req.body) === null || _v === void 0 ? void 0 : _v.numberOfVacancies)
        jobPosting.numberOfVacancies = req.body.numberOfVacancies;
    if ((_w = req.body) === null || _w === void 0 ? void 0 : _w.trialPeriod)
        jobPosting.trialPeriod = req.body.trialPeriod;
    if ((_x = req.body) === null || _x === void 0 ? void 0 : _x.applicationDeadline)
        jobPosting.applicationDeadline = new Date((0, moment_1.default)(req.body.applicationDeadline).format("YYYY-MM-DD"));
    if ((_y = req.body) === null || _y === void 0 ? void 0 : _y.minSalary)
        jobPosting.minSalary = req.body.minSalary;
    if ((_z = req.body) === null || _z === void 0 ? void 0 : _z.maxSalary)
        jobPosting.maxSalary = req.body.maxSalary;
    if ((_0 = req.body) === null || _0 === void 0 ? void 0 : _0.skills)
        jobPosting.skills = req.body.skills;
    if ((_1 = req.body) === null || _1 === void 0 ? void 0 : _1.jobDescription)
        jobPosting.jobDescription = req.body.jobDescription;
    if ((_2 = req.body) === null || _2 === void 0 ? void 0 : _2.jobRequirements)
        jobPosting.jobRequirements = req.body.jobRequirements;
    if ((_3 = req.body) === null || _3 === void 0 ? void 0 : _3.benefits)
        jobPosting.benefits = req.body.benefits;
    if (((_4 = req.body) === null || _4 === void 0 ? void 0 : _4.isHidden) !== null)
        jobPosting.isHidden = req.body.isHidden;
    if ((_5 = req.body) === null || _5 === void 0 ? void 0 : _5.requiredSkills)
        jobPosting.requiredSkills = req.body.requiredSkills;
    if ((_6 = req.body) === null || _6 === void 0 ? void 0 : _6.keywords)
        jobPosting.keywords = req.body.keywords;
    jobPosting.status = enum_1.approvalStatus.pending;
    jobPosting.updateAt = new Date();
    jobPosting.check = null;
    yield jobPostingRepository.save(jobPosting);
    const createNotification = notificationRepository.create({
        content: 'Bạn đã cập nhật tin tuyển dụng ' + jobPosting.jobTitle,
        user: jobPosting.employer.user
    });
    yield notificationRepository.save(createNotification);
    return ({
        message: `Job posting has postId: ${req.params.postId} are updated successfully`,
        status: 200,
        data: jobPosting
    });
});
JobPostingServices.handleCreateNewJobPosting = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29;
    if (!((_7 = req === null || req === void 0 ? void 0 : req.body) === null || _7 === void 0 ? void 0 : _7.name) || !((_8 = req === null || req === void 0 ? void 0 : req.body) === null || _8 === void 0 ? void 0 : _8.email) || !((_9 = req === null || req === void 0 ? void 0 : req.body) === null || _9 === void 0 ? void 0 : _9.phone) || !((_10 = req === null || req === void 0 ? void 0 : req.body) === null || _10 === void 0 ? void 0 : _10.contactAddress)) {
        return ({
            message: 'Thông tin liên hệ còn thiếu',
            status: 400,
            data: null
        });
    }
    if (!((_11 = req === null || req === void 0 ? void 0 : req.body) === null || _11 === void 0 ? void 0 : _11.jobTitle) || !((_12 = req === null || req === void 0 ? void 0 : req.body) === null || _12 === void 0 ? void 0 : _12.profession) || !((_13 = req === null || req === void 0 ? void 0 : req.body) === null || _13 === void 0 ? void 0 : _13.employmentType) || !((_14 = req === null || req === void 0 ? void 0 : req.body) === null || _14 === void 0 ? void 0 : _14.degree) || !((_15 = req === null || req === void 0 ? void 0 : req.body) === null || _15 === void 0 ? void 0 : _15.experience) ||
        !((_16 = req === null || req === void 0 ? void 0 : req.body) === null || _16 === void 0 ? void 0 : _16.positionLevel) || !((_17 = req === null || req === void 0 ? void 0 : req.body) === null || _17 === void 0 ? void 0 : _17.numberOfVacancies) || !((_18 = req === null || req === void 0 ? void 0 : req.body) === null || _18 === void 0 ? void 0 : _18.applicationDeadline)) {
        return ({
            message: 'Thông tin cơ bản còn thiếu',
            status: 400,
            data: null
        });
    }
    if (!((_19 = req === null || req === void 0 ? void 0 : req.body) === null || _19 === void 0 ? void 0 : _19.workAddress) || !((_20 = req === null || req === void 0 ? void 0 : req.body) === null || _20 === void 0 ? void 0 : _20.minSalary) || !((_21 = req === null || req === void 0 ? void 0 : req.body) === null || _21 === void 0 ? void 0 : _21.maxSalary)) {
        return ({
            message: 'Thông tin địa chỉ làm việc hoặc mức lương còn thiếu',
            status: 400,
            data: null
        });
    }
    if (!((_22 = req === null || req === void 0 ? void 0 : req.body) === null || _22 === void 0 ? void 0 : _22.jobDescription) || !((_23 = req === null || req === void 0 ? void 0 : req.body) === null || _23 === void 0 ? void 0 : _23.jobRequirements) || !((_24 = req === null || req === void 0 ? void 0 : req.body) === null || _24 === void 0 ? void 0 : _24.benefits)) {
        return ({
            message: 'Mô tả công việc còn thiếu',
            status: 400,
            data: null
        });
    }
    const post = yield jobPostingRepository.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        contactAddress: req.body.contactAddress,
        workAddress: req.body.workAddress,
        jobTitle: req.body.jobTitle,
        profession: req.body.profession,
        employmentType: req.body.employmentType,
        degree: req.body.degree,
        experience: req.body.experience,
        positionLevel: req.body.positionLevel,
        minAge: req.body.minAge ? req.body.minAge : null,
        maxAge: req.body.maxAge ? req.body.maxAge : null,
        sex: req.body.sex ? req.body.sex : null,
        numberOfVacancies: req.body.numberOfVacancies,
        trialPeriod: req.body.trialPeriod ? req.body.trialPeriod : null,
        applicationDeadline: new Date((0, moment_1.default)(req.body.applicationDeadline, "DD-MM-YYYY").format("MM-DD-YYYY")),
        minSalary: req.body.minSalary,
        maxSalary: req.body.maxSalary,
        skills: req.body.skills ? req.body.skills : null,
        jobDescription: req.body.jobDescription,
        jobRequirements: req.body.jobRequirements,
        benefits: req.body.benefits,
        submissionCount: 0,
        view: 0,
        isHidden: ((_25 = req === null || req === void 0 ? void 0 : req.body) === null || _25 === void 0 ? void 0 : _25.isHidden) ? req.body.isHidden : false,
        requiredSkills: ((_26 = req.body) === null || _26 === void 0 ? void 0 : _26.requiredSkills) ? (_27 = req.body) === null || _27 === void 0 ? void 0 : _27.requiredSkills : null,
        keywords: ((_28 = req.body) === null || _28 === void 0 ? void 0 : _28.keywords) ? (_29 = req.body) === null || _29 === void 0 ? void 0 : _29.keywords : null
    });
    const post1 = yield jobPostingRepository.save(post);
    const user = yield employerRepository.findOne({
        where: { userId: req.user.userId },
        relations: ['jobPostings']
    });
    if (!user) {
        return ({
            message: 'User not found',
            status: 400,
            data: null
        });
    }
    user.jobPostings.push(post1);
    yield employerRepository.save(user);
    const foundUser = yield userRepository.findOne({
        where: { userId: req.user.userId }
    });
    if (!foundUser) {
        return ({
            message: 'User not found',
            status: 400,
            data: null
        });
    }
    const createNotification = notificationRepository.create({
        content: 'Đăng tuyển của bạn đang chờ duyệt',
        user: foundUser
    });
    yield notificationRepository.save(createNotification);
    return ({
        message: 'Create new job posting successfully',
        status: 200,
        data: post
    });
});
JobPostingServices.handleDeleteJobPosting = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _30;
    if (!((_30 = req === null || req === void 0 ? void 0 : req.params) === null || _30 === void 0 ? void 0 : _30.postId)) {
        return ({
            message: 'postId is required',
            status: 400,
            data: null
        });
    }
    const jobPosting = yield jobPostingRepository.findOne({
        where: { postId: req.params.postId },
        relations: ['employer']
    });
    if (!jobPosting) {
        return ({
            message: `No Job posting matches postId: ${req.params.postId}`,
            status: 400,
            data: null
        });
    }
    if (jobPosting.employer.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of Job posting has id: ${req.params.postId}`,
            status: 403,
            data: null
        });
    }
    yield jobPostingRepository.delete(jobPosting.postId);
    return ({
        message: `Delete Job posting has postId: ${req.params.postId} successes`,
        status: 200,
        data: jobPosting
    });
});
JobPostingServices.handleUpdateApprovalStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _31, _32, _33;
    if (!((_31 = req === null || req === void 0 ? void 0 : req.params) === null || _31 === void 0 ? void 0 : _31.postId)) {
        return ({
            message: 'postId is required',
            status: 400,
            data: null
        });
    }
    const post = yield jobPostingRepository.findOne({
        where: { postId: req.params.postId },
        relations: ['employer']
    });
    if (!post) {
        return ({
            message: `No Post matches postId: ${req.params.postId}`,
            status: 400,
            data: null
        });
    }
    if ((_32 = req.body) === null || _32 === void 0 ? void 0 : _32.status)
        post.status = (0, enumAction_1.EnumApprovalStatus)(req.body.status);
    if (((_33 = req.body) === null || _33 === void 0 ? void 0 : _33.check) !== null)
        post.check = req.body.check;
    yield jobPostingRepository.save(post);
    return ({
        message: `Status of Post has id: ${req.params.postId} are changed successfully`,
        status: 200,
        data: post
    });
});
exports.default = JobPostingServices;
//# sourceMappingURL=jobpostingServices.js.map