import express from "express"
import UserController from "../controllers/userController";
const route = express.Router()

route.post('/api/v1/register', UserController.register);
route.post('/api/v1/login', UserController.login);

export default route