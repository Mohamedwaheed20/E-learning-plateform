import Router from "express";
import * as authservice from "./service/auth-service.js"
import { errorHandler } from "../../middelware/error-handler-middelware.js";
const authcontroller= Router();
authcontroller.post("/signup",errorHandler(authservice.signupService))
authcontroller.post("/signin",errorHandler(authservice.signinService))
authcontroller.post("/verifyotp",errorHandler(authservice.verifyotpService))
authcontroller.post("/signout",errorHandler(authservice.signoutService))
authcontroller.post("/forgetpassword",errorHandler(authservice.forgetpasswordService))
authcontroller.post("/resetpassword",errorHandler(authservice.resetpasswordService))
export default authcontroller
