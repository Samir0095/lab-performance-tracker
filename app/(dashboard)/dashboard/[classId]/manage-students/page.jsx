"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ManageStudentsPage() {
  const { classId } = useParams();

  const [students, setStudents] = useState([]);

  const [serialNo, setSerialNo] = useState("");
  const [roll, setRoll] = useState("");
  const [name, setName] = useState("");
  const [group, setGroup] = useState("1st 30");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function loadStudents() {
      const { data } = await supabase
        .from("students")
        .select("*")
        .eq("class_id", classId)
        .order("serial_no");

      setStudents(data || []);
    }

    loadStudents();
  }, [classId, refreshTrigger]);

  async function addStudent(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("students")
      .insert({
        class_id: classId,
        serial_no: Number(serialNo),
        roll,
        name,
        group_name: group,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setSerialNo("");
    setRoll("");
    setName("");
    setGroup("1st 30");

    setRefreshTrigger((prev) => prev + 1);
  }

  async function deleteStudent(id) {
    if (!confirm("Delete this student?")) return;

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <div className="p-6">

      <div className="bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold mb-6">
          Manage Students
        </h1>

        <form
          onSubmit={addStudent}
          className="grid grid-cols-5 gap-3 mb-8"
        >

          <input
            type="number"
            placeholder="Serial"
            value={serialNo}
            onChange={(e) => setSerialNo(e.target.value)}
            className="border rounded-lg p-2"
            required
          />

          <input
            placeholder="Roll"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="border rounded-lg p-2"
            required
          />

          <input
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg p-2"
            required
          />

          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option>1st 30</option>
            <option>2nd 30</option>
          </select>

          <button
            className="bg-indigo-600 text-white rounded-lg"
          >
            Add Student
          </button>

        </form>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-2">Serial</th>
              <th className="text-left p-2">Roll</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Group</th>
              <th className="text-left p-2">Action</th>

            </tr>

          </thead>

          <tbody>

            {students.map((student) => (

              <tr
                key={student.id}
                className="border-b"
              >

                <td className="p-2">{student.serial_no}</td>
                <td className="p-2">{student.roll}</td>
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.group_name}</td>

                <td className="p-2">

                  <button
                    onClick={() => deleteStudent(student.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}