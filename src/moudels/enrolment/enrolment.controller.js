import Router from "express";

import * as enrolmentService from "./service/enrolment-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
const enrolmentcontroller=Router()
enrolmentcontroller.post("/enrollincourse",errorHandler(enrolmentService.enrollInCourse))
enrolmentcontroller.get("/getenrolments",errorHandler(enrolmentService.getAllEnrolmentsController))
enrolmentcontroller.get("/getenrolmentbyid/:_id",errorHandler(enrolmentService.getEnrolmentByIdController))
enrolmentcontroller.get("/getenrolmentsbystudent/:student_id",errorHandler(enrolmentService.getEnrolmentsByStudentController))
enrolmentcontroller.put("/updateenrolment/:_id",errorHandler(enrolmentService.updateEnrolmentController))
enrolmentcontroller.delete("/deleteenrolment/:_id",errorHandler(enrolmentService.deleteEnrolmentController))
enrolmentcontroller.post("/addcompletedlesson",errorHandler(enrolmentService.addCompletedLessonController))
enrolmentcontroller.get("/getcourseprogressforstudents/:course_id",errorHandler(enrolmentService.getCourseProgressForStudents))
export default enrolmentcontroller
