"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, Bell, Calendar, Download, LogOut } from "lucide-react";
import { AuthUser } from "@/types/user";
import { ThemeModeDropdown } from "@/components/theme/ThemeModeDropdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminHeaderProps {
  user: AuthUser | null;
  onMenu: () => void;
  notifCount?: number;
}

export function AdminHeader({ user, onMenu, notifCount = 0 }: AdminHeaderProps) {
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
    <header className="h-14 bg-card border-b border-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="lg:hidden px-2" onClick={onMenu}>
          <Menu className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Search className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Search</span>
          <kbd className="ml-1 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded border border-border">
            ⌘K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm hidden xl:inline">10 Sep 2026 - 07 Oct 2026</span>
          <span className="text-sm xl:hidden">Date Range</span>
        </Button>

        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Export</span>
        </Button>

        <span className="relative inline-flex">
          <Button variant="ghost" size="sm" className="px-2">
            <Bell className="w-4 h-4" />
          </Button>
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {notifCount}
            </span>
          )}
        </span>

        <ThemeModeDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                  {user?.name ? user.name.charAt(0) : "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "Administrator"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "admin@janic.edu.so"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={loggingOut} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
