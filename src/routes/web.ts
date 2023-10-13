import express from "express";
import userRoute from "./userRoute"
import postRoute from "./postRoute"
import applicationRoute from "./applicationRoute"
const route = express.Router();


route.use('/', userRoute)
route.use('/', postRoute)
route.use('/', applicationRoute)

module.exports = route