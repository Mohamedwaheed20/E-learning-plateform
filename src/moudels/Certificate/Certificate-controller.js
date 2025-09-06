// moudels/certificate/certificate-controller.js
import { Router } from "express";
import * as certificateService from "./service/Certificate-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";

const certificateController = Router();

certificateController.post("/generate", errorHandler(certificateService.generateCertificate));
certificateController.get("/download/:_id", errorHandler(certificateService.downloadCertificate));

export default certificateController;
