import express from "express"
import { verifyToken } from "../middlewares/auth";
import { verifyRole } from "../middlewares/verifyRole";
import { userRole } from "../utils/enum";
import AdminController from "../controllers/adminController";
const route = express.Router()

route.get('/admin/get-job-postings-report', verifyToken, verifyRole(userRole.Admin), AdminController.jobPostingsReport);
route.get('/admin/get-job-postings-report-by-query', verifyToken, verifyRole(userRole.Admin), AdminController.getJobPostingsReportByQuery);
route.get('/admin/candidate-statistics', verifyToken, verifyRole(userRole.Admin), AdminController.candidateStatistics);
route.get('/admin/candidate-statistics-by-query', verifyToken, verifyRole(userRole.Admin), AdminController.candidateStatisticsByQuery);
route.get('/admin/get-all-user', verifyToken, verifyRole(userRole.Admin), AdminController.getAllUser);
route.get('/admin/get-total-user', verifyToken, verifyRole(userRole.Admin), AdminController.getTotalUser);

route.post('/admin/send-email', verifyToken, verifyRole(userRole.Admin), AdminController.sendEmail);
route.post('/admin/search-email-or-name', verifyToken, verifyRole(userRole.Admin), AdminController.searchEmailOrName);

export default route