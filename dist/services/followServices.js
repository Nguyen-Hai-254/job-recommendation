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
FollowServices.handleFollowCompany = (user, employerId) => __awaiter(void 0, void 0, void 0, function* () {
    let findUser = yield employeeRepository.findOne({
        where: { userId: user.userId },
        relations: ['follow']
    });
    if (!findUser) {
        return ({
            message: 'Người dùng không tồn tại',
            status: 404,
            data: null
        });
    }
    let findEmployer = yield employerRepository.findOne({
        where: { userId: employerId }
    });
    if (!findEmployer) {
        return ({
            message: 'Công ty không tồn tại!',
            status: 404,
            data: null
        });
    }
    const find = findUser.follow.findIndex((follow) => follow.employerId == employerId);
    if (find !== -1) {
        yield followRepository.delete({
            employeeId: findUser.userId,
            employerId: findEmployer.userId
        });
    }
    else {
        const createFollow = followRepository.create({
            employeeId: findUser.userId,
            employerId: findEmployer.userId
        });
        yield followRepository.save(createFollow);
    }
    ;
    return ({
        message: find !== -1 ? 'Đã bỏ theo dõi công ty' : 'Đã theo dõi công ty',
        status: 200,
        data: true
    });
});
FollowServices.handleSaveEmployee = (user, emloyeeId, isOnlineProfile) => __awaiter(void 0, void 0, void 0, function* () {
    let findEmployer = yield employerRepository.findOne({
        where: {
            userId: user.userId
        },
        relations: ['saveEmployee']
    });
    if (!findEmployer) {
        return ({
            message: 'Không tìm thấy thông tin công ty!',
            status: 404,
            data: null
        });
    }
    const findEmployee = yield employeeRepository.findOne({
        where: { userId: emloyeeId }
    });
    if (!findEmployee) {
        return ({
            message: 'Không tìm thấy thông tin người xin việc!',
            status: 404,
            data: null
        });
    }
    const find = findEmployer.saveEmployee.filter(save => save.employerId == user.userId && save.employeeId == emloyeeId && save.isOnlineProfile == isOnlineProfile);
    if (find.length > 0) {
        yield saveRepository.remove(find);
        return ({
            message: 'Đã bỏ lưu hồ sơ',
            status: 200,
            data: true
        });
    }
    else {
        const createSave = saveRepository.create({
            employeeId: findEmployee.userId,
            employerId: findEmployer.userId,
            isOnlineProfile: isOnlineProfile == '1' ? true : false
        });
        yield saveRepository.save(createSave);
        return ({
            message: 'Đã lưu hồ sơ',
            status: 200,
            data: true
        });
    }
    ;
});
FollowServices.handleGetFollowByEmployee = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const findEmployee = yield followRepository.find({
        where: { employeeId: user.userId },
        relations: ['employer.jobPostings']
    });
    if (!findEmployee) {
        return ({
            message: 'Không tìm thấy thông tin người xin việc!',
            status: 404,
            data: null
        });
    }
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
    return ({
        message: 'OK',
        status: 200,
        data: {
            employeeId: user.userId,
            email: user.email,
            followCompany: company
        }
    });
});
FollowServices.handleGetSaveEmployeeByEmployer = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const findEmployer = yield saveRepository.find({
        where: {
            employerId: user.userId,
        },
        relations: ['employee.user', 'employee.online_profile', 'employee.attached_document']
    });
    if (!findEmployer) {
        return ({
            message: 'Không tìm thấy thông tin công ty!',
            status: 404,
            data: null
        });
    }
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
    const filterData = data.filter(save => save);
    return ({
        message: 'OK',
        status: 200,
        data: filterData
    });
});
FollowServices.handleFollowJobPosting = (user, jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const findEmployee = yield employeeRepository.findOne({
        where: { userId: user.userId },
        relations: ['jobs']
    });
    if (!findEmployee) {
        return ({
            message: 'Không tìm thấy thông tin người xin việc!',
            status: 404,
            data: null
        });
    }
    const findJobPosing = yield jobPostingRepository.findOneBy({
        postId: jobId
    });
    if (!findJobPosing) {
        return ({
            message: 'Không tìm thấy thông tin đăng tuyển!',
            status: 404,
            data: null
        });
    }
    if (findJobPosing.status === enum_1.approvalStatus.pending || findJobPosing.status === enum_1.approvalStatus.rejected || findJobPosing.isHidden) {
        return ({
            message: 'Bạn không thể theo dõi đăng tuyển này',
            status: 403,
            data: null
        });
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
    yield employeeRepository.save(findEmployee);
    return ({
        message: findFollow === -1 ? 'Theo dõi đăng tuyển thành công' : 'Đã bỏ theo dõi đăng tuyển',
        status: 200,
        data: []
    });
});
FollowServices.handleGetFollowJobPosting = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const findEmployee = yield employeeRepository.findOne({
        where: { userId: user.userId },
        relations: ['jobs.employer']
    });
    if (!findEmployee) {
        return ({
            message: 'Không tìm thấy thông tin người xin việc!',
            status: 404,
            data: null
        });
    }
    return ({
        message: 'OK',
        status: 200,
        data: {
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
        }
    });
});
exports.default = FollowServices;
//# sourceMappingURL=followServices.js.map