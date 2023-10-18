import express from "express"
import { verifyToken } from "../middleware/auth";
import JobPostingController from "../controllers/jobPostingController";
import { verifyRole } from "../middleware/verifyRole";
import { userRole } from "../utils/enum";
const route = express.Router()

route.get('/api/v1/job-postings', JobPostingController.getAllJobPostings);
route.post('/api/v1/job-postings', verifyToken, verifyRole(userRole.Employer), JobPostingController.createNewJobPosting);
route.get('/api/v1/job-postings/user', verifyToken, verifyRole(userRole.Employer), JobPostingController.getJobPostingsByUser);
route.get('/api/v1/job-postings/:postId', JobPostingController.getJobPosting);
route.get('/api/v1/job-postings/user/:postId', verifyToken, verifyRole(userRole.Employer), JobPostingController.getJobPostingByUser);
route.put('/api/v1/job-postings/:postId', verifyToken, verifyRole(userRole.Employer), JobPostingController.updateJobPosting);
route.put('/api/v1/admin/job-postings/:id', verifyToken, verifyRole(userRole.Admin), JobPostingController.updateApprovalStatus);



export default route