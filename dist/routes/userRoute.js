"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_1 = require("../middleware/auth");
const verifyRole_1 = require("../middleware/verifyRole");
const enum_1 = require("../utils/enum");
const route = express_1.default.Router();
route.post('/api/v1/register', userController_1.default.register);
route.post('/api/v1/login', userController_1.default.login);
route.post('/api/v1/password', auth_1.verifyToken, userController_1.default.resetPassword);
route.get('/api/v1/get-information-company-by-user', userController_1.default.getInformationCompanyByUser);
route.get('/api/v1/get-all-company-by-user', userController_1.default.getAllCompanyByUser);
route.get('/api/v1/logout', auth_1.verifyToken, userController_1.default.logOut);
route.get('/api/v1/get-profile', auth_1.verifyToken, userController_1.default.getProfile);
route.post('/api/v1/edit-profile', auth_1.verifyToken, userController_1.default.editProfile);
route.get('/api/v1/get-information-company', auth_1.verifyToken, userController_1.default.getInformationCompany);
route.post('/api/v1/edit-information-company', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), userController_1.default.editInformationCompany);
route.post('/api/v1/user/upload-avatar', auth_1.verifyToken, userController_1.default.uploadAvatar);
route.post('/api/v1/user/upload-logo', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), userController_1.default.uploadLogo);
route.post('/api/v1/user/upload-banner', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), userController_1.default.uploadBanner);
route.delete('/api/v1/users/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), userController_1.default.deleteUser);
route.get('/api/v1/user/online-profile', auth_1.verifyToken, userController_1.default.getOnlineProfileByUser);
route.get('/api/v1/user/attached-document', auth_1.verifyToken, userController_1.default.getAttachedDocumentByUser);
exports.default = route;
//# sourceMappingURL=userRoute.js.map