import { globalErrorHandler } from "../middelware/error-handler-middelware.js";
import authcontroller from "../moudels/Auth/Auth-controller.js";
import coursecontroller from "../moudels/course/course-controller.js";
import enrolmentcontroller from "../moudels/enrolment/enrolment.controller.js";
import lessoncontroller from "../moudels/lessons/lesson-controller.js";
import progresscontroller from "../moudels/progress/progress-controller.js";
import quizcontroller from "../moudels/Quiz/quiz-controller.js";
import quistioncontroller from "../moudels/Quistion/Quistion-controller.js";
import QuizAttemptcontroller from "../moudels/QuizAttempt/QuizAttempt.controller.js";
import discussioncontroller from "../moudels/Discussion/Discussion-controller.js";
import reviewcontroller from "../moudels/review/review-controller.js";
import notificationcontroller from "../moudels/notification/notification-controller.js";
import paymentcontroller from "../moudels/payment/payment-controller.js";
import certificatecontroller from "../moudels/Certificate/Certificate-controller.js";
import dashboardController from "../moudels/dashboard/dashboard-contrller.js";
const routerHandler=(app)=>{

    app.use("/auth",authcontroller)
    app.use("/course",coursecontroller)
    app.use("/enrolment",enrolmentcontroller)
    app.use("/lesson",lessoncontroller)
    app.use("/progress",progresscontroller)
    app.use("/quiz",quizcontroller)
    app.use("/quistion",quistioncontroller)
    app.use("/discussion",discussioncontroller)
    app.use("/quizattempt",QuizAttemptcontroller)
    app.use("/review",reviewcontroller)
    app.use("/notification",notificationcontroller)
    app.use("/payment",paymentcontroller)
    app.use("/certificate",certificatecontroller)
    app.use("/dashboard",dashboardController)
    app.use(globalErrorHandler)
 }
 
 export default routerHandler;