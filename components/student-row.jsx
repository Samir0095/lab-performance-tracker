import { forwardRef, useState } from "react";
import { Star } from "lucide-react";

export const StudentRow = forwardRef(function StudentRow(
  {
    studentId,
    name,
    roll,
    markingType = "star",
    scale = 5,
    value = "",
    onMarkChange,
    onEnter,
  },
  ref
) {
  const [hoverValue, setHoverValue] = useState(null);

  const handleChange = (e) => {
    let value = e.target.value;

    if (value === "") {
      onMarkChange?.(studentId, "");
      return;
    }

    let num = Number(value);

    if (num > scale) num = scale;
    if (num < 0) num = 0;

    onMarkChange?.(studentId, num);
  };

  const handleStarClick = (starValue) => {
    if (Number(value) === starValue) {
      onMarkChange?.(studentId, ""); // Toggle off if clicking the already selected star
    } else {
      onMarkChange?.(studentId, starValue);
    }
  };

  return (
    <div className="grid grid-cols-[1.4fr_1fr_1.1fr] sm:grid-cols-[1.5fr_1fr_1fr] gap-1.5 sm:gap-3">
      <div className="bg-white rounded-md px-2.5 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-600 shadow-sm border truncate">
        {name}
      </div>

      <div className="bg-white rounded-md px-2.5 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-600 shadow-sm border truncate">
        {roll}
      </div>

      <div className="bg-white rounded-md px-2.5 sm:px-4 py-1.5 sm:py-2 shadow-sm border flex items-center min-h-[34px] sm:min-h-[38px]">
        {markingType === "star" ? (
          <div 
            className="flex items-center gap-0.5"
            onMouseLeave={() => setHoverValue(null)}
          >
            {Array.from({ length: scale }).map((_, i) => {
              const starValue = i + 1;
              const isFilled = hoverValue !== null 
                ? starValue <= hoverValue 
                : starValue <= Number(value);

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleStarClick(starValue)}
                  onMouseEnter={() => setHoverValue(starValue)}
                  className="focus:outline-none transition-transform duration-100 hover:scale-110 active:scale-90"
                >
                  <Star
                    className={`h-5 w-5 transition-all duration-150 ${
                      isFilled
                        ? "fill-amber-400 text-amber-500"
                        : "fill-transparent text-gray-300 hover:text-amber-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <input
            ref={ref}
            type="number"
            min={0}
            max={scale}
            value={value}
            onChange={handleChange}
            className="w-full outline-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onEnter?.();
              }
            }}
          />
        )}
      </div>
    </div>
  );
});