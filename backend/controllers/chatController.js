const { StreamChat } = require("stream-chat");
const https = require("https");
const User = require("../models/User");
const Notification = require("../models/Notification");

const apiKey    = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const agent = new https.Agent({ rejectUnauthorized: false });

const serverClient = StreamChat.getInstance(apiKey, apiSecret, {
  httpsAgent: agent,
});

/* ---------------------------
   GET STREAM TOKEN
---------------------------- */
const getStreamToken = async (req, res) => {
  try {
    const userId     = req.user._id.toString();
    const name       = req.user.name;
    const profilePic = req.user.profilePic;

    await serverClient.upsertUser({ id: userId, name, image: profilePic });

    const token = serverClient.createToken(userId);

    res.json({ token, userId, name, apiKey });
  } catch (error) {
    console.error("Error in getStreamToken:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ---------------------------
   UPSERT STREAM USER
---------------------------- */
const upsertStreamUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    await serverClient.upsertUser({
      id:    targetUser._id.toString(),
      name:  targetUser.name,
      image: targetUser.profilePic,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error upserting stream user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ---------------------------
   STREAM WEBHOOK
   Stream calls this when a
   new message is sent
---------------------------- */
const streamWebhook = async (req, res) => {
  try {
    // Always respond 200 immediately so Stream doesn't retry
    res.status(200).send("ok");

    const event = req.body;

    // Only handle new messages
    if (event.type !== "message.new") return;

    const senderId = event.user?.id;
    const members  = event.members || [];

    // Find the receiver (member who is NOT the sender)
    const receiver = members.find((m) => m.user_id !== senderId);
    if (!receiver) return;

    const receiverId   = receiver.user_id;
    const senderName   = event.user?.name || "Someone";
    const messageText  = event.message?.text || "a message";

    // Don't notify if receiver is online (already in chat)
    const receiverMember = members.find((m) => m.user_id === receiverId);
    if (receiverMember?.user?.online) return;

    // Save notification to DB
    const notification = await Notification.create({
      user:    receiverId,
      message: `💬 ${senderName} sent you a message`,
      type:    "message",
      read:    false,
    });

    // ✅ Emit toast popup to receiver
    if (global.io) {
      global.io.to(String(receiverId)).emit("new_notification", {
        _id:       notification._id,
        message:   notification.message,
        type:      notification.type,
        createdAt: notification.createdAt,
      });
    }

  } catch (err) {
    console.error("streamWebhook error:", err);
  }
};

module.exports = { getStreamToken, upsertStreamUser, streamWebhook };