import express from "express"
import { verifyToken } from "../middleware/auth";
import ApplicationController from "../controllers/applicationController";
import { verifyRole } from "../middleware/verifyRole";
import { userRole } from "../utils/enum";
const route = express.Router()

route.get('/api/v1/employee/applications', verifyToken, verifyRole(userRole.Employee), ApplicationController.getApplicationsbyEmployee);
route.get('/api/v1/employee/applications/:id', verifyToken, verifyRole(userRole.Employee), ApplicationController.getApplication);
route.post('/api/v1/employee/applications', verifyToken, verifyRole(userRole.Employee), ApplicationController.createNewApplication);

route.get('/api/v1/employer/applications', verifyToken, verifyRole(userRole.Employer), ApplicationController.getApplicationsbyEmployer);
route.get('/api/v1/employer/applications/totalResults', verifyToken, verifyRole(userRole.Employer), ApplicationController.getLengthOfApplicationsbyEmployer);
route.get('/api/v1/employer/applications/:id', verifyToken, verifyRole(userRole.Employer), ApplicationController.getApplicationbyEmployer);
route.put('/api/v1/employer/applications/:id', verifyToken, verifyRole(userRole.Employer), ApplicationController.updateApprovalStatus);

route.get('/api/v1/admin/applications', verifyToken, verifyRole(userRole.Admin), ApplicationController.getAllApplications);

export default route