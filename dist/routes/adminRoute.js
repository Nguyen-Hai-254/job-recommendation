"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const verifyRole_1 = require("../middlewares/verifyRole");
const enum_1 = require("../utils/enum");
const adminController_1 = __importDefault(require("../controllers/adminController"));
const route = express_1.default.Router();
route.get('/admin/get-job-postings-report', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), adminController_1.default.jobPostingsReport);
route.get('/admin/get-job-postings-report-by-query', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), adminController_1.default.getJobPostingsReportByQuery);
route.get('/admin/candidate-statistics', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), adminController_1.default.candidateStatistics);
route.get('/admin/candidate-statistics-by-query', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), adminController_1.default.candidateStatisticsByQuery);
route.get('/admin/get-all-user', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), adminController_1.default.getAllUser);
route.get('/admin/get-total-user', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), adminController_1.default.getTotalUser);
route.post('/admin/send-email', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), adminController_1.default.sendEmail);
route.post('/admin/search-email-or-name', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), adminController_1.default.searchEmailOrName);
exports.default = route;
//# sourceMappingURL=adminRoute.js.map