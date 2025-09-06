import Review from "../../../database/models/review-model.js";

export const addReviewController = async (req, res, next) => {
  try {
    const { course_id, student_id, rating, comment } = req.body;

    if (!course_id || !student_id || !rating) {
      return res.status(400).json({ message: "Course, Student, and Rating are required" });
    }

    const review = new Review({ course_id, student_id, rating, comment });
    await review.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    next(error);
  }
};

export const getCourseReviewsController = async (req, res, next) => {
  try {
    const { course_id } = req.params;

    const reviews = await Review.find({ course_id })
      .populate("student_id", "username email");

    const avgRating = reviews.length
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({ reviews, avgRating });
  } catch (error) {
    next(error);
  }
};
