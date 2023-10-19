import express from "express"
import { verifyToken } from "../middleware/auth";
import { verifyRole } from "../middleware/verifyRole";
import EmployeeController from "../controllers/employeeController";
import { userRole } from "../utils/enum";
const route = express.Router()

route.get('/api/v1/employee/attached-document', verifyToken, verifyRole(userRole.Employee), EmployeeController.getAttachedDocument);
route.post('/api/v1/employee/attached-document', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewAttachedDocument);
route.put('/api/v1/employee/attached-document', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateAttachedDocument);
route.get('/api/v1/employee/online-profile', verifyToken, verifyRole(userRole.Employee), EmployeeController.getOnlineProfile);
route.post('/api/v1/employee/online-profile', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewOnlineProfile);
route.put('/api/v1/employee/online-profile', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateOnlineProfile);
route.post('/api/v1/employee/online-profile/another-degree', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewAnotherDegree);
route.post('/api/v1/employee/online-profile/education-information', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewEducationInformation);
route.post('/api/v1/employee/online-profile/work-experience', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewWorkExperience);
export default route