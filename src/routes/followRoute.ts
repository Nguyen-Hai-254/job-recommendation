import  express  from "express";
import { verifyToken } from "../middleware/auth";
import { verifyRole } from "../middleware/verifyRole";
import { userRole } from "../utils/enum";
import FollowController from "../controllers/followController";

const route = express.Router()

route.post('/api/v1/employee/follow-company', verifyToken, verifyRole(userRole.Employee), FollowController.followCompany);
route.get('/api/v1/employee/follow-company', verifyToken, verifyRole(userRole.Employee), FollowController.getFollowByEmployee);

route.post('/api/v1/employer/save-employee', verifyToken, verifyRole(userRole.Employer), FollowController.saveEmployee);
route.get('/api/v1/employer/save-employee', verifyToken, verifyRole(userRole.Employer), FollowController.getSaveEmployeeByEmployer);

route.post('/api/v1/employee/follow-job', verifyToken, verifyRole(userRole.Employee), FollowController.followJobPosting);
route.get('/api/v1/employee/follow-job', verifyToken, verifyRole(userRole.Employee), FollowController.getFollowJobPosting);


export default route