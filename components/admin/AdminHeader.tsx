"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Bell, Shield } from "lucide-react";
import { AuthUser } from "@/types/user";

interface AdminHeaderProps {
  user: AuthUser | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title / Institutional branding */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-800 text-sm md:text-base">
          JANIC Administration Console
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          System Active
        </span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* User Card */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
            {user?.name ? user.name.charAt(0) : "A"}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">
              {user?.name || "Administrator"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3 text-blue-600" />
              <p className="text-[10px] uppercase font-bold text-blue-600">
                {user?.role || "ADMIN"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title="Sign out"
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Log out</span>
        </button>
      </div>
    </header>
  );
}
