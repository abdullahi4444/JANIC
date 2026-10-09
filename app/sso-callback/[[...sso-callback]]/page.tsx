"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#0875D1] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Completing authentication...</p>
      </div>
      <AuthenticateWithRedirectCallback signInForceRedirectUrl="/api/auth/sync" signUpForceRedirectUrl="/api/auth/sync" />
    </div>
  );
}
