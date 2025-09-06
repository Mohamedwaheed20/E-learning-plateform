import Enrolment from "../../../database/models/enrolment-model.js";
import Payment from "../../../database/models/payment -mode.js";

// إنشاء دفع جديد (بعد ما الطالب يشتري كورس)
export const createPayment = async (req, res, next) => {
  try {
    const { student_id, course_id, amount } = req.body;

    const payment = new Payment({
      student_id,
      course_id,
      amount,
      payment_status: "pending"
    });

    await payment.save();

    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    next(error);
  }
};

// تحديث حالة الدفع (مثلاً من Webhook بتاع Stripe)

export const updatePaymentStatus = async (req, res, next) => {
    try {
      const { _id } = req.params;
      const { payment_status, transaction_id } = req.body;
  
      const payment = await Payment.findByIdAndUpdate(
        _id,
        { payment_status, transaction_id },
        { new: true }
      ).populate("student_id course_id");
  
      if (!payment) throw new Error("Payment not found");
  
      // ✅ لو الدفع ناجح → اعمل Enrolment للطالب في الكورس
      if (payment.payment_status === "completed") {
        const existing = await Enrolment.findOne({
          student_id: payment.student_id._id,
          course_id: payment.course_id._id
        });
  
        if (!existing) {
          const enrolment = new Enrolment({
            student_id: payment.student_id._id,
            course_id: payment.course_id._id,
            progress: 0,
            completed_lessons: []
          });
          await enrolment.save();
        }
      }
  
      res.status(200).json({ message: "Payment updated", payment });
    } catch (error) {
      next(error);
    }
  };

// عرض مدفوعات طالب
export const getStudentPayments = async (req, res, next) => {
  try {
    const { student_id } = req.params;
    const payments = await Payment.find({ student_id }).populate("course_id");
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};
