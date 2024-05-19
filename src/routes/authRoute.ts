import express from "express"
import { verifyToken } from "../middleware/auth";
import AuthController from "../controllers/authController";
const route = express.Router()

route.post('/api/v1/auth/register', AuthController.register);
route.post('/api/v1/auth/login', AuthController.login);
route.get('/api/v1/auth/logout', verifyToken, AuthController.logOut);
route.post('/api/v1/auth/change-password', verifyToken, AuthController.changePassword);
route.post('/api/v1/auth/request-password-reset', AuthController.requestPasswordReset);
route.post('/api/v1/auth/reset-password', AuthController.resetPassword);

export default route