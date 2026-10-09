import React from "react";
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import {
  FolderGit2,
  Lightbulb,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function StaffDashboardPage() {
  const [
    totalProjects,
    publishedProjects,
    totalSubmissions,
    pendingSubmissions,
    recentProjects,
    recentSubmissions,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.innovationSubmission.count(),
    prisma.innovationSubmission.count({ where: { status: "PENDING" } }),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, category: true, status: true, updatedAt: true },
    }),
    prisma.innovationSubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, submitterName: true, status: true, createdAt: true },
    }),
  ]);

  const kpis = [
    { title: "Total Projects", value: totalProjects, sub: `${publishedProjects} active`, icon: FolderGit2, color: "text-blue-600 bg-blue-500/10" },
    { title: "Student Submissions", value: totalSubmissions, sub: `${pendingSubmissions} pending review`, icon: Lightbulb, color: "text-amber-600 bg-amber-500/10" },
  ];

  const quickActions = [
    { title: "New Project", href: "/staff/projects", icon: Plus },
    { title: "Review Submission", href: "/staff/submissions", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Staff Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage student projects and submissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.title} className="hover:shadow-md hover:-translate-y-0.5 transition-all">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {k.title}
                  </span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${k.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-bold text-foreground">{k.value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{k.sub}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((q) => {
            const Icon = q.icon;
            return (
              <Link key={q.title} href={q.href}>
                <Card className="hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
                  <CardContent className="p-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground">{q.title}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Recently Updated Projects</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 font-medium">Project</th>
                    <th className="pb-2 font-medium">Updated</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2 text-sm font-medium text-foreground">{p.title}</td>
                      <td className="py-2 text-xs text-muted-foreground">{formatDate(p.updatedAt)}</td>
                      <td className="py-2">
                        <Badge variant={p.status === "PUBLISHED" ? "success" : p.status === "DRAFT" ? "warning" : "secondary"}>
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 font-medium">Title</th>
                    <th className="pb-2 font-medium">Submitter</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((s) => (
                    <tr key={s.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2 text-sm font-medium text-foreground">{s.title}</td>
                      <td className="py-2 text-xs text-muted-foreground">{s.submitterName}</td>
                      <td className="py-2">
                        <Badge variant={s.status === "APPROVED" ? "success" : s.status === "PENDING" ? "warning" : "secondary"}>
                          {s.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
