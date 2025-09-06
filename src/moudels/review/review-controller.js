// modules/review/review-controller.js
import { Router } from "express";
import * as reviewService from "./service/review-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";

const reviewcontroller = Router();

reviewcontroller.post("/addreview", errorHandler(reviewService.addReviewController));
reviewcontroller.get("/coursereviews/:course_id", errorHandler(reviewService.getCourseReviewsController));

export default reviewcontroller;
