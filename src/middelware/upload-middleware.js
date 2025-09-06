import multer from "multer";
import path from "path";

// مكان حفظ الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/courses/"); // فولدر رفع الصور
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // اسم ملف فريد
  },
});

const upload = multer({ storage });
export default upload;
