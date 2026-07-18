import { forwardRef } from "react";

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

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] gap-3">
      <div className="bg-white rounded-md px-4 py-2 text-sm font-medium text-gray-600 shadow-sm border">
        {name}
      </div>

      <div className="bg-white rounded-md px-4 py-2 text-sm font-medium text-gray-600 shadow-sm border">
        {roll}
      </div>

      <div className="bg-white rounded-md px-4 py-2 shadow-sm border flex items-center">
        {markingType === "star" ? (
          Array.from({ length: scale }).map((_, i) => (
            <span
              key={i}
              className="cursor-pointer text-gray-300 hover:text-yellow-400"
            >
              ★
            </span>
          ))
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