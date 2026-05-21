const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  submitReview,
  getReviewsForUser,
  getSessionReviewStatus,
  getMyReviews,
} = require("../controllers/reviewController");

// POST   /api/reviews            → Submit a review (auth required)
router.post("/", auth, submitReview);

// GET    /api/reviews/my         → All reviews I wrote (auth required)
router.get("/my", auth, getMyReviews);

// GET    /api/reviews/session/:sessionId → Did I already review this session?
router.get("/session/:sessionId", auth, getSessionReviewStatus);

// GET    /api/reviews/user/:userId → All reviews on a user's profile (public)
router.get("/user/:userId", getReviewsForUser);

module.exports = router;