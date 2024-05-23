import express from "express"
import { verifyToken } from "../middlewares/auth";
import { verifyRole } from "../middlewares/verifyRole";
import { paginationParser } from "../middlewares/paginationParser";
import JobPostingController from "../controllers/jobPostingController";
import { userRole } from "../utils/enum";
const route = express.Router()

route.get('/job-postings', paginationParser, JobPostingController.getAllJobPostings);
route.get('/job-postings/totalResultsOfProfession', JobPostingController.getTotalResultsOfProfession);
route.get('/job-postings/:postId', JobPostingController.getJobPosting);

route.get('/employer/job-postings', verifyToken, verifyRole(userRole.Employer), paginationParser, JobPostingController.getJobPostingsByEmployer);
route.get('/employer/job-postings/:postId', verifyToken, verifyRole(userRole.Employer), JobPostingController.getJobPostingByEmployer);
route.post('/employer/job-postings', verifyToken, verifyRole(userRole.Employer), JobPostingController.createNewJobPosting);
route.put('/employer/job-postings/:postId', verifyToken, verifyRole(userRole.Employer), JobPostingController.updateJobPosting);
route.delete('/employer/job-postings/:postId', verifyToken, verifyRole(userRole.Employer), JobPostingController.deleteJobPosting);

route.get('/admin/job-postings', verifyToken, verifyRole(userRole.Admin), paginationParser, JobPostingController.getAllJobPostingsByAdmin);
route.get('/admin/job-postings/totalResultsOfProfession', verifyToken, verifyRole(userRole.Admin), JobPostingController.getTotalResultsOfProfessionByAdmin);
route.put('/admin/job-postings/:postId', verifyToken, verifyRole(userRole.Admin), JobPostingController.UpdateJobPostingByAdmin);

export default route