"use client";

import React from "react";
import { Clock, CheckCircle2, CalendarDays, Sparkles } from "lucide-react";

export interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

interface EventAgendaTimelineProps {
  agenda: AgendaItem[] | string;
  keyHighlights?: string[] | string;
}

export function EventAgendaTimeline({ agenda, keyHighlights }: EventAgendaTimelineProps) {
  let items: AgendaItem[] = [];
  try {
    if (typeof agenda === "string") {
      items = JSON.parse(agenda);
    } else if (Array.isArray(agenda)) {
      items = agenda;
    }
  } catch {
    items = [];
  }

  let highlights: string[] = [];
  try {
    if (typeof keyHighlights === "string") {
      highlights = JSON.parse(keyHighlights);
    } else if (Array.isArray(keyHighlights)) {
      highlights = keyHighlights;
    }
  } catch {
    highlights = [];
  }

  return (
    <div className="space-y-8">
      {/* Key Highlights Section if present */}
      {highlights && highlights.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-white dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border border-blue-200/60 dark:border-blue-900/40 rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 text-[#08245C] dark:text-blue-400">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-base sm:text-lg font-black tracking-tight">
              Key Event Highlights &amp; Outcomes
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-white/80 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700/60 p-3.5 rounded-2xl shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Agenda Section */}
      {items && items.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#08245C] dark:text-white tracking-tight">
                Event Schedule &amp; Agenda
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Detailed chronological program flow and session breakdown.
              </p>
            </div>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 dark:border-blue-950 space-y-6 sm:space-y-8 my-4 ml-3 sm:ml-4">
            {items.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Node Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 border-4 border-white dark:border-slate-900 shadow-md group-hover:scale-125 transition-transform" />

                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition">
                  {/* Time badge & Speaker */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      <Clock className="w-3.5 h-3.5" />
                      {item.time}
                    </span>
                    {item.speaker && (
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Lead: <strong className="text-slate-700 dark:text-slate-200">{item.speaker}</strong>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="text-base sm:text-lg font-bold text-[#08245C] dark:text-white leading-snug mb-1.5">
                    {item.title}
                  </h4>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
