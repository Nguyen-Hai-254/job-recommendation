import express from "express"
import { verifyToken } from "../middleware/auth";
import ApplicationController from "../controllers/applicationController";
const route = express.Router()

route.post('/api/v1/applications', verifyToken, ApplicationController.createNewApplication);
route.get('/api/v1/applications', verifyToken, ApplicationController.getAllApplications);
route.get('/api/v1/applications/user', verifyToken, ApplicationController.getApplicationsbyUser);
route.get('/api/v1/applications/:id', verifyToken, ApplicationController.getApplication);
route.put('/api/v1/applications/:id', verifyToken, ApplicationController.updateApplication);

export default route