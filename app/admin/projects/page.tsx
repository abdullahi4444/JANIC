import React from "react";
import { ProjectService } from "@/services/projects/project.service";
import { ProjectManager } from "@/components/admin/ProjectManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const [{ items: projects }, categories] = await Promise.all([
    ProjectService.getAllAdmin(),
    ProjectService.getCategories(),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Project Showcases
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Create, edit, publish, and manage student innovation projects and laboratory prototypes.
        </p>
      </div>

      <ProjectManager
        initialProjects={projects as any}
        categories={categories}
      />
    </div>
  );
}
