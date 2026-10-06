import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import { ScrollReveal } from "@/components/public/ScrollReveal";

interface SectionHeroProps {
  badge?: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export function SectionHero({
  badge,
  title,
  description,
  breadcrumbs,
  children,
}: SectionHeroProps) {
  return (
    <section className="bg-white pt-6 pb-8 sm:pt-8 sm:pb-12 overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-down" duration={750} rootMargin="0px">
          <div className="relative rounded-[2rem] md:rounded-[2.5rem] bg-[#08245C] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl border border-blue-900/60">
            {/* Background ambient lighting */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
              {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

              {badge && (
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                    {badge}
                  </span>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
                {description}
              </p>

              {children && <div className="pt-2">{children}</div>}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
