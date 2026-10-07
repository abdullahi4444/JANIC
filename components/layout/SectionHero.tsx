import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/layout/Breadcrumbs";

interface SectionHeroProps {
  badge?: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

function HeroVisual() {
  return (
    <div
      className="absolute inset-y-0 right-0 w-full lg:w-[45%] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute top-1/4 right-8 w-64 h-64 rounded-full bg-sky-200/40 dark:bg-sky-500/10 blur-[110px]" />
      <div className="absolute bottom-4 right-1/4 w-44 h-44 rounded-full bg-emerald-100/50 dark:bg-emerald-500/10 blur-[100px]" />

      <svg className="absolute inset-0 w-full h-full opacity-[0.5]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" style={{ stroke: "var(--hero-grid-stroke, #DBEAFE)" }} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
      </svg>

      <svg
        className="hero-nodes absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[300px]"
        viewBox="0 0 420 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#93C5FD" strokeOpacity="0.6" strokeWidth="1">
          <line x1="80" y1="220" x2="160" y2="140" />
          <line x1="160" y1="140" x2="260" y2="170" />
          <line x1="260" y1="170" x2="340" y2="90" />
          <line x1="160" y1="140" x2="210" y2="60" />
          <line x1="340" y1="90" x2="380" y2="180" />
          <line x1="260" y1="170" x2="290" y2="250" />
        </g>
        <g fill="#38BDF8">
          <circle cx="80" cy="220" r="4" />
          <circle cx="160" cy="140" r="5" />
          <circle cx="260" cy="170" r="4" />
          <circle cx="340" cy="90" r="5" />
          <circle cx="210" cy="60" r="3.5" />
          <circle cx="380" cy="180" r="3.5" />
          <circle cx="290" cy="250" r="4" />
        </g>
        <circle cx="160" cy="140" r="10" stroke="#7DD3FC" />
        <circle cx="340" cy="90" r="10" stroke="#7DD3FC" />
      </svg>

      <div className="hidden md:block absolute bottom-8 right-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-[#0875D1] dark:text-sky-300 uppercase">
          <span>Education</span>
          <span className="text-slate-300 dark:text-slate-700">→</span>
          <span className="text-sky-600 dark:text-sky-300">Innovation</span>
          <span className="text-slate-300 dark:text-slate-700">→</span>
          <span className="text-emerald-600 dark:text-emerald-300">Impact</span>
        </div>
      </div>
    </div>
  );
}

export function SectionHero({
  badge,
  title,
  description,
  breadcrumbs,
  children,
}: SectionHeroProps) {
  return (
    <section className="bg-white dark:bg-slate-950 pt-6 pb-8 sm:pt-8 sm:pb-12 overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="section-hero-card relative rounded-2xl md:rounded-2xl lg:rounded-2xl p-8 sm:p-12 lg:px-16 lg:py-14 overflow-hidden border border-blue-100/70 dark:border-slate-800 lg:min-h-[400px] flex items-center"
        >
          <HeroVisual />

          <div className="relative z-10 w-full lg:w-[58%]">
            {breadcrumbs && (
              <div className="hero-fade-up" style={{ animationDelay: "0ms" }}>
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}

            {badge && (
              <div className="hero-fade-up mt-4" style={{ animationDelay: "80ms" }}>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/70 dark:border-sky-900 text-[#0875D1] text-[11px] font-semibold uppercase tracking-[0.08em]">
                  {badge}
                </span>
              </div>
            )}

            <h1
              className="hero-fade-up mt-5 text-[34px] leading-[1.05] sm:text-[46px] lg:text-[56px] font-black tracking-tight text-[#08245C]"
              style={{ animationDelay: "160ms" }}
            >
              {title}
            </h1>

            <p
              className="hero-fade-up mt-5 text-[15px] sm:text-base lg:text-[17px] leading-[1.65] text-slate-600 max-w-[640px]"
              style={{ animationDelay: "240ms" }}
            >
              {description}
            </p>

            {children && (
              <div className="hero-fade-up pt-6" style={{ animationDelay: "320ms" }}>
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageHero(props: SectionHeroProps) {
  return <SectionHero {...props} />;
}
