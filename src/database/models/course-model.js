
import mongoose from "mongoose";
export const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
    },
    instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
   
}, {timestamps: true});

 const Course = mongoose.models.Course || mongoose.model("Course", courseSchema)
 export default Course