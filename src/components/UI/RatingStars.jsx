import { Star } from "lucide-react";

export default function RatingStars({ 
  rating = 0, 
  max = 5, 
  onRatingChange, 
  size = 20, 
  interactive = false,
  className = "" 
}) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className={`flex gap-1 ${className}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange?.(star)}
          className={`${interactive ? "cursor-pointer transition-transform hover:scale-110 active:scale-95" : "cursor-default"}`}
        >
          <Star
            size={size}
            className={`${
              star <= rating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300 fill-gray-100"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
