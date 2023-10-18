require('dotenv').config()
import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { Notification } from "../entity/Notification"
import { OnlineProfile } from "../entity/OnlineProfile"
import { User } from "../entity/Users"
import { sex, userRole } from "../utils/enum"
import { EnumDegree } from "../utils/enumAction"
import { createToken } from "../utils/JWTAction"
import bcrypt from "bcrypt"
import moment from "moment"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const notificationRepository = myDataSource.getRepository(Notification);
const online_profileRepository = myDataSource.getRepository(OnlineProfile);

export default class UserServices {
    static handleRegister = async (email, password, confirmPassword, role) => {
        const checkEmail = await userRepository.findOne({
            where: { email: email },
            relations: ['employer']
        })

        if (checkEmail) {
            if (checkEmail.employer?.userId) {
                return ({
                    message: 'This email is registered as an employer',
                    status: 409,
                    data: null
                })
            }

            return ({
                message: 'Email already exists!',
                status: 409,
                data: null
            })
        }

        if (password != confirmPassword) {
            return ({
                message: 'Password does not match confirm password',
                status: 400,
                data: null
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassWord = await bcrypt.hash(password, salt);

        const createUser = await userRepository.create({
            email: email,
            password: hashPassWord,
            role: role
        })
        const userData = await userRepository.save(createUser)

        if (role === 'employer' || role === 'EMPLOYER' || role === 'Employer') {
            const createEmployer = await employerRepository.create({
                userId: userData.userId
            });
            await employerRepository.save(createEmployer);
        }
        else if (role === 'admin') {

        }
        else {
            const createEmployee = await employeeRepository.create({
                userId: userData.userId
            });
            await employeeRepository.save(createEmployee);
        }

        return ({
            message: 'Create user successful!',
            status: 200,
        })
    }

    static handleLogin = async (email, password) => {
        const findUser = await userRepository.findOne({
            where: {
                email: email
            }
        })

        if (!findUser) {
            return ({
                message: `Your's email is't exist`,
                status: 404,
                data: null
            })
        }

        const checkUserPassword = await bcrypt.compare(password, findUser.password);

        if (!checkUserPassword) {
            return ({
                message: 'Wrong password!',
                status: 401,
                data: null
            })
        }

        let payload = {
            userId: findUser.userId,
            email: findUser.email,
            role: findUser.role,
            expireIn: process.env.JWT_EXPIRE_IN
        }
        let token = createToken(payload)

        return ({
            message: 'Login successful!',
            status: 200,
            data: {
                access_token: token,
                userData: {
                    userId: findUser.userId,
                    email: findUser.email,
                    role: findUser.role
                }
            }
        })
    }

    static handleGetProfile = async (user) => {
        const getUserProfile = await userRepository.findOne({
            where: { userId: user.userId },
            relations: ['employee']
        })

        if (!getUserProfile) {
            return ({
                message: `This account isn't registered`,
                status: 404,
                data: null
            })
        }

        return ({
            message: 'OK!',
            status: 200,
            data: {
                userId: getUserProfile.userId,
                email: getUserProfile.email,
                name: getUserProfile.name,
                role: getUserProfile.role,
                dob: moment(getUserProfile.dob).format("DD-MM-YYYY"),
                address: getUserProfile.address,
                phone: getUserProfile.phone,
                sex: getUserProfile.sex,
                isMarried: getUserProfile.employee?.isMarried ? getUserProfile.employee.isMarried : null
            }
        })
    }

    static handleEditProfile = async (user, body) => {
        let findUser = await userRepository.findOne({
            where: { userId: user.userId },
            relations: ['employee']
        })

        if (!findUser) {
            return ({
                message: `This account isn't registered`,
                status: 404,
                data: null
            })
        }

        findUser.name = body.name ? body.name : null;
        findUser.dob = new Date(moment(body.dob, "DD-MM-YYYY").format("MM-DD-YYYY"));
        findUser.address = body.address ? body.address : null;
        findUser.phone = body.phone ? body.phone : null;

        if (body.sex == 1) {
            findUser.sex = sex.Male
        }
        else if (body.sex == 2) {
            findUser.sex = sex.Female
        }
        else {
            findUser.sex = sex.Other
        }

        if (findUser.employee) {
            findUser.employee.isMarried = body.isMarried === '1' ? true : false;
            await employeeRepository.save(findUser.employee);
        }

        await userRepository.save(findUser);

        const createNotification = notificationRepository.create({
            content: 'Bạn đã cập nhật thông tin cá nhân',
            user: findUser
        })
        await notificationRepository.save(createNotification);

        return ({
            message: 'Update your profile successful!',
            status: 200,
            data: {
                userId: findUser.userId,
                email: findUser.email,
                name: findUser.name,
                dob: moment(findUser.dob).format("DD-MM-YYYY"),
                address: findUser.address,
                phone: findUser.phone,
                sex: findUser.sex,
                isMarried: findUser.employee?.isMarried ? findUser.employee.isMarried : null
            }
        })
    }

    static handleGetInformationCompany = async (user) => {
        const getEmployer = await userRepository.findOne({
            where: { userId: user.userId },
            relations: ['employer']
        })

        if (!getEmployer) {
            return ({
                message: `This account isn't registered`,
                status: 404,
                data: null
            })
        }

        if (getEmployer.role !== userRole.Employer) {
            return ({
                message: `You are not a employer`,
                status: 403,
                data: null
            })
        }

        return ({
            message: `Edit your company successful!`,
            status: 200,
            data: {
                userId: getEmployer.userId,
                email: getEmployer.email,
                name: getEmployer.name,
                role: getEmployer.role,
                taxCode: getEmployer.employer.taxCode,
                companyName: getEmployer.employer.companyName,
                companyLocation: getEmployer.employer.companyLocation,
                careerField: getEmployer.employer.careerField,
            }
        })
    }

    static handleEditInformationCompany = async (user, body) => {
        let findEmployer = await userRepository.findOne({
            where: { userId: user.userId },
            relations: ['employer']
        })

        if (!findEmployer) {
            return ({
                message: `This account isn't registered`,
                status: 404,
                data: null
            })
        }

        if (findEmployer.role !== userRole.Employer) {
            return ({
                message: `You are not a employer`,
                status: 403,
                data: null
            })
        }

        findEmployer.employer.taxCode = body.taxCode;
        findEmployer.employer.companyName = body.companyName;
        findEmployer.employer.companyLocation = body.companyLocation;
        findEmployer.employer.careerField = body.careerField;

        await employerRepository.save(findEmployer.employer);

        const createNotification = notificationRepository.create({
            content: 'Bạn đã cập nhật thông tin công ty của bạn',
            user: findEmployer
        })
        await notificationRepository.save(createNotification);

        return ({
            message: `Edit your company successful!`,
            status: 200,
            data: {
                userId: findEmployer.userId,
                email: findEmployer.email,
                name: findEmployer.name,
                role: findEmployer.role,
                taxCode: findEmployer.employer.taxCode,
                companyName: findEmployer.employer.companyName,
                companyLocation: findEmployer.employer.companyLocation,
                careerField: findEmployer.employer.careerField,
            }
        })
    }
}