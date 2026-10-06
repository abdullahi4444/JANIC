import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventService } from "@/services/events/event.service";
import { SectionHero } from "@/components/layout/SectionHero";
import { Calendar, MapPin, Users, ExternalLink, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await EventService.getEventBySlug(slug);
  if (!event) return { title: "Event Not Found | JANIC" };

  return {
    title: `${event.title} | JANIC`,
    description: event.summary,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await EventService.getEventBySlug(slug);

  if (!event || event.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div>
      <SectionHero
        badge={event.category}
        title={event.title}
        description={event.summary}
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
      />

      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Details (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {event.coverImage && (
                <div className="aspect-[16/9] relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="text-2xl font-extrabold text-[#08245C]">
                  Event Description & Agenda
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-[#08245C]">Event Details</h3>

                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#0875D1]" />
                    <span><strong>Date:</strong> {formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#0875D1] shrink-0 mt-0.5" />
                    <span><strong>Location:</strong> {event.location}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-[#0875D1]" />
                      <span><strong>Capacity:</strong> {event.capacity} seats</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  {event.registrationUrl ? (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Register for Event
                    </a>
                  ) : (
                    <div className="p-3 bg-slate-50 text-center rounded-xl text-xs text-slate-500 font-medium">
                      Registration opens 2 weeks before the event
                    </div>
                  )}
                </div>
              </div>

              <Link
                href="/events"
                className="w-full py-3 px-4 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
