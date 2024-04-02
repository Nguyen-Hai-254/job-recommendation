import express from "express"
import { verifyToken } from "../middleware/auth";
import JobPostingController from "../controllers/jobPostingController";
import { verifyRole } from "../middleware/verifyRole";
import { userRole } from "../utils/enum";
const route = express.Router()

route.get('/api/v1/job-postings', JobPostingController.getAllJobPostings);
route.get('/api/v1/job-postings/totalResults', JobPostingController.getLengthOfAllJobPostings);
route.get('/api/v1/job-postings/totalResultsOfProfession', JobPostingController.getTotalResultsOfProfession);
route.get('/api/v1/admin/job-postings/totalResultsOfProfession', verifyToken, verifyRole(userRole.Admin), JobPostingController.getTotalResultsOfProfessionByAdmin);
route.get('/api/v1/admin/job-postings', verifyToken, verifyRole(userRole.Admin), JobPostingController.getAllJobPostingsByAdmin);
route.get('/api/v1/admin/job-postings/totalResults', verifyToken, verifyRole(userRole.Admin), JobPostingController.getLengthOfAllJobPostingsByAdmin);
route.get('/api/v1/job-postings/:postId', JobPostingController.getJobPosting);

route.get('/api/v1/employer/job-postings', verifyToken, verifyRole(userRole.Employer), JobPostingController.getJobPostingsByEmployer);
route.get('/api/v1/employer/job-postings/:postId', verifyToken, verifyRole(userRole.Employer), JobPostingController.getJobPostingByEmployer);
route.post('/api/v1/employer/job-postings', verifyToken, verifyRole(userRole.Employer), JobPostingController.createNewJobPosting);
route.put('/api/v1/employer/job-postings/:postId', verifyToken, verifyRole(userRole.Employer), JobPostingController.updateJobPosting);

route.put('/api/v1/admin/job-postings/:postId', verifyToken, verifyRole(userRole.Admin), JobPostingController.updateApprovalStatus);



export default route