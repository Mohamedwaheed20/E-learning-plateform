// database/models/certificate-model.js
import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  issue_date: { type: Date, default: Date.now },
  pdf_url: { type: String } // رابط ملف الـ PDF
}, { timestamps: true });

const Certificate = mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);
export default Certificate;
