import express from "express";
import userRoute from "./userRoute"
import postRoute from "./postRoute"
import applicationRoute from "./applicationRoute"
import employeeRoute from "./employeeRoute"
import utilsRoute from "./utilsRoute"
const route = express.Router();


route.use('/', userRoute)
route.use('/', postRoute)
route.use('/', applicationRoute)
route.use('/', employeeRoute)
route.use('/', utilsRoute)

module.exports = route