// src/moudels/dashboard/service/dashboard-service.js
import User from "../../../database/models/user-model.js";
import Course from "../../../database/models/course-model.js";
import Enrolment from "../../../database/models/enrolment-model.js";
import Payment from "../../../database/models/payment -mode.js";
// 🟢 1. إجمالي عدد الطلاب
export const getTotalStudents = async (req, res, next) => {
  try {
    const total = await User.countDocuments();
    res.status(200).json({ totalStudents: total });
  } catch (error) {
    next(error);
  }
};

// 🟢 2. إجمالي عدد الكورسات
export const getTotalCourses = async (req, res, next) => {
  try {
    const total = await Course.countDocuments();
    res.status(200).json({ totalCourses: total });
  } catch (error) {
    next(error);
  }
};

// 🟢 3. أكثر الكورسات تسجيلًا
export const getTopCourses = async (req, res, next) => {
  try {
    const topCourses = await Enrolment.aggregate([
      { $group: { _id: "$course_id", enrolments: { $sum: 1 } } },
      { $sort: { enrolments: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses", // اسم collection في MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          _id: 0,
          courseId: "$course._id",
          title: "$course.title",
          enrolments: 1,
        },
      },
    ]);

    res.status(200).json(topCourses);
  } catch (error) {
    next(error);
  }
};

// 🟢 4. إجمالي الأرباح
export const getTotalRevenue = async (req, res, next) => {
  try {
    const revenue = await Payment.aggregate([
      { $match: { payment_status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({ totalRevenue: revenue[0]?.total || 0 });
  } catch (error) {
    next(error);
  }
};
