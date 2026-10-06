import React from "react";
import { EventService } from "@/services/events/event.service";
import { EventManager } from "@/components/admin/EventManager";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await EventService.getAllAdmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Events & Activities CMS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage hackathons, demo days, tech summits, and competitions.
        </p>
      </div>

      <EventManager initialEvents={events as any} />
    </div>
  );
}
