import  express  from "express";
import { verifyToken } from "../middlewares/auth";
import { verifyRole } from "../middlewares/verifyRole";
import { userRole } from "../utils/enum";
import FollowController from "../controllers/followController";

const route = express.Router()

route.post('/employee/follow-company', verifyToken, verifyRole(userRole.Employee), FollowController.followCompany);
route.get('/employee/follow-company', verifyToken, verifyRole(userRole.Employee), FollowController.getFollowByEmployee);

route.post('/employer/save-employee', verifyToken, verifyRole(userRole.Employer), FollowController.saveEmployee);
route.get('/employer/save-employee', verifyToken, verifyRole(userRole.Employer), FollowController.getSaveEmployeeByEmployer);

route.post('/employee/follow-job', verifyToken, verifyRole(userRole.Employee), FollowController.followJobPosting);
route.get('/employee/follow-job', verifyToken, verifyRole(userRole.Employee), FollowController.getFollowJobPosting);


export default route