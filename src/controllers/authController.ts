import { HttpException } from "../exceptions/httpException";
import AuthServices from "../services/authServices";

export default class AuthController {
    static register = async (req, res, next) => {
        try {
            const { email, password, confirmPassword, role } = req.body;
            if (!email || !password || !confirmPassword || !role) throw new HttpException(400, 'Invalid email, password, confirm password or role');

            const data = await AuthServices.handleRegister(email, password, confirmPassword, role);
            return res.status(201).json({message: 'Register account successfully', data: data});
        } catch (error) {
            next(error);
        }
    }

    static login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) throw new HttpException(400, 'Invalid email or password');

            const data = await AuthServices.handleLogin(email, password);
            res.cookie("jwt", data.access_token, { httpOnly: true })

            return res.status(200).json({message: 'login successfully', data: data});
        } catch (error) {
            next(error);
        }
    }

    static logOut = async (req, res, next) => {
        try {
            res.setHeader('jwt', ['Authorization=; Max-age=0']);
            res.clearCookie("jwt");
            const data = req.user;
            if (req.user) req.user = null;
            return res.status(200).json({message: 'Logged out!', data: data});
        } catch (error) {
            next(error);
        }
    }

    static resetPassword = async (req, res, next) => {
        try {
            const { email } = req.user;
            const { password, newPassword, confirmNewPassword } = req.body;
            if (!email || !password || !newPassword || !confirmNewPassword) {
                throw new HttpException(400, 'Invalid input');
            }
            
            const userData = await AuthServices.handleResetPassword(email, password, newPassword, confirmNewPassword);
            return res.status(200).json({message: 'Reset password successfully', data: userData});

        } catch (error) {
            next(error);
        }
    }
}