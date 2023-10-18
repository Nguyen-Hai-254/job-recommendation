import express from "express"
import { verifyToken } from "../middleware/auth";
import { verifyRole } from "../middleware/verifyRole";
import EmployeeController from "../controllers/employeeController";
import { userRole } from "../utils/enum";
const route = express.Router()

route.post('/api/v1/employee/attached-document', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewAttachedDocument);
route.post('/api/v1/employee/online-profile', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewOnlineProfile);
route.put('/api/v1/employee/attached-document', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateAttachedDocument);
route.put('/api/v1/employee/online-profile', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateOnlineProfile);

export default route