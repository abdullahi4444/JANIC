"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      toast.success("Welcome back! Redirecting to dashboard...");
      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-xl shadow-blue-900/5 rounded-2xl p-8 relative">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-medium rounded-xl text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying Credentials...
            </>
          ) : (
            <>
              Sign Into Dashboard
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FBFF] via-[#EEF6FF] to-[#F3FAFF] dark:bg-none dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-200/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 transition transform hover:scale-105">
            <div className="flex items-center justify-center gap-3">
              <div className="relative w-44 h-14">
                <Image
                  src="/images/janic-logo-blue.png"
                  alt="JANIC Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/70 text-[#0875D1] text-xs font-medium tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0875D1]" />
            Administrative Portal
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#08245C] mt-3">
            Management Sign In
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Faculty of Computer Science & IT • Jazeera University
          </p>
        </div>

        {/* Card Form wrapped in Suspense */}
        <Suspense
          fallback={
            <div className="bg-white border border-slate-200 shadow-xl shadow-blue-900/5 rounded-2xl p-8 text-center text-slate-400 py-16 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#0875D1]" />
              <p className="text-xs">Loading authentication interface...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-[#0875D1] transition inline-flex items-center gap-1.5"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
