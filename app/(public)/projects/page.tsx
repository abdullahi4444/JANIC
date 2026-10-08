import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { ProjectService } from "@/services/projects/project.service";
import { ProjectsFilterControls } from "@/components/public/ProjectsFilterControls";
import { ComingSoonCohort } from "@/components/public/ComingSoonCohort";
import { ProjectMediaCover } from "@/components/public/ProjectMediaCover";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Student Innovation Projects",
  description:
    "Explore student-engineered solutions in Web Platforms, HealthTech, Robotics, Arduino, IoT, and AI developed at JANIC.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; year?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "all";
  const searchQuery = resolvedParams.q || "";
  const currentYear = resolvedParams.year || "all";

  const [rawProjects, categories] = await Promise.all([
    ProjectService.getPublishedProjects({
      category: currentCategory === "all" ? undefined : currentCategory,
      search: searchQuery || undefined,
    }),
    ProjectService.getCategories(),
  ]);

  const isFutureCohort = currentYear === "2027" || currentYear === "2028";

  // Filter projects by year when a specific active year like 2026 is chosen
  const projects = isFutureCohort
    ? []
    : currentYear !== "all"
    ? rawProjects.filter((p) => {
        const d = new Date(p.publishedAt || p.createdAt);
        return d.getFullYear() === parseInt(currentYear, 10);
      })
    : rawProjects;

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="Innovations in Action"
        title="Student Innovation Showcase"
        description="From classroom ideas to real-world solutions. Discover functional prototypes, robotics hardware, and software platforms engineered by Jazeera University students."
        breadcrumbs={[{ label: "Projects" }]}
      />

      {/* 2. SEARCH, FILTERS & PROJECTS BENTO GRID - FADE UP */}
      <section className="py-8 sm:py-14 bg-slate-50 min-h-[600px] overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            {/* Custom Category Dropdown & Year Filter Bar */}
            <ProjectsFilterControls
              categories={categories}
              currentCategory={currentCategory}
              currentYear={currentYear}
              searchQuery={searchQuery}
              totalProjectsCount={isFutureCohort ? 0 : projects.length}
            />

            {/* If 2027 or 2028 is selected, display the animated Coming Soon component */}
            {isFutureCohort ? (
              <ComingSoonCohort year={currentYear} />
            ) : projects.length === 0 ? (
              <div className="bg-[#F0F6FE] rounded-2xl border border-blue-100/70 p-16 text-center max-w-lg mx-auto shadow-sm">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#08245C]">No projects found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search query, selecting another category, or viewing another cohort year.
                </p>
                <Link
                  href="/projects"
                  className="inline-block mt-4 text-xs font-bold text-[#0875D1] hover:underline"
                >
                  Reset all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col hover:-translate-y-1"
                  >
                    {/* Media with frosted category pill (Video prioritized if uploaded) */}
                    <div className="aspect-[16/9] relative bg-slate-900 overflow-hidden">
                      <ProjectMediaCover
                        videoUrl={project.videoUrl}
                        imageUrl={project.heroImage}
                        alt={project.title}
                        fallbackImage="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#08245C] uppercase tracking-wider z-10 shadow-xs">
                        {project.category}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#08245C] group-hover:text-[#0875D1] transition mb-2">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                          {project.summary}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {project.technology
                            .split(",")
                            .slice(0, 3)
                            .map((tech, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-bold bg-blue-50 text-[#0875D1] px-2.5 py-1 rounded-md"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                        </div>
                      </div>

                      <div
                        className="w-full py-2.5 px-4 rounded-xl bg-[#08245C] group-hover:bg-[#061B40] text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                      >
                        View Solution
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* 3. CALL TO ACTION (MATCHING HOME PAGE) - ZOOM IN */}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-white text-center overflow-hidden">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] tracking-tight leading-tight">
              Have an Idea? Let&apos;s Turn It Into Innovation.
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-normal tracking-wide max-w-xl mx-auto">
              Join our vibrant ecosystem of developers, researchers, and visionaries.
            </p>
            <div className="pt-3">
              <Link
                href="/submit-innovation"
                className="inline-flex items-center px-8 py-3.5 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg transition-all"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
