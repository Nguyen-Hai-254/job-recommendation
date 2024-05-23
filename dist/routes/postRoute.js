"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const verifyRole_1 = require("../middlewares/verifyRole");
const paginationParser_1 = require("../middlewares/paginationParser");
const jobPostingController_1 = __importDefault(require("../controllers/jobPostingController"));
const enum_1 = require("../utils/enum");
const route = express_1.default.Router();
route.get('/job-postings', paginationParser_1.paginationParser, jobPostingController_1.default.getAllJobPostings);
route.get('/job-postings/totalResultsOfProfession', jobPostingController_1.default.getTotalResultsOfProfession);
route.get('/job-postings/:postId', jobPostingController_1.default.getJobPosting);
route.get('/employer/job-postings', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), paginationParser_1.paginationParser, jobPostingController_1.default.getJobPostingsByEmployer);
route.get('/employer/job-postings/:postId', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), jobPostingController_1.default.getJobPostingByEmployer);
route.post('/employer/job-postings', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), jobPostingController_1.default.createNewJobPosting);
route.put('/employer/job-postings/:postId', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), jobPostingController_1.default.updateJobPosting);
route.delete('/employer/job-postings/:postId', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), jobPostingController_1.default.deleteJobPosting);
route.get('/admin/job-postings', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), paginationParser_1.paginationParser, jobPostingController_1.default.getAllJobPostingsByAdmin);
route.get('/admin/job-postings/totalResultsOfProfession', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), jobPostingController_1.default.getTotalResultsOfProfessionByAdmin);
route.put('/admin/job-postings/:postId', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), jobPostingController_1.default.UpdateJobPostingByAdmin);
exports.default = route;
//# sourceMappingURL=postRoute.js.map