import Notification from "../../../database/models/notification-model.js";

// إنشاء إشعار جديد
export const createNotification = async (user_id, message) => {
  const notification = new Notification({ user_id, message });
  await notification.save();
  return notification;
};

// جلب كل الإشعارات الخاصة بمستخدم
export const getUserNotifications = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const notifications = await Notification.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

// وضع علامة مقروء
export const markAsRead = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const notification = await Notification.findByIdAndUpdate(_id, { isRead: true }, { new: true });
    if (!notification) throw new Error("Notification not found");
    res.status(200).json(notification);
  } catch (err) {
    next(err);
  }
};
