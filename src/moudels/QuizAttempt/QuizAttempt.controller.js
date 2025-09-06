import Router from "express";
import * as QuizAttemptService from "./service/QuizAttempt-service.js"
import { errorHandler } from "../../middelware/error-handler-middelware.js";
const QuizAttemptController = Router();
QuizAttemptController.post("/submitquiz", errorHandler(QuizAttemptService.submitQuizController));
QuizAttemptController.get("/getattemptsbystudent/:student_id", errorHandler(QuizAttemptService.getAttemptsByStudentController));
QuizAttemptController.get("/getattemptbyid/:_id", errorHandler(QuizAttemptService.getAttemptByIdController));
export default QuizAttemptController;
