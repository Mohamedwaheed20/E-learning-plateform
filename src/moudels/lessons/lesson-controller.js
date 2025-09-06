import { Router } from "express";
import * as lessonService from "./service/lesson-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
const lessoncontroller=Router()
lessoncontroller.post("/createlesson",errorHandler(lessonService.createLessonController))
lessoncontroller.get("/getlessons",errorHandler(lessonService.getAllLessonsController))
lessoncontroller.get("/getlessonbyid/:_id",errorHandler(lessonService.getLessonByIdController))
lessoncontroller.put("/updatelesson/:_id",errorHandler(lessonService.updateLessonController))
lessoncontroller.delete("/deletlesson/:_id",errorHandler(lessonService.deleteLessonController))
lessoncontroller.put("/addcompletedlesson",errorHandler(lessonService.addCompletedLessonController))
export default lessoncontroller