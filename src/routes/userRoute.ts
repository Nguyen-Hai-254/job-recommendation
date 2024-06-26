import express from "express"
import UserController from "../controllers/userController";
import { verifyToken } from "../middlewares/auth";
import { verifyRole } from "../middlewares/verifyRole";
import { userRole } from "../utils/enum";
import { paginationParser } from "../middlewares/paginationParser";
const route = express.Router()

route.get('/get-information-company-by-user', UserController.getInformationCompanyByUser);
route.get('/get-all-company-by-user', paginationParser, UserController.getAllCompanyByUser);
route.get('/get-profile', verifyToken, UserController.getProfile);
route.post('/edit-profile', verifyToken, UserController.editProfile);
route.get('/get-information-company', verifyToken,verifyRole(userRole.Employer), UserController.getInformationCompany);
route.post('/edit-information-company', verifyToken, verifyRole(userRole.Employer), UserController.editInformationCompany);
route.post('/user/upload-avatar', verifyToken, UserController.uploadAvatar);
route.post('/user/upload-logo', verifyToken, verifyRole(userRole.Employer), UserController.uploadLogo);
route.post('/user/upload-banner', verifyToken, verifyRole(userRole.Employer), UserController.uploadBanner);
route.delete('/users/:id', verifyToken, verifyRole(userRole.Admin), UserController.deleteUser);

export default route