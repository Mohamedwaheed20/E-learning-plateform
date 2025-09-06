import Enrolment from "../../../database/models/enrolment-model.js";
import Lesson from "../../../database/models/lessons-model.js";
import Course from "../../../database/models/course-model.js";
import { createNotification } from "../../../moudels/notification/service/notification-service.js";

export const enrollInCourse = async (req,res,next) => {
  const {student_id,course_id,progress,completed_lessons}=req.body;
  const existing = await Enrolment.findOne({ student_id, course_id });
  if (existing) {
    return next(new Error("Student already enrolled in this course"));
  }

  const enrolment = new Enrolment({ student_id, course_id,progress,completed_lessons });
  await enrolment.save();

  // ✅ إشعار للـ Instructor
  const course = await Course.findById(course_id);
  if (course) {
    await createNotification(course.instructor_id, `طالب جديد سجل في كورسك: ${course.title}`);
  }

  return res.status(200).json({ message: "Student enrolled in course successfully", enrolment });
};

  export const getAllEnrolmentsController = async (req, res, next) => {
    try {
      const enrolments = await Enrolment.find()
        .populate("student_id")
        .populate("course_id")
        .populate("completed_lessons"); // ✅ دلوقتي هيلاقي Lesson
  
      res.status(200).json(enrolments);
    } catch (err) {
      next(err);
    }
  };
  
  
  export const getEnrolmentByIdController = async (req,res,next) => {
    const {_id}=req.params;
    const enrolment = await Enrolment.findById(_id).populate("student_id course_id completed_lessons");
    if (!enrolment) throw new Error("Enrolment not found");
    return res.status(200).json(enrolment);
  };
  
  export const getEnrolmentsByStudentController = async (req,res,next) => {
    const {student_id}=req.params;
    const enrolments = await Enrolment.find({ student_id }).populate("course_id completed_lessons");
    if (!enrolments) throw new Error("Enrolments not found");
    return res.status(200).json(enrolments);
  };
  

  export const updateEnrolmentController = async (req, res, next) => {
    try {
      const { _id } = req.params;
      const { completed_lessons } = req.body; // ✅ بس نسمح بتحديث الدروس
  
      // جلب الـ enrolment
      const enrolment = await Enrolment.findById(_id);
      if (!enrolment) throw new Error("Enrolment not found");
  
      // تحديث قائمة الدروس المكتملة (من غير تكرار)
      completed_lessons.forEach((lessonId) => {
        if (!enrolment.completed_lessons.includes(lessonId)) {
          enrolment.completed_lessons.push(lessonId);
        }
      });
  
      // حساب progress أوتوماتيك
      const totalLessons = await Lesson.countDocuments({ course_id: enrolment.course_id });
      enrolment.progress =
        totalLessons > 0
          ? Math.round((enrolment.completed_lessons.length / totalLessons) * 100)
          : 0;
  
      await enrolment.save();
  
      res.status(200).json({
        message: "Enrolment updated successfully",
        enrolment,
      });
    } catch (error) {
      next(error);
    }
  };  
  
  export const deleteEnrolmentController = async (req,res,next) => {
    const {_id}=req.params;
    const enrolment = await Enrolment.findByIdAndDelete(_id);
    if (!enrolment) throw new Error("Enrolment not found");
    return res.status(200).json({ message: "Enrolment deleted successfully" });
  };



// إضافة درس مكتمل للطالب + تحديث progress
export const addCompletedLessonController = async (req, res, next) => {
    const { enrolmentId, lessonId } = req.body;

    // 1- دور على enrolment
    const enrolment = await Enrolment.findById(enrolmentId);
    if (!enrolment) throw new Error("Enrolment not found");

    // 2- تأكد إن الدرس تبع نفس الكورس
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.course_id.toString() !== enrolment.course_id.toString()) {
      return res.status(400).json({ message: "Lesson does not belong to this course" });
    }

    // 3- ضيف الدرس لو مش موجود قبل كدا
    if (!enrolment.completed_lessons.includes(lessonId)) {
      enrolment.completed_lessons.push(lessonId);
    }

    // 4- حساب التقدم progress
    const totalLessons = await Lesson.countDocuments({ course_id: enrolment.course_id });
    const completedCount = enrolment.completed_lessons.length;

    enrolment.progress = Math.round((completedCount / totalLessons) * 100);

    await enrolment.save();

    res.status(200).json({
      message: "Lesson completed and progress updated",
      enrolment,
    });
};
export const getCourseProgressForStudents = async (req, res, next) => {
      const { course_id } = req.params;
  
      // كل الطلبة اللي مسجلين في الكورس
      const enrolments = await Enrolment.find({ course_id })
        .populate("student_id", "username email") // بس الاسم و الإيميل
        .populate("completed_lessons");
  
      if (!enrolments.length) {
        return res.status(404).json({ message: "No students enrolled in this course" });
      }
  
      // عدد الدروس الكلية في الكورس
      const totalLessons = await Lesson.countDocuments({ course_id });
  
      // تجهيز تقرير التقدم لكل طالب
      const report = enrolments.map((enrol) => ({
        student: enrol.student_id.username,
        email: enrol.student_id.email,
        completedLessons: enrol.completed_lessons.length,
        totalLessons,
        progress: totalLessons > 0
          ? Math.round((enrol.completed_lessons.length / totalLessons) * 100)
          : 0
      }));
  
      res.status(200).json(report); 
      
}