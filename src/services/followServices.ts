import { myDataSource } from "../config/connectDB";
import { Employee } from "../entity/Employee";
import { Employer } from "../entity/Employer";
import { JobPosting } from "../entity/JobPosting";
import { Follow } from "../entity/follow";
import { Save } from "../entity/save";
import { approvalStatus } from "../utils/enum";

const employeeRepository = myDataSource.getRepository(Employee);
const employerRepository = myDataSource.getRepository(Employer);
const followRepository = myDataSource.getRepository(Follow);
const saveRepository = myDataSource.getRepository(Save);
const jobPostingRepository = myDataSource.getRepository(JobPosting);

export default class FollowServices {
    static handleFollowCompany = async (user, employerId) => {
        let findUser = await employeeRepository.findOne({
            where: { userId: user.userId },
            relations: ['follow']
        })

        if (!findUser) {
            return ({
                message: 'Người dùng không tồn tại',
                status: 404,
                data: null
            })
        }

        let findEmployer = await employerRepository.findOne({
            where: { userId: employerId }
        })

        if (!findEmployer) {
            return ({
                message: 'Công ty không tồn tại!',
                status: 404,
                data: null
            })
        }
        const find = findUser.follow.findIndex((follow) => follow.employerId == employerId);

        if (find !== -1) {
            await followRepository.delete({
                employeeId: findUser.userId,
                employerId: findEmployer.userId
            })
        }
        else {
            const createFollow = followRepository.create({
                employeeId: findUser.userId,
                employerId: findEmployer.userId
            })

            await followRepository.save(createFollow);
        };

        return ({
            message: find !== -1 ? 'Đã bỏ theo dõi công ty' : 'Đã theo dõi công ty',
            status: 200,
            data: true
        })
    }

    static handleSaveEmployee = async (user, emloyeeId, isOnlineProfile) => {
        let findEmployer = await employerRepository.findOne({
            where: {
                userId: user.userId
            },
            relations: ['saveEmployee']
        })

        if (!findEmployer) {
            return ({
                message: 'Không tìm thấy thông tin công ty!',
                status: 404,
                data: null
            })
        }

        const findEmployee = await employeeRepository.findOne({
            where: { userId: emloyeeId }
        })

        if (!findEmployee) {
            return ({
                message: 'Không tìm thấy thông tin người xin việc!',
                status: 404,
                data: null
            })
        }

        const find = findEmployer.saveEmployee.filter(save => save.employerId == user.userId && save.employeeId == emloyeeId && save.isOnlineProfile == isOnlineProfile);

        if (find.length > 0) {
            await saveRepository.remove(find);

            return ({
                message: 'Đã bỏ lưu hồ sơ',
                status: 200,
                data: true
            })
        }
        else {
            const createSave = saveRepository.create({
                employeeId: findEmployee.userId,
                employerId: findEmployer.userId,
                isOnlineProfile: isOnlineProfile == '1' ? true : false
            })
            await saveRepository.save(createSave);

            return ({
                message: 'Đã lưu hồ sơ',
                status: 200,
                data: true
            })
        };
    }

    static handleGetFollowByEmployee = async (user) => {
        const findEmployee = await followRepository.find({
            where: { employeeId: user.userId },
            relations: ['employer.jobPostings']
        })

        if (!findEmployee) {
            return ({
                message: 'Không tìm thấy thông tin người xin việc!',
                status: 404,
                data: null
            })
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
            })
        })

        return ({
            message: 'OK',
            status: 200,
            data: {
                employeeId: user.userId,
                email: user.email,
                followCompany: company
            }
        })
    }

    static handleGetSaveEmployeeByEmployer = async (user) => {
        const findEmployer = await saveRepository.find({
            where: {
                employerId: user.userId,
            },
            relations: ['employee.user', 'employee.online_profile', 'employee.attached_document']
        })

        if (!findEmployer) {
            return ({
                message: 'Không tìm thấy thông tin công ty!',
                status: 404,
                data: null
            })
        }

        const data = findEmployer.map(save => {
            if ((save.isOnlineProfile && save.employee.online_profile && !save.employee.online_profile.isHidden) || (!save.isOnlineProfile && save.employee.attached_document && !save.employee.attached_document.isHidden))
                return ({
                    userId: save.employee.user.userId,
                    email: save.employee.user.email,
                    name: save.employee.user.name,
                    createAt: save.createAt,
                    file: {
                        jobTitle: save.isOnlineProfile ? save.employee.online_profile?.jobTitle : save.employee.attached_document?.jobTitle,
                        desiredSalary: save.isOnlineProfile ? save.employee.online_profile?.desiredSalary : save.employee.attached_document?.desiredSalary,
                        profession: save.isOnlineProfile ? save.employee.online_profile?.profession : save.employee.attached_document?.profession,
                        currentPosition: save.isOnlineProfile ? save.employee.online_profile?.currentPosition : save.employee.attached_document?.currentPosition,
                        experience: save.isOnlineProfile ? save.employee.online_profile?.experience : save.employee.attached_document?.experience,
                        degree: save.isOnlineProfile ? save.employee.online_profile?.degree : save.employee.attached_document?.degree,
                        skills: save.isOnlineProfile ? save.employee.online_profile?.skills : save.employee.attached_document?.skills,
                    }
                })
            else return
        })

        const filterData = data.filter(save => save)

        return ({
            message: 'OK',
            status: 200,
            data: filterData
        })
    }

    static handleFollowJobPosting = async (user, jobId) => {
        const findEmployee = await employeeRepository.findOne({
            where: { userId: user.userId },
            relations: ['jobs']
        })

        if (!findEmployee) {
            return ({
                message: 'Không tìm thấy thông tin người xin việc!',
                status: 404,
                data: null
            })
        }

        const findJobPosing = await jobPostingRepository.findOneBy({
            postId: jobId
        })

        if (!findJobPosing) {
            return ({
                message: 'Không tìm thấy thông tin đăng tuyển!',
                status: 404,
                data: null
            })
        }
        if (findJobPosing.status === approvalStatus.pending || findJobPosing.status === approvalStatus.rejected || findJobPosing.isHidden) {
            return ({
                message: 'Bạn không thể theo dõi đăng tuyển này',
                status: 403,
                data: null
            })
        }

        let findFollow = -1;
        if (findEmployee.jobs.length !== 0) {
            findFollow = findEmployee.jobs.findIndex((job) => job.postId == jobId)
        }

        if (findFollow === -1) {
            findEmployee.jobs.push(findJobPosing);
        }
        else {
            delete findEmployee.jobs[findFollow];
        }

        await employeeRepository.save(findEmployee);

        return ({
            message: findFollow === -1 ? 'Theo dõi đăng tuyển thành công' : 'Đã bỏ theo dõi đăng tuyển',
            status: 200,
            data: []
        })
    }

    static handleGetFollowJobPosting = async (user) => {
        const findEmployee = await employeeRepository.findOne({
            where: { userId: user.userId },
            relations: ['jobs.employer']
        })

        if (!findEmployee) {
            return ({
                message: 'Không tìm thấy thông tin người xin việc!',
                status: 404,
                data: null
            })
        }

        return ({
            message: 'OK',
            status: 200,
            data: {
                userId: findEmployee.userId,
                jobs: findEmployee.jobs.filter((job) => {
                    return (
                        job.isHidden === false
                    )
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
                    })
                })
            }
        })
    }
}