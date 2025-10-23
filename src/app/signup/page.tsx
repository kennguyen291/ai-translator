// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/app/service/axios";
import { ApiConstants } from "@/app/utils/ApiConstants";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // setError(null);
    // setLoading(true);
    // try {
    //   await axiosClient.post(ApiConstants.AUTH_SIGNUP, { name, email, password });
    //   // Optionally auto-login then redirect:
    //   router.push("/login"); // or router.push("/")
    // } catch (err: any) {
    //   setError(err?.response?.data?.message ?? "Sign up failed.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/70 rounded-xl p-6 shadow">
        <h1 className="text-2xl font-semibold mb-6">Create an account</h1>
        {error && (
          <div className="mb-4 rounded-md border border-red-700 bg-red-900/40 p-3 text-red-200">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-slate-300">Name</label>
            <input
              type="text"
              className="w-full rounded-md bg-slate-900 border border-slate-700 p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-slate-300">Email</label>
            <input
              type="email"
              className="w-full rounded-md bg-slate-900 border border-slate-700 p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-slate-300">Password</label>
            <input
              type="password"
              className="w-full rounded-md bg-slate-900 border border-slate-700 p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-emerald-600 hover:bg-emerald-700 p-3 font-semibold disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="text-sm text-slate-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-sky-400 hover:underline">Log in</a>.
        </p>
      </div>
    </main>
  );
}
