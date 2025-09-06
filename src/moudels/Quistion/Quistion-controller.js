import Router from "express";
import * as quistionService from "./service/quistion-service.js"
import { errorHandler } from "../../middelware/error-handler-middelware.js";
const quistioncontroller=Router()
quistioncontroller.post("/createquestion",errorHandler(quistionService.createQuestionController))
quistioncontroller.get("/getallquestions",errorHandler(quistionService.getAllQuestionsController))
quistioncontroller.get("/getquestionbyid/:_id",errorHandler(quistionService.getQuestionByIdController))
quistioncontroller.put("/updatequestion/:_id",errorHandler(quistionService.updateQuestionController))
quistioncontroller.delete("/deletequestion/:_id",errorHandler(quistionService.deleteQuestionController))
export default quistioncontroller
