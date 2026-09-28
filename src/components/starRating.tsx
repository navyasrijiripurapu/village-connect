import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  size?: number;
};

export function StarRating({
  value,
  size = 16,
}: StarRatingProps) {
  const safeValue = Math.max(
    0,
    Math.min(5, Number(value) || 0)
  );

  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label={`Rating ${safeValue.toFixed(1)} out of 5`}
    >
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={
              i <= Math.round(safeValue)
                ? "fill-warning text-warning"
                : "text-muted-foreground/40"
            }
          />
        ))}
      </span>

      <span className="text-sm font-semibold text-foreground">
        {safeValue.toFixed(1)}
      </span>
    </span>
  );
}