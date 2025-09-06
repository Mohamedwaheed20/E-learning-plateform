import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const discussionSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // صاحب البوست
  text: { type: String, required: true },
  replies: [replySchema] // الردود
}, { timestamps: true });

const Discussion = mongoose.models.Discussion || mongoose.model("Discussion", discussionSchema);
export default Discussion;
