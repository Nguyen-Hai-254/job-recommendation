"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const connectDB_1 = require("../config/connectDB");
const entities_1 = require("../entities");
const enum_1 = require("../utils/enum");
const httpException_1 = require("../exceptions/httpException");
const employeeRepository = connectDB_1.myDataSource.getRepository(entities_1.Employee);
const employerRepository = connectDB_1.myDataSource.getRepository(entities_1.Employer);
const followRepository = connectDB_1.myDataSource.getRepository(entities_1.Follow);
const saveRepository = connectDB_1.myDataSource.getRepository(entities_1.Save);
const jobPostingRepository = connectDB_1.myDataSource.getRepository(entities_1.JobPosting);
class FollowServices {
}
_a = FollowServices;
FollowServices.handleFollowCompany = async (user, employerId) => {
    let findUser = await employeeRepository.findOne({
        where: { userId: user.userId },
        relations: ['follow']
    });
    if (!findUser)
        throw new httpException_1.HttpException(404, 'User not found');
    let findEmployer = await employerRepository.findOne({
        where: { userId: employerId }
    });
    if (!findEmployer)
        throw new httpException_1.HttpException(404, 'Employer not found');
    const find = findUser.follow.findIndex((follow) => follow.employerId == employerId);
    if (find !== -1) {
        await followRepository.delete({
            employeeId: findUser.userId,
            employerId: findEmployer.userId
        });
    }
    else {
        const createFollow = followRepository.create({
            employeeId: findUser.userId,
            employerId: findEmployer.userId
        });
        await followRepository.save(createFollow);
    }
    ;
    return find !== -1 ? 'Đã bỏ theo dõi công ty' : 'Đã theo dõi công ty';
};
FollowServices.handleSaveEmployee = async (user, emloyeeId, isOnlineProfile) => {
    let findEmployer = await employerRepository.findOne({
        where: {
            userId: user.userId
        },
        relations: ['saveEmployee']
    });
    if (!findEmployer)
        throw new httpException_1.HttpException(404, 'Employer not found');
    const findEmployee = await employeeRepository.findOne({
        where: { userId: emloyeeId }
    });
    if (!findEmployee)
        throw new httpException_1.HttpException(404, 'Employee not found');
    const find = findEmployer.saveEmployee.filter(save => save.employerId == user.userId && save.employeeId == emloyeeId && save.isOnlineProfile == isOnlineProfile);
    if (find.length > 0) {
        await saveRepository.remove(find);
        return 'Đã bỏ lưu hồ sơ';
    }
    else {
        const createSave = saveRepository.create({
            employeeId: findEmployee.userId,
            employerId: findEmployer.userId,
            isOnlineProfile: isOnlineProfile == '1' ? true : false
        });
        await saveRepository.save(createSave);
        return 'Đã lưu hồ sơ';
    }
    ;
};
FollowServices.handleGetFollowByEmployee = async (user, reqQuery) => {
    const { companyIds, num, page } = reqQuery;
    let query = followRepository.createQueryBuilder('follow')
        .leftJoinAndSelect('follow.employer', 'employer')
        .where('follow.employeeId = :employeeId', { employeeId: user.userId });
    if (companyIds) {
        const ArrayCompanyIds = companyIds.split(',').map(companyId => Number(companyId));
        query = query.andWhere('follow.employerId IN (:...ArrayCompanyIds)', { ArrayCompanyIds });
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
            itemsPerPage: +num,
            totalPages,
            currentPage: +page
        }
    };
};
FollowServices.handleGetSaveEmployeeByEmployer = async (user, reqQuery) => {
    const { num, page } = reqQuery;
    const [items, totalItems] = await saveRepository.findAndCount({
        where: {
            employerId: user.userId,
        },
        relations: ['employee.user', 'employee.online_profile', 'employee.attached_document'],
        order: {
            createAt: 'DESC'
        },
        skip: (Number(page) - 1) * Number(num),
        take: Number(num)
    });
    const transformedItems = items.map(save => {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if ((save.isOnlineProfile && save.employee.online_profile && !save.employee.online_profile.isHidden) || (!save.isOnlineProfile && save.employee.attached_document && !save.employee.attached_document.isHidden))
            return ({
                userId: save.employee.user.userId,
                name: save.employee.user.name,
                createAt: save.createAt,
                avatar: save.employee.user.avatar,
                isOnlineProfile: save.isOnlineProfile,
                file: {
                    jobTitle: save.isOnlineProfile ? (_b = save.employee.online_profile) === null || _b === void 0 ? void 0 : _b.jobTitle : (_c = save.employee.attached_document) === null || _c === void 0 ? void 0 : _c.jobTitle,
                    desiredSalary: save.isOnlineProfile ? (_d = save.employee.online_profile) === null || _d === void 0 ? void 0 : _d.desiredSalary : (_e = save.employee.attached_document) === null || _e === void 0 ? void 0 : _e.desiredSalary,
                    profession: save.isOnlineProfile ? (_f = save.employee.online_profile) === null || _f === void 0 ? void 0 : _f.profession : (_g = save.employee.attached_document) === null || _g === void 0 ? void 0 : _g.profession,
                    currentPosition: save.isOnlineProfile ? (_h = save.employee.online_profile) === null || _h === void 0 ? void 0 : _h.currentPosition : (_j = save.employee.attached_document) === null || _j === void 0 ? void 0 : _j.currentPosition,
                    experience: save.isOnlineProfile ? (_k = save.employee.online_profile) === null || _k === void 0 ? void 0 : _k.experience : (_l = save.employee.attached_document) === null || _l === void 0 ? void 0 : _l.experience,
                    degree: save.isOnlineProfile ? (_m = save.employee.online_profile) === null || _m === void 0 ? void 0 : _m.degree : (_o = save.employee.attached_document) === null || _o === void 0 ? void 0 : _o.degree,
                    skills: save.isOnlineProfile ? (_p = save.employee.online_profile) === null || _p === void 0 ? void 0 : _p.skills : (_q = save.employee.attached_document) === null || _q === void 0 ? void 0 : _q.skills,
                }
            });
        else
            return ({
                userId: save.employee.user.userId,
                name: save.employee.user.name,
                createAt: save.createAt,
                avatar: save.employee.user.avatar,
                isOnlineProfile: save.isOnlineProfile,
                file: null
            });
    });
    const totalPages = Math.ceil(totalItems / num);
    return {
        items: transformedItems,
        meta: {
            totalItems,
            itemCount: items.length,
            itemsPerPage: +num,
            totalPages,
            currentPage: +page
        }
    };
};
FollowServices.handleFollowJobPosting = async (user, jobId) => {
    const findEmployee = await employeeRepository.findOne({
        where: { userId: user.userId },
        relations: ['jobs']
    });
    if (!findEmployee)
        throw new httpException_1.HttpException(404, 'Employee not found');
    const findJobPosing = await jobPostingRepository.findOneBy({
        postId: jobId
    });
    if (!findJobPosing)
        throw new httpException_1.HttpException(404, 'Job posting not found');
    if (findJobPosing.status === enum_1.approvalStatus.pending || findJobPosing.status === enum_1.approvalStatus.rejected || findJobPosing.isHidden) {
        throw new httpException_1.HttpException(403, 'Bạn không thể theo dõi đăng tuyển này');
    }
    let findFollow = -1;
    if (findEmployee.jobs.length !== 0) {
        findFollow = findEmployee.jobs.findIndex((job) => job.postId == jobId);
    }
    if (findFollow === -1) {
        findEmployee.jobs.push(findJobPosing);
    }
    else {
        delete findEmployee.jobs[findFollow];
    }
    await employeeRepository.save(findEmployee);
    return findFollow === -1 ? 'Theo dõi đăng tuyển thành công' : 'Đã bỏ theo dõi đăng tuyển';
};
FollowServices.handleGetFollowJobPosting = async (user, reqQuery) => {
    const entityManager = connectDB_1.myDataSource.manager;
    const { jobIds, num, page } = reqQuery;
    let queryByJobIds = jobIds ? `AND fj.postId IN (${jobIds})` : ``;
    let query = `
            SELECT 
                fj.postId,
                jp.jobTitle,
                jp.minSalary,
                jp.maxSalary,
                jp.workAddress,
                jp.createAt,
                employer.companyName,
                employer.logo,
                COUNT(*) OVER() AS totalItems
            FROM \`follow-job\` fj 
            INNER JOIN job_posting jp
            ON fj.postId = jp.postId
            INNER JOIN employer
            ON jp.employer_id = employer.userId
            WHERE fj.userId = ${user.userId}
                ${queryByJobIds}
                AND jp.isHidden = false
                AND jp.status = '${enum_1.approvalStatus.approved}'
            LIMIT ${parseInt(num)}
            OFFSET ${(parseInt(page) - 1) * parseInt(num)} 
        `;
    const result = await entityManager.query(query);
    const totalItems = result.length ? Number(result[0].totalItems) : 0;
    const items = result.length ? result.map(({ totalItems, ...rest }) => rest) : [];
    const totalPages = Math.ceil(totalItems / num);
    return {
        items: items,
        meta: {
            totalItems,
            itemCount: items.length,
            itemsPerPage: +num,
            totalPages,
            currentPage: +page
        }
    };
};
exports.default = FollowServices;
//# sourceMappingURL=followServices.js.map