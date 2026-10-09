import React, { Suspense } from "react";
import Link from "next/link";
import { LoginPage } from "@/components/ui/login-page";

export const metadata = {
  title: "Sign In • JANIC",
  description: "Sign in to access your JANIC account, programs, and innovation dashboard.",
};

export default function LoginPageContainer() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <Suspense fallback={<div className="min-h-[640px] flex items-center justify-center text-slate-400">Loading...</div>}>
        <LoginPage />
      </Suspense>
      <p className="text-center text-sm text-slate-500 pb-16">
        Don&apos;t have an account yet?{" "}
        <Link href="/register" className="text-[#0875D1] font-semibold hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
