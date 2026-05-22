// src/components/ReviewsSection.jsx

import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";

const ReviewsSection = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `https://skill-swap-zkfd.onrender.com/api/reviews/user/${userId}`
        );
        const data = await res.json();

        if (res.ok) {
          setReviews(data.reviews || []);
          setAverageRating(data.averageRating);
          setTotal(data.total || 0);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      pct: total > 0 ? (count / total) * 100 : 0,
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <span className="loading loading-spinner loading-md text-success" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <h2 className="text-base-content font-semibold text-lg">Reviews</h2>

      {total === 0 ? (
        <div className="text-center py-10 text-base-content/50 text-sm">
          No reviews yet.
        </div>
      ) : (
        <>
          {/* Summary Card */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-5 flex flex-col sm:flex-row gap-6">

            {/* Average score */}
            <div className="flex flex-col items-center justify-center gap-1 min-w-[100px]">
              <span className="text-5xl font-bold text-base-content">
                {averageRating ?? "—"}
              </span>

              <StarRating
                value={Math.round(averageRating || 0)}
                readOnly
                size="sm"
              />

              <span className="text-base-content/50 text-xs">
                {total} review{total !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Breakdown bars */}
            <div className="flex flex-col gap-2 flex-1 justify-center">
              {breakdown.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="text-base-content/50 w-3">{star}</span>

                  <span className="text-warning">★</span>

                  <div className="flex-1 bg-base-300 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-warning h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <span className="text-base-content/50 w-4">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Cards */}
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsSection;