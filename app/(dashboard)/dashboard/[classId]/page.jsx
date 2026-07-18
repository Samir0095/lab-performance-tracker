"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { StudentRow } from "@/components/student-row";

export default function DashboardPage() {
  const { classId } = useParams();

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  const [group, setGroup] = useState("1st 30");
  const [labNo, setLabNo] = useState(1);
  const [labDate, setLabDate] = useState("");

  const [markingType, setMarkingType] = useState("star");
  const [scale, setScale] = useState(5);

  const inputRefs = useRef([]);

  useEffect(() => {
    setLabDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    loadData();
  }, [classId, group, labNo]);

  async function loadData() {
    // Load students

    const { data: studentData } = await supabase
      .from("students")
      .select("*")
      .eq("class_id", classId)
      .eq("group_name", group)
      .order("serial_no");

    setStudents(studentData || []);

    let temp = {};

    (studentData || []).forEach((student) => {
      temp[student.id] = "";
    });

    // Find lab

    const { data: lab } = await supabase
      .from("labs")
      .select("*")
      .eq("class_id", Number(classId))
      .eq("lab_number", labNo)
      .eq("group_name", group)
      .maybeSingle();

    if (lab) {
      setLabDate(lab.lab_date);
      setMarkingType(lab.marking_type);
      setScale(lab.scale);

      // Load saved marks

      const { data: markData } = await supabase
        .from("marks")
        .select("*")
        .eq("lab_id", lab.id);

      markData?.forEach((m) => {
        temp[m.student_id] = m.score;
      });
    }

    setMarks(temp);
  }

  function handleMarkChange(studentId, value) {
    setMarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  }

  async function saveMarks() {
    let { data: lab } = await supabase
      .from("labs")
      .select("*")
      .eq("class_id", Number(classId))
      .eq("lab_number", labNo)
      .eq("group_name", group)
      .maybeSingle();

    if (!lab) {
      const { data: newLab, error } = await supabase
        .from("labs")
        .insert({
          class_id: Number(classId),
          lab_number: labNo,
          lab_date: labDate,
          group_name: group,
          marking_type: markingType,
          scale: scale,
        })
        .select()
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      lab = newLab;
    }

    const rows = students.map((student) => ({
      lab_id: lab.id,
      student_id: student.id,
      score:
        marks[student.id] === ""
          ? null
          : Number(marks[student.id]),
    }));

    const { error } = await supabase
      .from("marks")
      .upsert(rows);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Marks saved successfully!");
  }

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

            <select
              value={labNo}
              onChange={(e) => setLabNo(Number(e.target.value))}
              className="border rounded-md px-2 py-1 text-sm"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 font-semibold">
            📅 Date

            <input
              type="date"
              value={labDate}
              onChange={(e) => setLabDate(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            />
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
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option>1st 30</option>
              <option>2nd 30</option>
            </select>
          </div>

        </div>

        <div className="flex justify-end mb-5">
          <button
            onClick={saveMarks}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Save Marks
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">

          <div className="flex flex-col gap-3">
            {leftColumn.map((s, i) => (
              <StudentRow
                key={s.id}
                ref={(el) => (inputRefs.current[i] = el)}
                studentId={s.id}
                name={s.name}
                roll={s.roll}
                value={marks[s.id] ?? ""}
                onMarkChange={handleMarkChange}
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
                  studentId={s.id}
                  name={s.name}
                  roll={s.roll}
                  value={marks[s.id] ?? ""}
                  onMarkChange={handleMarkChange}
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