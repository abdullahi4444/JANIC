"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Users2, UserCheck, Award } from "lucide-react";

export interface EventGuest {
  name: string;
  role: string;
  organization?: string;
  avatar?: string;
}

interface EventGuestsListProps {
  guests: EventGuest[] | string;
}

export function EventGuestsList({ guests }: EventGuestsListProps) {
  let list: EventGuest[] = [];
  try {
    if (typeof guests === "string") {
      list = JSON.parse(guests);
    } else if (Array.isArray(guests)) {
      list = guests;
    }
  } catch {
    list = [];
  }

  if (!list || list.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Users2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#08245C] dark:text-white tracking-tight">
            Distinguished Guests &amp; Keynote Speakers
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Industry evaluators, keynote experts, and faculty leaders who participated in this event.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {list.map((guest, idx) => {
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl dark:hover:shadow-slate-950/60 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
            >
              {/* Avatar */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-500/30 dark:border-blue-400/30 bg-slate-100 dark:bg-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300">
                {guest.avatar ? (
                  <Image
                    src={guest.avatar}
                    alt={guest.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-black text-xl">
                    {guest.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Name */}
              <h4 className="text-base font-bold text-[#08245C] dark:text-white leading-snug mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {guest.name}
              </h4>

              {/* Role badge */}
              <div className="mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                  {guest.role}
                </span>
              </div>

              {/* Organization */}
              {guest.organization && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {guest.organization}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
