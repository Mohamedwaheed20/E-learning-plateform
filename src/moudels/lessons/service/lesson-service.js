import Lesson from "../../../database/models/lessons-model.js";
import Enrolment from "../../../database/models/enrolment-model.js";
import { createNotification } from "../../../moudels/notification/service/notification-service.js";
export const createLessonController = async (req, res, next) => {
  const { course_id, title, description, video_url, order, duration } = req.body;
  const lesson = new Lesson({ course_id, title, description, video_url, order, duration });
  await lesson.save();

  // ✅ إشعار لكل الطلاب المسجلين في الكورس
  const enrolments = await Enrolment.find({ course_id });
  for (const enrol of enrolments) {
    await createNotification(enrol.student_id, `تم إضافة درس جديد في الكورس: ${title}`);
  }

  return res.status(201).json({ message: "Lesson created successfully", lesson });
};
export const getAllLessonsController = async (req, res, next) => {
  const lessons = await Lesson.find().populate("course_id");
  return res.status(200).json(lessons);
};

export const getLessonByIdController = async (req, res, next) => {
  const { _id } = req.params;
  const lesson = await Lesson.findById(_id).populate("course_id");
  if (!lesson) throw new Error("Lesson not found");
  return res.status(200).json(lesson);
};

export const updateLessonController = async (req, res, next) => {
  const { _id } = req.params;
  const { title, description, video_url, order, duration } = req.body;
  const lesson = await Lesson.findByIdAndUpdate(
    _id,
    { title, description, video_url, order, duration },
    { new: true }
  );
  if (!lesson) throw new Error("Lesson not found");
  return res.status(200).json(lesson);
};

export const deleteLessonController = async (req, res, next) => {
  const { _id } = req.params;
  const lesson = await Lesson.findByIdAndDelete(_id);
  if (!lesson) throw new Error("Lesson not found");
  return res.status(200).json({ message: "Lesson deleted successfully" });
};

// إضافة درس مكتمل للطالب + تحديث progress
export const addCompletedLessonController = async (req, res, next) => {
  try {
    const { enrolmentId, lessonId } = req.body;

    // 1- دور على enrolment
    const enrolment = await Enrolment.findById(enrolmentId).populate("course_id student_id");
    if (!enrolment) throw new Error("Enrolment not found");

    // 2- تأكد إن الدرس تبع نفس الكورس
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.course_id.toString() !== enrolment.course_id._id.toString()) {
      return res.status(400).json({ message: "Lesson does not belong to this course" });
    }

    // 3- ضيف الدرس لو مش موجود قبل كدا
    if (!enrolment.completed_lessons.includes(lessonId)) {
      enrolment.completed_lessons.push(lessonId);
    }

    // 4- حساب التقدم progress
    const totalLessons = await Lesson.countDocuments({ course_id: enrolment.course_id._id });
    const completedCount = enrolment.completed_lessons.length;

    enrolment.progress = Math.round((completedCount / totalLessons) * 100);
    await enrolment.save();

    // ✅ لو الطالب خلص الكورس كله
    if (enrolment.progress === 100) {
      await createNotification(
        enrolment.course_id.instructor_id,
        `الطالب ${enrolment.student_id.username} خلص الكورس بالكامل!`
      );
    }

    res.status(200).json({
      message: "Lesson completed and progress updated",
      enrolment,
    });
  } catch (error) {
    next(error);
  }
};
