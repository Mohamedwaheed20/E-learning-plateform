import { Router } from "express";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
import * as paymentService from "./service/payment-service.js";

const paymentController = Router();

paymentController.post("/create", errorHandler(paymentService.createPayment));
paymentController.put("/update/:_id", errorHandler(paymentService.updatePaymentStatus));
paymentController.get("/student/:student_id", errorHandler(paymentService.getStudentPayments));

export default paymentController;
