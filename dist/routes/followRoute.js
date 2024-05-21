"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const verifyRole_1 = require("../middlewares/verifyRole");
const enum_1 = require("../utils/enum");
const followController_1 = __importDefault(require("../controllers/followController"));
const route = express_1.default.Router();
route.post('/employee/follow-company', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), followController_1.default.followCompany);
route.get('/employee/follow-company', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), followController_1.default.getFollowByEmployee);
route.post('/employer/save-employee', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), followController_1.default.saveEmployee);
route.get('/employer/save-employee', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), followController_1.default.getSaveEmployeeByEmployer);
route.post('/employee/follow-job', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), followController_1.default.followJobPosting);
route.get('/employee/follow-job', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), followController_1.default.getFollowJobPosting);
exports.default = route;
//# sourceMappingURL=followRoute.js.map