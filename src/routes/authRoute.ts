import express from "express"
import { verifyToken } from "../middlewares/auth";
import AuthController from "../controllers/authController";
const route = express.Router()

route.post('/auth/register', AuthController.register);
route.post('/auth/login', AuthController.login);
route.get('/auth/logout', verifyToken, AuthController.logOut);
route.post('/auth/change-password', verifyToken, AuthController.changePassword);
route.post('/auth/request-password-reset', AuthController.requestPasswordReset);
route.post('/auth/reset-password', AuthController.resetPassword);

export default route