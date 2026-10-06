import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { EventService } from "@/services/events/event.service";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Events & Activities",
  description:
    "Upcoming hackathons, demo days, robotics workshops, and tech summits at JANIC, Jazeera University.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await EventService.getPublishedEvents();

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="Innovation in Action"
        title="Events, Hackathons & Summits"
        description="Experience technology in action. Join student demo showcases, 48-hour competitive hackathons, robotics bootcamps, and career expos."
        breadcrumbs={[{ label: "Events" }]}
      />

      {/* 2. EVENTS BENTO GRID - FADE UP */}
      <section className="py-8 sm:py-14 bg-white min-h-[500px] overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="mb-10 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1.5">
                CALENDAR &amp; ACTIVITIES
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#08245C] tracking-tight">
                Upcoming &amp; Featured Events
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
                Connect with students, engineering leaders, and faculty advisors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {events.map((event) => {
                const eventDateObj = new Date(event.eventDate);
                const dayStr = isNaN(eventDateObj.getDate())
                  ? "15"
                  : String(eventDateObj.getDate()).padStart(2, "0");
                const monthStr = isNaN(eventDateObj.getMonth())
                  ? "DEC"
                  : eventDateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-[26px] border border-slate-200/80 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                  >
                    <div>
                      {/* Event Cover Image with Top-Left Date Badge */}
                      <div className="aspect-[16/10] relative bg-slate-100 overflow-hidden">
                        <Image
                          src={
                            event.coverImage ||
                            "/images/event-summit.jpg"
                          }
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Top-Left Date Badge */}
                        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 min-w-[46px]">
                          <div className="text-base sm:text-lg font-black text-[#08245C] leading-none">
                            {dayStr}
                          </div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                            {monthStr}
                          </div>
                        </div>

                        <div className="absolute top-3.5 right-3.5 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-sm uppercase tracking-wider">
                          {event.category}
                        </div>
                      </div>

                      <div className="p-6 sm:p-7">
                        <h3 className="text-lg font-bold text-[#08245C] mb-2 leading-snug group-hover:text-[#0875D1] transition">
                          {event.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                          {event.summary}
                        </p>

                        <div className="space-y-1.5 py-3 border-t border-slate-100 text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#0875D1] shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          {event.capacity && (
                            <div className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-[#0875D1] shrink-0" />
                              <span>Capacity: {event.capacity} Attendees</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7 pt-0">
                      <Link
                        href={`/events/${event.slug}`}
                        className="w-full py-3 px-5 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20"
                      >
                        Event Details &amp; Register
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
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
