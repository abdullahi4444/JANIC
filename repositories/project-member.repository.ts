import prisma from "@/lib/db/prisma";

export interface ProjectMemberRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  bio?: string | null;
  avatar?: string | null;
  projectId?: string | null;
  project?: {
    id: string;
    title: string;
    slug: string;
    category: string;
    order: number;
    heroImage?: string | null;
    summary?: string | null;
  } | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  tags?: string | null;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProjectMemberRepository {
  private static get model() {
    return (prisma as any).projectMember;
  }

  static async findAll(options?: {
    projectId?: string;
    search?: string;
    isActive?: boolean;
  }): Promise<ProjectMemberRecord[]> {
    const where: Record<string, any> = {};

    if (options?.projectId && options.projectId !== "all") {
      where.projectId = options.projectId;
    }

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search } },
        { role: { contains: options.search } },
        { tags: { contains: options.search } },
        { project: { title: { contains: options.search } } },
      ];
    }

    return this.model.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            order: true,
            heroImage: true,
            summary: true,
          },
        },
      },
    });
  }

  static async findById(id: string): Promise<ProjectMemberRecord | null> {
    return this.model.findUnique({
      where: { id },
      include: { project: true },
    });
  }

  static async create(data: any): Promise<ProjectMemberRecord> {
    const created = await this.model.create({
      data,
      include: { project: true },
    });

    if (created.projectId) {
      await this.syncProjectTeamMembersString(created.projectId);
    }

    return created;
  }

  static async update(id: string, data: any): Promise<ProjectMemberRecord> {
    const updated = await this.model.update({
      where: { id },
      data,
      include: { project: true },
    });

    if (updated.projectId) {
      await this.syncProjectTeamMembersString(updated.projectId);
    }

    return updated;
  }

  static async delete(id: string): Promise<ProjectMemberRecord> {
    const existing = await this.model.findUnique({ where: { id } });
    const deleted = await this.model.delete({ where: { id } });

    if (existing?.projectId) {
      await this.syncProjectTeamMembersString(existing.projectId);
    }

    return deleted;
  }

  // Keep Project.teamMembers string in sync with ProjectMember table
  static async syncProjectTeamMembersString(projectId: string): Promise<void> {
    try {
      const members: ProjectMemberRecord[] = await this.model.findMany({
        where: { projectId, isActive: true },
        orderBy: { order: "asc" },
      });

      const memberNames = members.map((m: { name: string }) => m.name).join(", ");
      await prisma.project.update({
        where: { id: projectId },
        data: { teamMembers: memberNames },
      });
    } catch (e) {
      console.warn("Failed to sync teamMembers string:", e);
    }
  }
}
