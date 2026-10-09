import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { EventService } from "@/services/events/event.service";
import { EventsDirectory } from "@/components/public/EventsDirectory";
import { Sparkles, CalendarCheck } from "lucide-react";

export const metadata = {
  title: "Events Hosted by JANIC | Innovation, Hackathons & Tech Summits",
  description:
    "Explore past breakthrough showcases and upcoming hackathons, robotics bootcamps, and tech summits hosted by JANIC at Jazeera University.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await EventService.getPublishedEvents();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#070d18] text-slate-900 dark:text-slate-100 overflow-x-clip transition-colors">
      {/* 1. HERO SECTION */}
      <SectionHero
        badge="Innovation in Action"
        title="Events Hosted by JANIC"
        description="Explore the milestones, student demo showcases, 48-hour competitive hackathons, robotics bootcamps, and summits hosted by the Jazeera Nexus Innovation Center."
        breadcrumbs={[{ label: "Events" }]}
      />

      {/* 2. MAIN DIRECTORY WITH INTERACTIVE FILTER */}
      <section className="py-8 sm:py-14 min-h-[600px] overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={700}>
            <EventsDirectory events={events as any} />
          </ScrollReveal>
        </div>
      </section>

      {/* 3. CALL TO ACTION */}
      <section className="pt-10 pb-20 sm:pt-16 sm:pb-28 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-center overflow-hidden transition-colors">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              <Sparkles className="w-3.5 h-3.5" />
              Collaborate With JANIC
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] dark:text-white tracking-tight leading-tight">
              Have an Idea? Let&apos;s Turn It Into Innovation.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-normal tracking-wide max-w-xl mx-auto leading-relaxed">
              Join our vibrant ecosystem of developers, researchers, and visionaries at Jazeera University. Propose a project or partner on our next major hackathon.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/submit-innovation"
                className="inline-flex items-center px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg transition-all"
              >
                Submit Innovation
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all"
              >
                Learn About JANIC
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
