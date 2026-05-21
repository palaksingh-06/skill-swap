const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // Who wrote the review
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Who is being reviewed
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The session this review is for
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    // The skill that was taught/learned
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      default: null,
    },

    // "teacher" = reviewer is rating the teacher | "learner" = reviewer is rating the learner
    reviewType: {
      type: String,
      enum: ["teacher", "learner"],
      required: true,
    },

    // Star rating 1–5
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    // Written review
    comment: {
      type: String,
      maxLength: 1000,
      default: "",
    },

    // XP awarded to reviewer for leaving this review
    xpAwarded: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// One review per user per session (prevent duplicate reviews)
reviewSchema.index({ reviewer: 1, session: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);