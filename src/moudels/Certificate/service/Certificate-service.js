import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import Certificate from "../../../database/models/Certificate-model.js";
import Enrolment from "../../../database/models/enrolment-model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = async (req, res, next) => {
  try {
    const { student_id, course_id } = req.body;

    // تأكد إن الطالب خلص الكورس
    const enrolment = await Enrolment.findOne({ student_id, course_id })
      .populate("student_id course_id");

    if (!enrolment || enrolment.progress < 100) {
      return res.status(400).json({ message: "Student has not completed the course yet" });
    }

    // اسم الملف آمن
    const safeCourseTitle = enrolment.course_id.title.replace(/[^a-z0-9]/gi, "_");
    const fileName = `${enrolment.student_id.username}_${safeCourseTitle}.pdf`;
    const certificatesDir = path.join(__dirname, "../../../certificates");

    // إنشاء فولدر لو مش موجود
    fs.mkdirSync(certificatesDir, { recursive: true });

    const filePath = path.join(certificatesDir, fileName);

    // ✅ توليد الـ PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(26).text("Certificate of Completion", { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text(`This is to certify that ${enrolment.student_id.username}`);
    doc.text(`has successfully completed the course: ${enrolment.course_id.title}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.end();

    stream.on("finish", async () => {
      // ✅ خزّن مسارين: file_path + downloadUrl
      const certificate = new Certificate({
        student_id,
        course_id,
        file_path: filePath, // مسار فعلي
        downloadUrl: `/certificate/download/${fileName}` // لينك API
      });

      await certificate.save();

      res.status(201).json({
        message: "Certificate generated successfully",
        certificate,
      });
    });
  } catch (error) {
    next(error);
  }
};

// ✅ API لتحميل الشهادة
export const downloadCertificate = async (req, res, next) => {
  try {
    const { fileName } = req.params;
    const certificatesDir = path.join(__dirname, "../../../certificates");
    const filePath = path.join(certificatesDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Certificate file not found on server" });
    }

    res.download(filePath);
  } catch (error) {
    next(error);
  }
};
