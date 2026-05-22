// src/pages/PostCallReview.jsx
// Shown to BOTH users after a video call ends
// Each user rates the other person

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import StarRating from "../components/StarRating";

const REVIEW_XP = 10;

const PostCallReview = () => {
  const { sessionId } = useParams();
  const navigate      = useNavigate();
  const { user }      = useContext(AuthContext);

  const [session,    setSession]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [rating,     setRating]     = useState(0);
  const [comment,    setComment]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");
  const [alreadyDone,setAlreadyDone]= useState(false);
  const [timeLeft,   setTimeLeft]   = useState(30); // auto-skip countdown

  // ── Fetch session info ──────────────────────────────────
  useEffect(() => {
    if (!sessionId || !user) return;

    const fetchSession = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get session details
        const [sessRes, reviewRes] = await Promise.all([
          axios.get(`https://skill-swap-zkfd.onrender.com/api/sessions/completed`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://skill-swap-zkfd.onrender.com/api/reviews/session/${sessionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Find this specific session
        const sessions = sessRes.data.sessions || sessRes.data || [];
        const found = sessions.find((s) => s._id === sessionId);
        setSession(found || null);

        // Check if already reviewed
        if (reviewRes.data.hasReviewed) {
          setAlreadyDone(true);
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, user]);

  // ── Auto-skip countdown ─────────────────────────────────
  useEffect(() => {
    if (submitted || alreadyDone || loading) return;
    if (timeLeft <= 0) {
      navigate("/sessions");
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, submitted, alreadyDone, loading, navigate]);

  // ── Submit review ───────────────────────────────────────
  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select at least 1 star.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // reviewType: current user is reviewing their PARTNER
      // If current user is the teacher (userB) → reviewing the learner
      // If current user is the learner (userA) → reviewing the teacher
      const reviewType = session?.role === "teacher" ? "learner" : "teacher";

      await axios.post(
        "https://skill-swap-zkfd.onrender.com/api/reviews",
        { sessionId, rating, comment, reviewType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitted(true);

      // Redirect to profile after 3s
      setTimeout(() => navigate("/profile"), 3000);
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to submit review.";
      if (msg.includes("already")) {
        setAlreadyDone(true);
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => navigate("/sessions");

  // ── Partner info ────────────────────────────────────────
  const partnerName   = session?.partnerName   || "your session partner";
  const partnerAvatar = session?.partnerAvatar || null;
  const skillName     = session?.skillName     || "Skill Exchange";

  // ── Render ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">

        {/* ── Already reviewed ── */}
        {alreadyDone && (
          <motion.div
            key="already"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="text-6xl">✅</div>
            <h2 className="text-white text-2xl font-bold">Already Reviewed!</h2>
            <p className="text-gray-400">You already submitted a review for this session.</p>
            <button
              onClick={() => navigate("/profile")}
              className="mt-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-medium transition"
            >
              Go to Profile
            </button>
          </motion.div>
        )}

        {/* ── Success state ── */}
        {submitted && !alreadyDone && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex flex-col items-center gap-5 text-center"
          >
            {/* Stars burst */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.5 }}
              className="text-7xl"
            >
              🎉
            </motion.div>

            <h2 className="text-white text-3xl font-bold">Review Submitted!</h2>
            <p className="text-gray-400 text-lg">Thanks for rating {partnerName}</p>

            {/* XP badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-6 py-4"
            >
              <span className="text-4xl">⚡</span>
              <div className="text-left">
                <p className="text-yellow-300 font-bold text-xl">+{REVIEW_XP} XP Earned!</p>
                <p className="text-yellow-400/70 text-sm">Keep reviewing to level up</p>
              </div>
            </motion.div>

            {/* Star display */}
            <div className="flex gap-1">
              {[1,2,3,4,5].map((s) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + s * 0.08 }}
                  className={`text-3xl ${s <= rating ? "text-yellow-400" : "text-gray-700"}`}
                >
                  ★
                </motion.span>
              ))}
            </div>

            <p className="text-gray-500 text-sm">Redirecting to your profile in 3s...</p>

            <button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-medium transition"
            >
              Go to Profile Now
            </button>
          </motion.div>
        )}

        {/* ── Review form ── */}
        {!submitted && !alreadyDone && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="text-5xl mb-4"
              >
                🌟
              </motion.div>
              <h1 className="text-white text-2xl font-bold mb-2">Session Complete!</h1>
              <p className="text-gray-400 text-sm">
                How was your skill exchange with{" "}
                <span className="text-teal-400 font-medium">{partnerName}</span>?
              </p>
            </div>

            <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-2xl">

              {/* Partner info */}
              <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 mb-6">
                {partnerAvatar ? (
                  <img
                    src={partnerAvatar}
                    alt={partnerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/40"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {partnerName[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold">{partnerName}</p>
                  <p className="text-gray-400 text-xs">{skillName}</p>
                </div>
                {/* Skill swap badge */}
                <div className="ml-auto flex items-center gap-1 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
                  <span className="text-teal-400 text-xs">🔄 Skill Swap</span>
                </div>
              </div>

              {/* XP nudge */}
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5 mb-6">
                <span className="text-yellow-400">⚡</span>
                <span className="text-yellow-300 text-sm">
                  Leave a review and earn <strong>+{REVIEW_XP} XP</strong>
                </span>
              </div>

              {/* Star rating */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-3">
                  Your Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-col items-center gap-2">
                  <StarRating value={rating} onChange={setRating} size="lg" />
                  {rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-400 text-sm"
                    >
                      {["", "Poor 😞", "Fair 😐", "Good 😊", "Very Good 😄", "Excellent 🤩"][rating]}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">
                  Write a Review{" "}
                  <span className="text-gray-600">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder={`Share your experience with ${partnerName}...`}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-gray-600 resize-none focus:outline-none focus:border-teal-500/50 transition-colors"
                />
                <p className="text-gray-700 text-xs mt-1 text-right">{comment.length}/1000</p>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-2xl py-3 text-sm font-medium transition"
                >
                  Skip ({timeLeft}s)
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || rating === 0}
                  className="flex-2 flex-grow-[2] bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl py-3 text-sm font-semibold transition"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Review ⭐"
                  )}
                </button>
              </div>
            </div>

            {/* Progress bar for auto-skip */}
            <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal-500/40 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 30, ease: "linear" }}
              />
            </div>
            <p className="text-center text-gray-600 text-xs mt-2">
              Auto-skipping in {timeLeft}s
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default PostCallReview;



