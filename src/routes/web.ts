import express from "express";
import userRoute from "./userRoute"
import postRoute from "./postRoute"
import applicationRoute from "./applicationRoute"
import employeeRoute from "./employeeRoute"
const route = express.Router();


route.use('/', userRoute)
route.use('/', postRoute)
route.use('/', applicationRoute)
route.use('/', employeeRoute)

module.exports = route