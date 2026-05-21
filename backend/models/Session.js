const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skill: {
      type: String,
      required: true,
    },
    date: { type: String, default: null },
    time: { type: String, default: null },
    notes: { type: String, default: null },
    videoCallLink: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      // ✅ Added "upcoming" to enum
      enum: ["pending", "upcoming", "scheduled", "completed", "cancelled"],
      default: "pending",
    },
    // Session.js
    callId: { type: String, default: null, index: true },
    recordingUrl:       { type: String, default: null },
    recordingDuration:  { type: Number, default: null },
    recordingCreatedAt: { type: Date,   default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
