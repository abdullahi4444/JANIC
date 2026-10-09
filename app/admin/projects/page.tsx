/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React from "react";
import { requireAuth } from "@/lib/permissions/roles";
import { KpiRow } from "@/components/admin/KpiRow";
import { ProjectService } from "@/services/projects/project.service";
import { ProjectManager } from "@/components/admin/ProjectManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await requireAuth(null, "projects:read");
  const [{ items: projects }, categories] = await Promise.all([
    ProjectService.getAllAdmin(),
    ProjectService.getCategories(),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Project Showcases
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Create, edit, publish, and manage student innovation projects and laboratory prototypes.
        </p>
      </div>

      <KpiRow items={[
      { title: "Total Projects", value: projects.length, sub: "all time" },
      { title: "Published", value: projects.filter((p) => p.status === "PUBLISHED").length, sub: "live on portal" },
      { title: "Drafts", value: projects.filter((p) => p.status === "DRAFT").length, sub: "in progress" },
      { title: "Archived", value: projects.filter((p) => p.status === "ARCHIVED").length, sub: "retired" },
    ]} />

      <ProjectManager
        initialProjects={projects as any}
        categories={categories}
      />
    </div>
  );
}
