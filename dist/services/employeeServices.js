"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const moment_1 = __importDefault(require("moment"));
const connectDB_1 = require("../config/connectDB");
const entities_1 = require("../entities");
const enum_1 = require("../utils/enum");
const enumAction_1 = require("../utils/enumAction");
const utilsFunction_1 = require("../utils/utilsFunction");
const httpException_1 = require("../exceptions/httpException");
const sort_direction_enum_1 = require("../utils/enums/sort-direction.enum");
const employeeRepository = connectDB_1.myDataSource.getRepository(entities_1.Employee);
const applicationRepository = connectDB_1.myDataSource.getRepository(entities_1.Application);
const attached_documentRepository = connectDB_1.myDataSource.getRepository(entities_1.AttachedDocument);
const online_profileRepository = connectDB_1.myDataSource.getRepository(entities_1.OnlineProfile);
const another_degreeRepository = connectDB_1.myDataSource.getRepository(entities_1.AnotherDegree);
const education_informationRepository = connectDB_1.myDataSource.getRepository(entities_1.EducationInformation);
const work_experienceRepository = connectDB_1.myDataSource.getRepository(entities_1.WorkExperience);
class EmployeeServices {
}
_a = EmployeeServices;
EmployeeServices.handleGetAttachedDocument = async (userId) => {
    const attached_document = await attached_documentRepository.findOne({
        where: { userId: userId },
        relations: ['employee']
    });
    if (!attached_document)
        throw new httpException_1.HttpException(404, 'attachedDocument not found');
    return attached_document;
};
EmployeeServices.handleCreateNewAttachedDocument = async (userId, dto) => {
    // Check general information
    if (!dto.jobTitle || !dto.profession || !dto.currentPosition ||
        !dto.desiredPosition || !dto.desiredSalary || !dto.degree ||
        !dto.workAddress || !dto.experience || !dto.employmentType) {
        throw new httpException_1.HttpException(400, 'general information is required');
    }
    // Check other information
    if (!dto.CV)
        throw new httpException_1.HttpException(400, 'CV is required');
    try {
        const attached_document = attached_documentRepository.create({
            userId: userId,
            jobTitle: dto.jobTitle,
            profession: dto.profession,
            currentPosition: dto.currentPosition,
            desiredPosition: dto.desiredPosition,
            desiredSalary: dto.desiredSalary,
            degree: dto.degree,
            workAddress: dto.workAddress,
            experience: dto.experience,
            employmentType: dto.employmentType,
            careerGoal: dto.careerGoal,
            skills: dto.skills,
            CV: dto.CV,
            view: 0,
            isHidden: dto.isHidden ? dto.isHidden : false
        });
        await attached_documentRepository.save(attached_document);
        return attached_document;
    }
    catch (err) {
        if (err.code === enum_1.MySQLErrorCode.DUPLICATE) {
            throw new httpException_1.HttpException(400, `Attached document has userId: ${userId} already exists`);
        }
        if (err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY || err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY2) {
            throw new httpException_1.HttpException(404, 'User Not Found');
        }
        throw err;
    }
};
EmployeeServices.handleUpdateAttachedDocument = async (userId, dto) => {
    // Check attached document exists?
    const attached_document = await attached_documentRepository.findOne({
        where: { userId: userId },
        relations: ['employee']
    });
    if (!attached_document)
        throw new httpException_1.HttpException(404, 'Attached document not found');
    // Update with req.body
    // general information
    if (dto.jobTitle)
        attached_document.jobTitle = dto.jobTitle;
    if (dto.profession)
        attached_document.profession = dto.profession;
    if (dto.currentPosition)
        attached_document.currentPosition = (0, enumAction_1.EnumPositionLevel)(dto.currentPosition);
    if (dto.desiredPosition)
        attached_document.desiredPosition = (0, enumAction_1.EnumPositionLevel)(dto.desiredPosition);
    if (dto.desiredSalary)
        attached_document.desiredSalary = dto.desiredSalary;
    if (dto.degree)
        attached_document.degree = (0, enumAction_1.EnumDegree)(dto.degree);
    if (dto.workAddress)
        attached_document.workAddress = dto.workAddress;
    if (dto.experience)
        attached_document.experience = (0, enumAction_1.EnumExperience)(dto.experience);
    if (dto.employmentType)
        attached_document.employmentType = (0, enumAction_1.EnumEmploymentType)(dto.employmentType);
    if (dto.careerGoal)
        attached_document.careerGoal = dto.careerGoal;
    if (dto.skills)
        attached_document.skills = dto.skills;
    // other information
    if (dto.CV)
        attached_document.CV = dto.CV;
    if (dto.isHidden !== null)
        attached_document.isHidden = dto.isHidden;
    // update keywords
    if (dto.keywords)
        attached_document.keywords = dto.keywords;
    await attached_documentRepository.save(attached_document);
    return attached_document;
};
EmployeeServices.handleGetOnlineProfile = async (userId) => {
    const online_profile = await online_profileRepository.findOne({
        where: { userId: userId },
        relations: ['employee', 'another_degrees', 'education_informations', 'work_experiences']
    });
    if (!online_profile)
        throw new httpException_1.HttpException(404, 'Online profile not found');
    return online_profile;
};
EmployeeServices.handleCreateNewOnlineProfile = async (userId, dto) => {
    // Check general information
    if (!dto.jobTitle || !dto.profession || !dto.currentPosition ||
        !dto.desiredPosition || !dto.desiredSalary || !dto.degree ||
        !dto.workAddress || !dto.experience || !dto.employmentType) {
        throw new httpException_1.HttpException(400, 'general information is required');
    }
    try {
        // Create new online profile
        const online_profile = await online_profileRepository.create({
            userId: userId,
            jobTitle: dto.jobTitle,
            profession: dto.profession,
            currentPosition: dto.currentPosition,
            desiredPosition: dto.desiredPosition,
            desiredSalary: dto.desiredSalary,
            degree: dto.degree,
            workAddress: dto.workAddress,
            experience: dto.experience,
            employmentType: dto.employmentType,
            careerGoal: dto.careerGoal,
            skills: dto.skills,
            view: 0,
            isHidden: dto.isHidden ? dto.isHidden : false
        });
        await online_profileRepository.save(online_profile);
        return online_profile;
    }
    catch (err) {
        if (err.code === enum_1.MySQLErrorCode.DUPLICATE) {
            throw new httpException_1.HttpException(400, `Online profile has userId: ${userId} already exists`);
        }
        if (err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY || err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY2) {
            throw new httpException_1.HttpException(404, 'User Not Found');
        }
        throw err;
    }
};
EmployeeServices.handleUpdateOnlineProfile = async (userId, dto) => {
    // Check online profile exists?
    const online_profile = await online_profileRepository.findOne({
        where: { userId: userId },
        relations: ['employee']
    });
    if (!online_profile)
        throw new httpException_1.HttpException(404, `No online profile matches userId: ${userId}`);
    // Update with req.body
    // general information
    if (dto.jobTitle)
        online_profile.jobTitle = dto.jobTitle;
    if (dto.profession)
        online_profile.profession = dto.profession;
    if (dto.currentPosition)
        online_profile.currentPosition = (0, enumAction_1.EnumPositionLevel)(dto.currentPosition);
    if (dto.desiredPosition)
        online_profile.desiredPosition = (0, enumAction_1.EnumPositionLevel)(dto.desiredPosition);
    if (dto.desiredSalary)
        online_profile.desiredSalary = dto.desiredSalary;
    if (dto.degree)
        online_profile.degree = (0, enumAction_1.EnumDegree)(dto.degree);
    if (dto.workAddress)
        online_profile.workAddress = dto.workAddress;
    if (dto.experience)
        online_profile.experience = (0, enumAction_1.EnumExperience)(dto.experience);
    if (dto.employmentType)
        online_profile.employmentType = (0, enumAction_1.EnumEmploymentType)(dto.employmentType);
    if (dto.careerGoal)
        online_profile.careerGoal = dto.careerGoal;
    if (dto.skills)
        online_profile.skills = dto.skills;
    // other information
    if (dto.isHidden !== null)
        online_profile.isHidden = dto.isHidden;
    else
        online_profile.isHidden = false;
    // update keywords
    if (dto.keywords)
        online_profile.keywords = dto.keywords;
    await online_profileRepository.save(online_profile);
    return online_profile;
};
// Update online profile: another degree, education information, work experience
// 1. another degree
EmployeeServices.handleCreateNewAnotherDegree = async (userId, dto) => {
    if (!dto.degreeName || !dto.level)
        throw new httpException_1.HttpException(400, 'degreeName and level are required');
    try {
        const another_degree = another_degreeRepository.create({
            degreeName: dto.degreeName,
            level: dto.level,
            online_profile: { userId: userId }
        });
        const result = await another_degreeRepository.save(another_degree);
        return result;
    }
    catch (err) {
        if (err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY || err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY2) {
            throw new httpException_1.HttpException(404, 'Online profile Not Found');
        }
        throw err;
    }
};
EmployeeServices.handleUpdateAnotherDegree = async (userId, id, dto) => {
    const another_degree = await another_degreeRepository.findOne({
        where: { id: id },
        relations: ['online_profile']
    });
    if (!another_degree)
        throw new httpException_1.HttpException(404, 'Another degree not found');
    if (another_degree.online_profile.userId !== userId)
        throw new httpException_1.HttpException(403, `You are not the owner of another degree has id: ${id}`);
    if (dto.degreeName)
        another_degree.degreeName = dto.degreeName;
    if (dto.level)
        another_degree.level = dto.level;
    await another_degreeRepository.save(another_degree);
    return {
        userId: another_degree.online_profile.userId,
        id: another_degree.id,
        degreeName: another_degree.degreeName,
        level: another_degree.level
    };
};
EmployeeServices.handleDeleteAnotherDegree = async (userId, id) => {
    const another_degree = await another_degreeRepository.findOne({
        where: { id: id },
        relations: ['online_profile']
    });
    if (!another_degree)
        throw new httpException_1.HttpException(404, 'Another degree not found');
    if (another_degree.online_profile.userId !== userId)
        throw new httpException_1.HttpException(403, `You are not the owner of another degree has id: ${id}`);
    return await another_degreeRepository.remove(another_degree);
};
// 2. education information
EmployeeServices.handleCreateNewEducationInformation = async (userId, dto) => {
    if (!dto.schoolName || !dto.specialization || !dto.degreeName || !dto.startDate || !dto.endDate) {
        throw new httpException_1.HttpException(400, 'schoolName, specialization, degreeName, startDate, endDate are required');
    }
    try {
        const education_information = education_informationRepository.create({
            schoolName: dto.schoolName,
            specialization: dto.specialization,
            degreeName: dto.degreeName,
            startDate: new Date((0, moment_1.default)(dto.startDate, "DD-MM-YYYY").format("MM-DD-YYYY")),
            endDate: new Date((0, moment_1.default)(dto.endDate, "DD-MM-YYYY").format("MM-DD-YYYY")),
            online_profile: { userId: userId },
        });
        return await education_informationRepository.save(education_information);
    }
    catch (err) {
        if (err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY || err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY2) {
            throw new httpException_1.HttpException(404, 'Online profile Not Found');
        }
        throw err;
    }
};
EmployeeServices.handleUpdateEducationInformation = async (userId, id, dto) => {
    const education_information = await education_informationRepository.findOne({
        where: { id: id },
        relations: ['online_profile']
    });
    if (!education_information)
        throw new httpException_1.HttpException(404, 'Education Information Not Found');
    if (education_information.online_profile.userId !== userId)
        throw new httpException_1.HttpException(403, `You are not the owner of education information has id: ${id}`);
    if (dto.schoolName)
        education_information.schoolName = dto.schoolName;
    if (dto.specialization)
        education_information.specialization = dto.specialization;
    if (dto.degreeName)
        education_information.degreeName = dto.degreeName;
    if (dto.startDate)
        education_information.startDate = new Date((0, moment_1.default)(dto.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    if (dto.endDate)
        education_information.endDate = new Date((0, moment_1.default)(dto.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    await education_informationRepository.save(education_information);
    return education_information;
};
EmployeeServices.handleDeleteEducationInformation = async (userId, id) => {
    const education_information = await education_informationRepository.findOne({
        where: { id: id },
        relations: ['online_profile']
    });
    if (!education_information)
        throw new httpException_1.HttpException(404, 'Education Information Not Found');
    if (education_information.online_profile.userId !== userId)
        throw new httpException_1.HttpException(403, `You are not the owner of education information has id: ${id}`);
    await education_informationRepository.remove(education_information);
    return education_information;
};
// 3. work experience
EmployeeServices.handleCreateNewWorkExperience = async (userId, dto) => {
    if (!dto.jobTitle || !dto.companyName || !dto.jobDescription || !dto.startDate || (!dto.endDate && !dto.isDoing)) {
        throw new httpException_1.HttpException(400, 'jobTitle, companyName, jobDescription, startDate, (endDate or isDoing) are required');
    }
    try {
        const work_experience = work_experienceRepository.create({
            jobTitle: dto.jobTitle,
            companyName: dto.companyName,
            jobDescription: dto.jobDescription,
            startDate: new Date((0, moment_1.default)(dto.startDate, "DD-MM-YYYY").format("MM-DD-YYYY")),
            online_profile: { userId: userId },
        });
        if (dto.isDoing)
            work_experience.isDoing = dto.isDoing;
        if (!work_experience.isDoing)
            work_experience.endDate = new Date((0, moment_1.default)(dto.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
        return await work_experienceRepository.save(work_experience);
    }
    catch (err) {
        if (err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY || err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY2) {
            throw new httpException_1.HttpException(404, 'Online profile Not Found');
        }
        throw err;
    }
};
EmployeeServices.handleUpdateWorkExperience = async (userId, id, dto) => {
    const work_experience = await work_experienceRepository.findOne({
        where: { id: id },
        relations: ['online_profile']
    });
    if (!work_experience)
        throw new httpException_1.HttpException(404, 'Work experience Not Found');
    if (work_experience.online_profile.userId !== userId)
        throw new httpException_1.HttpException(403, `You are not the owner of work experience has id: ${id}`);
    if (dto.jobTitle)
        work_experience.jobTitle = dto.jobTitle;
    if (dto.companyName)
        work_experience.companyName = dto.companyName;
    if (dto.jobDescription)
        work_experience.jobDescription = dto.jobDescription;
    if (dto.startDate)
        work_experience.startDate = new Date((0, moment_1.default)(dto.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    // handle isDoing and endDate
    if (dto.isDoing && dto.endDate) {
        throw new httpException_1.HttpException(400, `cannot update when body has: isDoing is true and endDate exist`);
    }
    if (dto.isDoing && !dto.endDate) {
        work_experience.endDate = new Date((0, moment_1.default)(null, "DD-MM-YYYY").format("MM-DD-YYYY"));
        work_experience.isDoing = true;
    }
    if (dto.isDoing !== null && dto.isDoing !== undefined && dto.isDoing === false && !dto.endDate) {
        throw new httpException_1.HttpException(400, `cannot update when body has: isDoing is false and endDate not exist`);
    }
    if (!dto.isDoing && dto.endDate) {
        work_experience.endDate = new Date((0, moment_1.default)(dto.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
        work_experience.isDoing = false;
    }
    await work_experienceRepository.save(work_experience);
    return work_experience;
};
EmployeeServices.handleDeleteWorkExperience = async (userId, id) => {
    const work_experience = await work_experienceRepository.findOne({
        where: { id: id },
        relations: ['online_profile']
    });
    if (!work_experience)
        throw new httpException_1.HttpException(404, 'work experience Not Found');
    if (work_experience.online_profile.userId !== userId)
        throw new httpException_1.HttpException(403, `You are not the owner of work experience has id: ${id}`);
    await work_experienceRepository.remove(work_experience);
    return work_experience;
};
// Features for employer, admin
EmployeeServices.handleGetEmployeesByAdmin = async (reqQuery) => {
    const { name, profession, num, page, orderBy, sort } = reqQuery;
    let query = employeeRepository
        .createQueryBuilder('employee')
        .select(['employee', 'user', 'attached_document', 'online_profile', 'work_experiences', 'education_informations', 'another_degrees'])
        .leftJoin('employee.user', 'user')
        .leftJoin('employee.attached_document', 'attached_document')
        .leftJoin('employee.online_profile', 'online_profile')
        .leftJoin('online_profile.work_experiences', 'work_experiences')
        .leftJoin('online_profile.education_informations', 'education_informations')
        .leftJoin('online_profile.another_degrees', 'another_degrees');
    if (profession) {
        query = query.andWhere(new typeorm_1.Brackets(qb => qb.where('online_profile.profession LIKE :profession', { profession: `%${profession}%` })
            .orWhere('attached_document.profession LIKE :profession', { profession: `%${profession}%` })));
    }
    if (name) {
        query = query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }
    // sort
    if (orderBy) {
        if (!sort_direction_enum_1.SortDirection.hasOwnProperty(sort))
            throw new httpException_1.HttpException(400, 'Invalid sort');
        switch (orderBy) {
            case 'name':
            case 'email':
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
EmployeeServices.handleGetEmployeesByEmployer = async (reqQuery) => {
    const { jobTitle, profession, minSalary, maxSalary, degree, workAddress, experience, employmentType, sex, currentPosition, desiredPosition, num, page } = reqQuery;
    let queryforOnlineProfile = online_profileRepository
        .createQueryBuilder('online_profile')
        .select(['online_profile', 'work_experiences', 'education_informations', 'another_degrees', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar', 'user.phone', 'user.email'])
        .where('online_profile.isHidden = false')
        .leftJoin('online_profile.work_experiences', 'work_experiences')
        .leftJoin('online_profile.education_informations', 'education_informations')
        .leftJoin('online_profile.another_degrees', 'another_degrees')
        .leftJoin('online_profile.employee', 'employee')
        .leftJoin('employee.user', 'user');
    let queryforAttachedDocument = attached_documentRepository
        .createQueryBuilder('attached_document')
        .select(['attached_document', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar', 'user.phone', 'user.email'])
        .where('attached_document.isHidden = false')
        .leftJoin('attached_document.employee', 'employee')
        .leftJoin('employee.user', 'user');
    // Public
    if (workAddress) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        const professionArray = (0, utilsFunction_1.getValidSubstrings)(profession);
        if (professionArray.length === 0)
            throw new httpException_1.HttpException(400, 'Invalid profession');
        queryforOnlineProfile = queryforOnlineProfile.andWhere(`(${professionArray.map((keyword) => `online_profile.profession LIKE '%${keyword}%'`).join(' OR ')})`);
        queryforAttachedDocument = queryforAttachedDocument.andWhere(`(${professionArray.map((keyword) => `attached_document.profession LIKE '%${keyword}%'`).join(' OR ')})`);
    }
    if (employmentType) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.employmentType = :employmentType', { employmentType });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.employmentType = :employmentType', { employmentType });
    }
    if (degree) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.degree = :degree', { degree });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.degree = :degree', { degree });
    }
    if (experience) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.experience = :experience', { experience });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.experience = :experience', { experience });
    }
    if (sex) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('user.sex = :sex', { sex });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('user.sex = :sex', { sex });
    }
    if (minSalary) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredSalary >= :minSalary', { minSalary });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredSalary >= :minSalary', { minSalary });
    }
    if (maxSalary) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredSalary <= :maxSalary', { maxSalary });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredSalary <= :maxSalary', { maxSalary });
    }
    if (currentPosition) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.currentPosition = :currentPosition', { currentPosition });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.currentPosition = :currentPosition', { currentPosition });
    }
    if (desiredPosition) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredPosition = :desiredPosition', { desiredPosition });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredPosition = :desiredPosition', { desiredPosition });
    }
    let hasAttachedDocument = true;
    const onlineProfile_take = parseInt(num);
    const onlineProfile_skip = (parseInt(page) - 1) * parseInt(num);
    queryforOnlineProfile = queryforOnlineProfile.skip(onlineProfile_skip).take(onlineProfile_take);
    const [onlineProfile_items, onlineProfile_totalItems] = await queryforOnlineProfile.getManyAndCount();
    let attachedDocument_take = num - onlineProfile_items.length;
    if (attachedDocument_take === 0) {
        hasAttachedDocument = false;
        attachedDocument_take = 1;
    }
    const attachedDocument_skip = Math.max(onlineProfile_skip - onlineProfile_totalItems, 0);
    queryforAttachedDocument = queryforAttachedDocument.skip(attachedDocument_skip).take(attachedDocument_take);
    const [attachedDocument_items, attachedDocument_totalItems] = await queryforAttachedDocument.getManyAndCount();
    const items = hasAttachedDocument ? [...onlineProfile_items, ...attachedDocument_items] : [...onlineProfile_items];
    const totalItems = attachedDocument_totalItems + onlineProfile_totalItems;
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
EmployeeServices.handleGetEmployeeJobApplicationByEmployer = async (employeeId, type) => {
    if (type === enum_1.applicationType.online_profile) {
        const online_profile = await online_profileRepository
            .createQueryBuilder('online_profile')
            .select(['online_profile', 'work_experiences', 'education_informations', 'another_degrees', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar', 'user.phone', 'user.email'])
            .where('online_profile.isHidden = false')
            .andWhere('online_profile.userId = :employeeId', { employeeId })
            .leftJoin('online_profile.work_experiences', 'work_experiences')
            .leftJoin('online_profile.education_informations', 'education_informations')
            .leftJoin('online_profile.another_degrees', 'another_degrees')
            .leftJoin('online_profile.employee', 'employee')
            .leftJoin('employee.user', 'user')
            .getOne();
        if (!online_profile)
            throw new httpException_1.HttpException(404, `online profile of employee:${employeeId} not found`);
        return online_profile;
    }
    else if (type === enum_1.applicationType.attached_document) {
        const attached_document = await attached_documentRepository
            .createQueryBuilder('attached_document')
            .select(['attached_document', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar', 'user.phone', 'user.email'])
            .where('attached_document.isHidden = false')
            .andWhere('attached_document.userId = :employeeId', { employeeId })
            .leftJoin('attached_document.employee', 'employee')
            .leftJoin('employee.user', 'user')
            .getOne();
        if (!attached_document)
            throw new httpException_1.HttpException(404, `attached document of employee:${employeeId} not found`);
        return attached_document;
    }
    else
        throw new httpException_1.HttpException(400, `Application type must be ${enum_1.applicationType.attached_document}, ${enum_1.applicationType.online_profile}`);
};
EmployeeServices.handleGetEmployeesByEmployerSortByKeywords = async (reqQuery) => {
    const { num, page } = reqQuery;
    const sortByKeywords = await sortOnlineProfilesAndAttachedDocumentsByKeyWords(reqQuery);
    let queryforOnlineProfile = online_profileRepository
        .createQueryBuilder('online_profile')
        .select(['online_profile', 'work_experiences', 'education_informations', 'another_degrees', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar', 'user.email', 'user.phone'])
        .leftJoin('online_profile.work_experiences', 'work_experiences')
        .leftJoin('online_profile.education_informations', 'education_informations')
        .leftJoin('online_profile.another_degrees', 'another_degrees')
        .leftJoin('online_profile.employee', 'employee')
        .leftJoin('employee.user', 'user');
    let queryforAttachedDocument = attached_documentRepository
        .createQueryBuilder('attached_document')
        .select(['attached_document', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar', 'user.email', 'user.phone'])
        .leftJoin('attached_document.employee', 'employee')
        .leftJoin('employee.user', 'user');
    const items = [];
    const lengthOfSortByKeywords = sortByKeywords.result.length;
    for (let i = 0; i < lengthOfSortByKeywords; i++) {
        if (sortByKeywords.result[i].type == '0') {
            let tmp = await queryforOnlineProfile.andWhere('online_profile.userId = :userId', { userId: sortByKeywords.result[i].userId }).getOne();
            items.push(tmp);
        }
        else if (sortByKeywords.result[i].type == '1') {
            let tmp = await queryforAttachedDocument.andWhere('attached_document.userId = :userId', { userId: sortByKeywords.result[i].userId }).getOne();
            items.push(tmp);
        }
    }
    // Pagination
    const totalItems = sortByKeywords.totalItems;
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
EmployeeServices.handleDeleteOnlineProfile = async (id) => {
    // Check online profile exists?
    const online_profile = await online_profileRepository.findOneBy({ userId: id });
    if (!online_profile)
        throw new httpException_1.HttpException(404, "Attached document not found");
    await applicationRepository.delete({
        applicationType: enum_1.applicationType.online_profile,
        employee: { userId: id }
    });
    await online_profileRepository.remove(online_profile);
    return online_profile;
};
EmployeeServices.handleDeleteAttachedDocument = async (id) => {
    const attached_document = await attached_documentRepository.findOneBy({ userId: id });
    if (!attached_document)
        throw new httpException_1.HttpException(404, "Attached document not found");
    // Delete application have attached document
    await applicationRepository.delete({
        applicationType: enum_1.applicationType.attached_document,
        employee: { userId: attached_document.userId }
    });
    await attached_documentRepository.remove(attached_document);
    return attached_document;
};
exports.default = EmployeeServices;
async function sortOnlineProfilesAndAttachedDocumentsByKeyWords(reqQuery) {
    const entityManager = connectDB_1.myDataSource.manager;
    const { jobTitle, profession, minSalary, maxSalary, degree, workAddress, experience, employmentType, sex, currentPosition, desiredPosition, keywords, num, page } = reqQuery;
    // TODO: create optional query for user
    let queryforOnlineProfile = ``;
    let queryforAttachedDocument = ``;
    // TODO: left join table user where sex is NOT NULL
    let leftjoinforOnlineProfile = ``;
    let leftjoinforAttachedDocument = ``;
    if (workAddress) {
        queryforOnlineProfile += ` AND online_profile.workAddress LIKE '%${workAddress}%'`;
        queryforAttachedDocument += ` AND attached_document.workAddress LIKE '%${workAddress}%'`;
    }
    if (jobTitle) {
        queryforOnlineProfile += ` AND online_profile.jobTitle LIKE '%${jobTitle}%'`;
        queryforAttachedDocument += ` AND attached_document.jobTitle LIKE '%${jobTitle}%`;
    }
    if (employmentType) {
        queryforOnlineProfile += ` AND online_profile.employmentType = '${employmentType}'`;
        queryforAttachedDocument += ` AND attached_document.employmentType = '${employmentType}'`;
    }
    if (degree) {
        queryforOnlineProfile += ` AND online_profile.degree = '${degree}'`;
        queryforAttachedDocument += ` AND attached_document.degree = '${degree}'`;
    }
    if (experience) {
        queryforOnlineProfile += ` AND online_profile.experience = '${experience}'`;
        queryforAttachedDocument += ` AND attached_document.experience = '${experience}'`;
    }
    if (sex) {
        queryforOnlineProfile += ` AND user.sex = '${sex}'`;
        queryforAttachedDocument += ` AND user.sex = '${sex}'`;
        // TODO: left join table where sex is NOT NULL
        leftjoinforOnlineProfile = `
        LEFT JOIN employee
        ON employee.userId = online_profile.userId  
        LEFT JOIN user 
        ON user.userId = employee.userId
        `;
        leftjoinforAttachedDocument = ` 
        LEFT JOIN employee
        ON employee.userId = attached_document.userId  
        LEFT JOIN user 
        ON user.userId = employee.userId
        `;
    }
    if (minSalary) {
        queryforOnlineProfile += ` AND online_profile.desiredSalary >= '${minSalary}'`;
        queryforAttachedDocument += ` AND attached_document.desiredSalary >= '${minSalary}'`;
    }
    if (maxSalary) {
        queryforOnlineProfile += ` AND online_profile.desiredSalary <= '${maxSalary}'`;
        queryforAttachedDocument += ` AND attached_document.desiredSalary <= '${maxSalary}'`;
    }
    if (currentPosition) {
        queryforOnlineProfile += ` AND online_profile.currentPosition = '${currentPosition}'`;
        queryforAttachedDocument += ` AND attached_document.currentPosition = '${currentPosition}'`;
    }
    if (desiredPosition) {
        queryforOnlineProfile += ` AND online_profile.desiredPosition = '${desiredPosition}'`;
        queryforAttachedDocument += ` AND attached_document.desiredPosition = '${desiredPosition}'`;
    }
    // TODO: profession is a array.    
    if (profession) {
        const professionArray = (0, utilsFunction_1.getValidSubstrings)(profession);
        if (professionArray.length === 0)
            throw new httpException_1.HttpException(400, 'Invalid profession');
        queryforOnlineProfile += ` AND (${professionArray.map((keyword) => `online_profile.profession LIKE '%${keyword}%'`).join(' OR ')})`;
        queryforAttachedDocument += ` AND (${professionArray.map((keyword) => `attached_document.profession LIKE '%${keyword}%'`).join(' OR ')})`;
    }
    // TODO : default query
    const keywordArray = (0, utilsFunction_1.getValidSubstrings)(keywords, 2);
    if (keywordArray.length === 0)
        throw new httpException_1.HttpException(400, 'Invalid keywords');
    const onlineProfileQuery = `
        SELECT 
            online_profile.userId AS userId, 
            0 AS type,
            (${keywordArray.map((keyword) => `CASE WHEN online_profile.keywords LIKE '%${keyword}%' THEN 1 ELSE 0 END`).join(' + ')}) AS count
        FROM online_profile
        ${leftjoinforOnlineProfile}
        WHERE online_profile.isHidden = false
        ${queryforOnlineProfile}
        HAVING count > 0
    `;
    const attachedDocumentQuery = `
        SELECT 
            attached_document.userId AS userId, 
            1 AS type,
            (${keywordArray.map((keyword) => `CASE WHEN attached_document.keywords LIKE '%${keyword}%' THEN 1 ELSE 0 END`).join(' + ')}) AS count
        FROM attached_document
        ${leftjoinforAttachedDocument}
        WHERE attached_document.isHidden = false
        ${queryforAttachedDocument}
        HAVING count > 0
    `;
    // TODO: Total Count
    const onlineProfileCountQuery = `
        SELECT COUNT(*) AS totalCount
        FROM (${onlineProfileQuery}) AS onlineProfiles
    `;
    const attachedDocumentCountQuery = `
        SELECT COUNT(*) AS totalCount
        FROM (${attachedDocumentQuery}) AS attachedDocuments
    `;
    const onlineProfileCountResult = await entityManager.query(onlineProfileCountQuery);
    const attachedDocumentCountResult = await entityManager.query(attachedDocumentCountQuery);
    const totalItems = Number(onlineProfileCountResult[0].totalCount) + Number(attachedDocumentCountResult[0].totalCount);
    // TODO: Query
    const result = await entityManager.query(`
        (${onlineProfileQuery} UNION ${attachedDocumentQuery}) 
        ORDER BY count DESC 
        LIMIT ${parseInt(num)}
        OFFSET ${(parseInt(page) - 1) * parseInt(num)} 
        `);
    return {
        totalItems: totalItems,
        result: result
    };
}
//# sourceMappingURL=employeeServices.js.map