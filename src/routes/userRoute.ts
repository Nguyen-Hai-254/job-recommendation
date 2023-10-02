import express from "express"
import UserController from "../controllers/userController";
import { verifyToken } from "../middleware/auth";
const route = express.Router()

route.post('/api/v1/register', UserController.register);
route.post('/api/v1/login', UserController.login);
route.get('/api/v1/logout', verifyToken, UserController.logOut);
route.get('/api/v1/profile', verifyToken, UserController.getProfile);
route.post('/api/v1/profile', verifyToken, UserController.editProfile);

export default route