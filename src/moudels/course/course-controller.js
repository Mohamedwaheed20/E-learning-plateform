import { Router } from "express";
import * as courseService from "./service/course-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
import upload from "../../middelware/upload-middleware.js";

const courseController = Router();

// رفع صورة كورس
courseController.post(
  "/create",
  upload.single("image"), // 👈 لازم الاسم يكون "image"
  errorHandler(courseService.createCourseController)
);

courseController.get("/getall", errorHandler(courseService.getAllCoursesController));
courseController.get("/get/:_id", errorHandler(courseService.getCourseByIdController));
courseController.put("/update/:_id", upload.single("image"), errorHandler(courseService.updateCourseController));
courseController.delete("/delete/:_id", errorHandler(courseService.deleteCourseController));
courseController.get("/search", errorHandler(courseService.searchCourses));
courseController.get("/filter", errorHandler(courseService.filterCourses));

export default courseController;
