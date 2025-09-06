import Question from "../../../database/models/Question-mode.js";
import Quiz from "../../../database/models/Quiz-model.js";

export const createQuestionController = async (req, res, next) => {
  try {
    const { quiz_id, text, options, correct_answer } = req.body;

    if (!quiz_id || !text || !options || options.length < 2) {
      throw new Error("quiz_id, text, and at least 2 options are required");
    }

    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) throw new Error("Quiz not found");

    const question = await Question.create({ quiz_id, text, options, correct_answer });
    return res.status(201).json({ message: "Question created successfully", question });
  } catch (err) {
    next(err);
  }
};

export const getAllQuestionsController = async (req, res, next) => {
  try {
    const questions = await Question.find().populate("quiz_id");
    return res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
};

export const getQuestionByIdController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const question = await Question.findById(_id).populate("quiz_id");
    if (!question) throw new Error("Question not found");
    return res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};

export const updateQuestionController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { text, options, correct_answer } = req.body;

    const question = await Question.findByIdAndUpdate(
      _id,
      { text, options, correct_answer },
      { new: true }
    );

    if (!question) throw new Error("Question not found");
    return res.status(200).json({ message: "Question updated successfully", question });
  } catch (err) {
    next(err);
  }
};
  
export const deleteQuestionController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const question = await Question.findByIdAndDelete(_id);
    if (!question) throw new Error("Question not found");
    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    next(err);
  }
};
