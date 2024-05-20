import { tokenFromCookie, tokenFromHeader } from "../middleware/auth";
import { HttpException } from "../exceptions/httpException";
import AuthServices from "../services/authServices";
import respondSuccess from "../utils/respondSuccess";


export default class AuthController {
    static register = async (req, res, next) => {
        try {
            const { email, password, confirmPassword, role } = req.body;
            if (!email || !password || !confirmPassword || !role) throw new HttpException(400, 'Invalid email, password, confirm password or role');

            const data = await AuthServices.handleRegister(email, password, confirmPassword, role);
            return respondSuccess(res, 'Register account successfully', data, 201);
        } catch (error) {
            next(error);
        }
    }

    static login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) throw new HttpException(400, 'Invalid email or password');

            const data = await AuthServices.handleLogin(email, password);
            res.cookie('jwt', data.access_token, { httpOnly: true, expiresIn: data.expiresIn })

            return respondSuccess(res, 'login successfully', data);
        } catch (error) {
            next(error);
        }
    }

    static logOut = async (req, res, next) => {
        try {
            const jwt1 = await tokenFromHeader(req);
            const jwt2 = await tokenFromCookie(req);   
            res.clearCookie('jwt');
            const data = req.user;
            if (req.user) req.user = null;

            await AuthServices.handleLogout(jwt1, jwt2);
            return respondSuccess(res, "You've been logged out!", data.email);
        } catch (error) {
            next(error);
        }
    }

    static changePassword = async (req, res, next) => {
        try {
            const { email } = req.user;
            const { password, newPassword, confirmNewPassword } = req.body;
            if (!email || !password || !newPassword || !confirmNewPassword) {
                throw new HttpException(400, 'Invalid input');
            }
            
            const userData = await AuthServices.handleChangePassword(email, password, newPassword, confirmNewPassword);
            return respondSuccess(res, 'Change password successfully', userData);

        } catch (error) {
            next(error);
        }
    }

    static requestPasswordReset = async (req, res, next) => {
        try {
            const { email } = req.body;
            if (!email ) throw new HttpException(400, 'Email is required');

            await AuthServices.hanldeRequestPasswordReset(email);
            return respondSuccess(res, 'Password reset instructions have been sent to your email');
        } catch (error) {
            next(error);
        }
    }
    
    static resetPassword = async (req, res, next) => {
        try {
            const { email, token, newPassword } = req.body;
            if (!email || !token || !newPassword) {
                throw new HttpException(400, 'email, token and new password are required');
            } 
            const userData = await AuthServices.handleResetPassword(email, token, newPassword);
            return respondSuccess(res, 'Password reset successfully.', userData);
        } catch (error) {
            next(error);
        }
    }
}
