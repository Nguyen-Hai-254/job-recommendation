import express from "express"
import { verifyToken } from "../middleware/auth";
import JobPostingController from "../controllers/jobPostingController";
const route = express.Router()

route.get('/api/v1/job-postings', JobPostingController.getAllJobPostings);
route.post('/api/v1/job-postings', verifyToken, JobPostingController.createNewJobPosting);
route.get('/api/v1/job-postings/user', verifyToken, JobPostingController.getJobPostingsByUser);
route.get('/api/v1/job-postings/:postId', verifyToken, JobPostingController.getJobPosting);
route.put('/api/v1/job-postings/:postId', verifyToken, JobPostingController.updateJobPosting);



export default route