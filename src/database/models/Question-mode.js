import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  text: {   // 👈 عدلنا هنا
    type: String,
    required: true
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
export default Question;
