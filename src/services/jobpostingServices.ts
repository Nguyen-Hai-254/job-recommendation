import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User } from "../entity/Users"
import { approvalStatus, userRole } from "../utils/enum"
import { JobPosting } from "../entity/JobPosting"
import moment from "moment"
import { EnumEmploymentType, EnumDegree, EnumExperience, EnumPositionLevel, EnumSex, EnumApprovalStatus } from "../utils/enumAction"
import { Notification } from "../entity/Notification"
import { LessThan, MoreThanOrEqual } from "typeorm"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const jobPostingRepository = myDataSource.getRepository(JobPosting);
const notificationRepository = myDataSource.getRepository(Notification);

export default class JobPostingServices {
    static handleGetAllJobPostings = async (req) => {
        const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, num, page} = req.query;
        let query = jobPostingRepository.createQueryBuilder('job-postings');
        // jobposting for employee, employer, unknown
        query = query.leftJoinAndSelect("job-postings.employer", "employer")
                     .where('job-postings.status = :status', {status: approvalStatus.approved})
                     .andWhere('job-postings.applicationDeadline >= :applicationDeadline', {applicationDeadline: moment(new Date()).subtract(1, 'days').toDate()});
        // Public
        if (workAddress) {
            query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        }
        if (jobTitle) {
            query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        }
        if (profession) {
            query = query.andWhere('job-postings.profession = :profession', { profession});
        }
        if (employmentType) {
            query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType});
        }
        if (degree) {
            query = query.andWhere('job-postings.degree = :degree', { degree});
        }
        if (experience) {
            query = query.andWhere('job-postings.experience = :experience', { experience});
        }
        if (positionLevel) {
            query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel});
        }
        if (sex) {
            query = query.andWhere('job-postings.sex = :sex', { sex});
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
      

        const jobPostings = await query.getMany();
        
        if (!jobPostings || jobPostings.length === 0) {
            return ({
                message: 'No jobPostings found',
                status: 204,
                data: null
            })
        }

        return ({
            message: 'Find all jobPostings success',
            status: 200,
            data: jobPostings
        })
    }

    static handleGetTotalResultsOfAllJobPostings = async (req) => {
        // Update status of job postings when job postings were expried.
        let findExpiredPosts = await jobPostingRepository.find({
            where: {
                applicationDeadline: LessThan(moment(new Date()).subtract(1, 'days').toDate()),
                status: approvalStatus.approved
            }
        })

        if (findExpiredPosts.length > 0) {
            findExpiredPosts.map(async (post) => {
                post.status = approvalStatus.expired
                await jobPostingRepository.save(post)
            })
        }

        const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary} = req.query;
        let query = jobPostingRepository.createQueryBuilder('job-postings');
        // jobposting for employee, employer, unknown
        query = query.leftJoinAndSelect("job-postings.employer", "employer")
                     .where('job-postings.status = :status', {status: approvalStatus.approved})
                     .andWhere('job-postings.applicationDeadline >= :applicationDeadline', {applicationDeadline: moment(new Date()).subtract(1, 'days').toDate()});
        // Public
        if (workAddress) {
            query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        }
        if (jobTitle) {
            query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        }
        if (profession) {
            query = query.andWhere('job-postings.profession = :profession', { profession});
        }
        if (employmentType) {
            query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType});
        }
        if (degree) {
            query = query.andWhere('job-postings.degree = :degree', { degree});
        }
        if (experience) {
            query = query.andWhere('job-postings.experience = :experience', { experience});
        }
        if (positionLevel) {
            query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel});
        }
        if (sex) {
            query = query.andWhere('job-postings.sex = :sex', { sex});
        }
        if (salary) {
            query = query.andWhere(':salary BETWEEN job-postings.minSalary AND job-postings.maxSalary', { salary });
        }
        const jobPostings = await query.getMany();
        
        if (!jobPostings || jobPostings.length === 0) {
            return ({
                message: 'No jobPostings found',
                status: 204,
                data: {totalResults: jobPostings.length}
            })
        }

        return ({
            message: 'Find all jobPostings success',
            status: 200,
            data: {totalResults: jobPostings.length}
        })
    }

    static handleGetAllJobPostingsByAdmin = async (req) => {
        const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, status, num, page} = req.query;
        let query = jobPostingRepository.createQueryBuilder('job-postings');
        // all jobposting for admin
        query = query.leftJoinAndSelect("job-postings.employer", "employer");
        if ( status) {
            query = query.where('job-postings.status = :status', {status});
        }
        // Public
        if (workAddress) {
            query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        }
        if (jobTitle) {
            query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        }
        if (profession) {
            query = query.andWhere('job-postings.profession = :profession', { profession});
        }
        if (employmentType) {
            query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType});
        }
        if (degree) {
            query = query.andWhere('job-postings.degree = :degree', { degree});
        }
        if (experience) {
            query = query.andWhere('job-postings.experience = :experience', { experience});
        }
        if (positionLevel) {
            query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel});
        }
        if (sex) {
            query = query.andWhere('job-postings.sex = :sex', { sex});
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

        const jobPostings = await query.getMany();
        
        if (!jobPostings || jobPostings.length === 0) {
            return ({
                message: 'No jobPostings found',
                status: 204,
                data: null
            })
        }

        return ({
            message: 'Find all jobPostings success',
            status: 200,
            data: jobPostings
        })
    }

    static handleGetTotalResultsOfAllJobPostingsByAdmin = async (req) => {
        // Update status of job postings when job postings were expried.
        let findExpiredPosts = await jobPostingRepository.find({
            where: {
                applicationDeadline: LessThan(moment(new Date()).subtract(1, 'days').toDate()),
                status: approvalStatus.approved
            }
        })

        findExpiredPosts.map(async (post) => {
            post.status = approvalStatus.expired
            await jobPostingRepository.save(post)
        })

        const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, status} = req.query;
        let query = jobPostingRepository.createQueryBuilder('job-postings');
        // all jobposting for admin
        query = query.leftJoinAndSelect("job-postings.employer", "employer");
        if ( status) {
            query = query.where('job-postings.status = :status', {status});
        }
        // Public
        if (workAddress) {
            query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        }
        if (jobTitle) {
            query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        }
        if (profession) {
            query = query.andWhere('job-postings.profession = :profession', { profession});
        }
        if (employmentType) {
            query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType});
        }
        if (degree) {
            query = query.andWhere('job-postings.degree = :degree', { degree});
        }
        if (experience) {
            query = query.andWhere('job-postings.experience = :experience', { experience});
        }
        if (positionLevel) {
            query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel});
        }
        if (sex) {
            query = query.andWhere('job-postings.sex = :sex', { sex});
        }
        if (salary) {
            query = query.andWhere(':salary BETWEEN job-postings.minSalary AND job-postings.maxSalary', { salary });
        }
        const jobPostings = await query.getMany();
        
        if (!jobPostings || jobPostings.length === 0) {
            return ({
                message: 'No jobPostings found',
                status: 204,
                data: {totalResults: jobPostings.length}
            })
        }

        return ({
            message: 'Find all jobPostings success',
            status: 200,
            data: {totalResults: jobPostings.length}
        })
    }

    static handleGetJobPostingsByEmployer = async (req) => {
        const jobpostings = await jobPostingRepository.find({
            where: { employer: { userId: req.user.userId } },
            relations: ['employer']
        })

        if (!jobpostings) {
            return ({
                message: `User ${req.user.userId} don't have  any job posting`,
                status: 400,
                data: null
            })
        }
        return ({
            message: `Find job postings successful!`,
            status: 200,
            data: jobpostings
        })

    }

    static handleGetJobPosting = async (req) => {
        if (!req?.params?.postId) {
            return ({
                message: 'postId is required',
                status: 400,
                data: null
            })
        }
        const jobPosting = await jobPostingRepository.findOne({
            where: { postId: req.params.postId },
            relations: ['employer']
        })
        if (!jobPosting) {
            return ({
                message: `No Job posting matches postId: ${req.params.postId}`,
                status: 400,
                data: null
            })
        }

        return ({
            message: `Find Job posting has postId: ${req.params.postId} successes`,
            status: 200,
            data: jobPosting
        })
    }

    static handleGetJobPostingByEmployer = async (req) => {
        if (!req?.params?.postId) {
            return ({
                message: 'postId is required',
                status: 400,
                data: null
            })
        }
        const jobPosting = await jobPostingRepository.findOne({
            where: { postId: req.params.postId },
            relations: ['employer', 'applications'],
        })
        if (!jobPosting) {
            return ({
                message: `No Job posting matches postId: ${req.params.postId}`,
                status: 400,
                data: null
            })
        }

        return ({
            message: `Find Job posting has postId: ${req.params.postId} successes`,
            status: 200,
            data: jobPosting
        })
    }

    static handleUpdateJobPosting = async (req) => {
        if (!req?.params?.postId) {
            return ({
                message: 'postId is required',
                status: 400,
                data: null
            })
        }

        const jobPosting = await jobPostingRepository.findOne({
            where: { postId: req.params.postId },
            relations: ['employer.user']
        })
        if (!jobPosting) {
            return ({
                message: `No Job posting matches postId: ${req.params.postId}`,
                status: 400,
                data: null
            })
        }

        if (jobPosting.employer.userId !== req.user.userId) {
            return ({
                message: `You aren't a owner of jobPosting with postId: ${jobPosting.postId}`,
                status: 403,
                data: null
            })
        }

        // Update with req.body
        if (req.body?.name) jobPosting.name = req.body.name
        if (req.body?.email) jobPosting.email = req.body.email
        if (req.body?.phone) jobPosting.phone = req.body.phone
        if (req.body?.contactAddress) jobPosting.contactAddress = req.body.contactAddress
        if (req.body?.workAddress) jobPosting.workAddress = req.body.workAddress

        if (req.body?.jobTitle) jobPosting.jobTitle = req.body.jobTitle
        if (req.body?.profession) jobPosting.profession = req.body.profession
        if (req.body?.employmentType) jobPosting.employmentType = EnumEmploymentType(req.body.employmentType)
        if (req.body?.degree) jobPosting.degree = EnumDegree(req.body.degree)
        if (req.body?.experience) jobPosting.experience = EnumExperience(req.body.experience)
        if (req.body?.positionLevel) jobPosting.positionLevel = EnumPositionLevel(req.body.positionLevel)
        if (req.body?.minAge) jobPosting.minAge = req.body.minAge
        if (req.body?.maxAge) jobPosting.maxAge = req.body.maxAge
        if (req.body?.sex) jobPosting.sex = EnumSex(req.body.sex)
        if (req.body?.numberOfVacancies) jobPosting.numberOfVacancies = req.body.numberOfVacancies
        if (req.body?.trialPeriod) jobPosting.trialPeriod = req.body.trialPeriod
        if (req.body?.applicationDeadline) jobPosting.applicationDeadline = new Date(moment(req.body.applicationDeadline).format("YYYY-MM-DD"));
        if (req.body?.minSalary) jobPosting.minSalary = req.body.minSalary
        if (req.body?.maxSalary) jobPosting.maxSalary = req.body.maxSalary
        if (req.body?.skills) jobPosting.skills = req.body.skills
        if (req.body?.jobDescription) jobPosting.jobDescription = req.body.jobDescription
        if (req.body?.jobRequirements) jobPosting.jobRequirements = req.body.jobRequirements
        if (req.body?.benefits) jobPosting.benefits = req.body.benefits
        if (req.body?.isHidden !== null) jobPosting.isHidden = req.body.isHidden

        await jobPostingRepository.save(jobPosting);
        const createNotification = notificationRepository.create({
            content: 'Bạn đã cập nhật đăng tuyển ' + jobPosting.jobTitle,
            user: jobPosting.employer.user
        })
        await notificationRepository.save(createNotification);

        return ({
            message: `Job posting has postId: ${req.params.postId} are updated successfully`,
            status: 200,
            data: jobPosting
        })
    }

    static handleCreateNewJobPosting = async (req) => {
        // Check parameters
        if (!req?.body?.name || !req?.body?.email || !req?.body?.phone || !req?.body?.contactAddress) {
            return ({
                message: 'Thông tin liên hệ còn thiếu',
                status: 400,
                data: null
            })
        }
        if (!req?.body?.jobTitle || !req?.body?.profession || !req?.body?.employmentType || !req?.body?.degree || !req?.body?.experience ||
            !req?.body?.positionLevel || !req?.body?.numberOfVacancies || !req?.body?.applicationDeadline) {
            return ({
                message: 'Thông tin cơ bản còn thiếu',
                status: 400,
                data: null
            })
        }
        if (!req?.body?.workAddress || !req?.body?.minSalary || !req?.body?.maxSalary) {
            return ({
                message: 'Thông tin địa chỉ làm việc hoặc mức lương còn thiếu',
                status: 400,
                data: null
            })
        }
        if (!req?.body?.jobDescription || !req?.body?.jobRequirements || !req?.body?.benefits) {
            return ({
                message: 'Mô tả công việc còn thiếu',
                status: 400,
                data: null
            })
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
            applicationDeadline: new Date(moment(req.body.applicationDeadline, "DD-MM-YYYY").format("MM-DD-YYYY")),
            minSalary: req.body.minSalary,
            maxSalary: req.body.maxSalary,
            skills: req.body.skills ? req.body.skills : null,
            jobDescription: req.body.jobDescription,
            jobRequirements: req.body.jobRequirements,
            benefits: req.body.benefits,
            submissionCount: 0,
            view: 0,
            isHidden: req?.body?.isHidden ? req.body.isHidden : false
        })
        const post1 = await jobPostingRepository.save(post)

        const user = await employerRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['jobPostings']
        })
        if (!user) {
            return ({
                message: 'User not found',
                status: 400,
                data: null
            })
        }

        user.jobPostings.push(post1);
        await employerRepository.save(user);

        // Add new notification
        const foundUser = await userRepository.findOne({
            where: { userId: req.user.userId }
        })
        if (!foundUser) {
            return ({
                message: 'User not found',
                status: 400,
                data: null
            })
        }
        const createNotification = notificationRepository.create({
            content: 'Đăng tuyển của bạn đang chờ duyệt',
            user: foundUser
        })
        await notificationRepository.save(createNotification);

        return ({
            message: 'Create new job posting successfully',
            status: 200,
            data: post
        })
    }

    static handleUpdateApprovalStatus = async (req) => {
        if (!req?.params?.postId) {
            return ({
                message: 'postId is required',
                status: 400,
                data: null
            })
        }

        const post = await jobPostingRepository.findOne({
            where: { postId: req.params.postId },
            relations: ['employer']
        })
        if (!post) {
            return ({
                message: `No Post matches postId: ${req.params.postId}`,
                status: 400,
                data: null
            })
        }

        // Update with req.body
        if (req.body?.status) post.status = EnumApprovalStatus(req.body.status);

        await jobPostingRepository.save(post)

        return ({
            message: `Status of Post has id: ${req.params.postId} are changed successfully`,
            status: 200,
            data: post
        })
    }
}
