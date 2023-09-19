import express from "express";
import userRoute from "./userRoute"
import postRoute from "./postRoute"
const route = express.Router();


route.use('/', userRoute)
route.use('/', postRoute)

module.exports = route