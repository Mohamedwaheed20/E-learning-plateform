import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  amount: { type: Number, required: true },
  payment_status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  transaction_id: { type: String }, // مثلاً Stripe/PayPal ID
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
