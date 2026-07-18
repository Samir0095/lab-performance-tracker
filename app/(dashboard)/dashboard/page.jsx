"use client";

import { useState, useRef } from "react";
import { StudentRow } from "@/components/student-row";

const students = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: "",
  roll: "",
  marks: "",
}));

export default function DashboardPage() {
  const [markingType, setMarkingType] = useState("star");
  const [scale, setScale] = useState(5);

  const inputRefs = useRef([]);

  const leftColumn = students.slice(0, 15);
  const rightColumn = students.slice(15, 30);

  const focusNext = (index) => {
    const next = inputRefs.current[index + 1];
    if (next) next.focus();
  };

  return (
    <div className="px-6 pb-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 font-semibold">
            Lab No.
            <select className="border rounded-md px-2 py-1 text-sm">
              <option>08</option>
            </select>
          </div>

          <div className="flex items-center gap-2 font-semibold">
            📅 Date
            <input type="date" className="border rounded-md px-2 py-1 text-sm" />
          </div>

          <div className="flex items-center gap-2 font-semibold">
            Marking
            <select
              value={markingType}
              onChange={(e) => setMarkingType(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="star">Star Rating</option>
              <option value="number">Number Mark</option>
            </select>

            <select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value={5}>Out of 5</option>
              <option value={10}>Out of 10</option>
            </select>
          </div>

          <div className="flex items-center gap-2 font-semibold">
            <select className="border rounded-md px-2 py-1 text-sm">
              <option>1st 30</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            {leftColumn.map((s, i) => (
              <StudentRow
                key={s.id}
                ref={(el) => (inputRefs.current[i] = el)}
                name={s.name}
                roll={s.roll}
                marks={s.marks}
                markingType={markingType}
                scale={scale}
                onEnter={() => focusNext(i)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {rightColumn.map((s, i) => {
              const globalIndex = i + 15;
              return (
                <StudentRow
                  key={s.id}
                  ref={(el) => (inputRefs.current[globalIndex] = el)}
                  name={s.name}
                  roll={s.roll}
                  marks={s.marks}
                  markingType={markingType}
                  scale={scale}
                  onEnter={() => focusNext(globalIndex)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}