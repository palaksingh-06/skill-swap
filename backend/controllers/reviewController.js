const Review = require("../models/Review");
const Session = require("../models/Session");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { awardXP, XP, checkAndAwardBadges } = require("../utils/xpUtils");

const REVIEW_XP = XP.LEAVE_REVIEW;

// ─── Helper: emit notification ────────────────────────────
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

// ─────────────────────────────────────────────
// POST /api/reviews
// ─────────────────────────────────────────────
exports.submitReview = async (req, res) => {
  try {
    const reviewerId = req.user.id;
    const { sessionId, rating, comment, reviewType } = req.body;

    if (!sessionId || !rating || !reviewType) {
      return res.status(400).json({ msg: "sessionId, rating, and reviewType are required" });
    }
    if (!["teacher", "learner"].includes(reviewType)) {
      return res.status(400).json({ msg: "reviewType must be 'teacher' or 'learner'" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    const session = await Session.findById(sessionId).populate("skill", "name");
    if (!session) return res.status(404).json({ msg: "Session not found" });
    if (session.status !== "completed") {
      return res.status(400).json({ msg: "You can only review completed sessions" });
    }

    const isParticipant =
      session.userA.toString() === reviewerId ||
      session.userB.toString() === reviewerId;
    if (!isParticipant) {
      return res.status(403).json({ msg: "You are not a participant of this session" });
    }

    const existing = await Review.findOne({ reviewer: reviewerId, session: sessionId });
    if (existing) return res.status(409).json({ msg: "You have already reviewed this session" });

    let revieweeId;
    if (reviewType === "teacher") {
      revieweeId = session.userB.toString();
    } else {
      revieweeId = session.userA.toString();
    }

    const review = await Review.create({
      reviewer:  reviewerId,
      reviewee:  revieweeId,
      session:   sessionId,
      skill:     session.skill?._id || null,
      reviewType,
      rating,
      comment:   comment || "",
      xpAwarded: REVIEW_XP,
    });

    //  +10 XP to reviewer for leaving a review
    await awardXP(reviewerId, REVIEW_XP, "Left a review");

    //  +15 XP to reviewee if they received a 5★ review
    if (rating === 5) {
      await awardXP(revieweeId, XP.RECEIVE_5STAR, "Received a 5-star review");
    }

    const reviewer  = await User.findById(reviewerId).select("name");
    const skillName = session.skill?.name || "a skill";

    // Notify reviewee about the review
    await emitNotification(
      revieweeId,
      `${reviewer.name} left you a ${rating}⭐ review for ${skillName}${rating === 5 ? " (+5 XP bonus!)" : ""}`,
      "review"
    );

    //  Check badges — notify if any earned
    const reviewerBadges = await checkAndAwardBadges(reviewerId);
    const revieweeBadges = await checkAndAwardBadges(revieweeId);

    if (reviewerBadges?.length > 0) {
      for (const badge of reviewerBadges) {
        await emitNotification(
          reviewerId,
          `🏅 You earned the "${badge.name}" badge!`,
          "badge"
        );
        // Also emit badge-earned for the celebration animation
        if (global.io) {
          global.io.to(String(reviewerId)).emit("badge-earned", badge);
        }
      }
    }

    if (revieweeBadges?.length > 0) {
      for (const badge of revieweeBadges) {
        await emitNotification(
          revieweeId,
          `🏅 You earned the "${badge.name}" badge!`,
          "badge"
        );
        if (global.io) {
          global.io.to(String(revieweeId)).emit("badge-earned", badge);
        }
      }
    }

    // Update reviewee's average rating
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avgRating  = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalReviews:  allReviews.length,
    });

    return res.status(201).json({
      msg:       "Review submitted successfully",
      review,
      xpAwarded: REVIEW_XP,
      bonusXP:   rating === 5 ? XP.RECEIVE_5STAR : 0,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ msg: "You have already reviewed this session" });
    }
    console.error("submitReview error:", err);
    return res.status(500).json({ msg: "Failed to submit review" });
  }
};

// ─────────────────────────────────────────────
// GET /api/reviews/user/:userId
// ─────────────────────────────────────────────
exports.getReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId })
      .populate("reviewer", "name avatar")
      .populate("skill", "name category")
      .sort({ createdAt: -1 })
      .lean();

    const shaped = reviews.map((r) => ({
      _id:            r._id,
      reviewerName:   r.reviewer?.name   || "Anonymous",
      reviewerAvatar: r.reviewer?.avatar || null,
      skillName:      r.skill?.name      || "Skill Exchange",
      skillCategory:  r.skill?.category  || null,
      reviewType:     r.reviewType,
      rating:         r.rating,
      comment:        r.comment,
      createdAt:      r.createdAt,
    }));

    const avgRating =
      shaped.length > 0
        ? parseFloat((shaped.reduce((s, r) => s + r.rating, 0) / shaped.length).toFixed(1))
        : null;

    return res.status(200).json({ reviews: shaped, total: shaped.length, averageRating: avgRating });
  } catch (err) {
    console.error("getReviewsForUser error:", err);
    return res.status(500).json({ msg: "Failed to fetch reviews" });
  }
};

// ─────────────────────────────────────────────
// GET /api/reviews/session/:sessionId
// ─────────────────────────────────────────────
exports.getSessionReviewStatus = async (req, res) => {
  try {
    const reviewerId  = req.user.id;
    const { sessionId } = req.params;

    const existing = await Review.findOne({
      reviewer: reviewerId,
      session:  sessionId,
    }).lean();

    return res.status(200).json({ hasReviewed: !!existing, review: existing || null });
  } catch (err) {
    console.error("getSessionReviewStatus error:", err);
    return res.status(500).json({ msg: "Failed to check review status" });
  }
};

// ─────────────────────────────────────────────
// GET /api/reviews/my
// ─────────────────────────────────────────────
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user.id })
      .populate("reviewee", "name avatar")
      .populate("skill", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ reviews, total: reviews.length });
  } catch (err) {
    console.error("getMyReviews error:", err);
    return res.status(500).json({ msg: "Failed to fetch your reviews" });
  }
};

