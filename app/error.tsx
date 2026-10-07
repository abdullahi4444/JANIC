"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-2xl font-bold text-[#08245C]">Something went wrong</h1>
      <p className="mt-2 text-slate-500 max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-full bg-[#008A08] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-slate-200 px-8 py-3 text-sm font-semibold text-[#08245C] hover:bg-slate-50 transition"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
