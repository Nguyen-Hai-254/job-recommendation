"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const connectDB_1 = require("../config/connectDB");
const enum_1 = require("../utils/enum");
const JobPosting_1 = require("../entity/JobPosting");
const moment_1 = __importDefault(require("moment"));
const enumAction_1 = require("../utils/enumAction");
const typeorm_1 = require("typeorm");
const httpException_1 = require("../exceptions/httpException");
const notificationServices_1 = __importDefault(require("./notificationServices"));
const jobPostingRepository = connectDB_1.myDataSource.getRepository(JobPosting_1.JobPosting);
class JobPostingServices {
}
_a = JobPostingServices;
JobPostingServices.handleGetJobPosting = async (postId) => {
    const jobPosting = await jobPostingRepository.findOne({
        where: { postId: postId, isHidden: false },
        relations: ['employer']
    });
    if (!jobPosting)
        throw new httpException_1.HttpException(404, `No Job posting matches postId: ${postId}`);
    jobPosting.view += 1;
    await jobPosting.save();
    return jobPosting;
};
JobPostingServices.handleGetAllJobPostings = async (reqQuery) => {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, employerId, keywords, num, page } = reqQuery;
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
    else {
        query = query.skip(0).take(10);
    }
    query = query.orderBy('job-postings.updateAt', 'DESC');
    const jobPostings = await query.getMany();
    return jobPostings ? jobPostings : [];
};
JobPostingServices.handleGetLengthOfAllJobPostings = async (reqQuery) => {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, employerId, keywords } = reqQuery;
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
    return { totalResults: totalResults };
};
JobPostingServices.handleGetAllJobPostingsByAdmin = async (reqQuery) => {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, status, num, page } = reqQuery;
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
    const data = jobPostings.map(job => ({
        ...job,
        submissionCount: job.applications.length
    }));
    return data ? data : [];
};
JobPostingServices.handleGetLengthOfAllJobPostingsByAdmin = async (reqQuery) => {
    const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, status } = reqQuery;
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
    return { totalResults: totalResults };
};
JobPostingServices.handleGetTotalResultsOfProfession = async (reqQuery) => {
    const { status } = reqQuery;
    let query = jobPostingRepository.createQueryBuilder('jobPosting')
        .select('jobPosting.profession', 'profession');
    if (status)
        query = query.where('jobPosting.status = :status', { status });
    const posts = await query.getRawMany();
    const professionCount = {};
    for (const post of posts) {
        const professions = post.profession.split(',');
        for (const profession of professions) {
            if (professionCount[profession.trim()]) {
                professionCount[profession.trim()] += 1;
            }
            else {
                professionCount[profession.trim()] = 1;
            }
        }
    }
    const result = Object.keys(professionCount).map(key => ({
        'profession_value': key,
        'count': professionCount[key]
    }));
    return result;
};
JobPostingServices.handleGetJobPostingsByEmployer = async (employerId, reqQuery) => {
    const { status, num, page } = reqQuery;
    let query = jobPostingRepository
        .createQueryBuilder('jobPosting')
        .leftJoin('jobPosting.employer', 'employer')
        .leftJoinAndSelect("jobPosting.applications", "applications")
        .where('employer.userId = :userId', { userId: employerId });
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
    const data = {
        totalResults: totalResults,
        result: jobPostings.map(job => ({
            ...job,
            submissionCount: job.applications.length
        }))
    };
    return data ? data : [];
};
JobPostingServices.handleGetJobPostingByEmployer = async (employerId, postId) => {
    const jobPosting = await jobPostingRepository.findOne({
        where: { postId: postId },
        relations: ['employer', 'applications'],
    });
    if (!jobPosting)
        throw new httpException_1.HttpException(404, `No Job posting matches postId: ${postId}`);
    if (jobPosting.employer.userId !== employerId) {
        throw new httpException_1.HttpException(403, `You aren't a owner of jobPosting with postId: ${postId}`);
    }
    return jobPosting;
};
JobPostingServices.handleUpdateJobPosting = async (employerId, postId, dto) => {
    const { name, email, phone, contactAddress, workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, minAge, maxAge, sex, numberOfVacancies, trialPeriod, applicationDeadline, minSalary, maxSalary, skills, jobDescription, jobRequirements, benefits, requiredSkills, keywords, isHidden } = dto;
    const jobPosting = await jobPostingRepository.findOne({
        where: { postId: postId },
        relations: ['employer.user']
    });
    if (!jobPosting)
        throw new httpException_1.HttpException(404, `No Job posting matches postId: ${postId}`);
    if (jobPosting.employer.userId !== employerId) {
        throw new httpException_1.HttpException(403, `You aren't a owner of jobPosting with postId: ${postId}`);
    }
    // Update with req.body
    if (name)
        jobPosting.name = name;
    if (email)
        jobPosting.email = email;
    if (phone)
        jobPosting.phone = phone;
    if (contactAddress)
        jobPosting.contactAddress = contactAddress;
    if (workAddress)
        jobPosting.workAddress = workAddress;
    if (jobTitle)
        jobPosting.jobTitle = jobTitle;
    if (profession)
        jobPosting.profession = profession;
    if (employmentType)
        jobPosting.employmentType = (0, enumAction_1.EnumEmploymentType)(employmentType);
    if (degree)
        jobPosting.degree = (0, enumAction_1.EnumDegree)(degree);
    if (experience)
        jobPosting.experience = (0, enumAction_1.EnumExperience)(experience);
    if (positionLevel)
        jobPosting.positionLevel = (0, enumAction_1.EnumPositionLevel)(positionLevel);
    if (minAge)
        jobPosting.minAge = minAge;
    if (maxAge)
        jobPosting.maxAge = maxAge;
    if (sex)
        jobPosting.sex = (0, enumAction_1.EnumSex)(sex);
    else if (sex === null)
        jobPosting.sex = null;
    if (numberOfVacancies)
        jobPosting.numberOfVacancies = numberOfVacancies;
    if (trialPeriod)
        jobPosting.trialPeriod = trialPeriod;
    if (applicationDeadline)
        jobPosting.applicationDeadline = new Date((0, moment_1.default)(applicationDeadline).format("YYYY-MM-DD"));
    if (minSalary)
        jobPosting.minSalary = minSalary;
    if (maxSalary)
        jobPosting.maxSalary = maxSalary;
    if (skills)
        jobPosting.skills = skills;
    if (jobDescription)
        jobPosting.jobDescription = jobDescription;
    if (jobRequirements)
        jobPosting.jobRequirements = jobRequirements;
    if (benefits)
        jobPosting.benefits = benefits;
    if (isHidden !== null)
        jobPosting.isHidden = isHidden;
    if (requiredSkills)
        jobPosting.requiredSkills = requiredSkills;
    if (keywords)
        jobPosting.keywords = keywords;
    jobPosting.status = enum_1.approvalStatus.pending;
    jobPosting.updateAt = new Date();
    jobPosting.check = null;
    await jobPostingRepository.save(jobPosting);
    await notificationServices_1.default.handleCreateNewNotification(employerId, `Bạn đã cập nhật tin tuyển dụng  ${jobPosting.jobTitle}`);
    return jobPosting;
};
JobPostingServices.handleCreateNewJobPosting = async (employerId, req) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    // Check parameters
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.name) || !((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.email) || !((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.phone) || !((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.contactAddress)) {
        throw new httpException_1.HttpException(400, 'body is required');
    }
    if (!((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.jobTitle) || !((_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.profession) || !((_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.employmentType) || !((_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.degree) || !((_k = req === null || req === void 0 ? void 0 : req.body) === null || _k === void 0 ? void 0 : _k.experience) ||
        !((_l = req === null || req === void 0 ? void 0 : req.body) === null || _l === void 0 ? void 0 : _l.positionLevel) || !((_m = req === null || req === void 0 ? void 0 : req.body) === null || _m === void 0 ? void 0 : _m.numberOfVacancies) || !((_o = req === null || req === void 0 ? void 0 : req.body) === null || _o === void 0 ? void 0 : _o.applicationDeadline)) {
        throw new httpException_1.HttpException(400, 'body is required');
    }
    if (!((_p = req === null || req === void 0 ? void 0 : req.body) === null || _p === void 0 ? void 0 : _p.workAddress) || !((_q = req === null || req === void 0 ? void 0 : req.body) === null || _q === void 0 ? void 0 : _q.minSalary) || !((_r = req === null || req === void 0 ? void 0 : req.body) === null || _r === void 0 ? void 0 : _r.maxSalary)) {
        throw new httpException_1.HttpException(400, 'body is required');
    }
    if (!((_s = req === null || req === void 0 ? void 0 : req.body) === null || _s === void 0 ? void 0 : _s.jobDescription) || !((_t = req === null || req === void 0 ? void 0 : req.body) === null || _t === void 0 ? void 0 : _t.jobRequirements) || !((_u = req === null || req === void 0 ? void 0 : req.body) === null || _u === void 0 ? void 0 : _u.benefits)) {
        throw new httpException_1.HttpException(400, 'body is required');
    }
    try {
        // Create new post
        const post = jobPostingRepository.create({
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
            keywords: ((_y = req.body) === null || _y === void 0 ? void 0 : _y.keywords) ? (_z = req.body) === null || _z === void 0 ? void 0 : _z.keywords : null,
            employer: { userId: employerId }
        });
        await jobPostingRepository.save(post);
        await notificationServices_1.default.handleCreateNewNotification(employerId, 'Đăng tuyển của bạn đang chờ duyệt');
        return post;
    }
    catch (err) {
        if (err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY || err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY2) {
            throw new httpException_1.HttpException(404, 'Employer not found');
        }
        throw err;
    }
};
JobPostingServices.handleDeleteJobPosting = async (employerId, postId) => {
    const jobPosting = await jobPostingRepository.findOne({
        where: { postId: postId },
        relations: ['employer']
    });
    if (!jobPosting)
        throw new httpException_1.HttpException(404, `No Job posting matches postId: ${postId}`);
    if (jobPosting.employer.userId !== employerId) {
        throw new httpException_1.HttpException(403, `You aren't a owner of jobPosting with postId: ${postId}`);
    }
    return await jobPostingRepository.remove(jobPosting);
};
JobPostingServices.handleUpdateApprovalStatus = async (postId, dto) => {
    const { status, check } = dto;
    const jobPosting = await jobPostingRepository.findOne({
        where: { postId: postId },
        relations: ['employer']
    });
    if (!jobPosting)
        throw new httpException_1.HttpException(404, `No Job posting matches postId: ${postId}`);
    // Update with dto
    if (status)
        jobPosting.status = (0, enumAction_1.EnumApprovalStatus)(status);
    if (check !== null)
        jobPosting.check = check;
    return await jobPostingRepository.save(jobPosting);
};
exports.default = JobPostingServices;
//# sourceMappingURL=jobpostingServices.js.map