import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ProjectService } from "@/services/projects/project.service";
import { ArrowRight, Search, Tag, Sparkles } from "lucide-react";

export const metadata = {
  title: "Student Innovation Projects",
  description:
    "Explore student-engineered solutions in Web Platforms, HealthTech, Robotics, Arduino, IoT, and AI developed at JANIC.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "all";
  const searchQuery = resolvedParams.q || "";

  const [projects, categories] = await Promise.all([
    ProjectService.getPublishedProjects({
      category: currentCategory === "all" ? undefined : currentCategory,
      search: searchQuery || undefined,
    }),
    ProjectService.getCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="Innovations in Action"
        title="Student Innovation Showcase"
        description="From classroom ideas to real-world solutions. Discover functional prototypes, robotics hardware, and software platforms engineered by Jazeera University students."
        breadcrumbs={[{ label: "Projects" }]}
      />

      {/* 2. SEARCH, FILTERS & PROJECTS BENTO GRID */}
      <section className="py-8 sm:py-14 bg-white min-h-[600px]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls Bento Card: Search & Filter Tabs */}
          <div className="bg-[#F0F6FE] p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border border-blue-100/70 shadow-sm mb-12 space-y-5">
            {/* Search Input */}
            <form method="GET" action="/projects" className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-[#0875D1]" />
              </div>
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search projects by title, problem, or technology (e.g. Arduino, Next.js, AI)..."
                className="w-full pl-11 pr-28 py-3.5 bg-white border border-blue-200/60 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1] shadow-sm transition"
              />
              {currentCategory !== "all" && (
                <input type="hidden" name="category" value={currentCategory} />
              )}
              <button
                type="submit"
                className="absolute inset-y-1.5 right-1.5 px-6 bg-[#0875D1] hover:bg-[#0660ac] text-white font-bold text-xs rounded-full transition shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-blue-100/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#0875D1]" /> Category:
              </span>
              <Link
                href={`/projects${searchQuery ? `?q=${searchQuery}` : ""}`}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                  currentCategory === "all"
                    ? "bg-[#08245C] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                All Categories
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/projects?category=${encodeURIComponent(cat)}${
                    searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""
                  }`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                    currentCategory === cat
                      ? "bg-[#0875D1] text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="bg-[#F0F6FE] rounded-[32px] border border-blue-100/70 p-16 text-center max-w-lg mx-auto shadow-sm">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#08245C]">No projects found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search query or select another category filter.
              </p>
              <Link
                href="/projects"
                className="inline-block mt-4 text-xs font-bold text-[#0875D1] hover:underline"
              >
                Reset all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="bg-white rounded-[26px] border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1"
                >
                  {/* Image with frosted category pill */}
                  <div className="aspect-[16/10] relative bg-slate-100 overflow-hidden">
                    <Image
                      src={
                        project.heroImage ||
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3.5 left-3.5 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-sm uppercase tracking-wider">
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

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0875D1]">
                      <span>View Solution</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. CALL TO ACTION (MATCHING HOME PAGE) */}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-white text-center">
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
      </section>
    </div>
  );
}
