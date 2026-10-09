"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  department: string;
  bio?: string | null;
  avatar?: string | null;
  isFounder?: boolean;
}

interface MentorsLeadershipSectionProps {
  founder: TeamMemberData | null;
  otherMembers: TeamMemberData[];
}

function FounderCard({ founder }: { founder: TeamMemberData }) {
  return (
    <div className="founder-card-gradient bg-gradient-to-b from-amber-50/70 via-white to-white dark:from-amber-950/40 dark:via-[#0c1e3d] dark:to-[#08152b] rounded-2xl border-2 border-amber-300 dark:border-amber-500/60 shadow-md ring-2 ring-amber-400/20 dark:ring-amber-500/25 dark:shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)] p-6 text-center hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between relative overflow-hidden group h-full min-h-[380px]">
      <div className="w-full flex flex-col items-center">
        {/* Distinctive Founder Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs mb-3 ring-1 ring-amber-300/40">
          <Award className="w-3 h-3 text-amber-200" />
          <span>FOUNDER</span>
        </span>

        {/* Founder Avatar with Amber Ring */}
        <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-full mx-auto mb-3.5 relative bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-400 shadow-md overflow-hidden ring-4 ring-amber-100/80 dark:ring-amber-500/30 group-hover:scale-105 transition-transform duration-300">
          <Image
            src={founder.avatar || "/images/Founder-img.jpeg"}
            alt={`${founder.name} - Founder & ${founder.role}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 96px, 104px"
            priority
          />
        </div>

        {/* Identity */}
        <h3 className="text-base sm:text-lg font-black text-[#08245C] dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {founder.name}
        </h3>
        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
          {founder.role}
        </p>
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-300 mt-1">
          {founder.department}
        </p>
        {founder.bio && (
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-3 leading-relaxed line-clamp-3">
            {founder.bio}
          </p>
        )}
      </div>
    </div>
  );
}

function AdvisorCard({ member }: { member: TeamMemberData }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-between h-full min-h-[380px] group">
      <div className="w-full flex flex-col items-center">
        <div className="w-24 h-24 rounded-full mx-auto mb-4 relative bg-slate-100 dark:bg-slate-800 border-2 border-blue-100 dark:border-blue-900/60 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
          <Image
            src={
              member.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
            }
            alt={member.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <h3 className="text-base font-bold text-[#08245C] dark:text-white tracking-tight">
          {member.name}
        </h3>
        <p className="text-xs font-semibold text-[#0875D1] dark:text-sky-400 mt-0.5">
          {member.role}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
          {member.department}
        </p>
        {member.bio && (
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-3 line-clamp-3 leading-relaxed">
            {member.bio}
          </p>
        )}
      </div>
    </div>
  );
}

export function MentorsLeadershipSection({
  founder,
  otherMembers,
}: MentorsLeadershipSectionProps) {
  const totalCards = (founder ? 1 : 0) + otherMembers.length;
  const shouldScroll = totalCards > 4;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = scrollLeft / maxScroll;
      const index = Math.min(
        otherMembers.length - 1,
        Math.max(0, Math.round(progress * (otherMembers.length - 1)))
      );
      setActiveIndex(index);
    } else {
      setActiveIndex(0);
    }
  }, [otherMembers.length]);

  useEffect(() => {
    if (!shouldScroll) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [shouldScroll, updateScrollButtons, otherMembers.length]);

  // Auto-play animation: slides every 3.5 seconds, pauses on user hover or touch
  useEffect(() => {
    if (!shouldScroll || isHovered || otherMembers.length <= 1) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;

      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 16;

      if (isAtEnd) {
        // Loop back smoothly to the beginning
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Advance smoothly by 1 card width
        const cardEl = container.firstElementChild as HTMLElement | null;
        const cardWidth = cardEl?.offsetWidth || 280;
        container.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [shouldScroll, isHovered, otherMembers.length]);

  const handlePrev = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardEl = container.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl?.offsetWidth || 280;
    container.scrollBy({ left: -(cardWidth + 24), behavior: "smooth" });
  };

  const handleNext = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardEl = container.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl?.offsetWidth || 280;
    container.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
  };

  const scrollToDot = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    const targetScroll = (index / (otherMembers.length - 1)) * maxScroll;
    container.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  return (
    <div>
      {/* Header with Title and Scroll Controls (shown only when cards > 4) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] dark:text-[#38BDF8] block mb-1.5">
            MENTORS &amp; FACULTY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#08245C] dark:text-white tracking-tight">
            Leadership &amp; Advisors
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
            Distinguished educators and industry specialists guiding student innovators.
          </p>
        </div>

        {shouldScroll && (
          <div
            className="flex items-center gap-2.5 shrink-0 self-start sm:self-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 hidden sm:inline-block mr-1">
              {otherMembers.length} Advisors
            </span>
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canScrollLeft}
              aria-label="Previous advisors"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#08245C] dark:text-white flex items-center justify-center shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-900 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canScrollRight}
              aria-label="Next advisors"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#08245C] dark:text-white flex items-center justify-center shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-900 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* WHEN <= 4 CARDS: Standard clean 4-column grid (no scrolling) */}
      {!shouldScroll && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {founder && <FounderCard founder={founder} />}
          {otherMembers.map((member) => (
            <AdvisorCard key={member.id} member={member} />
          ))}
        </div>
      )}

      {/* WHEN > 4 CARDS:
          The Founder card does NOT scroll (pinned static on the left).
          The other Leadership & Advisors cards scroll horizontally.
      */}
      {shouldScroll && (
        <div className="flex flex-col lg:flex-row items-stretch gap-6">
          {/* 1. FOUNDER CARD — NEVER SCROLLS (Pinned 1-col width on desktop) */}
          {founder && (
            <div className="w-full lg:w-[calc(25%-18px)] shrink-0">
              <FounderCard founder={founder} />
            </div>
          )}

          {/* 2. OTHER LEADERSHIP & ADVISORS — SCROLLABLE HORIZONTALLY WITH AUTO ANIMATION */}
          <div
            className="flex-1 min-w-0 flex flex-col justify-between"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <div
              ref={scrollContainerRef}
              tabIndex={0}
              aria-label="Scrollable list of Leadership and Advisors"
              className="advisors-scroll-track flex gap-6 overflow-x-auto scroll-smooth snap-x pb-4 pt-1 px-1 -mx-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {otherMembers.map((member) => (
                <div
                  key={member.id}
                  className={`shrink-0 snap-start h-full ${
                    founder
                      ? "w-[270px] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                      : "w-[270px] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                  }`}
                >
                  <AdvisorCard member={member} />
                </div>
              ))}
            </div>

            {/* Interactive Dots Pagination (Replaces scrollbar track) */}
            <div
              className="flex items-center justify-center gap-2 pt-4 pb-1"
              role="tablist"
              aria-label="Leadership & Advisors pagination dots"
            >
              {otherMembers.map((member, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={member.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => scrollToDot(index)}
                    aria-label={`Slide to advisor ${index + 1}: ${member.name}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isActive
                        ? "w-7 bg-[#0875D1] dark:bg-sky-400 shadow-xs shadow-blue-500/30"
                        : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
