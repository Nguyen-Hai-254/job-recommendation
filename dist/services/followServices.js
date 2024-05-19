"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const connectDB_1 = require("../config/connectDB");
const Employee_1 = require("../entity/Employee");
const Employer_1 = require("../entity/Employer");
const JobPosting_1 = require("../entity/JobPosting");
const follow_1 = require("../entity/follow");
const save_1 = require("../entity/save");
const enum_1 = require("../utils/enum");
const employeeRepository = connectDB_1.myDataSource.getRepository(Employee_1.Employee);
const employerRepository = connectDB_1.myDataSource.getRepository(Employer_1.Employer);
const followRepository = connectDB_1.myDataSource.getRepository(follow_1.Follow);
const saveRepository = connectDB_1.myDataSource.getRepository(save_1.Save);
const jobPostingRepository = connectDB_1.myDataSource.getRepository(JobPosting_1.JobPosting);
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
FollowServices.handleGetFollowByEmployee = async (user) => {
    const findEmployee = await followRepository.find({
        where: { employeeId: user.userId },
        relations: ['employer.jobPostings']
    });
    if (!findEmployee)
        throw new httpException_1.HttpException(404, 'Employee not found');
    const company = findEmployee.map((follow) => {
        return ({
            employerId: follow.employerId,
            companyName: follow.employer.companyName,
            companyLocation: follow.employer.companyLocation,
            logo: follow.employer.logo,
            numberCurrentlyRecruiting: follow.employer.jobPostings.length,
            followDate: follow.createAt,
            careerField: follow.employer.careerField,
            banner: follow.employer.banner
        });
    });
    return {
        employeeId: user.userId,
        email: user.email,
        followCompany: company
    };
};
FollowServices.handleGetSaveEmployeeByEmployer = async (user) => {
    const findEmployer = await saveRepository.find({
        where: {
            employerId: user.userId,
        },
        relations: ['employee.user', 'employee.online_profile', 'employee.attached_document']
    });
    if (!findEmployer)
        throw new httpException_1.HttpException(404, 'Employer not found');
    const data = findEmployer.map(save => {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if ((save.isOnlineProfile && save.employee.online_profile && !save.employee.online_profile.isHidden) || (!save.isOnlineProfile && save.employee.attached_document && !save.employee.attached_document.isHidden))
            return ({
                userId: save.employee.user.userId,
                email: save.employee.user.email,
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
            return;
    });
    return data.filter(save => save);
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
FollowServices.handleGetFollowJobPosting = async (user) => {
    const findEmployee = await employeeRepository.findOne({
        where: { userId: user.userId },
        relations: ['jobs.employer']
    });
    if (!findEmployee)
        throw new httpException_1.HttpException(404, 'Employee not found');
    const data = {
        userId: findEmployee.userId,
        jobs: findEmployee.jobs.filter((job) => {
            return (job.isHidden === false);
        }).map((job) => {
            return ({
                postId: job.postId,
                jobTitle: job.jobTitle,
                companyName: job.employer.companyName,
                minSalary: job.minSalary,
                maxSalary: job.maxSalary,
                workAddress: job.workAddress,
                createAt: job.createAt,
                logo: job.employer.logo
            });
        })
    };
    return data;
};
exports.default = FollowServices;
//# sourceMappingURL=followServices.js.map