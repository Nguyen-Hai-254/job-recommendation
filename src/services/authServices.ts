import { HttpException } from "../exceptions/httpException"
import { myDataSource } from "../config/connectDB"
import { User } from "../entity/Users"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { MySQLErrorCode } from "../utils/enum"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import RedisServices from "./redisServices";
import MailServices from "../services/mailServices";
import UserServices from "../services/userServices";



export const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

const userRepository = myDataSource.getRepository(User);
const employeeRepository = myDataSource.getRepository(Employee);
const employerRepository = myDataSource.getRepository(Employer);


export default class AuthServices {
    static handleRegister = async (email, password, confirmPassword, role) => {
        if (password != confirmPassword) throw new HttpException(400, 'Password does not match confirm password');
        if (role.toLowerCase() === 'admin') throw new HttpException(403, 'You do not have permission to register a admin account'); 
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassWord = await bcrypt.hash(password, salt);    
            const createUser = userRepository.create({
                email: email,
                password: hashPassWord,
                role: role
            })
            const user = await userRepository.save(createUser);

            if (role.toLowerCase() === 'employer') {
                const createEmployer = employerRepository.create({userId: user.userId});
                await employerRepository.save(createEmployer);
            }
            else if (role.toLowerCase() === 'employee') {
                const createEmployee = employeeRepository.create({userId: user.userId});
                await employeeRepository.save(createEmployee);
            }
            return {
                userId: user.userId,
                email: user.email,
                role: user.role
            }
        } catch (err) {
            if (err.code === MySQLErrorCode.DUPLICATE) {
                throw new HttpException(409, 'Email already exists!')
            }
            throw err;
        }

    }

    static handleLogin = async (email, password) => {
        const findUser = await userRepository
            .createQueryBuilder('user')
            .select("user")
            .addSelect("user.password")
            .where('user.email = :email', { email })
            .getOne()

        if (!findUser) throw new HttpException(409, "Email not found");
        const checkUserPassword = await bcrypt.compare(password, findUser.password);

        if (!checkUserPassword) throw new HttpException(401, "Password incorrect");

        const payload = {
            userId: findUser.userId,
            email: findUser.email,
            role: findUser.role,
        }
        const token = createToken(payload)
      
        return {
            access_token: token,
            userData: payload
        }
    }

    static handleChangePassword = async (email, password, newPassword, confirmNewPassword) => {
        if (newPassword != confirmNewPassword) {
            throw new HttpException(400, 'new Password does not match new confirm password')
        }
        const findUser = await userRepository
            .createQueryBuilder('user')
            .select("user")
            .addSelect("user.password")
            .where('user.email = :email', { email })
            .getOne();
        if (!findUser) throw new HttpException(404 , `Your's email is't exist`);
        
        const checkUserPassword = await bcrypt.compare(password, findUser.password);
        if (!checkUserPassword) throw new HttpException(401, 'Your password is incorrect');

        const salt = await bcrypt.genSalt(10);
        const hashPassWord = await bcrypt.hash(newPassword, salt);
        findUser.password = hashPassWord;
        await findUser.save();
        return {
            userId: findUser.userId,
            email: findUser.email,
            role: findUser.role
        };
    }

    static hanldeRequestPasswordReset = async (email) => {
        const userId  = await UserServices.getUserIdByEmail(email);

        const token = this.generatePasswordResetToken();
        const expiresAt = new Date().getTime() + 10 * 60 * 1000; // Mã xác thực có hiệu lực 10 phút

        await this.storePasswordResetToken(userId, token, expiresAt);
        await MailServices.sendTokenForResetPassword(email, token);
    }

    static handleResetPassword = async (email, token, newPassword) => {
        const findUser = await userRepository.findOneBy({ email: email });
        if (!findUser) throw new HttpException(404 , `Your's email is't exist`);

        const isTokenValid = await this.verifyPasswordResetToken(findUser.userId, token);
        if (!isTokenValid) throw new HttpException(401, 'Invalid token');

        const salt = await bcrypt.genSalt(10);
        const hashPassWord = await bcrypt.hash(newPassword, salt);
        findUser.password = hashPassWord;
        await findUser.save();
        return {
            userId: findUser.userId,
            email: findUser.email,
            role: findUser.role
        };

    }

    static generatePasswordResetToken = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã xác thực 6 số ngẫu nhiên
    }
    
    static storePasswordResetToken = async (userId, token, expiresAt) => {
        await RedisServices.setPasswordResetToken(userId, token, expiresAt);
    }
    
    static verifyPasswordResetToken = async (userId, token) => {
        const storedToken = await RedisServices.getPasswordResetToken(userId);
        return storedToken === token;
    }
}