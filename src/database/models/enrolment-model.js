import mongoose from "mongoose";
import Lesson from "./lessons-model.js"; // مهم عشان يضمن تسجيل الموديل

export const enrolmentSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  progress: {
    type: Number,
    default: 0
  },
  completed_lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson"
  }]
}, { timestamps: true });

const Enrolment = mongoose.models.Enrolment || mongoose.model("Enrolment", enrolmentSchema);
export default Enrolment;
