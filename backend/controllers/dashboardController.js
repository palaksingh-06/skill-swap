// controllers/dashboardController.js
const Session = require("../models/Session");
const Request = require("../models/Request");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Pending requests sent TO me
    const skillRequests = await Request.countDocuments({
      toUser: userId,
      status: "pending",
    });

    // Active sessions = upcoming/scheduled and NOT yet expired
    // Expired = 1 hour AFTER session start time (mirrors frontend logic)
    const now = new Date();

    const allSessions = await Session.find({
      $or: [{ userA: userId }, { userB: userId }],
      status: { $in: ["upcoming", "scheduled"] }, // ✅ removed "pending"
    });

    const activeSessions = allSessions.filter((s) => {
      if (!s.date || !s.time) return true; // no schedule yet = still active
      const sessionStart = new Date(`${s.date}T${s.time}`);
      const expiryTime = new Date(sessionStart.getTime() + 60 * 60 * 1000); // ✅ +1 hour
      return now < expiryTime; // ✅ not yet expired
    });

    // Completed sessions = skills shared
    // Also count sessions that SHOULD be completed (expired upcoming/scheduled)
    const expiredAsCompleted = allSessions.filter((s) => {
      if (!s.date || !s.time) return false;
      const sessionStart = new Date(`${s.date}T${s.time}`);
      const expiryTime = new Date(sessionStart.getTime() + 60 * 60 * 1000);
      return now >= expiryTime; // ✅ expired but still marked upcoming/scheduled in DB
    });

    const actualCompleted = await Session.countDocuments({
      $or: [{ userA: userId }, { userB: userId }],
      status: "completed",
    });

    const skillsShared = actualCompleted + expiredAsCompleted.length; // ✅ true total

    res.json({
      skillRequests,
      activeSessions: activeSessions.length,
      skillsShared,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};