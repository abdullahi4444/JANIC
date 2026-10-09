"use client";

import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isForbidden = error.message.includes("FORBIDDEN") || error.message.includes("UNAUTHORIZED");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        {isForbidden ? "Access Denied" : "Something went wrong"}
      </h2>
      <p className="text-slate-500 mb-8 max-w-md">
        {isForbidden
          ? "You do not have the required permissions to access this module. If you believe this is a mistake, please contact an administrator."
          : "An unexpected error occurred while loading this page."}
      </p>
      <div className="flex gap-4">
        {!isForbidden && (
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
          >
            Try again
          </button>
        )}
        <Link
          href="/admin/dashboard"
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
