/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ProjectService } from "@/services/projects/project.service";
import { ProjectManager } from "@/components/admin/ProjectManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects Showcase | JANIC Admin",
  description: "Create, edit, publish, and manage student innovation projects and prototypes.",
};

export default async function AdminProjectsPage() {
  const [{ items: projects }, categories] = await Promise.all([
    ProjectService.getAllAdmin(),
    ProjectService.getCategories(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Project Showcases
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
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
