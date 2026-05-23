const Message = require("../models/Message");
const Notification = require("../models/Notification");

/* ---------------------------
   SEND MESSAGE
---------------------------- */
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const message = await Message.create({
      sender:   req.user.id,
      receiver: receiverId,
      text,
    });

    const populated = await message.populate("sender receiver", "name email");

    // ✅ Notify receiver about new message
    const notification = await Notification.create({
      user:    receiverId,
      message: `💬 ${populated.sender.name} sent you a message`,
      type:    "message",
      read:    false,
    });

    if (global.io) {
      global.io.to(String(receiverId)).emit("new_notification", {
        _id:       notification._id,
        message:   notification.message,
        type:      notification.type,
        createdAt: notification.createdAt,
      });
    }

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send message" });
  }
};

/* ---------------------------
   GET CHAT BETWEEN USERS
---------------------------- */
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId,      receiver: req.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender receiver", "name email");

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load messages" });
  }
};





