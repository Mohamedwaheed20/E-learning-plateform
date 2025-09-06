import Router from "express";
import * as quizService from "./service/quiz-service.js"
import { errorHandler } from "../../middelware/error-handler-middelware.js";
const quizcontroller=Router()
quizcontroller.post("/createquiz",errorHandler(quizService.createQuizController))
quizcontroller.get("/getallquizzes",errorHandler(quizService.getAllQuizzesController))
quizcontroller.get("/getquizbyid/:_id",errorHandler(quizService.getQuizByIdController))
quizcontroller.put("/updatequiz/:_id",errorHandler(quizService.updateQuizController))
quizcontroller.delete("/deletequiz/:_id",errorHandler(quizService.deleteQuizController))
export default quizcontroller
