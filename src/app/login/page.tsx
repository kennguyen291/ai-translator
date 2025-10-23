// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/app/service/axios";
import { ApiConstants } from "@/app/utils/ApiConstants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // setError(null);
    // setLoading(true);
    // try {
    //   await axiosClient.post(ApiConstants.AUTH_LOGIN, { email, password });
    //   // TODO: set auth state / token if your backend returns one
      router.push("/"); // go back to main after login
    // } catch (err: any) {
    //   setError(err?.response?.data?.message ?? "Login failed.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/70 rounded-xl p-6 shadow">
        <h1 className="text-2xl font-semibold mb-6">Log in</h1>
        {error && (
          <div className="mb-4 rounded-md border border-red-700 bg-red-900/40 p-3 text-red-200">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
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
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-sky-600 hover:bg-sky-700 p-3 font-semibold disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Log in"}
          </button>
        </form>
        <p className="text-sm text-slate-400 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-sky-400 hover:underline">Sign up</a>.
        </p>
      </div>
    </main>
  );
}
