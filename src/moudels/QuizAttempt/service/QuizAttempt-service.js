import Question from "../../../database/models/Question-mode.js";
import QuizAttempt from "../../../database/models/QuizAttempt-model.js";

export const submitQuizController = async (req, res, next) => {
  try {
    const { student_id, quiz_id, answers } = req.body;

    // نحسب النتيجة
    let score = 0;
    for (let ans of answers) {
      const question = await Question.findById(ans.question_id);
      if (!question) continue;

      const correctOption = question.options.find(o => o.isCorrect);
      if (correctOption && correctOption.text === ans.selectedOption) {
        score++;
      }
    }

    const attempt = new QuizAttempt({ student_id, quiz_id, answers, score });
    await attempt.save();

    res.status(201).json({ message: "Quiz submitted successfully", attempt });
  } catch (error) {
    next(error);
  }
};

export const getAttemptsByStudentController = async (req, res, next) => {
  try {
    const { student_id } = req.params;

    const attempts = await QuizAttempt.find({ student_id })
      .populate("quiz_id", "title") // يجيب عنوان الكويز بسذ
      .populate("answers.question_id", "question_text options"); // يجيب تفاصيل الأسئلة

    if (!attempts.length) {
      return res.status(404).json({ message: "No attempts found for this student" });
    }

    res.status(200).json(attempts);
  } catch (error) {
    next(error);
  }
};

export const getAttemptByIdController = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const attempt = await QuizAttempt.findById(_id)
      .populate("student_id", "username email")
      .populate("quiz_id", "title")
      .populate("answers.question_id", "question_text options");

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    res.status(200).json(attempt);
  } catch (error) {
    next(error);
  }
};
