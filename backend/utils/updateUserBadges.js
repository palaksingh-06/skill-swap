const Badge = require("../models/Badge");
const UserBadge = require("../models/UserBadge");
const Session = require("../models/Session");

const updateUserBadges = async (userId) => {
  const badges = await Badge.find();

  // REAL USER DATA
  const completedSessions = await Session.countDocuments({
    $or: [{ user1: userId }, { user2: userId }],
    status: "completed"
  });

  const hostedSessions = await Session.countDocuments({
    user1: userId,
    status: "completed"
  });

  for (const badge of badges) {
    let progress = 0;

    if (badge.criteria === "sessions_completed") {
      progress = completedSessions;
    }

    if (badge.criteria === "sessions_hosted") {
      progress = hostedSessions;
    }

    const earned = progress >= badge.target;

    await UserBadge.findOneAndUpdate(
      { user: userId, badge: badge._id },
      {
        progress,
        earned,
        earnedAt: earned ? new Date() : null
      },
      { upsert: true }
    );
  }
};

module.exports = updateUserBadges;
