//Samia
// const express = require("express");
// const auth = require("../middleware/authMiddleware");
// const router = express.Router();

// const {
//   createSessionFromRequest,
//   getMySessions,
//   deleteSession,
//   scheduleSession,
//   completeSession,
//   completeByRoom,
//   getCompletedSessions, // ✅ new
// } = require("../controllers/sessionController");

// router.post("/create-from-request", auth, createSessionFromRequest);
// router.get("/", auth, getMySessions);  
// router.get("/my", auth, getMySessions);
// router.get("/completed", auth, getCompletedSessions); // ✅ new — must be BEFORE /:id routes

// router.put("/:id/schedule", auth, scheduleSession);
// router.put("/:id/complete", auth, completeSession);
// router.put("/complete-by-room/:roomId", auth, completeByRoom);
// router.delete("/:id", auth, deleteSession);

// module.exports = router;
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Session = require("../models/Session");
const router = express.Router();

const {
  createSessionFromRequest,
  getMySessions,
  deleteSession,
  scheduleSession,
  completeSession,
  completeByRoom,
  getCompletedSessions,
} = require("../controllers/sessionController");

router.post("/create-from-request", auth, createSessionFromRequest);
router.get("/", auth, getMySessions);
router.get("/my", auth, getMySessions);
router.get("/completed", auth, getCompletedSessions);

router.get("/:sessionId/recording", auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const userId = req.user._id.toString();

    const isParticipant =
      session.userA?.toString() === userId ||
      session.userB?.toString() === userId;

    if (!isParticipant) {
      console.warn(`[Recording] Access denied — userId: ${userId}, userA: ${session.userA}, userB: ${session.userB}`);
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      recordingUrl: session.recordingUrl       || null,
      duration:     session.recordingDuration  || null,
      createdAt:    session.recordingCreatedAt || null,
    });
  } catch (err) {
    console.error("[Recording] Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/:id/call-id", auth, async (req, res) => {
  try {
    const { callId } = req.body;
    if (!callId) return res.status(400).json({ message: "callId is required" });

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { callId },
      { new: true }
    );

    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ session });
  } catch (err) {
    console.error("[call-id] Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id/schedule", auth, scheduleSession);
router.put("/:id/complete", auth, completeSession);
router.put("/complete-by-room/:roomId", auth, completeByRoom);
router.delete("/:id", auth, deleteSession);

// ✅ This was missing — caused "object" export instead of function
module.exports = router;