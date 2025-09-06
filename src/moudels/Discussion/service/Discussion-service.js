// modules/discussion/service/discussion-service.js
import Discussion from "../../../database/models/Discussion-model.js";

// إنشاء بوست جديد
export const createDiscussionController = async (req, res, next) => {
  try {
    const { course_id, user_id, text } = req.body;
    const discussion = new Discussion({ course_id, user_id, text });
    await discussion.save();
    res.status(201).json({ message: "Discussion created successfully", discussion });
  } catch (error) {
    next(error);
  }
};

// جلب كل البوستات في كورس
export const getDiscussionsByCourseController = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const discussions = await Discussion.find({ course_id })
      .populate("user_id", "username email")
      .populate("replies.user_id", "username email");

    res.status(200).json(discussions);
  } catch (error) {
    next(error);
  }
};

// إضافة رد
export const addReplyController = async (req, res, next) => {
  try {
    const { discussion_id } = req.params;
    const { user_id, text } = req.body;

    const discussion = await Discussion.findById(discussion_id);
    if (!discussion) throw new Error("Discussion not found");

    discussion.replies.push({ user_id, text });
    await discussion.save();

    res.status(200).json({ message: "Reply added successfully", discussion });
  } catch (error) {
    next(error);
  }
};
