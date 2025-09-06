import Course from "../../../database/models/course-model.js";
import { createNotification } from "../../../moudels/notification/service/notification-service.js";
import User from "../../../database/models/user-model.js";
export const createCourseController = async (req, res, next) => {
  try {
    const { title, description, price, instructor_id } = req.body;

    // ✅ لو فيه صورة مرفوعة
    let imagePath;
    if (req.file && req.file.filename) {
      imagePath = `/uploads/courses/${req.file.filename}`;
    } else {
      imagePath = `/uploads/courses/default-course.png`; // صورة افتراضية
    }

    const course = await Course.create({
      title,
      description,
      price,
      image: imagePath,
      instructor_id,
    });

    // ✅ إشعار لكل الطلبة
    const students = await User.find({ role: "user" });
    for (const student of students) {
      await createNotification(student._id, `تم إضافة كورس جديد: ${course.title}`);
    }

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    next(error);
  }
};
  export const getAllCoursesController = async (req, res, next) => {
      const courses = await Course.find();
      res.status(200).json(courses);
    
  };
  
  export const getCourseByIdController = async (req, res, next) => {
      const {_id}=req.params;
      const course = await Course.findById(_id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(course);
    
  };
  
  // Update Course
  // Update Course
export const updateCourseController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { title, description, price, instructor_id } = req.body;

    // لو فيه صورة جديدة
    let imagePath;
    if (req.file && req.file.filename) {
      imagePath = `/uploads/courses/${req.file.filename}`;
    }

    const course = await Course.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        price,
        instructor_id,
        ...(imagePath && { image: imagePath }), // بس لو فيه صورة جديدة
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    next(error);
  }
};

  export const deleteCourseController = async (req, res, next) => {
      const {_id}=req.params;
      const course = await Course.findByIdAndDelete(_id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json({ message: "Course deleted successfully" });
    
  };
  export const searchCourses = async (req, res, next) => {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required" });
      }
  
      const courses = await Course.find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      });
  
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  };
  
  // 🎯 فلترة بالكريتريا
  export const filterCourses = async (req, res, next) => {
    try {
      const { minPrice, maxPrice, instructor } = req.query;
      const query = {};
  
      // فلترة بالسعر
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
  
      // فلترة بالـ Instructor
      if (instructor) {
        query.instructor_id = instructor;
      }
  
      const courses = await Course.find(query).populate("instructor_id", "username email");
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  };