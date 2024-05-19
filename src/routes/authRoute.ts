import express from "express"
import { verifyToken } from "../middleware/auth";
import AuthController from "../controllers/authController";
const route = express.Router()

route.post('/api/v1/auth/register', AuthController.register);
route.post('/api/v1/auth/login', AuthController.login);
route.get('/api/v1/auth/logout', verifyToken, AuthController.logOut);
route.post('/api/v1/auth/password', verifyToken, AuthController.resetPassword);

export default route