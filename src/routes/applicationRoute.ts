import express from "express"
import { verifyToken } from "../middleware/auth";
import ApplicationController from "../controllers/applicationController";
import { verifyRole } from "../middleware/verifyRole";
import { userRole } from "../utils/enum";
const route = express.Router()

route.get('/employee/applications', verifyToken, verifyRole(userRole.Employee), ApplicationController.getApplicationsbyEmployee);
route.get('/employee/applications/:id', verifyToken, verifyRole(userRole.Employee), ApplicationController.getApplication);
route.post('/employee/applications', verifyToken, verifyRole(userRole.Employee), ApplicationController.createNewApplication);

route.get('/employer/applications', verifyToken, verifyRole(userRole.Employer), ApplicationController.getApplicationsbyEmployer);
route.get('/employer/applications/totalResults', verifyToken, verifyRole(userRole.Employer), ApplicationController.getLengthOfApplicationsbyEmployer);
route.get('/employer/applications/:id', verifyToken, verifyRole(userRole.Employer), ApplicationController.getApplicationbyEmployer);
route.put('/employer/applications/:id', verifyToken, verifyRole(userRole.Employer), ApplicationController.updateApplicationbyEmployer);

route.get('/admin/applications', verifyToken, verifyRole(userRole.Admin), ApplicationController.getAllApplications);

export default route