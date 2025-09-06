import Enrolment from "../../../database/models/enrolment-model.js";
import Lesson from "../../../database/models/lessons-model.js";

export const getStudentProgress = async (req,res,next) => {
    const {student_id}=req.params;
  const enrolments = await Enrolment.find({ student_id }).populate("course_id completed_lessons");

  const progressData = await Promise.all(
    enrolments.map(async (enrolment) => {
      const totalLessons = await Lesson.countDocuments({ course_id: enrolment.course_id._id });
      const completedLessons = enrolment.completed_lessons.length;
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        course: enrolment.course_id.title,
        courseId: enrolment.course_id._id,
        completedLessons,
        totalLessons,
        progress
      };
    })
  );

  return res.status(200).json(progressData);
};
