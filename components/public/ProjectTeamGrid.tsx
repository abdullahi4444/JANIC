"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Mail,
  MapPin,
  GraduationCap,
  Sparkles,
  Phone,
  Tag,
  Check,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectTeamGridMember {
  id?: string;
  name: string;
  role: string | null;
  department: string | null;
  bio?: string | null;
  avatar?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  github?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  website?: string | null;
  tags?: string | null;
}

// Crisp Brand SVG Icons
function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GmailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.248l8.073-5.755c1.618-1.214 3.927-.059 3.927 1.964z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

// Avatar color gradient fallback
const avatarGradients = [
  "from-blue-600 to-indigo-700",
  "from-sky-500 to-blue-700",
  "from-emerald-600 to-teal-800",
  "from-indigo-600 to-violet-800",
  "from-cyan-600 to-blue-800",
  "from-teal-600 to-emerald-800",
];

function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarGradients.length;
  return avatarGradients[index];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ProjectTeamGrid({ members }: { members: ProjectTeamGridMember[] }) {
  const [active, setActive] = useState<ProjectTeamGridMember | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {members.map((member, idx) => {
          const gradient = getAvatarGradient(member.name);
          const initials = getInitials(member.name);
          const tagList = member.tags
            ? member.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [];

          return (
            <div
              key={member.id || idx}
              className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xs hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Photo + Name + Role + Dept */}
                <div className="flex items-start gap-4">
                  {/* Avatar Photo */}
                  <div
                    onClick={() => setActive(member)}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white dark:border-slate-800 shadow-md ring-2 ring-blue-500/20 group-hover:ring-[#0875D1] transition-all cursor-pointer bg-slate-100 dark:bg-slate-800"
                  >
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 64px, 80px"
                      />
                    ) : (
                      <div
                        className={cn(
                          "w-full h-full flex items-center justify-center font-black text-white text-base sm:text-lg bg-gradient-to-br",
                          gradient
                        )}
                      >
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 text-[#0875D1] dark:text-sky-300 border border-blue-200/60 dark:border-blue-900/60">
                        <GraduationCap className="w-3 h-3" />
                        Student Innovator
                      </span>
                    </div>

                    <h3
                      onClick={() => setActive(member)}
                      className="font-extrabold text-[#08245C] dark:text-white text-base sm:text-lg tracking-tight leading-snug group-hover:text-[#0875D1] dark:group-hover:text-sky-400 transition cursor-pointer"
                    >
                      {member.name}
                    </h3>

                    <p className="text-xs font-bold text-[#0875D1] dark:text-sky-400 mt-0.5">
                      {member.role || "Innovator"}
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {member.department || "Faculty of Computer Science & IT"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Bio Quote (if present) */}
                {member.bio && (
                  <p className="mt-3.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/70">
                    &ldquo;{member.bio}&rdquo;
                  </p>
                )}

                {/* Tags / Skills (if present) */}
                {tagList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tagList.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                    {tagList.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        +{tagList.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Bar: Social Connect Icons */}
              {(member.facebook || member.github || member.email || member.linkedin) && (
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    Connect & Links
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* Facebook */}
                    {member.facebook && (
                      <a
                        href={member.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition shadow-2xs hover:scale-110"
                        title="Facebook Profile"
                        aria-label="Facebook Profile"
                      >
                        <FacebookIcon className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* GitHub */}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-center transition shadow-2xs hover:scale-110"
                        title="GitHub Profile"
                        aria-label="GitHub Profile"
                      >
                        <GitHubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Email */}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/60 text-[#EA4335] hover:bg-[#EA4335] hover:text-white flex items-center justify-center transition shadow-2xs hover:scale-110"
                        title={`Email: ${member.email}`}
                        aria-label="Send Email"
                      >
                        <GmailIcon className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* LinkedIn */}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition shadow-2xs hover:scale-110"
                        title="LinkedIn Profile"
                        aria-label="LinkedIn Profile"
                      >
                        <LinkedInIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DETAILED STUDENT MODAL */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name} details`}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Photo & Badge */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-white dark:border-slate-800 shadow-xl ring-4 ring-blue-500/20 bg-slate-100 dark:bg-slate-800">
                {active.avatar ? (
                  <Image
                    src={active.avatar}
                    alt={active.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div
                    className={cn(
                      "w-full h-full flex items-center justify-center font-black text-white text-2xl bg-gradient-to-br",
                      getAvatarGradient(active.name)
                    )}
                  >
                    {getInitials(active.name)}
                  </div>
                )}
              </div>

              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/70 text-[#0875D1] dark:text-sky-300 border border-blue-200/60 dark:border-blue-900/60 mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  Verified Student Innovator
                </div>

                <h3 className="text-xl font-extrabold text-[#08245C] dark:text-white">
                  {active.name}
                </h3>

                <p className="text-sm font-bold text-[#0875D1] dark:text-sky-400 mt-0.5">
                  {active.role || "Innovator"}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  {active.department || "Faculty of Computer Science & IT, Jazeera University"}
                </p>
              </div>
            </div>

            {/* Bio Description */}
            {active.bio && (
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Biography & Innovation Role
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {active.bio}
                </p>
              </div>
            )}

            {/* Tags / Skills */}
            {active.tags && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  Core Competencies & Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {active.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-blue-50/80 dark:bg-blue-950/60 text-[#0875D1] dark:text-sky-300 text-xs font-semibold border border-blue-100 dark:border-blue-900/60"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Contact & Social Links */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Direct Contact & Portfolio
              </h4>

              {active.email && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate">
                    <Mail className="w-4 h-4 text-[#EA4335] shrink-0" />
                    <span className="truncate">{active.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(active.email!)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer shrink-0"
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}

              {active.phone && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <a href={`tel:${active.phone}`} className="hover:underline">
                    {active.phone}
                  </a>
                </div>
              )}

              {/* Social Channels Row */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                {active.facebook && (
                  <a
                    href={active.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1877F2] hover:bg-[#1877F2] hover:text-white text-xs font-bold transition shadow-2xs"
                  >
                    <FacebookIcon className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                )}

                {active.github && (
                  <a
                    href={active.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-black hover:text-white text-xs font-bold transition shadow-2xs"
                  >
                    <GitHubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}

                {active.linkedin && (
                  <a
                    href={active.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white text-xs font-bold transition shadow-2xs"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
