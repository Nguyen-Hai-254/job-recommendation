import express from "express"
import { verifyToken } from "../middleware/auth";
import ApplicationController from "../controllers/applicationController";
const route = express.Router()

route.post('/api/v1/employee/applications', verifyToken, ApplicationController.createNewApplication);
route.get('/api/v1/admin/applications', verifyToken, ApplicationController.getAllApplications);
route.get('/api/v1/employee/applications', verifyToken, ApplicationController.getApplicationsbyEmployee);
route.get('/api/v1/employer/applications', verifyToken, ApplicationController.getApplicationsbyEmployer);
route.get('/api/v1/employee/applications/:id', verifyToken, ApplicationController.getApplication);
route.put('/api/v1/employer/job-postings/applications/:id', verifyToken, ApplicationController.updateApprovalStatus);

export default route