import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User } from "../entity/Users"
import { userRole } from "../utils/enum"
import { JobPosting } from "../entity/JobPosting"
import { Application } from "../entity/Application"
import { AttachedDocument } from "../entity/AttachedDocument"
import { OnlineProfile } from "../entity/OnlineProfile"
import { EnumDegree, EnumEmploymentType, EnumExperience, EnumPositionLevel } from "../utils/enumAction"
import { Notification } from "../entity/Notification"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const jobpostingRepository = myDataSource.getRepository(JobPosting);
const applicationRepository = myDataSource.getRepository(Application);
const attached_documentRepository = myDataSource.getRepository(AttachedDocument);
const online_profileRepository = myDataSource.getRepository(OnlineProfile);
const notificationRepository = myDataSource.getRepository(Notification);

export default class EmployeeServices {
    static handleCreateNewAttachedDocument = async (req) => {
        // Check general information
        if (!req?.body?.jobTitle || !req?.body?.profession || !req?.body?.currentPosition ||
            !req?.body?.desiredPosition || !req?.body?.desiredSalary || !req?.body?.degree ||
            !req?.body?.workAddress || !req?.body?.experience || !req?.body?.employmentType) {
            return ({
                message: 'general information is required',
                status: 400,
                data: null
            })
        }
        // Check other information
        if (!req?.body?.CV) {
            return ({
                message: 'CV is required',
                status: 400,
                data: null
            })
        }
        // Check user is employee ?
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
        // Check attached document exists?
        const exist = await attached_documentRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee']
        })
        if (exist) {
            return ({
                message: `Attached document has userId: ${req.user.userId} already exists`,
                status: 400,
                data: null
            })
        }
        // Create new  attached document
        const attached_document = await attached_documentRepository.create({
            userId: foundUser.userId,
            jobTitle: req.body.jobTitle,
            profession: req.body.profession,
            currentPosition: req.body.currentPosition,
            desiredPosition: req.body.desiredPosition,
            desiredSalary: req.body.desiredSalary,
            degree: req.body.degree,
            workAddress: req.body.workAddress,
            experience: req.body.experience,
            employmentType: req.body.employmentType,
            careerGoal: req.body.careerGoal,
            skills: req.body.skills,
            CV: req.body.CV,
            view: 0,
            isHidden: req?.body?.isHidden ? req.body.isHidden : false
        })

        await attached_documentRepository.save(attached_document);
        const createNotification = notificationRepository.create({
            content: 'Bạn đã tạo hồ sơ đính kèm',
            user: foundUser
        })
        await notificationRepository.save(createNotification);


        return ({
            message: 'Tạo hồ sơ đính kèm thành công',
            status: 200,
            data: attached_document
        })
    }

    static handleCreateNewOnlineProfile = async (req) => {
        // Check general information
        if (!req?.body?.jobTitle || !req?.body?.profession || !req?.body?.currentPosition ||
            !req?.body?.desiredPosition || !req?.body?.desiredSalary || !req?.body?.degree ||
            !req?.body?.workAddress || !req?.body?.experience || !req?.body?.employmentType) {
            return ({
                message: 'general information is required',
                status: 400,
                data: null
            })
        }
        // Check other information
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
        // Check online profile exists?
        const exist = await online_profileRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee']
        })
        if (exist) {
            return ({
                message: `Online profile has userId: ${req.user.userId} already exists`,
                status: 400,
                data: null
            })
        }
        // Create new online profile
        const online_profile = await online_profileRepository.create({
            userId: foundUser.userId,
            jobTitle: req.body.jobTitle,
            profession: req.body.profession,
            currentPosition: req.body.currentPosition,
            desiredPosition: req.body.desiredPosition,
            desiredSalary: req.body.desiredSalary,
            degree: req.body.degree,
            workAddress: req.body.workAddress,
            experience: req.body.experience,
            employmentType: req.body.employmentType,
            careerGoal: req.body.careerGoal,
            skills: req.body.skills,
            view: 0,
            isHidden: req?.body?.isHidden ? req.body.isHidden : false
        })

        await online_profileRepository.save(online_profile);
        const createNotification = notificationRepository.create({
            content: 'Bạn đã tạo hồ sơ trực tuyến',
            user: foundUser
        })
        await notificationRepository.save(createNotification);

        return ({
            message: 'Tạo hồ sơ trực tuyến thành công',
            status: 200,
            data: online_profile
        })
    }

    static handleUpdateAttachedDocument = async (req) => {
        // Check attached document exists?
        const attached_document = await attached_documentRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee']
        })
        if (!attached_document) {
            return ({
                message: `No attached document matches userId: ${req.user.userId}`,
                status: 400,
                data: null
            })
        }

        // Update with req.body
        // general information
        if (req.body?.jobTitle) attached_document.jobTitle = req.body.jobTitle
        if (req.body?.profession) attached_document.profession = req.body.profession
        if (req.body?.currentPosition) attached_document.currentPosition = EnumPositionLevel(req.body.currentPosition)
        if (req.body?.desiredPosition) attached_document.desiredPosition = EnumPositionLevel(req.body.desiredPosition)
        if (req.body?.desiredSalary) attached_document.desiredSalary = req.body.desiredSalary
        if (req.body?.degree) attached_document.degree = EnumDegree(req.body.degree)
        if (req.body?.workAddress) attached_document.workAddress = req.body.workAddress
        if (req.body?.experience) attached_document.experience = EnumExperience(req.body.experience);
        if (req.body?.employmentType) attached_document.employmentType = EnumEmploymentType(req.body.employmentType);
        if (req.body?.careerGoal) attached_document.careerGoal = req.body.careerGoal
        if (req.body?.skills) attached_document.skills = req.body.skills
        // other information
        if (req.body?.CV) attached_document.CV = req.body.CV
        if (req.body?.isHidden) attached_document.isHidden = req.body.isHidden

        await attached_documentRepository.save(attached_document);
        const findUser = await userRepository.findOne({
            where: { userId: req.user.userId }
        })
        if (!findUser) {
            return ({
                message: `Không tìm thấy người dùng`,
                status: 400,
                data: null
            })
        }
        const createNotification = notificationRepository.create({
            content: 'Bạn đã cập nhật hồ sơ đính kèm',
            user: findUser
        })
        await notificationRepository.save(createNotification);

        return ({
            message: `attached document has userId: ${req.user.userId} are updated successfully`,
            status: 200,
            data: attached_document
        })

    }

    static handleUpdateOnlineProfile = async (req) => {
        // Check online profile exists?
        const online_profile = await online_profileRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee']
        })
        if (!online_profile) {
            return ({
                message: `No online profile matches userId: ${req.user.userId}`,
                status: 400,
                data: null
            })
        }

        // Update with req.body
        // general information
        if (req.body?.jobTitle) online_profile.jobTitle = req.body.jobTitle
        if (req.body?.profession) online_profile.profession = req.body.profession
        if (req.body?.currentPosition) online_profile.currentPosition = EnumPositionLevel(req.body.currentPosition)
        if (req.body?.desiredPosition) online_profile.desiredPosition = EnumPositionLevel(req.body.desiredPosition)
        if (req.body?.desiredSalary) online_profile.desiredSalary = req.body.desiredSalary
        if (req.body?.degree) online_profile.degree = EnumDegree(req.body.degree)
        if (req.body?.workAddress) online_profile.workAddress = req.body.workAddress
        if (req.body?.experience) online_profile.experience = EnumExperience(req.body.experience);
        if (req.body?.employmentType) online_profile.employmentType = EnumEmploymentType(req.body.employmentType);
        if (req.body?.careerGoal) online_profile.careerGoal = req.body.careerGoal
        if (req.body?.skills) online_profile.skills = req.body.skills
        // other information
        if (req.body?.isHidden) online_profile.isHidden = req.body.isHidden

        await online_profileRepository.save(online_profile);
        const findUser = await userRepository.findOneBy({
            userId: req.user.userId
        })
        if (!findUser) {
            return ({
                message: `Không tìm thấy người dùng`,
                status: 400,
                data: null
            })
        }
        const createNotification = notificationRepository.create({
            content: 'Bạn đã cập nhật hồ sơ trực tuyến',
            user: findUser
        })
        await notificationRepository.save(createNotification);



        return ({
            message: `online profile has userId: ${req.user.userId} are updated successfully`,
            status: 200,
            data: online_profile
        })

    }
}

