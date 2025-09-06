import { Router } from "express";
import * as dashboardService from "./service/dashboard-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
    
const dashboardController = Router();

dashboardController.get("/total-students", errorHandler(dashboardService.getTotalStudents));
dashboardController.get("/total-courses", errorHandler(dashboardService.getTotalCourses));
dashboardController.get("/top-courses", errorHandler(dashboardService.getTopCourses));
dashboardController.get("/revenue", errorHandler(dashboardService.getTotalRevenue));

export default dashboardController;
