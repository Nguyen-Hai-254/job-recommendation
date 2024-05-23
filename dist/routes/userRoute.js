"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_1 = require("../middlewares/auth");
const verifyRole_1 = require("../middlewares/verifyRole");
const enum_1 = require("../utils/enum");
const paginationParser_1 = require("../middlewares/paginationParser");
const route = express_1.default.Router();
route.get('/get-information-company-by-user', userController_1.default.getInformationCompanyByUser);
route.get('/get-all-company-by-user', paginationParser_1.paginationParser, userController_1.default.getAllCompanyByUser);
route.get('/get-profile', auth_1.verifyToken, userController_1.default.getProfile);
route.post('/edit-profile', auth_1.verifyToken, userController_1.default.editProfile);
route.get('/get-information-company', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), userController_1.default.getInformationCompany);
route.post('/edit-information-company', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), userController_1.default.editInformationCompany);
route.post('/user/upload-avatar', auth_1.verifyToken, userController_1.default.uploadAvatar);
route.post('/user/upload-logo', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), userController_1.default.uploadLogo);
route.post('/user/upload-banner', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), userController_1.default.uploadBanner);
route.delete('/users/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), userController_1.default.deleteUser);
route.get('/user/online-profile', auth_1.verifyToken, userController_1.default.getOnlineProfileByUser);
route.get('/user/attached-document', auth_1.verifyToken, userController_1.default.getAttachedDocumentByUser);
exports.default = route;
//# sourceMappingURL=userRoute.js.map