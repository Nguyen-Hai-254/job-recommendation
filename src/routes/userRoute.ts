import express from "express"
import UserController from "../controllers/userController";
import { verifyToken } from "../middleware/auth";
import { verifyRole } from "../middleware/verifyRole";
import { userRole } from "../utils/enum";
const route = express.Router()

route.post('/api/v1/register', UserController.register);
route.post('/api/v1/login', UserController.login);
route.get('/api/v1/logout', verifyToken, UserController.logOut);
route.get('/api/v1/get-profile', verifyToken, UserController.getProfile);
route.post('/api/v1/edit-profile', verifyToken, UserController.editProfile);
route.get('/api/v1/get-information-company', verifyToken, UserController.getInformationCompany);
route.post('/api/v1/edit-information-company', verifyToken, verifyRole(userRole.Employer), UserController.editInformationCompany);
route.post('/api/v1/user/upload-avatar', verifyToken, UserController.uploadAvatar);
route.post('/api/v1/user/upload-logo', verifyToken, verifyRole(userRole.Employer), UserController.uploadLogo);
route.post('/api/v1/user/upload-banner', verifyToken, verifyRole(userRole.Employer), UserController.uploadBanner);

export default route