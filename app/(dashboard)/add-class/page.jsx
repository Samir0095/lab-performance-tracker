"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AddClassPage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("classes").insert({
      teacher_id: user.id,
      code,
      title,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    alert("Class added successfully!");

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-8 w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold mb-8">
          Add New Class
        </h1>

        {error && (
          <p className="text-red-600 mb-4">
            {error}
          </p>
        )}

        <label className="block font-medium mb-2">
          Course Code
        </label>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CSE 2203"
          required
          className="w-full border rounded-md p-3 mb-6"
        />

        <label className="block font-medium mb-2">
          Course Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Microprocessor Microcontroller and Assembly Language"
          required
          className="w-full border rounded-md p-3 mb-8"
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-md py-3 font-semibold hover:bg-indigo-700"
        >
          {loading ? "Adding..." : "Add Class"}
        </button>
      </form>
    </div>
  );
}