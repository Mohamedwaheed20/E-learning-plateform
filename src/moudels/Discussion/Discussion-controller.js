// modules/discussion/discussion-controller.js
import { Router } from "express";
import * as discussionService from "./service/Discussion-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";

const discussionController = Router();
discussionController.post("/creatediscussion", errorHandler(discussionService.createDiscussionController));
discussionController.get("/getdiscussionsbycourse/:course_id", errorHandler(discussionService.getDiscussionsByCourseController));
discussionController.post("/addreply/:discussion_id", errorHandler(discussionService.addReplyController));
export default discussionController;
