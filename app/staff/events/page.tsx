/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React from "react";
import { requireAuth } from "@/lib/permissions/roles";
import { KpiRow } from "@/components/admin/KpiRow";
import { EventService } from "@/services/events/event.service";
import { EventManager } from "@/components/admin/EventManager";

export const dynamic = "force-dynamic";

export default async function StaffEventsPage() {
  await requireAuth(null, "events:read");
  const events = await EventService.getAllAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Events & Activities CMS
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage hackathons, demo days, tech summits, and competitions.
        </p>
      </div>

      <KpiRow items={[
        { title: "Total Events", value: events.length, sub: "all time" },
        { title: "Upcoming", value: events.filter((e) => new Date(e.eventDate) >= new Date()).length, sub: "scheduled" },
        { title: "Published", value: events.filter((e) => e.status === "PUBLISHED").length, sub: "visible" },
        { title: "Drafts", value: events.filter((e) => e.status === "DRAFT").length, sub: "planned" },
      ]} />

      <EventManager initialEvents={events as any} />
    </div>
  );
}
