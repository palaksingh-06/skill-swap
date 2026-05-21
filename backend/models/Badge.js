const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true }, 
  title: String,
  description: String,

  // what activity unlocks it
  criteria: {
    type: String,
    enum: [
      "sessions_completed",
      "sessions_hosted",
      "login_streak"
    ]
  },

  target: Number, // required count (1, 5, 30, etc)
  points: Number
});

module.exports = mongoose.model("Badge", badgeSchema);
