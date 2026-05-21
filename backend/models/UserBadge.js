const mongoose = require("mongoose");

const userBadgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  badge: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },

  progress: { type: Number, default: 0 },
  earned: { type: Boolean, default: false },
  earnedAt: Date
});

module.exports = mongoose.model("UserBadge", userBadgeSchema);
