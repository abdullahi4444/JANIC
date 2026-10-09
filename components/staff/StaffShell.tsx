"use client";

import React, { useState } from "react";
import { StaffSidebar } from "@/components/staff/StaffSidebar";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { AuthUser } from "@/types/user";

export function StaffShell({ user, children, notifCount = 0 }: { user: AuthUser; children: React.ReactNode; notifCount?: number }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-muted/30">
      <StaffSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      <div className="flex flex-col min-h-screen lg:ml-[208px]">
        <StaffHeader user={user} onMenu={() => setSidebarOpen(true)} notifCount={notifCount} />
        <main className="flex-1 p-4 md:p-5 xl:px-7">{children}</main>
      </div>
    </div>
  );
}
