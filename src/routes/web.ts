import express from "express";
import userRoute from "./userRoute"
import postRoute from "./postRoute"
import applicationRoute from "./applicationRoute"
import employeeRoute from "./employeeRoute"
import utilsRoute from "./utilsRoute"
import followRoute from "./followRoute"
import adminRoute from './adminRoute'
import authRoute from "./authRoute";
import Notification  from "./notificationRoute";
const route = express.Router();

route.use('/', authRoute)
route.use('/', userRoute)
route.use('/', postRoute)
route.use('/', applicationRoute)
route.use('/', employeeRoute)
route.use('/', utilsRoute)
route.use('/', followRoute)
route.use('/', adminRoute)
route.use('/', Notification)

module.exports = route