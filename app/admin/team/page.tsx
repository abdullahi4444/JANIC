/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { KpiRow } from "@/components/admin/KpiRow";
import { TeamRepository } from "@/repositories/team.repository";
import { TeamManager } from "@/components/admin/TeamManager";
import { requireAuth } from "@/lib/permissions/roles";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  await requireAuth(null, "team:read");
  const team = await TeamRepository.findAllAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Leadership & Faculty CMS
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage center directors, faculty heads, lab leads, and research mentors.
        </p>
      </div>

      <KpiRow items={[
      { title: "Members", value: team.length, sub: "total team" },
      { title: "Active", value: team.filter((t) => t.isActive).length, sub: "currently" },
      { title: "Departments", value: new Set(team.map((t) => t.department)).size, sub: "units" },
      { title: "Roles", value: new Set(team.map((t) => t.role)).size, sub: "distinct" },
    ]} />

      <TeamManager initialTeam={team} />
    </div>
  );
}
