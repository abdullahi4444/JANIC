import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectService } from "@/services/projects/project.service";
import { TeamRepository } from "@/repositories/team.repository";
import { SectionHero } from "@/components/layout/SectionHero";
import { enrichProjectTeam, parseProjectTeam } from "@/lib/project-team";
import { ProjectTeamGrid } from "@/components/public/ProjectTeamGrid";
import {
  ExternalLink,
  Code2,
  Video,
  Users,
  CheckCircle2,
  Cpu,
  Sparkles,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await ProjectService.getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found | JANIC" };

  return {
    title: `${project.title} | JANIC`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | JANIC`,
      description: project.summary,
      images: project.heroImage ? [project.heroImage] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await ProjectService.getProjectBySlug(slug);

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  const techList = project.technology.split(",").map((t) => t.trim());

  const profiles = await TeamRepository.findActive();
  const projectTeam = enrichProjectTeam(
    parseProjectTeam(project.teamMembers),
    profiles
  );

  return (
    <div>
      <SectionHero
        badge={project.category}
        title={project.title}
        description={project.summary}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white font-semibold text-xs shadow-md transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo / Website
            </a>
          )}
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
            >
              <Video className="w-3.5 h-3.5" />
              Watch Video Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              Source Code
            </a>
          )}
        </div>
      </SectionHero>

      <div className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Hero Image */}
              {project.heroImage && (
                <div className="aspect-[16/9] relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* The Problem */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
                  The Problem
                </div>
                <h2 className="text-2xl font-extrabold text-[#08245C]">
                  Challenge & Context
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {project.problem}
                </p>
              </div>

              {/* The Solution */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  The Solution
                </div>
                <h2 className="text-2xl font-extrabold text-[#08245C]">
                  Engineered Approach & Architecture
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {project.solution}
                </p>
              </div>

              {/* Key Innovation */}
              {project.innovation && (
                <div className="bg-[#08245C] text-white p-8 rounded-2xl border border-blue-900 shadow-xl space-y-3 relative overflow-hidden">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Key Innovation
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">
                    What Makes This Unique
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {project.innovation}
                  </p>
                </div>
              )}

              {/* Outcomes & Impact */}
              {project.outcomes && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0875D1] text-xs font-bold uppercase tracking-wider">
                    Outcomes & Validation
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#08245C]">
                    Results & Testing Performance
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {project.outcomes}
                  </p>
                </div>
              )}

              {/* Engineering Team */}
              {projectTeam.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0875D1] dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                        <Users className="w-3.5 h-3.5" />
                        Engineering Team
                      </div>
                      <h2 className="text-2xl font-extrabold text-[#08245C] dark:text-white mt-3">
                        Built by {projectTeam.length}{" "}
                        {projectTeam.length === 1 ? "Engineer" : "Engineers"}
                      </h2>
                    </div>
                  </div>

                  <ProjectTeamGrid
                    members={projectTeam.map((m) => ({
                      name: m.name,
                      role: m.role,
                      department: m.profile?.department ?? null,
                      bio: m.profile?.bio ?? null,
                      avatar: m.profile?.avatar ?? null,
                      email: m.profile?.email ?? null,
                      linkedin: m.profile?.linkedin ?? null,
                    }))}
                  />
                </div>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#08245C]">Project Gallery</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.gallery.map((img) => (
                      <div
                        key={img.id}
                        className="aspect-[4/3] relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                      >
                        <Image
                          src={img.imageUrl}
                          alt={img.alt || project.title}
                          fill
                          className="object-cover"
                        />
                        {img.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-2">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Technology Stack Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Cpu className="w-4 h-4 text-[#0875D1]" />
                  Technologies Used
                </div>
                <div className="flex flex-wrap gap-2">
                  {techList.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0875D1] font-semibold text-xs border border-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Student Team Card */}
              {projectTeam.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Engineering Team
                  </div>
                  <p className="text-5xl font-black text-[#08245C] dark:text-white leading-none">
                    {projectTeam.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {projectTeam.length === 1 ? "engineer" : "engineers"} built this project
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium pt-1">
                    {project.teamMembers}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                    Faculty of Computer Science & IT, Jazeera University
                  </p>
                </div>
              )}

              {/* Project Meta */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 text-xs text-slate-500">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Category</span>
                  <span className="font-semibold text-slate-800">{project.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Published Date</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(project.publishedAt || project.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Incubation Status</span>
                  <span className="font-semibold text-emerald-600">Active Lab Prototype</span>
                </div>
              </div>

              {/* Back to list button */}
              <Link
                href="/projects"
                className="w-full py-3 px-4 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
