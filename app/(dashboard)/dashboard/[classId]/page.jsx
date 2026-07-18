"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { StudentRow } from "@/components/student-row";

export default function DashboardPage() {
  const { classId } = useParams();

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [course, setCourse] = useState(null);

  const [group, setGroup] = useState("1st 30");
  const [labNo, setLabNo] = useState(1);
  const [labDate, setLabDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [markingType, setMarkingType] = useState("star");
  const [scale, setScale] = useState(5);

  const inputRefs = useRef([]);

  useEffect(() => {
    async function loadData() {
      // Load course details
      const { data: courseData } = await supabase
        .from("classes")
        .select("*")
        .eq("id", classId)
        .single();
      if (courseData) {
        setCourse(courseData);
      }

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

    loadData();
  }, [classId, group, labNo]);

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
      .upsert(rows, { onConflict: "lab_id,student_id" });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Marks saved successfully!");
  }

  async function exportToPDF() {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const primaryColor = [79, 70, 229]; // Indigo-600
    const textColor = [31, 41, 55]; // Gray-800
    const grayText = [107, 114, 128]; // Gray-500

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("LAB Performance Report", 14, 20);

    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`${course?.code || "Course Code"}: ${course?.title || "Course Title"}`, 14, 34);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text(`Lab Number: ${String(labNo).padStart(2, "0")}`, 14, 42);
    doc.text(`Date: ${labDate}`, 14, 48);
    doc.text(`Group: ${group}`, 14, 54);

    doc.text(`Marking Type: ${markingType === "star" ? "Star Rating" : "Number Mark"}`, 110, 42);
    doc.text(`Scale: Out of ${scale}`, 110, 48);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 110, 54);

    const tableColumns = ["Serial", "Roll Number", "Student Name", "Group", "Score"];

    const tableRows = students.map((student) => {
      const score = marks[student.id];
      let displayScore = "-";
      if (score !== undefined && score !== "" && score !== null) {
        displayScore = `${score} / ${scale}`;
      }
      return [
        student.serial_no,
        student.roll,
        student.name,
        student.group_name,
        displayScore
      ];
    });

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 62,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "left",
      },
      bodyStyles: {
        textColor: textColor,
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 35 },
        2: { cellWidth: 80 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25, halign: "center" },
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { top: 62, left: 14, right: 14 },
    });

    const filename = `${course?.code || "Class"}_Lab_${labNo}_${group.replace(/\s+/g, "_")}.pdf`;
    doc.save(filename);
  }

  const leftColumn = students.slice(0, 15);
  const rightColumn = students.slice(15, 30);

  const focusNext = (index) => {
    const next = inputRefs.current[index + 1];
    if (next) next.focus();
  };

  return (
    <div className="px-3 sm:px-6 pb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        {course && (
          <div className="mb-6 pb-4 border-b">
            <h2 className="text-xl font-bold text-indigo-700">{course.code}</h2>
            <p className="text-sm text-gray-500">{course.title}</p>
          </div>
        )}

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

        <div className="flex justify-end gap-3 mb-5">
          <button
            onClick={exportToPDF}
            className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            Export PDF
          </button>
          <button
            onClick={saveMarks}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition cursor-pointer"
          >
            Save Marks
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

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