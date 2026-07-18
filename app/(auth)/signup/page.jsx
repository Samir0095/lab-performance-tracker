"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [designation, setDesignation] = useState("Lecturer");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Create authentication account
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }

    // Save teacher profile
    const { error: teacherError } = await supabase
      .from("teachers")
      .insert({
        auth_id: data.user.id,
        full_name: fullName,
        designation,
        department,
        email,
      });

    setLoading(false);

    if (teacherError) {
      setError(teacherError.message);
      return;
    }

    alert("Account created successfully!");

    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D0D9F3]">
      <form
        onSubmit={handleSignup}
        className="bg-white rounded-xl shadow p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Teacher Sign Up
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4">
            {error}
          </p>
        )}

        <label className="block mb-1 font-medium">
          Full Name
        </label>

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full border rounded-md px-3 py-2 mb-4"
        />

        <label className="block mb-1 font-medium">
          Designation
        </label>

        <select
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4"
        >
          <option>Lecturer</option>
          <option>Assistant Professor</option>
          <option>Associate Professor</option>
          <option>Professor</option>
        </select>

        <label className="block mb-1 font-medium">
          Department
        </label>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4"
        >
          <option>Building Engineering & Construction Management</option>
          <option>Chemical Engineering</option>
          <option>Civil Engineering</option>
          <option>Computer Science & Engineering</option>
          <option>Electrical & Computer Engineering</option>
          <option>Electrical & Electronic Engineering</option>
          <option>Electronics & Telecommunication Engineering</option>
          <option>Glass & Ceramic Engineering</option>
          <option>Industrial & Production Engineering</option>
          <option>Materials Science & Engineering</option>
          <option>Mechanical Engineering</option>
          <option>Mechatronics Engineering</option>
          <option>Urban & Regional Planning</option>
          <option>Architecture</option>
        </select>

        <label className="block mb-1 font-medium">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-md px-3 py-2 mb-4"
        />

        <label className="block mb-1 font-medium">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border rounded-md px-3 py-2 mb-6"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-md py-2 font-semibold hover:bg-indigo-700"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 font-semibold"
          >
            Log In
          </a>
        </p>
      </form>
    </div>
  );
}