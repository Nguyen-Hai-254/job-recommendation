"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const jobPostingController_1 = __importDefault(require("../controllers/jobPostingController"));
const verifyRole_1 = require("../middleware/verifyRole");
const enum_1 = require("../utils/enum");
const route = express_1.default.Router();
route.get('/api/v1/job-postings', jobPostingController_1.default.getAllJobPostings);
route.get('/api/v1/job-postings/totalResults', jobPostingController_1.default.getLengthOfAllJobPostings);
route.get('/api/v1/job-postings/totalResultsOfProfession', jobPostingController_1.default.getTotalResultsOfProfession);
route.get('/api/v1/admin/job-postings/totalResultsOfProfession', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), jobPostingController_1.default.getTotalResultsOfProfessionByAdmin);
route.get('/api/v1/admin/job-postings', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), jobPostingController_1.default.getAllJobPostingsByAdmin);
route.get('/api/v1/admin/job-postings/totalResults', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), jobPostingController_1.default.getLengthOfAllJobPostingsByAdmin);
route.get('/api/v1/job-postings/:postId', jobPostingController_1.default.getJobPosting);
route.get('/api/v1/employer/job-postings', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), jobPostingController_1.default.getJobPostingsByEmployer);
route.get('/api/v1/employer/job-postings/:postId', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), jobPostingController_1.default.getJobPostingByEmployer);
route.post('/api/v1/employer/job-postings', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), jobPostingController_1.default.createNewJobPosting);
route.put('/api/v1/employer/job-postings/:postId', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), jobPostingController_1.default.updateJobPosting);
route.delete('/api/v1/employer/job-postings/:postId', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Employer), jobPostingController_1.default.deleteJobPosting);
route.put('/api/v1/admin/job-postings/:postId', auth_1.verifyToken, (0, verifyRole_1.verifyRole)(enum_1.userRole.Admin), jobPostingController_1.default.updateApprovalStatus);
exports.default = route;
//# sourceMappingURL=postRoute.js.map