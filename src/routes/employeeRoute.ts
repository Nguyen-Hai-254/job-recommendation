import express from "express"
import { verifyToken } from "../middlewares/auth";
import { verifyRole } from "../middlewares/verifyRole";
import { paginationParser } from "../middlewares/paginationParser";
import EmployeeController from "../controllers/employeeController";
import { userRole } from "../utils/enum";
const route = express.Router()

route.get('/employee/attached-document', verifyToken, verifyRole(userRole.Employee), EmployeeController.getAttachedDocument);
route.post('/employee/attached-document', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewAttachedDocument);
route.put('/employee/attached-document', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateAttachedDocument);
route.delete('/admin/attached-document/:id', verifyToken, verifyRole(userRole.Admin), EmployeeController.deleteAttachedDocument);

route.get('/employee/online-profile', verifyToken, verifyRole(userRole.Employee), EmployeeController.getOnlineProfile);
route.post('/employee/online-profile', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewOnlineProfile);
route.put('/employee/online-profile', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateOnlineProfile);
route.delete('/admin/online-profile/:id', verifyToken, verifyRole(userRole.Admin), EmployeeController.deleteOnlineProfile);

route.post('/employee/online-profile/another-degree', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewAnotherDegree);
route.put('/employee/online-profile/another-degree/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateAnotherDegree);
route.delete('/employee/online-profile/another-degree/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.deleteAnotherDegree);

route.post('/employee/online-profile/education-information', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewEducationInformation);
route.put('/employee/online-profile/education-information/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateEducationInformation);
route.delete('/employee/online-profile/education-information/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.deleteEducationInformation);

route.post('/employee/online-profile/work-experience', verifyToken, verifyRole(userRole.Employee), EmployeeController.createNewWorkExperience);
route.put('/employee/online-profile/work-experience/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.updateWorkExperience);
route.delete('/employee/online-profile/work-experience/:id', verifyToken, verifyRole(userRole.Employee), EmployeeController.deleteWorkExperience);

route.get('/employer/employees', verifyToken, verifyRole(userRole.Employer), paginationParser, EmployeeController.getEmployeesByEmployer);
route.get('/employer/employees/applied', verifyToken, verifyRole(userRole.Employer), EmployeeController.getCheckEmployeesAppliedByEmployer);
route.get('/employer/employees/sortbykeywords', verifyToken, verifyRole(userRole.Employer), paginationParser, EmployeeController.getEmployeesByEmployerSortByKeywords);
route.get('/employer/employees/:id', verifyToken, verifyRole(userRole.Employer), EmployeeController.getEmployeeJobApplicationByEmployer);

route.get('/admin/employees', verifyToken, verifyRole(userRole.Admin), paginationParser, EmployeeController.getEmployeesByAdmin);

export default route