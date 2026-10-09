"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      newErrors.username = "Username is required";
    } else if (trimmedUser.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please enter a valid username and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      const isPublicUser = data.user?.role === "USER";
      toast.success(isPublicUser ? "Welcome back! Redirecting..." : "Welcome back! Redirecting to dashboard...");
      const defaultDest =
        data.user?.role === "STAFF"
          ? "/staff/dashboard"
          : isPublicUser
          ? "/"
          : "/admin/dashboard";
      const dest =
        fromParam &&
        fromParam !== "/admin/dashboard" &&
        !(isPublicUser && (fromParam.startsWith("/admin") || fromParam.startsWith("/staff")))
          ? fromParam
          : defaultDest;
      router.push(dest);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-900/5 rounded-2xl p-8 relative">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
              }}
              placeholder="Enter your username"
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition ${
                errors.username
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                  : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }`}
            />
          </div>
          {errors.username && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5 font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.username}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••••••"
              className={`w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition ${
                errors.password
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                  : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5 font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.password}</span>
            </p>
          )}
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
                  className="object-contain dark:hidden"
                  priority
                  sizes="176px"
                />
                <Image
                  src="/images/janic-logo-white.png"
                  alt="JANIC Logo"
                  fill
                  className="object-contain hidden dark:block"
                  priority
                  sizes="176px"
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
