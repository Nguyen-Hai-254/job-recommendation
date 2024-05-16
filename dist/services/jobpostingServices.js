"use strict";
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
JobPostingServices.handleGetAllJobPostings = async (req) => {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, employerId, keywords, num, page } = req.query;
    let query = jobPostingRepository.createQueryBuilder('job-postings');
    // jobposting for employee, employer, unknown
    query = query.leftJoinAndSelect("job-postings.employer", "employer")
        .where('job-postings.status = :status', { status: enum_1.approvalStatus.approved });
    // Public
    if (workAddress) {
        query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        const professionArray = profession.split(',');
        query = query.andWhere(`(${professionArray.map((keyword) => `job-postings.profession LIKE '%${keyword}%'`).join(' OR ')})`);
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
    // query by employerId
    if (employerId) {
        query = query.andWhere('job-postings.employer.userId = :employerId', { employerId });
    }
    // query by keywords
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
    // Pagination
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    query = query.orderBy('job-postings.updateAt', 'DESC');
    const jobPostings = await query.getMany();
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
};
JobPostingServices.handleGetLengthOfAllJobPostings = async (req) => {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, employerId, keywords } = req.query;
    let query = jobPostingRepository.createQueryBuilder('job-postings');
    // jobposting for employee, employer, unknown
    query = query.leftJoinAndSelect("job-postings.employer", "employer")
        .where('job-postings.status = :status', { status: enum_1.approvalStatus.approved });
    // Public
    if (workAddress) {
        query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        const professionArray = profession.split(',');
        query = query.andWhere(`(${professionArray.map((keyword) => `job-postings.profession LIKE '%${keyword}%'`).join(' OR ')})`);
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
    // query by employerId
    if (employerId) {
        query = query.andWhere('job-postings.employer.userId = :employerId', { employerId });
    }
    // query by keywords
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
    const totalResults = await query.getCount();
    return ({
        message: 'Find length of jobPostings success',
        status: 200,
        data: { totalResults: totalResults }
    });
};
JobPostingServices.handleGetAllJobPostingsByAdmin = async (req) => {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, status, num, page } = req.query;
    let query = jobPostingRepository.createQueryBuilder('job-postings');
    // all jobposting for admin
    query = query.leftJoinAndSelect("job-postings.employer", "employer");
    query = query.leftJoinAndSelect("job-postings.applications", "applications");
    if (status) {
        query = query.where('job-postings.status = :status', { status });
    }
    // Public
    if (workAddress) {
        query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        const professionArray = profession.split(',');
        query = query.andWhere(`(${professionArray.map((keyword) => `job-postings.profession LIKE '%${keyword}%'`).join(' OR ')})`);
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
    // Pagination
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    else {
        query = query.skip(0).take(10);
    }
    query = query.orderBy('job-postings.updateAt', 'DESC');
    const jobPostings = await query.getMany();
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
        data: jobPostings.map(job => ({
            ...job,
            submissionCount: job.applications.length
        }))
    });
};
JobPostingServices.handleGetLengthOfAllJobPostingsByAdmin = async (req) => {
    // Update status of job postings when job postings were expried.
    // let findExpiredPosts = await jobPostingRepository.find({
    //     where: {
    //         applicationDeadline: LessThan(moment(new Date()).subtract(1, 'days').toDate()),
    //         status: approvalStatus.approved
    //     }
    // })
    // findExpiredPosts.map(async (post) => {
    //     post.status = approvalStatus.expired
    //     await jobPostingRepository.save(post)
    // })
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, status } = req.query;
    let query = jobPostingRepository.createQueryBuilder('job-postings');
    // all jobposting for admin
    query = query.leftJoinAndSelect("job-postings.employer", "employer");
    if (status) {
        query = query.where('job-postings.status = :status', { status });
    }
    // Public
    if (workAddress) {
        query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        const professionArray = profession.split(',');
        query = query.andWhere(`(${professionArray.map((keyword) => `job-postings.profession LIKE '%${keyword}%'`).join(' OR ')})`);
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
    const totalResults = await query.getCount();
    return ({
        message: 'Find length of jobPostings success',
        status: 200,
        data: { totalResults: totalResults }
    });
};
JobPostingServices.handleGetTotalResultsOfProfession = async () => {
    const posts = await jobPostingRepository
        .createQueryBuilder('jobPosting')
        .select('jobPosting.profession', 'profession')
        .where('jobPosting.status = :status', { status: enum_1.approvalStatus.approved })
        .getRawMany();
    const professionCount = {};
    for (const post of posts) {
        const professions = post.profession.split(',');
        for (const profession of professions) {
            if (professionCount[profession]) {
                professionCount[profession] += 1;
            }
            else {
                professionCount[profession] = 1;
            }
        }
    }
    const result = Object.keys(professionCount).map(key => ({
        'profession_value': key,
        'count': professionCount[key]
    }));
    return ({
        message: `Find job postings successful!`,
        status: 200,
        data: result
    });
};
JobPostingServices.handleGetTotalResultsOfProfessionByAdmin = async (req) => {
    const { status } = req.query;
    let query = jobPostingRepository.createQueryBuilder('jobPosting')
        .select('jobPosting.profession', 'profession');
    if (status)
        query = query.where('jobPosting.status = :status', { status });
    const posts = await query.getRawMany();
    const professionCount = {};
    for (const post of posts) {
        const professions = post.profession.split(',');
        for (const profession of professions) {
            if (professionCount[profession]) {
                professionCount[profession] += 1;
            }
            else {
                professionCount[profession] = 1;
            }
        }
    }
    const result = Object.keys(professionCount).map(key => ({
        'profession_value': key,
        'count': professionCount[key]
    }));
    return ({
        message: `Find job postings successful!`,
        status: 200,
        data: result
    });
};
JobPostingServices.handleGetJobPostingsByEmployer = async (req) => {
    const { status, num, page } = req.query;
    let query = jobPostingRepository
        .createQueryBuilder('jobPosting')
        .leftJoin('jobPosting.employer', 'employer')
        .leftJoinAndSelect("jobPosting.applications", "applications")
        .where('employer.userId = :userId', { userId: req.user.userId });
    if (status) {
        query = query.andWhere('jobPosting.status = :status', { status });
    }
    const totalResults = await query.getCount();
    // Pagination
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    else {
        query = query.skip(0).take(10);
    }
    query = query.orderBy('jobPosting.updateAt', 'DESC');
    const jobPostings = await query.getMany();
    return ({
        message: `Find job postings successful!`,
        status: 200,
        data: {
            totalResults: totalResults,
            result: jobPostings.map(job => ({
                ...job,
                submissionCount: job.applications.length
            }))
        }
    });
};
JobPostingServices.handleGetJobPosting = async (req) => {
    var _b;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.postId)) {
        return ({
            message: 'postId is required',
            status: 400,
            data: null
        });
    }
    const jobPosting = await jobPostingRepository.findOne({
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
    await jobPosting.save();
    return ({
        message: `Find Job posting has postId: ${req.params.postId} successes`,
        status: 200,
        data: jobPosting
    });
};
JobPostingServices.handleGetJobPostingByEmployer = async (req) => {
    var _b;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.postId)) {
        return ({
            message: 'postId is required',
            status: 400,
            data: null
        });
    }
    const jobPosting = await jobPostingRepository.findOne({
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
};
JobPostingServices.handleUpdateJobPosting = async (req) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.postId)) {
        return ({
            message: 'postId is required',
            status: 400,
            data: null
        });
    }
    const jobPosting = await jobPostingRepository.findOne({
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
    // Update with req.body
    if ((_c = req.body) === null || _c === void 0 ? void 0 : _c.name)
        jobPosting.name = req.body.name;
    if ((_d = req.body) === null || _d === void 0 ? void 0 : _d.email)
        jobPosting.email = req.body.email;
    if ((_e = req.body) === null || _e === void 0 ? void 0 : _e.phone)
        jobPosting.phone = req.body.phone;
    if ((_f = req.body) === null || _f === void 0 ? void 0 : _f.contactAddress)
        jobPosting.contactAddress = req.body.contactAddress;
    if ((_g = req.body) === null || _g === void 0 ? void 0 : _g.workAddress)
        jobPosting.workAddress = req.body.workAddress;
    if ((_h = req.body) === null || _h === void 0 ? void 0 : _h.jobTitle)
        jobPosting.jobTitle = req.body.jobTitle;
    if ((_j = req.body) === null || _j === void 0 ? void 0 : _j.profession)
        jobPosting.profession = req.body.profession;
    if ((_k = req.body) === null || _k === void 0 ? void 0 : _k.employmentType)
        jobPosting.employmentType = (0, enumAction_1.EnumEmploymentType)(req.body.employmentType);
    if ((_l = req.body) === null || _l === void 0 ? void 0 : _l.degree)
        jobPosting.degree = (0, enumAction_1.EnumDegree)(req.body.degree);
    if ((_m = req.body) === null || _m === void 0 ? void 0 : _m.experience)
        jobPosting.experience = (0, enumAction_1.EnumExperience)(req.body.experience);
    if ((_o = req.body) === null || _o === void 0 ? void 0 : _o.positionLevel)
        jobPosting.positionLevel = (0, enumAction_1.EnumPositionLevel)(req.body.positionLevel);
    if ((_p = req.body) === null || _p === void 0 ? void 0 : _p.minAge)
        jobPosting.minAge = req.body.minAge;
    if ((_q = req.body) === null || _q === void 0 ? void 0 : _q.maxAge)
        jobPosting.maxAge = req.body.maxAge;
    if ((_r = req.body) === null || _r === void 0 ? void 0 : _r.sex)
        jobPosting.sex = (0, enumAction_1.EnumSex)(req.body.sex);
    else if (((_s = req.body) === null || _s === void 0 ? void 0 : _s.sex) === null)
        jobPosting.sex = null;
    if ((_t = req.body) === null || _t === void 0 ? void 0 : _t.numberOfVacancies)
        jobPosting.numberOfVacancies = req.body.numberOfVacancies;
    if ((_u = req.body) === null || _u === void 0 ? void 0 : _u.trialPeriod)
        jobPosting.trialPeriod = req.body.trialPeriod;
    if ((_v = req.body) === null || _v === void 0 ? void 0 : _v.applicationDeadline)
        jobPosting.applicationDeadline = new Date((0, moment_1.default)(req.body.applicationDeadline).format("YYYY-MM-DD"));
    if ((_w = req.body) === null || _w === void 0 ? void 0 : _w.minSalary)
        jobPosting.minSalary = req.body.minSalary;
    if ((_x = req.body) === null || _x === void 0 ? void 0 : _x.maxSalary)
        jobPosting.maxSalary = req.body.maxSalary;
    if ((_y = req.body) === null || _y === void 0 ? void 0 : _y.skills)
        jobPosting.skills = req.body.skills;
    if ((_z = req.body) === null || _z === void 0 ? void 0 : _z.jobDescription)
        jobPosting.jobDescription = req.body.jobDescription;
    if ((_0 = req.body) === null || _0 === void 0 ? void 0 : _0.jobRequirements)
        jobPosting.jobRequirements = req.body.jobRequirements;
    if ((_1 = req.body) === null || _1 === void 0 ? void 0 : _1.benefits)
        jobPosting.benefits = req.body.benefits;
    if (((_2 = req.body) === null || _2 === void 0 ? void 0 : _2.isHidden) !== null)
        jobPosting.isHidden = req.body.isHidden;
    if ((_3 = req.body) === null || _3 === void 0 ? void 0 : _3.requiredSkills)
        jobPosting.requiredSkills = req.body.requiredSkills;
    if ((_4 = req.body) === null || _4 === void 0 ? void 0 : _4.keywords)
        jobPosting.keywords = req.body.keywords;
    jobPosting.status = enum_1.approvalStatus.pending;
    jobPosting.updateAt = new Date();
    jobPosting.check = null;
    await jobPostingRepository.save(jobPosting);
    const createNotification = notificationRepository.create({
        content: 'Bạn đã cập nhật tin tuyển dụng ' + jobPosting.jobTitle,
        user: jobPosting.employer.user
    });
    await notificationRepository.save(createNotification);
    return ({
        message: `Job posting has postId: ${req.params.postId} are updated successfully`,
        status: 200,
        data: jobPosting
    });
};
JobPostingServices.handleCreateNewJobPosting = async (req) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    // Check parameters
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.name) || !((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.email) || !((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.phone) || !((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.contactAddress)) {
        return ({
            message: 'Thông tin liên hệ còn thiếu',
            status: 400,
            data: null
        });
    }
    if (!((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.jobTitle) || !((_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.profession) || !((_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.employmentType) || !((_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.degree) || !((_k = req === null || req === void 0 ? void 0 : req.body) === null || _k === void 0 ? void 0 : _k.experience) ||
        !((_l = req === null || req === void 0 ? void 0 : req.body) === null || _l === void 0 ? void 0 : _l.positionLevel) || !((_m = req === null || req === void 0 ? void 0 : req.body) === null || _m === void 0 ? void 0 : _m.numberOfVacancies) || !((_o = req === null || req === void 0 ? void 0 : req.body) === null || _o === void 0 ? void 0 : _o.applicationDeadline)) {
        return ({
            message: 'Thông tin cơ bản còn thiếu',
            status: 400,
            data: null
        });
    }
    if (!((_p = req === null || req === void 0 ? void 0 : req.body) === null || _p === void 0 ? void 0 : _p.workAddress) || !((_q = req === null || req === void 0 ? void 0 : req.body) === null || _q === void 0 ? void 0 : _q.minSalary) || !((_r = req === null || req === void 0 ? void 0 : req.body) === null || _r === void 0 ? void 0 : _r.maxSalary)) {
        return ({
            message: 'Thông tin địa chỉ làm việc hoặc mức lương còn thiếu',
            status: 400,
            data: null
        });
    }
    if (!((_s = req === null || req === void 0 ? void 0 : req.body) === null || _s === void 0 ? void 0 : _s.jobDescription) || !((_t = req === null || req === void 0 ? void 0 : req.body) === null || _t === void 0 ? void 0 : _t.jobRequirements) || !((_u = req === null || req === void 0 ? void 0 : req.body) === null || _u === void 0 ? void 0 : _u.benefits)) {
        return ({
            message: 'Mô tả công việc còn thiếu',
            status: 400,
            data: null
        });
    }
    // Create new post
    const post = await jobPostingRepository.create({
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
        isHidden: ((_v = req === null || req === void 0 ? void 0 : req.body) === null || _v === void 0 ? void 0 : _v.isHidden) ? req.body.isHidden : false,
        requiredSkills: ((_w = req.body) === null || _w === void 0 ? void 0 : _w.requiredSkills) ? (_x = req.body) === null || _x === void 0 ? void 0 : _x.requiredSkills : null,
        keywords: ((_y = req.body) === null || _y === void 0 ? void 0 : _y.keywords) ? (_z = req.body) === null || _z === void 0 ? void 0 : _z.keywords : null
    });
    const post1 = await jobPostingRepository.save(post);
    const user = await employerRepository.findOne({
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
    await employerRepository.save(user);
    // Add new notification
    const foundUser = await userRepository.findOne({
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
    await notificationRepository.save(createNotification);
    return ({
        message: 'Create new job posting successfully',
        status: 200,
        data: post
    });
};
JobPostingServices.handleDeleteJobPosting = async (req) => {
    var _b;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.postId)) {
        return ({
            message: 'postId is required',
            status: 400,
            data: null
        });
    }
    const jobPosting = await jobPostingRepository.findOne({
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
    // Check employer is owner of Job posting ?
    if (jobPosting.employer.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of Job posting has id: ${req.params.postId}`,
            status: 403,
            data: null
        });
    }
    await jobPostingRepository.delete(jobPosting.postId);
    return ({
        message: `Delete Job posting has postId: ${req.params.postId} successes`,
        status: 200,
        data: jobPosting
    });
};
JobPostingServices.handleUpdateApprovalStatus = async (req) => {
    var _b, _c, _d;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.postId)) {
        return ({
            message: 'postId is required',
            status: 400,
            data: null
        });
    }
    const post = await jobPostingRepository.findOne({
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
    // Update with req.body
    if ((_c = req.body) === null || _c === void 0 ? void 0 : _c.status)
        post.status = (0, enumAction_1.EnumApprovalStatus)(req.body.status);
    if (((_d = req.body) === null || _d === void 0 ? void 0 : _d.check) !== null)
        post.check = req.body.check;
    await jobPostingRepository.save(post);
    return ({
        message: `Status of Post has id: ${req.params.postId} are changed successfully`,
        status: 200,
        data: post
    });
};
exports.default = JobPostingServices;
//# sourceMappingURL=jobpostingServices.js.map