
import mongoose from "mongoose";


export const reviewSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    
}, {timestamps: true})

 const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema)
 export default Review
