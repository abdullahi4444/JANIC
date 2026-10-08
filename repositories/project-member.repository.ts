import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export class ProjectMemberRepository {
  static async findAll(options?: {
    projectId?: string;
    search?: string;
    isActive?: boolean;
  }) {
    const where: Prisma.ProjectMemberWhereInput = {};

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

    return prisma.projectMember.findMany({
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

  static async findById(id: string) {
    return prisma.projectMember.findUnique({
      where: { id },
      include: { project: true },
    });
  }

  static async create(data: Prisma.ProjectMemberCreateInput) {
    const created = await prisma.projectMember.create({
      data,
      include: { project: true },
    });

    if (created.projectId) {
      await this.syncProjectTeamMembersString(created.projectId);
    }

    return created;
  }

  static async update(id: string, data: Prisma.ProjectMemberUpdateInput) {
    const updated = await prisma.projectMember.update({
      where: { id },
      data,
      include: { project: true },
    });

    if (updated.projectId) {
      await this.syncProjectTeamMembersString(updated.projectId);
    }

    return updated;
  }

  static async delete(id: string) {
    const existing = await prisma.projectMember.findUnique({ where: { id } });
    const deleted = await prisma.projectMember.delete({ where: { id } });

    if (existing?.projectId) {
      await this.syncProjectTeamMembersString(existing.projectId);
    }

    return deleted;
  }

  // Keep Project.teamMembers string in sync with ProjectMember table
  static async syncProjectTeamMembersString(projectId: string) {
    try {
      const members = await prisma.projectMember.findMany({
        where: { projectId, isActive: true },
        orderBy: { order: "asc" },
      });

      const memberNames = members.map((m) => m.name).join(", ");
      await prisma.project.update({
        where: { id: projectId },
        data: { teamMembers: memberNames },
      });
    } catch (e) {
      console.warn("Failed to sync teamMembers string:", e);
    }
  }
}
