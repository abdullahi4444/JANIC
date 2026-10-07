"use client";

import React, { useState } from "react";
import { X, Mail, MapPin, Link2 } from "lucide-react";

export interface ProjectTeamGridMember {
  name: string;
  role: string | null;
  department: string | null;
  bio: string | null;
  avatar: string | null;
  email: string | null;
  linkedin: string | null;
}

export function ProjectTeamGrid({ members }: { members: ProjectTeamGridMember[] }) {
  const [active, setActive] = useState<ProjectTeamGridMember | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map((member, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActive(member)}
            className="flex gap-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 dark:bg-slate-800/40 dark:border-slate-700/60 text-left transition hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 focus:outline-none focus:ring-2 focus:ring-[#0875D1] cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-blue-100 dark:border-slate-600">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-300 text-lg font-bold">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-[#08245C] dark:text-white text-sm truncate">
                {member.name}
              </h3>
              <p className="text-xs font-semibold text-[#0875D1] dark:text-sky-400">
                {member.role || "Engineer"}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {member.department || "JANIC"}
              </p>
              <p className="text-[11px] text-[#0875D1] dark:text-sky-400 mt-1 font-semibold">
                View details →
              </p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name} details`}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border border-blue-100 dark:border-slate-600 shrink-0">
                {active.avatar ? (
                  <img
                    src={active.avatar}
                    alt={active.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-bold">
                    {active.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-[#08245C] dark:text-white">
                  {active.name}
                </h3>
                <p className="text-sm font-semibold text-[#0875D1] dark:text-sky-400">
                  {active.role || "Engineer"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {active.department || "Faculty of Computer Science & IT, Jazeera University"}
                </p>
              </div>
            </div>

            {active.bio && (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                {active.bio}
              </p>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Contact
              </h4>
              {active.email ? (
                <a
                  href={`mailto:${active.email}`}
                  className="flex items-center gap-2 text-sm text-[#0875D1] dark:text-sky-400 hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  {active.email}
                </a>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  No email provided
                </p>
              )}
              {active.linkedin ? (
                <a
                  href={active.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#0875D1] dark:text-sky-400 hover:underline"
                >
                  <Link2 className="w-4 h-4" />
                  LinkedIn Profile
                </a>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-600 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  No LinkedIn provided
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
