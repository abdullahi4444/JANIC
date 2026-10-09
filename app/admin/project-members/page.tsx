import React from "react";
import { requireAuth } from "@/lib/permissions/roles";
import { KpiRow } from "@/components/admin/KpiRow";
import { ProjectMemberRepository } from "@/repositories/project-member.repository";
import { ProjectMemberManager } from "@/components/admin/ProjectMemberManager";
import { ProjectService } from "@/services/projects/project.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Project Members & Social Links | JANIC Admin",
  description: "Manage student innovators, team roles, and social media handles.",
};

export default async function AdminProjectMembersPage() {
  await requireAuth(null, "project_members:read");
  const [members, rawProjects] = await Promise.all([
    ProjectMemberRepository.findAll(),
    ProjectService.getPublishedProjects(),
  ]);

  const projects = (rawProjects as any[])
    .sort((a: any, b: any) => a.order - b.order)
    .map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      order: p.order,
    }));

  const withSocials = (members as any[]).filter(
    (m: any) =>
      Boolean(m.github) ||
      Boolean(m.linkedin) ||
      Boolean(m.twitter) ||
      Boolean(m.instagram) ||
      Boolean(m.facebook) ||
      Boolean(m.website) ||
      Boolean(m.email)
  ).length;

  const activeCount = (members as any[]).filter((m: any) => m.isActive).length;
  const projectCount = new Set((members as any[]).map((m: any) => m.projectId).filter(Boolean)).size;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Project Members & Social Links
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Add, edit, and manage student innovators, roles, avatars, and their social media profiles across the 15 projects.
        </p>
      </div>

      <KpiRow
        items={[
          { title: "Total Members", value: members.length, sub: "student engineers" },
          { title: "Active Directory", value: activeCount, sub: "publicly visible" },
          { title: "Projects Represented", value: projectCount, sub: "out of 15" },
          { title: "With Social Links", value: withSocials, sub: "connected profiles" },
        ]}
      />

      <ProjectMemberManager
        initialMembers={members as any}
        projects={projects}
      />
    </div>
  );
}

