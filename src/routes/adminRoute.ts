import express from "express"
import { verifyToken } from "../middleware/auth";
import { verifyRole } from "../middleware/verifyRole";
import { userRole } from "../utils/enum";
import AdminController from "../controllers/adminController"; ``
const route = express.Router()

route.get('/api/v1/admin/get-job-postings-report', verifyToken, verifyRole(userRole.Admin), AdminController.jobPostingsReport);
route.get('/api/v1/admin/get-job-postings-report-by-query', verifyToken, verifyRole(userRole.Admin), AdminController.getJobPostingsReportByQuery);
route.get('/api/v1/admin/candidate-statistics', verifyToken, verifyRole(userRole.Admin), AdminController.candidateStatistics);
route.get('/api/v1/admin/candidate-statistics-by-query', verifyToken, verifyRole(userRole.Admin), AdminController.candidateStatisticsByQuery);
route.get('/api/v1/admin/get-all-user', verifyToken, verifyRole(userRole.Admin), AdminController.getAllUser);
route.get('/api/v1/admin/get-total-user', verifyToken, verifyRole(userRole.Admin), AdminController.getTotalUser);

route.post('/api/v1/admin/send-email', verifyToken, verifyRole(userRole.Admin), AdminController.sendEmail);
route.post('/api/v1/admin/search-email-or-name', verifyToken, verifyRole(userRole.Admin), AdminController.searchEmailOrName);

export default route