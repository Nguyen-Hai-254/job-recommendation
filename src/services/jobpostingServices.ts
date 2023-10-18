import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User } from "../entity/Users"
import { userRole } from "../utils/enum"
import { JobPosting } from "../entity/JobPosting"
import moment from "moment"
import { EnumEmploymentType, EnumDegree, EnumExperience, EnumPositionLevel, EnumSex, EnumApprovalStatus } from "../utils/enumAction"
import { Notification } from "../entity/Notification"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const jobPostingRepository = myDataSource.getRepository(JobPosting);
const notificationRepository = myDataSource.getRepository(Notification);

export default class JobPostingServices {
    static handleGetAllJobPostings = async () => {
        const jobPostings = await jobPostingRepository.find({
            relations: ['employer']
        })
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

    static handleGetJobPostingsByUser = async (req) => {
        const getJobPostings = await employerRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['jobPostings']
        })

        if (!getJobPostings) {
            return ({
                message: `User ${req.user.userId} don't have  any job posting`,
                status: 400,
                data: null
            })
        }
        return ({
            message: `Find jobPostings successful!`,
            status: 200,
            data: getJobPostings.jobPostings
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

    static handleGetJobPostingByUser = async (req) => {
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
        if (req.body?.applicationDeadline) jobPosting.applicationDeadline = new Date(moment(req.body.applicationDeadline, "DD-MM-YYYY").format("MM-DD-YYYY"));
        if (req.body?.minSalary) jobPosting.minSalary = req.body.minSalary
        if (req.body?.maxSalary) jobPosting.maxSalary = req.body.maxSalary
        if (req.body?.skills) jobPosting.skills = req.body.skills
        if (req.body?.jobDescription) jobPosting.jobDescription = req.body.jobDescription
        if (req.body?.jobRequirements) jobPosting.jobRequirements = req.body.jobRequirements
        if (req.body?.benefits) jobPosting.benefits = req.body.benefits
        if (req.body?.isHidden) jobPosting.isHidden = req.body.isHidden

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
        // Check user is employer?
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
        if (foundUser.role !== userRole.Employer) {
            return ({
                message: `You aren't a employer, You cannot implement this request`,
                status: 401,
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
            // publishingDate: new Date(moment(new Date(), "DD-MM-YYYY").format("MM-DD-YYYY")),
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
        if (!req?.params?.id) {
            return ({
                message: 'id is required',
                status: 400,
                data: null
            })
        }

        const post = await jobPostingRepository.findOne({
            where: { postId: req.params.id },
            relations: ['employer']
        })
        if (!post) {
            return ({
                message: `No Post matches id: ${req.params.id}`,
                status: 400,
                data: null
            })
        }

        // Update with req.body
        if (req.body?.status) post.status = EnumApprovalStatus(req.body.status)

        await jobPostingRepository.save(post)

        return ({
            message: `Status of Post has id: ${req.params.id} are changed successfully`,
            status: 200,
            data: post
        })
    }
}
