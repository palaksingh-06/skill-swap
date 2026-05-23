const Notification = require("../models/Notification");

/* ------------------------------
   HELPER — call from any controller
-------------------------------- */
exports.createNotification = async (userId, message, type = "request") => {
  try {
    const notification = await Notification.create({
      user: userId,
      message,
      type,
      read: false
    });

    // global.io is set in server.js — room name is just userId string
    if (global.io) {
      global.io.to(String(userId)).emit("new_notification", {
        _id:       notification._id,
        message:   notification.message,
        type:      notification.type,
        createdAt: notification.createdAt
      });
    }

    return notification;
  } catch (err) {
    console.error("createNotification error:", err);
  }
};

/* ------------------------------
   GET USER NOTIFICATIONS
-------------------------------- */
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch notifications" });
  }
};

/* ------------------------------
   MARK AS READ
-------------------------------- */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update notification" });
  }
};

/* ------------------------------
   MARK ALL AS READ
-------------------------------- */
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.json({ msg: "All marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to mark all as read" });
  }
};

/* ------------------------------
   DELETE
-------------------------------- */
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ msg: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete notification" });
  }
};
