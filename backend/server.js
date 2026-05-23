const express = require("express");
const cors = require("cors");
require("dotenv").config({ override: true });
const connectDB = require("./config/db");
const passport = require("./config/passport");
// Routes
const authRoutes      = require("./routes/authRoutes");
const userRoutes      = require("./routes/userRoutes");
const requestRoutes   = require("./routes/requestRoutes");
const sessionRoutes   = require("./routes/sessionRoutes");
const skillRoutes     = require("./routes/skillRoutes");
const publicRoutes    = require("./routes/publicRoutes");
const skillSwapRoutes = require("./routes/skillSwapRoutes");
const matchRoutes     = require("./routes/match");
const chatRoutes      = require("./routes/chatRoutes");
const videoRoutes     = require("./routes/videoRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes           = require("./routes/ai");
const notificationRoutes = require("./routes/notificationRoutes");
const http     = require("http");
const { Server } = require("socket.io");
const app    = express();
const server = http.createServer(app);
const reviewRoutes      = require("./routes/review");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const Notification      = require("./models/Notification"); // ✅ NEW
const webhookRoutes = require("./routes/webhooks");
const io = new Server(server, {
    cors: {
    origin: ["http://localhost:5173",
      "https://skill-swap-1-4w1n.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});
global.io = io;

// ------------------ SOCKET.IO ------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  // ── ✅ Chat message notification ──────────────
  socket.on("notify_message", async ({ senderId, senderName, receiverId }) => {
    try {
      // Save notification to DB
      const notification = await Notification.create({
        user:    receiverId,
        message: `💬 ${senderName} sent you a message`,
        type:    "message",
        read:    false,
      });

      // Emit toast popup to receiver
      io.to(String(receiverId)).emit("new_notification", {
        _id:       notification._id,
        message:   notification.message,
        type:      notification.type,
        createdAt: notification.createdAt,
      });

    } catch (err) {
      console.error("notify_message error:", err);
    }
  });

  // ── Video call room join ──────────────────────
  socket.on("join-room", (roomId) => {
    const clients    = io.sockets.adapter.rooms.get(roomId);
    const numClients = clients ? clients.size : 0;
    socket.join(roomId);
    if (numClients === 0) {
      socket.emit("you-are-first");
    } else {
      socket.emit("you-are-second");
      socket.to(roomId).emit("second-user-joined");
    }
  });

  // ── WebRTC signaling ──────────────────────────
  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data.offer);
  });
  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data.answer);
  });
  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data.candidate);
  });

  // ── In-call chat ──────────────────────────────
  socket.on("call-message", (data) => {
    socket.to(data.roomId).emit("call-message", {
      text:   data.text,
      sender: data.sender,
      time:   data.time,
    });
  });

  // ── Emoji reactions ───────────────────────────
  socket.on("call-emoji", (data) => {
    socket.to(data.roomId).emit("call-emoji", {
      emoji:  data.emoji,
      sender: data.sender,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ------------------ MIDDLEWARE ------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://skill-swap-1-4w1n.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(passport.initialize());

// ------------------ DATABASE ------------------
connectDB();

// ------------------ TEST ------------------
app.get("/", (req, res) => {
  res.send("SkillSwap Backend Running");
});

// ------------------ ROUTES ------------------
app.use("/api/auth",          authRoutes);
app.use("/api/user",          userRoutes);
app.use("/api/requests",      requestRoutes);
app.use("/api/sessions",      sessionRoutes);
app.use("/api/skills",        skillRoutes);
app.use("/api/public",        publicRoutes);
app.use("/api/swaps",         skillSwapRoutes);
app.use("/api/match",         matchRoutes);
app.use("/api/chat",          chatRoutes);
app.use("/api/video",         videoRoutes);
app.use("/api/dashboard",     dashboardRoutes);
app.use("/api/ai",            aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews",       reviewRoutes);
app.use("/api/leaderboard",   leaderboardRoutes);
app.use("/api/webhooks", webhookRoutes);
// ------------------ SERVER ------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

