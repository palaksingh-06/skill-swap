// src/components/StarRating.jsx
// Reusable star rating component — interactive or read-only

const StarRating = ({ value, onChange, readOnly = false, size = "md" }) => {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          className={`
            ${sizes[size]} transition-transform duration-100
            ${!readOnly ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"}
            ${star <= value ? "text-yellow-400" : "text-gray-600"}
          `}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;