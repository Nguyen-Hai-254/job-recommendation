"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const applicationController_1 = __importDefault(require("../controllers/applicationController"));
const verifyRole_1 = require("../middleware/verifyRole");
const enum_1 = require("../utils/enum");
const route = express_1.default.Router();
route.get('/api/v1/employee/applications', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), applicationController_1.default.getApplicationsbyEmployee);
route.get('/api/v1/employee/applications/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), applicationController_1.default.getApplication);
route.post('/api/v1/employee/applications', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employee), applicationController_1.default.createNewApplication);
route.get('/api/v1/employer/applications', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), applicationController_1.default.getApplicationsbyEmployer);
route.get('/api/v1/employer/applications/totalResults', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), applicationController_1.default.getLengthOfApplicationsbyEmployer);
route.get('/api/v1/employer/applications/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), applicationController_1.default.getApplicationbyEmployer);
route.put('/api/v1/employer/applications/:id', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), applicationController_1.default.updateApplicationbyEmployer);
route.get('/api/v1/admin/applications', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), applicationController_1.default.getAllApplications);
exports.default = route;
//# sourceMappingURL=applicationRoute.js.map