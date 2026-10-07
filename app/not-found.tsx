import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <p className="text-7xl font-black text-[#08245C]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-[#08245C]">Page Not Found</h1>
      <p className="mt-2 text-slate-500 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[#008A08] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
