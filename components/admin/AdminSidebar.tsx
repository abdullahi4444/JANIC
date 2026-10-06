"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  GraduationCap,
  FlaskConical,
  Calendar,
  Lightbulb,
  Handshake,
  MessageSquare,
  Users,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { title: "Training", href: "/admin/training", icon: GraduationCap },
  { title: "Research", href: "/admin/research", icon: FlaskConical },
  { title: "Events", href: "/admin/events", icon: Calendar },
  { title: "Submissions", href: "/admin/submissions", icon: Lightbulb },
  { title: "Partnerships", href: "/admin/partnerships", icon: Handshake },
  { title: "Messages", href: "/admin/messages", icon: MessageSquare },
  { title: "Team", href: "/admin/team", icon: Users },
  { title: "Media", href: "/admin/media", icon: ImageIcon },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#081832] text-slate-300 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="relative w-36 h-9">
            <Image
              src="/images/janic-logo-white.png"
              alt="JANIC Admin"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Management CMS
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-200" />}
            </Link>
          );
        })}
      </div>

      {/* Bottom Public Link */}
      <div className="p-4 border-t border-slate-800 bg-[#061328]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            View Public Portal
          </span>
          <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded">Live</span>
        </Link>
      </div>
    </aside>
  );
}
