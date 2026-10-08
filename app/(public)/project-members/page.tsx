import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { ProjectService } from "@/services/projects/project.service";
import { ProjectMemberRepository } from "@/repositories/project-member.repository";
import { ProjectMembersDirectory } from "@/components/public/ProjectMembersDirectory";
import { Users, Sparkles, FolderGit2, Award } from "lucide-react";

export const metadata = {
  title: "Project Members & Teams | JANIC",
  description:
    "Meet the student innovators, developers, and engineers behind the 15 innovation projects developed at the Jazeera Nexus Innovation Center (JANIC).",
};

export const dynamic = "force-dynamic";

export default async function ProjectMembersPage() {
  const [members, rawProjects] = await Promise.all([
    ProjectMemberRepository.findAll({ isActive: true }),
    ProjectService.getPublishedProjects(),
  ]);

  // Sort projects in canonical order 1 to 15
  const projects = (rawProjects as any[])
    .sort((a: any, b: any) => a.order - b.order)
    .map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      category: p.category,
      order: p.order,
      heroImage: p.heroImage,
      teamMembers: p.teamMembers,
      status: p.status,
    }));

  // Map member records for directory presentation (only Facebook, GitHub, Gmail, LinkedIn)
  const memberRecords = members.map((m: any) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    department: m.department,
    bio: m.bio,
    avatar: m.avatar,
    projectId: m.projectId,
    project: m.project
      ? {
          id: m.project.id,
          title: m.project.title,
          slug: m.project.slug,
          category: m.project.category,
          order: m.project.order,
          heroImage: m.project.heroImage,
          summary: m.project.summary,
        }
      : null,
    facebook: m.facebook,
    github: m.github,
    email: m.email,
    linkedin: m.linkedin,
    tags: m.tags,
    order: m.order,
    isActive: m.isActive,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 overflow-x-clip">
      {/* 1. HERO SECTION (ROUNDED CARD HERO MATCHING OTHER PAGES) */}
      <SectionHero
        badge="JIT Innovation Cohort"
        title="Project Members & Teams"
        description="Meet the dedicated student innovators, developers, and engineers behind the 15 projects at JANIC. Explore collaborative group teams and individual ventures driving regional technology."
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Project Members" },
        ]}
      >
        {/* Hero stat badges */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-[#08245C] dark:text-slate-100 shadow-2xs">
            <FolderGit2 className="w-3.5 h-3.5 text-[#0875D1]" />
            <span>15 Total Projects</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/70 dark:border-blue-900 text-xs font-bold text-[#0875D1] dark:text-sky-300 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-[#0875D1]" />
            <span>10 Group Teams</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/70 dark:border-emerald-900 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>5 Individual Projects</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200/70 dark:border-purple-900 text-xs font-bold text-purple-700 dark:text-purple-300 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>{memberRecords.length > 0 ? `${memberRecords.length} Student Engineers` : "30+ Student Engineers"}</span>
          </div>
        </div>
      </SectionHero>

      {/* 2. DIRECTORY SECTION WITH FILTER CONTROLS */}
      <section className="py-8 sm:py-14 bg-slate-50 dark:bg-slate-950 min-h-[600px] overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            <ProjectMembersDirectory
              initialMembers={memberRecords}
              projects={projects}
            />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
