const User = require("../models/User");

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}, "name profilePic xp level badges")
      .sort({ xp: -1 })
      .limit(20);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      _id: user._id,
      name: user.name,
      profilePic: user.profilePic,
      xp: user.xp || 0,
      level: user.level || 1,
      badgeCount: user.badges?.length || 0,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getLeaderboard };