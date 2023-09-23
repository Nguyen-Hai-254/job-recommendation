require('dotenv').config()
import { myDataSource } from "../config/connectDB"
import { User } from "../entity/Users"
import { createToken } from "../utils/JWTAction"
import bcrypt from "bcrypt"

const userRepository = myDataSource.getRepository(User);

export default class UserServices {
    static handleRegister = async (email, password, confirmPassword) => {
        const checkEmail = await userRepository.findOne({ where: { email: email } })

        if (checkEmail) {
            return ({
                message: 'Email already exists!',
                status: 200,
                data: null
            })
        }

        if (password != confirmPassword) {
            return ({
                message: 'Password does not match confirm password',
                // error: null,
                status: 200,
                data: null
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassWord = await bcrypt.hash(password, salt);

        const createUser = await userRepository.create({
            email: email,
            password: hashPassWord
        })
        const userData = await userRepository.save(createUser)

        return ({
            message: 'Create user successful!',
            // error: null,
            status: 200,
            data: userData
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
                userId: findUser.userId,
                email: findUser.email
            }

        })
    }
}