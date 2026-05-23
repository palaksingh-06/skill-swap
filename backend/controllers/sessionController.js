


const Session = require("../models/Session");
const Request = require("../models/Request");
const Notification = require("../models/Notification");
const generateVideoLink = require("../utils/generateVideoLink");
const { v4: uuidv4 } = require("uuid");
const { awardXP, hasEarnedOneTimeXP, markOneTimeXP, XP } = require("../utils/xpUtils");

// ─── Helper: award session XP to both users ───────────────
async function awardSessionXP(session) {
  const userAId = session.userA?.toString();
  const userBId = session.userB?.toString();
  if (!userAId || !userBId) return;

  for (const userId of [userAId, userBId]) {
    await awardXP(userId, XP.COMPLETE_SESSION, "Session completed");

    const alreadyGotFirst = await hasEarnedOneTimeXP(userId, "first_session");
    if (!alreadyGotFirst) {
      await awardXP(userId, XP.FIRST_SESSION, "First session ever!");
      await markOneTimeXP(userId, "first_session");
    }
  }
}

// ─── Helper: emit notification to a user ──────────────────
async function emitNotification(userId, message, type = "session") {
  try {
    const notification = await Notification.create({
      user: userId,
      message,
      type,
      read: false,
    });

    if (global.io) {
      global.io.to(String(userId)).emit("new_notification", {
        _id:       notification._id,
        message:   notification.message,
        type:      notification.type,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (err) {
    console.error("emitNotification error:", err);
  }
}

//  Create session FROM request
exports.createSessionFromRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Request.findById(requestId);

    if (!request || request.status !== "accepted") {
      return res.status(400).json({ msg: "Invalid or unaccepted request" });
    }

    const session = await Session.create({
      userA: request.fromUser,
      userB: request.toUser,
      skill: request.skill,
      status: "pending",
    });

    // Notify both users
    await emitNotification(
      request.fromUser,
      `Your learning session for ${request.skill} has been created`,
      "session"
    );
    await emitNotification(
      request.toUser,
      `Your learning session for ${request.skill} has been created`,
      "session"
    );

    res.json({ msg: "Session created", session });
  } catch (err) {
    console.error("Create session error:", err);
    res.status(500).json({ msg: "Session creation failed" });
  }
};

//  Get my sessions
exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ userA: req.user.id }, { userB: req.user.id }],
    })
      .populate("userA", "name email")
      .populate("userB", "name email")
      .sort({ createdAt: -1 });

    const now = new Date();
    for (const s of sessions) {
      if (s.date && s.time && (s.status === "upcoming" || s.status === "scheduled")) {
        const sessionDateTime = new Date(`${s.date}T${s.time}`);
        const expiryTime = new Date(sessionDateTime.getTime() + 60 * 60 * 1000);
        if (now > expiryTime) {
          s.status = "completed";
          await s.save();
        }
      }
    }

    res.json(sessions);
  } catch (error) {
    console.error("Fetch sessions error:", error);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};


exports.scheduleSession = async (req, res) => {
  try {
    const { date, time, notes, mode, meetingLink } = req.body;
    const userId = req.user.id;
    const { v4: uuidv4 } = require('uuid');
    
    const roomId = uuidv4();
    // Use the meeting link provided by user, or fallback to your internal video call link
    const finalLink = mode === "Custom" ? meetingLink : `https://skill-swap-1-4w1n.onrender.com/video-call/${roomId}`;

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { 
        date, 
        time, 
        notes, 
        status: "upcoming", 
        videoCallLink: finalLink,
        mode 
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // ✅ XP Logic
    const alreadyScheduled = await hasEarnedOneTimeXP(userId, "first_schedule");
    let xpAwarded = false;

    if (!alreadyScheduled) {
      await awardXP(userId, 8, "First session scheduled!"); // Hardcoded 8 to match your popup
      await markOneTimeXP(userId, "first_schedule");
      xpAwarded = true; 
    }

    // Notifications
    const otherUserId = session.userA.toString() === userId ? session.userB : session.userA;
    await emitNotification(otherUserId, `Your session has been scheduled for ${date} at ${time}`, "session");
    await emitNotification(userId, `You scheduled a session for ${date} at ${time}`, "session");

    res.status(200).json({ 
      success: true, 
      message: "Session scheduled", 
      session, 
      xpAwarded // This tells React to show the popup
    });
  } catch (error) {
    console.error("Schedule session error:", error);
    res.status(500).json({ success: false, message: "Failed to schedule session" });
  }
};

// ✅ Complete by session ID
exports.completeSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { returnDocument: "after" }
    );

    if (!session) return res.status(404).json({ message: "Session not found" });

    await awardSessionXP(session);

    // ✅ Notify both users session is complete
    await emitNotification(
      session.userA,
      `Your session has been completed! Don't forget to leave a review.`,
      "session"
    );
    await emitNotification(
      session.userB,
      `Your session has been completed! Don't forget to leave a review.`,
      "session"
    );

    res.json({ success: true, session });
  } catch (error) {
    console.error("Complete session error:", error);
    res.status(500).json({ message: "Failed to complete session" });
  }
};

// ✅ Complete by roomId (used when leaving video call)
exports.completeByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const session = await Session.findOneAndUpdate(
      { videoCallLink: { $regex: roomId } },
      { status: "completed" },
      { returnDocument: "after" }
    );

    if (!session) return res.status(404).json({ message: "Session not found" });

    await awardSessionXP(session);

    // ✅ Notify both users
    await emitNotification(
      session.userA,
      `Your video session has ended! Leave a review for your partner.`,
      "session"
    );
    await emitNotification(
      session.userB,
      `Your video session has ended! Leave a review for your partner.`,
      "session"
    );

    res.json({ success: true, session });
  } catch (error) {
    console.error("Complete by room error:", error);
    res.status(500).json({ message: "Failed to complete session" });
  }
};

// ✅ Delete session
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    if (
      session.userA.toString() !== req.user.id &&
      session.userB.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // ✅ Notify the other user
    const otherUserId =
      session.userA.toString() === req.user.id
        ? session.userB
        : session.userA;

    await emitNotification(
      otherUserId,
      `A session has been cancelled by your partner.`,
      "session"
    );

    await session.deleteOne();
    res.json({ msg: "Session deleted" });
  } catch (err) {
    console.error("Delete session error:", err);
    res.status(500).json({ msg: "Failed to delete session" });
  }
};

// ✅ GET /api/sessions/completed
exports.getCompletedSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await Session.find({
      $or: [{ userA: userId }, { userB: userId }],
      status: "completed",
    })
      .populate("userA", "name avatar")
      .populate("userB", "name avatar")
      .populate("skill", "name category")
      .sort({ updatedAt: -1 })
      .lean();

    const shaped = sessions.map((s) => {
      const isTaught = s.userB?._id?.toString() === userId.toString();
      const partner  = isTaught ? s.userA : s.userB;
      return {
        _id:           s._id,
        skillName:     s.skill?.name     || "Skill Exchange",
        skillCategory: s.skill?.category || null,
        role:          isTaught ? "teacher" : "learner",
        isTaught,
        partnerName:   partner?.name     || "Unknown",
        partnerAvatar: partner?.avatar   || null,
        scheduledAt:   s.date ? `${s.date}T${s.time || "00:00"}` : null,
        duration:      s.duration        || null,
        rating:        s.rating          || null,
        notes:         s.notes           || null,
        createdAt:     s.createdAt,
      };
    });

    return res.status(200).json({ sessions: shaped, total: shaped.length });
  } catch (err) {
    console.error("getCompletedSessions error:", err);
    return res.status(500).json({ message: "Failed to fetch completed sessions" });
  }
};