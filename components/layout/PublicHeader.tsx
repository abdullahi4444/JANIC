"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogIn, UserPlus, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeModeDropdown } from "@/components/theme/ThemeModeDropdown";
import type { AuthUser } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const defaultNavLinks = [
  { name: "ABOUT JANIC", href: "/about" },
  { name: "WHAT WE DO", href: "/what-we-do" },
  { name: "INNOVATION HUB", href: "/innovation-hub" },
  { name: "PROJECTS", href: "/projects" },
  { name: "TRAINING", href: "/training" },
  { name: "RESEARCH", href: "/research" },
  { name: "EVENTS", href: "/events" },
  { name: "PARTNERSHIPS", href: "/partnerships" },
];

interface PublicHeaderProps {
  navLinks?: { name: string; href: string }[];
  currentUser?: AuthUser | null;
}

function getUserInitial(name: string): string {
  if (!name || name.length === 0) return "U";
  const trimmed = name.trim();
  if (trimmed.length === 0) return "U";
  return trimmed.charAt(0).toUpperCase();
}

interface UserAvatarMenuProps {
  user: AuthUser;
  loggingOut: boolean;
  onLogout: () => void;
}

function UserAvatarMenu({ user, loggingOut, onLogout }: UserAvatarMenuProps) {
  const router = useRouter();
  const initial = getUserInitial(user.name);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative h-9 w-9 xl:h-10 xl:w-10 rounded-full ring-1 ring-black/5 hover:ring-[#0875D1]/30 transition-shadow shrink-0"
          aria-label="User menu"
        >
          <Avatar className="h-9 w-9 xl:h-10 xl:w-10">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-[#0875D1] to-[#08245C] text-white font-bold text-sm">
              {initial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_20px_45px_-12px_rgba(8,36,92,0.25)] backdrop-blur-xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal rounded-lg bg-gradient-to-br from-[#F5F9FF] via-white to-[#E9F3FD] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-3 mb-1 border border-slate-100/80 dark:border-slate-800/80">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-[#08245C] dark:text-slate-100">
              {user.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 break-all">
              {user.email}
            </p>
            <p className="inline-flex items-center w-fit mt-1 px-2 py-0.5 rounded-full bg-[#0875D1]/10 border border-[#0875D1]/15 text-[10px] font-extrabold tracking-wider text-[#08245C] dark:text-[#7FB7EC] uppercase">
              {user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
        <DropdownMenuItem
          onClick={() => router.push("/admin/dashboard")}
          className="cursor-pointer gap-2 rounded-lg px-2.5 py-2 text-slate-800 dark:text-slate-200 hover:bg-gradient-to-r hover:from-[#E9F3FD] hover:to-white dark:hover:from-slate-900 dark:hover:to-slate-800 focus:bg-gradient-to-r focus:from-[#E9F3FD] focus:to-white dark:focus:from-slate-900 dark:focus:to-slate-800 hover:text-[#08245C] dark:hover:text-white transition-colors"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#0875D1]/10 to-[#08245C]/10 dark:from-[#0875D1]/15 dark:to-[#08245C]/15">
            <LayoutDashboard className="h-4 w-4 text-[#0875D1]" />
          </span>
          <span className="text-sm font-bold">Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
        <DropdownMenuItem
          onClick={onLogout}
          disabled={loggingOut}
          className="text-red-600 focus:text-red-600 cursor-pointer gap-2 rounded-lg px-2.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 transition-colors"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40">
            <LogOut className="h-4 w-4 text-red-600" />
          </span>
          <span className="text-sm font-bold">
            {loggingOut ? "Logging out..." : "Log out"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PublicHeader({ navLinks, currentUser }: PublicHeaderProps) {
  const links = navLinks && navLinks.length > 0 ? navLinks : defaultNavLinks;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const isLoggedIn = Boolean(currentUser);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileMenuOpen(false);
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800",
        scrolled ? "shadow-sm py-3" : "py-3.5 sm:py-4"
      )}
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with exact image */}
        <Link href="/" className="flex items-center shrink-0 group">
          <div className="relative h-9 w-36 sm:w-44 xl:w-52 transition-transform group-hover:scale-[1.02]">
            <Image
              src="/images/janic-logo-blue.png"
              alt="JANIC — Jazeera Nexus Innovation Center"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 2xl:gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[10px] xl:text-[11px] font-bold tracking-wide transition-colors uppercase whitespace-nowrap",
                  isActive
                    ? "text-[#0875D1]"
                    : "text-slate-700 hover:text-[#0875D1] dark:text-slate-300"
                )}
              >
                {link.name}
              </Link>
              
            );
          })}
        </nav>

        {/* Right Action: Desktop */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 px-3 xl:px-4 py-2 text-slate-600 hover:text-[#0875D1] dark:text-slate-300 font-bold text-[10px] xl:text-xs tracking-wider uppercase transition rounded-full hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            Contact
          </Link>
          <ThemeModeDropdown />
          {isLoggedIn ? (
            <>
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-full bg-gradient-to-r from-[#0875D1] to-[#0aa5e8] hover:from-[#0660ab] hover:to-[#0891c7] text-white font-bold text-[10px] xl:text-xs tracking-wider uppercase shadow-md shadow-blue-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              {currentUser ? (
                <UserAvatarMenu user={currentUser} loggingOut={loggingOut} onLogout={handleLogout} />
              ) : null}
            </>
          ) : (
            <>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-[#08245C] dark:text-slate-200 hover:border-[#08245C] dark:hover:border-slate-600 hover:bg-[#08245C] hover:text-white font-bold text-[10px] xl:text-xs tracking-wider uppercase transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-full bg-gradient-to-r from-[#0875D1] to-[#0aa5e8] hover:from-[#0660ab] hover:to-[#0891c7] text-white font-bold text-[10px] xl:text-xs tracking-wider uppercase shadow-md shadow-blue-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Join Us
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-[#0875D1] rounded-lg hover:bg-slate-50 transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-4 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Theme</p>
            <ThemeModeDropdown />
          </div>

          {/* Logged-in user card (mobile) */}
          {isLoggedIn && currentUser && (
            <div className="mb-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-[#F5F9FF] to-white dark:from-slate-900 dark:to-slate-950 p-4 flex items-center gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_25px_-15px_rgba(8,117,209,0.35)]">
              <Avatar className="h-11 w-11 shrink-0">
                {currentUser.avatar ? (
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-[#0875D1] to-[#08245C] text-white font-bold">
                  {getUserInitial(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {currentUser.email}
                </p>
                <p className="text-[10px] font-extrabold tracking-wider text-[#0875D1] uppercase mt-0.5">
                  {currentUser.role}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-4">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition dark:hover:bg-slate-900",
                    isActive
                      ? "text-[#0875D1] bg-blue-50/80 dark:bg-blue-950/50"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:text-[#0875D1]"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link
              href="/contact"
              className="w-full py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs text-center"
            >
              Contact Us
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#0875D1] to-[#0aa5e8] text-white font-semibold text-xs text-center shadow-md flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full py-2.5 px-4 rounded-full border border-red-200 text-red-600 font-semibold text-xs text-center flex items-center justify-center gap-1.5 hover:bg-red-50 disabled:opacity-60 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {loggingOut ? "Logging out..." : "Log out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/admin/login"
                  className="w-full py-2.5 px-4 rounded-full border border-[#08245C] text-[#08245C] font-semibold text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#0875D1] to-[#0aa5e8] text-white font-semibold text-xs text-center shadow-md flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Join Us
                </Link>
              </>
            )}
            <Link
              href="/submit-innovation"
              className="w-full py-2.5 px-4 rounded-full bg-[#08245C] text-white font-semibold text-xs text-center shadow-sm"
            >
              Submit Innovation Idea
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
