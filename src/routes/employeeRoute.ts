import express from "express"
import { verifyToken } from "../middleware/auth";
import EmployeeController from "../controllers/employeeController";
const route = express.Router()

route.post('/api/v1/employee/attached-document', verifyToken, EmployeeController.createNewAttachedDocument);
route.post('/api/v1/employee/online-profile', verifyToken, EmployeeController.createNewOnlineProfile);
route.put('/api/v1/employee/attached-document', verifyToken, EmployeeController.updateAttachedDocument);
route.put('/api/v1/employee/online-profile', verifyToken, EmployeeController.updateOnlineProfile);

export default route