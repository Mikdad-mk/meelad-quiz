"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid credentials");
      } else {
        router.replace(next);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-emerald-100 bg-white/85 backdrop-blur-xl p-6 shadow">
      <h1 className="text-lg font-semibold text-neutral-900">Admin Login</h1>
      <p className="text-sm text-neutral-600 mt-1">Enter your admin credentials</p>
      <div className="mt-5 space-y-4">
        <div>
          <label className="text-xs text-neutral-600">Username</label>
          <input className="mt-1 w-full border border-emerald-100 rounded-xl px-3 py-2.5 bg-white/80 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-300" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-neutral-600">Password</label>
          <input type="password" className="mt-1 w-full border border-emerald-100 rounded-xl px-3 py-2.5 bg-white/80 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-300" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
      </div>
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      <button disabled={loading || !username || !password} className="mt-5 w-full px-4 py-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 text-neutral-900 font-medium disabled:opacity-50">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(1200px_700px_at_50%_100%,rgba(255,255,255,0.7)_0%,#f6fff9_45%,#eafbf3_85%)] p-4">
      <Suspense fallback={<div className="text-lg">Loading...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}


