import express from "express"
import { verifyToken } from "../middlewares/auth";
import { verifyRole } from "../middlewares/verifyRole";
import { paginationParser } from "../middlewares/paginationParser";
import ApplicationController from "../controllers/applicationController";
import { userRole } from "../utils/enum";
const route = express.Router()

route.get('/employee/applications', verifyToken, verifyRole(userRole.Employee), paginationParser, ApplicationController.getApplicationsbyEmployee);
route.get('/employee/applications/:id', verifyToken, verifyRole(userRole.Employee), ApplicationController.getApplication);
route.post('/employee/applications', verifyToken, verifyRole(userRole.Employee), ApplicationController.createNewApplication);

route.get('/employee/job-postings/:postId/applied', verifyToken, verifyRole(userRole.Employee), ApplicationController.getCheckApplied)

route.get('/employer/applications', verifyToken, verifyRole(userRole.Employer), paginationParser, ApplicationController.getApplicationsbyEmployer);
route.get('/employer/applications/:id', verifyToken, verifyRole(userRole.Employer), ApplicationController.getApplicationbyEmployer);
route.put('/employer/applications/:id', verifyToken, verifyRole(userRole.Employer), ApplicationController.updateApplicationbyEmployer);

route.get('/admin/applications', verifyToken, verifyRole(userRole.Admin), paginationParser, ApplicationController.getApplicationsByAdmin);

export default route