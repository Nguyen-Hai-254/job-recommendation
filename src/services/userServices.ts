require('dotenv').config()
import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User, sex } from "../entity/Users"
import { createToken } from "../utils/JWTAction"
import bcrypt from "bcrypt"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);

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
                    status: 200,
                    data: null
                })
            }

            return ({
                message: 'Email already exists!',
                status: 200,
                data: null
            })
        }

        if (password != confirmPassword) {
            return ({
                message: 'Password does not match confirm password',
                status: 200,
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
            // data: {
            //     email: userData.email,
            //     role: userData.role
            // }
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
                status: 200,
                data: null
            })
        }

        const checkUserPassword = await bcrypt.compare(password, findUser.password);

        if (!checkUserPassword) {
            return ({
                message: 'Wrong password!',
                status: 200,
                data: null
            })
        }

        let payload = {
            userId: findUser.userId,
            email: findUser.email,
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

    static handleEditProfile = async (user, body) => {
        let employer = await userRepository.findOne({
            where: { userId: user.userId }
        })

        if (!employer) {
            return ({
                message: `This account isn't registered`,
                status: 200,
                data: null
            })
        }

        employer.name = body.name;
        if (body.sex == 1) {
            employer.sex = sex.Male
        }
        else if (body.sex == 2) {
            employer.sex = sex.Female
        }
        else {
            employer.sex = sex.Other
        }

        await userRepository.save(employer);

        return ({
            message: 'Update your profile successful!',
            status: 200,
            data: {
                name: employer.name,
                sex: employer.sex
            }
        })
    }
}