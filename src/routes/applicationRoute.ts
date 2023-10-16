import express from "express"
import { verifyToken } from "../middleware/auth";
import ApplicationController from "../controllers/applicationController";
const route = express.Router()

route.post('/api/v1/employee/applications', verifyToken, ApplicationController.createNewApplication);
route.get('/api/v1/admin/applications', verifyToken, ApplicationController.getAllApplications);
route.get('/api/v1/employee/applications', verifyToken, ApplicationController.getApplicationsbyUser);
route.get('/api/v1/employee/applications/:id', verifyToken, ApplicationController.getApplication);
route.put('/api/v1/admin/applications/:id', verifyToken, ApplicationController.updateStatusAdmin);

export default route