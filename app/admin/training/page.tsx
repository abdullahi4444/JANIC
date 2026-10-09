/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React from "react";
import { requireAuth } from "@/lib/permissions/roles";
import { KpiRow } from "@/components/admin/KpiRow";
import { TrainingService } from "@/services/training/training.service";
import { TrainingManager } from "@/components/admin/TrainingManager";

export const dynamic = "force-dynamic";

export default async function AdminTrainingPage() {
  await requireAuth(null, "training:read");
  const programs = await TrainingService.getAllAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Training & Certifications CMS
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage hands-on ICT programs, syllabi, class schedules, and credentials.
        </p>
      </div>

      <KpiRow items={[
      { title: "Programs", value: programs.length, sub: "all tracks" },
      { title: "Published", value: programs.filter((p) => p.status === "PUBLISHED").length, sub: "open enrollment" },
      { title: "Drafts", value: programs.filter((p) => p.status === "DRAFT").length, sub: "being prepared" },
      { title: "Categories", value: new Set(programs.map((p) => p.category)).size, sub: "skill areas" },
    ]} />

      <TrainingManager initialPrograms={programs as any} />
    </div>
  );
}
