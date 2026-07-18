"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-[#D0D9F3]">
      <div className="aura aura-holo ">
  <div className="card bg-[#D0D9F3] shadow-xl">
    <div className="card-body text-xl font-bold text-center">
      <p>Lab Performance Tracker</p>
    </div>
  </div>
</div>


<div className="min-h-screen flex items-center justify-center bg-[#D0D9F3]">
      <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Teacher Login</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-md px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded-md px-3 py-2 mb-6 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-md py-2 font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-sm text-center mt-4">
          No account?{" "}
          <a href="/signup" className="text-indigo-600 font-medium">
            Sign up
          </a>
        </p>
      </form>
    </div>

    </div>


    
  );
}