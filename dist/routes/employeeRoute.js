"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const verifyRole_1 = require("../middleware/verifyRole");
const employeeController_1 = __importDefault(require("../controllers/employeeController"));
const enum_1 = require("../utils/enum");
const route = express_1.default.Router();
route.get('/employee/attached-document', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.getAttachedDocument);
route.post('/employee/attached-document', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.createNewAttachedDocument);
route.put('/employee/attached-document', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.updateAttachedDocument);
route.delete('/admin/attached-document/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), employeeController_1.default.deleteAttachedDocument);
route.get('/employee/online-profile', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.getOnlineProfile);
route.post('/employee/online-profile', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.createNewOnlineProfile);
route.put('/employee/online-profile', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.updateOnlineProfile);
route.delete('/admin/online-profile/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), employeeController_1.default.deleteOnlineProfile);
route.post('/employee/online-profile/another-degree', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.createNewAnotherDegree);
route.put('/employee/online-profile/another-degree/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.updateAnotherDegree);
route.delete('/employee/online-profile/another-degree/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.deleteAnotherDegree);
route.post('/employee/online-profile/education-information', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.createNewEducationInformation);
route.put('/employee/online-profile/education-information/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.updateEducationInformation);
route.delete('/employee/online-profile/education-information/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.deleteEducationInformation);
route.post('/employee/online-profile/work-experience', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.createNewWorkExperience);
route.put('/employee/online-profile/work-experience/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.updateWorkExperience);
route.delete('/employee/online-profile/work-experience/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), employeeController_1.default.deleteWorkExperience);
route.get('/admin/employees', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), employeeController_1.default.getEmployeesByAdmin);
route.get('/admin/employees/totalResults', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), employeeController_1.default.getLengthOfEmployeesByAdmin);
route.get('/employer/employees', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), employeeController_1.default.getEmployeesByEmployer);
route.get('/employer/employees/totalResults', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), employeeController_1.default.getLengthOfEmployeesByEmployer);
route.get('/employer/employees/sortbykeywords', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), employeeController_1.default.getEmployeesByEmployerSortByKeywords);
exports.default = route;
//# sourceMappingURL=employeeRoute.js.map