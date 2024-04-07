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
route.put('/api/v1/employee/online-profile/another-degree/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateAnotherDegree);
route.delete('/api/v1/employee/online-profile/another-degree/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.deleteAnotherDegree);

route.post('/api/v1/employee/online-profile/education-information', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewEducationInformation);
route.put('/api/v1/employee/online-profile/education-information/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateEducationInformation);
route.delete('/api/v1/employee/online-profile/education-information/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.deleteEducationInformation);

route.post('/api/v1/employee/online-profile/work-experience', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewWorkExperience);
route.put('/api/v1/employee/online-profile/work-experience/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateWorkExperience);
route.delete('/api/v1/employee/online-profile/work-experience/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.deleteWorkExperience);

route.get('/api/v1/admin/employees', verifyToken, verifyRole(userRole.Admin), EmployeeController.getEmployeesByAdmin);
route.get('/api/v1/admin/employees/totalResults', verifyToken, verifyRole(userRole.Admin), EmployeeController.getLengthOfEmployeesByAdmin);
route.get('/api/v1/employer/employees', verifyToken, verifyRole(userRole.Employer), EmployeeController.getEmployeesByEmployer);
route.get('/api/v1/employer/employees/totalResults', verifyToken, verifyRole(userRole.Employer), EmployeeController.getLengthOfEmployeesByEmployer);
route.get('/api/v1/employer/employees/sortbykeywords', verifyToken, verifyRole(userRole.Employer), EmployeeController.getEmployeesByEmployerSortByKeywords);

export default route