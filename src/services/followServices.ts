import { myDataSource } from "../config/connectDB";
import { Employee, Employer, JobPosting, Follow, Save} from "../entities";
import { approvalStatus } from "../utils/enum";
import { HttpException } from "../exceptions/httpException";

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

        if (!findUser) throw new HttpException(404, 'User not found')

        let findEmployer = await employerRepository.findOne({
            where: { userId: employerId }
        })
        if (!findEmployer) throw new HttpException(404, 'Employer not found')

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

        return find !== -1 ? 'Đã bỏ theo dõi công ty' : 'Đã theo dõi công ty';
            
    }

    static handleSaveEmployee = async (user, emloyeeId, isOnlineProfile) => {
        let findEmployer = await employerRepository.findOne({
            where: {
                userId: user.userId
            },
            relations: ['saveEmployee']
        })

        if (!findEmployer) throw new HttpException(404, 'Employer not found')

        const findEmployee = await employeeRepository.findOne({
            where: { userId: emloyeeId }
        })
        if (!findEmployee) throw new HttpException(404, 'Employee not found')

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
            })
            await saveRepository.save(createSave);
            return 'Đã lưu hồ sơ';   
        };
    }

    static handleGetFollowByEmployee = async (user) => {
        const findEmployee = await followRepository.find({
            where: { employeeId: user.userId },
            relations: ['employer.jobPostings']
        })

        if (!findEmployee) throw new HttpException(404, 'Employee not found')

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

        return  {
                employeeId: user.userId,
                email: user.email,
                followCompany: company
            }
        
    }

    static handleGetSaveEmployeeByEmployer = async (user) => {
        const findEmployer = await saveRepository.find({
            where: {
                employerId: user.userId,
            },
            relations: ['employee.user', 'employee.online_profile', 'employee.attached_document']
        })

        if (!findEmployer) throw new HttpException(404, 'Employer not found')

        const data = findEmployer.map(save => {
            if ((save.isOnlineProfile && save.employee.online_profile && !save.employee.online_profile.isHidden) || (!save.isOnlineProfile && save.employee.attached_document && !save.employee.attached_document.isHidden))
                return ({
                    userId: save.employee.user.userId,
                    email: save.employee.user.email,
                    name: save.employee.user.name,
                    createAt: save.createAt,
                    avatar: save.employee.user.avatar,
                    isOnlineProfile: save.isOnlineProfile,
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

        return data.filter(save => save)
    }

    static handleFollowJobPosting = async (user, jobId) => {
        const findEmployee = await employeeRepository.findOne({
            where: { userId: user.userId },
            relations: ['jobs']
        })
        if (!findEmployee) throw new HttpException(404, 'Employee not found')

        const findJobPosing = await jobPostingRepository.findOneBy({
            postId: jobId
        })
        if (!findJobPosing) throw new HttpException(404, 'Job posting not found')

        if (findJobPosing.status === approvalStatus.pending || findJobPosing.status === approvalStatus.rejected || findJobPosing.isHidden) {
            throw new HttpException(403, 'Bạn không thể theo dõi đăng tuyển này')
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

        return findFollow === -1 ? 'Theo dõi đăng tuyển thành công' : 'Đã bỏ theo dõi đăng tuyển';
    }

    static handleGetFollowJobPosting = async (user) => {
        const findEmployee = await employeeRepository.findOne({
            where: { userId: user.userId },
            relations: ['jobs.employer']
        })
        if (!findEmployee) throw new HttpException(404, 'Employee not found')

        const data = {
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

        return data;
      
    }
}