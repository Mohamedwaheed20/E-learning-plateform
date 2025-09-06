import Quiz from "../../../database/models/Quiz-model.js";

export const createQuizController = async (req, res, next) => {
  try {
    const { course_id, title, description } = req.body;
    if (!course_id || !title) {
      throw new Error("course_id and title are required");
    }

    const quiz = await Quiz.create({ course_id, title, description });
    return res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (err) {
    next(err);
  }
};

export const getAllQuizzesController = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().populate("course_id");
    return res.status(200).json({message:"success",quizzes});
  } catch (err) {
    next(err);
  }
};

export const getQuizByIdController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const quiz = await Quiz.findById(_id).populate("course_id");
    if (!quiz) throw new Error("Quiz not found");
    return res.status(200).json({message:"success",quiz});
  } catch (err) {
    next(err);
  }
};

export const updateQuizController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { title, description } = req.body;

    const quiz = await Quiz.findByIdAndUpdate(
      _id,
      { title, description },
      { new: true }
    );
    if (!quiz) throw new Error("Quiz not found");
    return res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (err) {
    next(err);
  }
};

export const deleteQuizController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(_id);
    if (!quiz) throw new Error("Quiz not found");
    return res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (err) {
    next(err);
  }
};
