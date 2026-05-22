import { useState } from "react";
import StarRating from "./StarRating";

const REVIEW_XP = 3;

const ReviewModal = ({ session, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const reviewType = session.role === "teacher" ? "learner" : "teacher";
  const reviewingLabel = session.role === "teacher" ? "learner" : "teacher";

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://skill-swap-zkfd.onrender.com/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: session._id,
          rating,
          comment,
          reviewType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Failed to submit review.");
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        onSubmitted && onSubmitted(data);
        onClose();
      }, 2000);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Leave a Review
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#1F8F7A] text-xl"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="text-5xl">🎉</div>
            <p className="font-semibold text-lg text-[#1F8F7A]">
              Review submitted!
            </p>

            <div className="px-4 py-2 rounded-lg bg-[#E8F5F2]">
              <span className="font-medium text-[#1F8F7A]">
                +{REVIEW_XP} XP earned
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Session Info */}
            <div className="flex items-center gap-3 bg-[#E8F5F2] rounded-xl p-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1F8F7A] flex items-center justify-center text-white font-bold">
                {session.partnerName?.[0]?.toUpperCase() || "?"}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">
                  {session.partnerName}
                </p>
                <p className="text-xs text-gray-500">
                  {session.skillName} · Reviewing as {reviewingLabel}
                </p>
              </div>
            </div>

            {/* XP Info */}
            <div className="text-sm bg-[#E8F5F2] rounded-lg px-3 py-2 mb-4">
              You'll earn{" "}
              <span className="text-[#1F8F7A] font-semibold">
                +{REVIEW_XP} XP
              </span>{" "}
              for leaving a review
            </div>

            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                Rating *
              </label>

              <StarRating value={rating} onChange={setRating} />
            </div>

            {/* Comment */}
            <div className="mb-5">
              <label className="block text-sm text-gray-600 mb-2">
                Review (optional)
              </label>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Write your review..."
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1F8F7A]"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-[#1F8F7A] text-[#1F8F7A] py-2 rounded-lg hover:bg-[#1F8F7A] hover:text-white transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-[#1F8F7A] text-white py-2 rounded-lg hover:bg-[#187a68] transition"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;