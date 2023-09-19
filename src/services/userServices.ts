import { myDataSource } from "../config/connectDB"
import { User } from "../entity/Users"

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

        const createUser = await userRepository.create({
            email: email,
            password: password
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

        if (password !== findUser.password) {
            return ({
                message: 'Wrong password!',
                status: 200,
                data: null
            })
        }

        return ({
            message: 'Login successful!',
            status: 200,
            data: findUser
        })
    }
}