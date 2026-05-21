// src/components/ReviewCard.jsx

import StarRating from "./StarRating";

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const ReviewCard = ({ review }) => {
  const {
    reviewerName,
    reviewerAvatar,
    skillName,
    reviewType,
    rating,
    comment,
    createdAt,
  } = review;

  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col gap-3">
      {/* Top row: avatar + name + date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {reviewerAvatar ? (
            <img
              src={reviewerAvatar}
              alt={reviewerName}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-success flex items-center justify-center text-success-content font-bold text-sm shrink-0">
              {reviewerName?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p className="text-base-content text-sm font-medium">
              {reviewerName}
            </p>
            <p className="text-base-content/50 text-xs capitalize">
              Reviewed you as a{" "}
              <span className="text-success font-medium">{reviewType}</span>
            </p>
          </div>
        </div>
        <span className="text-base-content/40 text-xs">{timeAgo(createdAt)}</span>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-2">
        <StarRating value={rating} readOnly size="sm" />
        <span className="text-warning text-sm font-semibold">{rating}.0</span>
      </div>

      {/* Skill pill */}
      {skillName && (
        <span className="self-start text-xs badge badge-outline badge-success">
          {skillName}
        </span>
      )}

      {/* Comment */}
      {comment && (
        <p className="text-base-content/70 text-sm leading-relaxed border-t border-base-300 pt-3">
          "{comment}"
        </p>
      )}
    </div>
  );
};

export default ReviewCard;