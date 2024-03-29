import express from "express"
import { verifyToken } from "../middleware/auth";
import { verifyRole } from "../middleware/verifyRole";
import { userRole } from "../utils/enum";
import AdminController from "../controllers/adminController";
const route = express.Router()

route.get('/api/v1/admin/get-job-postings-report', verifyToken, verifyRole(userRole.Admin), AdminController.jobPostingsReport);
// route.get('/api/v1/admin/get-all-user', verifyToken, verifyRole(userRole.Admin), AdminController.getAllUser);
route.get('/api/v1/admin/get-all-user', AdminController.getAllUser);
route.get('/api/v1/admin/get-total-user', AdminController.getTotalUser);

export default route