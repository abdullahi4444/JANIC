import React from "react";
import Link from "next/link";
import { AuthPage } from "@/components/ui/auth-page";

export const metadata = {
  title: "Join JANIC",
  description: "Create your JANIC account to access training programs, events, and the innovation hub.",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AuthPage />
      <p className="text-center text-sm text-slate-500 pb-16">
        Already have an account?{" "}
        <Link href="/login" className="text-[#0875D1] font-semibold hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
