import React from "react";
import { TeamRepository } from "@/repositories/team.repository";
import { TeamManager } from "@/components/admin/TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const team = await TeamRepository.findAllAdmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Leadership & Faculty CMS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage center directors, faculty heads, lab leads, and research mentors.
        </p>
      </div>

      <TeamManager initialTeam={team} />
    </div>
  );
}
