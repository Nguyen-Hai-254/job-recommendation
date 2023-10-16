import express from "express"
import { verifyToken } from "../middleware/auth";
import JobpostingController from "../controllers/jobpostingController.";
const route = express.Router()

route.get('/api/v1/jobpostings', JobpostingController.getAllJobpostings);
route.post('/api/v1/jobpostings', verifyToken, JobpostingController.createNewJobposting);
route.get('/api/v1/jobpostings/user', verifyToken, JobpostingController.getJobpostingsbyUser);
route.get('/api/v1/jobpostings/:postId', JobpostingController.getJobposting);
route.put('/api/v1/jobpostings/:postId', verifyToken, JobpostingController.updateJobposting);



export default route