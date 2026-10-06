"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "ABOUT JANIC", href: "/about" },
  { name: "WHAT WE DO", href: "/what-we-do" },
  { name: "INNOVATION HUB", href: "/innovation-hub" },
  { name: "PROJECTS", href: "/projects" },
  { name: "TRAINING", href: "/training" },
  { name: "RESEARCH", href: "/research" },
  { name: "EVENTS", href: "/events" },
  { name: "PARTNERSHIPS", href: "/partnerships" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 bg-white border-b border-slate-100",
        scrolled ? "shadow-sm py-3" : "py-3.5 sm:py-4"
      )}
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with exact image */}
        <Link href="/" className="flex items-center shrink-0 group">
          <div className="relative h-11 w-48 sm:w-56 transition-transform group-hover:scale-[1.02]">
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
        <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[11px] font-bold tracking-wider transition-colors uppercase whitespace-nowrap",
                  isActive
                    ? "text-[#0875D1]"
                    : "text-slate-700 hover:text-[#0875D1]"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Pill Contact Button matching screenshot */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="px-8 py-2.5 rounded-full bg-[#08245C] hover:bg-[#051532] text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow-md transition cursor-pointer"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-slate-700 hover:text-[#0875D1] rounded-lg hover:bg-slate-50 transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white px-4 pt-4 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition",
                    isActive
                      ? "text-[#0875D1] bg-blue-50/80"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#0875D1]"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/contact"
              className="w-full py-2.5 px-4 rounded-full bg-[#08245C] text-white font-semibold text-xs text-center shadow-sm"
            >
              Contact Us
            </Link>
            <Link
              href="/submit-innovation"
              className="w-full py-2.5 px-4 rounded-full bg-[#0875D1] text-white font-semibold text-xs text-center shadow-sm"
            >
              Submit Innovation Idea
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
