"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const verifyRole_1 = require("../middlewares/verifyRole");
const paginationParser_1 = require("../middlewares/paginationParser");
const applicationController_1 = __importDefault(require("../controllers/applicationController"));
const enum_1 = require("../utils/enum");
const route = express_1.default.Router();
route.get('/employee/applications', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), paginationParser_1.paginationParser, applicationController_1.default.getApplicationsbyEmployee);
route.get('/employee/applications/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), applicationController_1.default.getApplication);
route.post('/employee/applications', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), applicationController_1.default.createNewApplication);
route.get('/employee/job-postings/:postId/applied', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), applicationController_1.default.getCheckApplied);
route.get('/employer/applications', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), paginationParser_1.paginationParser, applicationController_1.default.getApplicationsbyEmployer);
route.get('/employer/applications/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), applicationController_1.default.getApplicationbyEmployer);
route.put('/employer/applications/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), applicationController_1.default.updateApplicationbyEmployer);
route.get('/admin/applications', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), paginationParser_1.paginationParser, applicationController_1.default.getApplicationsByAdmin);
exports.default = route;
//# sourceMappingURL=applicationRoute.js.map