import { Router } from "express";
import * as notificationService from "./service/notification-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";

const notificationController = Router();

notificationController.get("/user/:user_id", errorHandler(notificationService.getUserNotifications));
notificationController.put("/read/:_id", errorHandler(notificationService.markAsRead));

export default notificationController;
