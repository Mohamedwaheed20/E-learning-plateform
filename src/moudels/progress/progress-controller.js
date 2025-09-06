import Router from"express";
import * as progressService from"./service/progress-service.js"
import { errorHandler } from "../../middelware/error-handler-middelware.js";
const progresscontroller=Router()
progresscontroller.get("/getstudentprogress/:student_id",errorHandler(progressService.getStudentProgress))
export default progresscontroller