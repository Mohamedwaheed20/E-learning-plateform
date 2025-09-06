
import mongoose from "mongoose";

export const lessonSchema = new mongoose.Schema({

course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
},
title: {
    type: String,
    required: true
},
description: {
    type: String,
    required: true
},
video_url: {
    type: String,
    required: true
},
order: {
    type: Number,
    required: true
},
duration: {
    type: Number,
    required: true
},



}, {timestamps: true})

 const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema)
 export default Lesson
