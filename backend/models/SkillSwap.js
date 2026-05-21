const mongoose = require("mongoose");

const skillSwapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  skillOffered: {
    type: String,
    required: true,
  },

  skillWanted: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  isTrending: {
    type: Boolean,
    default: false,
  },

  views: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["open", "matched", "closed"],
    default: "open",
  },
}, { timestamps: true });

module.exports = mongoose.model("SkillSwap", skillSwapSchema);
