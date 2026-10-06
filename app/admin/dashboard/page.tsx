import React from "react";
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import {
  FolderGit2,
  GraduationCap,
  FlaskConical,
  Calendar,
  Lightbulb,
  Handshake,
  MessageSquare,
  Users,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProjects,
    publishedProjects,
    totalTraining,
    totalResearch,
    totalEvents,
    totalSubmissions,
    pendingSubmissions,
    totalPartnerships,
    newPartnerships,
    totalMessages,
    unreadMessages,
    recentProjects,
    recentSubmissions,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.trainingProgram.count(),
    prisma.researchPaper.count(),
    prisma.event.count(),
    prisma.innovationSubmission.count(),
    prisma.innovationSubmission.count({ where: { status: "PENDING" } }),
    prisma.partnershipInquiry.count(),
    prisma.partnershipInquiry.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.project.findMany({
      take: 4,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, category: true, status: true, updatedAt: true },
    }),
    prisma.innovationSubmission.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, submitterName: true, status: true, createdAt: true },
    }),
  ]);

  const statCards = [
    {
      title: "Projects",
      value: totalProjects,
      subtext: `${publishedProjects} Published live`,
      icon: FolderGit2,
      href: "/admin/projects",
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    {
      title: "Student Submissions",
      value: totalSubmissions,
      subtext: `${pendingSubmissions} Pending review`,
      icon: Lightbulb,
      href: "/admin/submissions",
      color: "bg-amber-500/10 text-amber-600 border-amber-200",
    },
    {
      title: "Training Programs",
      value: totalTraining,
      subtext: "ICT & Certification tracks",
      icon: GraduationCap,
      href: "/admin/training",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    },
    {
      title: "Research Papers",
      value: totalResearch,
      subtext: "Applied research & papers",
      icon: FlaskConical,
      href: "/admin/research",
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
    },
    {
      title: "Events & Hackathons",
      value: totalEvents,
      subtext: "Upcoming & active",
      icon: Calendar,
      href: "/admin/events",
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
    },
    {
      title: "Partnership Inquiries",
      value: totalPartnerships,
      subtext: `${newPartnerships} New inquiries`,
      icon: Handshake,
      href: "/admin/partnerships",
      color: "bg-rose-500/10 text-rose-600 border-rose-200",
    },
    {
      title: "Contact Messages",
      value: totalMessages,
      subtext: `${unreadMessages} Unread messages`,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "bg-sky-500/10 text-sky-600 border-sky-200",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#08245C] to-[#0A3B8C] text-white p-7 rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
            Faculty of Computer Science & IT • Jazeera University
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            JANIC Innovation Command Center
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Manage student innovation showcases, professional training programs, applied research papers, and institutional inquiries from one centralized system.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-medium text-sm transition shadow-lg shadow-blue-500/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Manage Projects
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition border border-white/20 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            View Live Site
          </Link>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900">{card.value}</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  {card.subtext}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Projects & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recently Updated Projects</h2>
              <p className="text-xs text-slate-500">Student innovations and lab prototypes</p>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentProjects.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{p.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {p.category} • Updated {formatDate(p.updatedAt)}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                    p.status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : p.status === "DRAFT"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Submissions Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Incoming Student Innovations</h2>
              <p className="text-xs text-slate-500">Submissions awaiting faculty review</p>
            </div>
            <Link
              href="/admin/submissions"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Review Submissions <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSubmissions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No innovation submissions pending yet.
              </div>
            ) : (
              recentSubmissions.map((s) => (
                <div key={s.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{s.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submitted by {s.submitterName} • {formatDate(s.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      s.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : s.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : s.status === "UNDER_REVIEW"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
