import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  answers: [
    {
      question_id: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedOption: String
    }
  ],
  score: { type: Number, default: 0 }
}, { timestamps: true });

const Answer = mongoose.models.Answer || mongoose.model("Answer", answerSchema);
export default Answer;
