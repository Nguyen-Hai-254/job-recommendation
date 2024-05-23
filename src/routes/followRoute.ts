import  express  from "express";
import { verifyToken } from "../middlewares/auth";
import { verifyRole } from "../middlewares/verifyRole";
import { paginationParser } from "../middlewares/paginationParser";
import { userRole } from "../utils/enum";
import FollowController from "../controllers/followController";

const route = express.Router()

route.post('/employee/follow-company', verifyToken, verifyRole(userRole.Employee), FollowController.followCompany);
route.get('/employee/follow-company', verifyToken, verifyRole(userRole.Employee), paginationParser, FollowController.getFollowByEmployee);

route.post('/employer/save-employee', verifyToken, verifyRole(userRole.Employer), FollowController.saveEmployee);
route.get('/employer/save-employee', verifyToken, verifyRole(userRole.Employer), paginationParser, FollowController.getSaveEmployeeByEmployer);

route.post('/employee/follow-job', verifyToken, verifyRole(userRole.Employee), FollowController.followJobPosting);
route.get('/employee/follow-job', verifyToken, verifyRole(userRole.Employee), paginationParser, FollowController.getFollowJobPosting);


export default route