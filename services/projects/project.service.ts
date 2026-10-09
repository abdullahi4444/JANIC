import { ProjectRepository } from "@/repositories/project.repository";
import { slugify } from "@/lib/utils";
import { ContentStatus, Prisma } from "@prisma/client";
import prisma from "@/lib/db/prisma";

export class ProjectService {
  static async getFeaturedProjects(limit = 6) {
    const featured = await ProjectRepository.findPublished({ isFeatured: true, limit });
    if (featured.length < limit) {
      const allPublished = await ProjectRepository.findPublished({ limit: limit * 2 });
      const featuredIds = new Set(featured.map((p) => p.id));
      const rest = allPublished
        .filter((p) => !featuredIds.has(p.id))
        .slice(0, limit - featured.length);
      return [...featured, ...rest];
    }
    return featured;
  }

  static async getPublishedProjects(options?: {
    category?: string;
    search?: string;
    limit?: number;
  }) {
    return ProjectRepository.findPublished(options);
  }

  static async getProjectBySlug(slug: string) {
    return ProjectRepository.findBySlug(slug);
  }

  static async getAllAdmin(options?: {
    status?: ContentStatus;
    category?: string;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    return ProjectRepository.findAllAdmin(options);
  }

  static async createProject(data: {
    title: string;
    summary: string;
    problem: string;
    solution: string;
    technology: string;
    innovation?: string | null;
    outcomes?: string | null;
    category: string;
    status?: ContentStatus;
    isFeatured?: boolean;
    heroImage?: string | null;
    demoUrl?: string | null;
    videoUrl?: string | null;
    githubUrl?: string | null;
    teamMembers?: string | null;
    order?: number;
    galleryImages?: string[];
    members?: Array<{
      id?: string;
      name: string;
      role?: string;
      department?: string;
      avatar?: string | null;
      github?: string | null;
      linkedin?: string | null;
      facebook?: string | null;
      email?: string | null;
    }>;
  }) {
    let slug = slugify(data.title);
    const existing = await ProjectRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const computedTeamMembers =
      data.teamMembers?.trim() ||
      (data.members && data.members.length > 0
        ? data.members.map((m) => (m.role ? `${m.name} (${m.role})` : m.name)).join(", ")
        : null);

    const createInput: Prisma.ProjectCreateInput = {
      title: data.title,
      slug,
      summary: data.summary,
      problem: data.problem,
      solution: data.solution,
      technology: data.technology,
      innovation: data.innovation || null,
      outcomes: data.outcomes || null,
      category: data.category,
      status: data.status || ContentStatus.PUBLISHED,
      isFeatured: !!data.isFeatured,
      heroImage: data.heroImage || null,
      demoUrl: data.demoUrl || null,
      videoUrl: data.videoUrl || null,
      githubUrl: data.githubUrl || null,
      teamMembers: computedTeamMembers,
      order: data.order || 0,
      publishedAt: data.status === ContentStatus.PUBLISHED ? new Date() : null,
    };

    const project = await ProjectRepository.create(createInput);

    if (data.galleryImages && Array.isArray(data.galleryImages)) {
      const valid = data.galleryImages.filter((u) => typeof u === "string" && u.trim().length > 0);
      if (valid.length > 0) {
        await prisma.projectGalleryItem.createMany({
          data: valid.map((url, idx) => ({
            projectId: project.id,
            imageUrl: url.trim(),
            order: idx,
          })),
        });
      }
    }

    if (data.members && Array.isArray(data.members)) {
      const memberModel = (prisma as any).projectMember;
      for (const m of data.members) {
        if (m.name && m.name.trim()) {
          await memberModel.create({
            data: {
              projectId: project.id,
              name: m.name.trim(),
              role: m.role?.trim() || "Team Member",
              department: m.department?.trim() || "Faculty of Computer Science & IT",
              avatar: m.avatar?.trim() || null,
              github: m.github?.trim() || null,
              linkedin: m.linkedin?.trim() || null,
              facebook: m.facebook?.trim() || null,
              email: m.email?.trim() || null,
            },
          });
        }
      }
    }

    return ProjectRepository.findById(project.id);
  }

  static async updateProject(
    id: string,
    data: {
      title?: string;
      summary?: string;
      problem?: string;
      solution?: string;
      technology?: string;
      innovation?: string | null;
      outcomes?: string | null;
      category?: string;
      status?: ContentStatus;
      isFeatured?: boolean;
      heroImage?: string | null;
      demoUrl?: string | null;
      videoUrl?: string | null;
      githubUrl?: string | null;
      teamMembers?: string | null;
      order?: number;
      galleryImages?: string[];
      members?: Array<{
        id?: string;
        name: string;
        role?: string;
        department?: string;
        avatar?: string | null;
        github?: string | null;
        linkedin?: string | null;
        facebook?: string | null;
        email?: string | null;
      }>;
    }
  ) {
    const { galleryImages, members, ...scalarData } = data;

    const computedTeamMembers =
      scalarData.teamMembers !== undefined
        ? scalarData.teamMembers
        : members && members.length > 0
        ? members.map((m) => (m.role ? `${m.name} (${m.role})` : m.name)).join(", ")
        : undefined;

    const updateInput: Prisma.ProjectUpdateInput = {
      ...scalarData,
      heroImage: scalarData.heroImage !== undefined ? (scalarData.heroImage || null) : undefined,
      demoUrl: scalarData.demoUrl !== undefined ? (scalarData.demoUrl || null) : undefined,
      videoUrl: scalarData.videoUrl !== undefined ? (scalarData.videoUrl || null) : undefined,
      githubUrl: scalarData.githubUrl !== undefined ? (scalarData.githubUrl || null) : undefined,
      teamMembers: computedTeamMembers !== undefined ? (computedTeamMembers || null) : undefined,
      innovation: scalarData.innovation !== undefined ? (scalarData.innovation || null) : undefined,
      outcomes: scalarData.outcomes !== undefined ? (scalarData.outcomes || null) : undefined,
    };

    if (scalarData.status === ContentStatus.PUBLISHED) {
      updateInput.publishedAt = new Date();
    }

    await ProjectRepository.update(id, updateInput);

    if (galleryImages !== undefined && Array.isArray(galleryImages)) {
      await prisma.projectGalleryItem.deleteMany({ where: { projectId: id } });
      const valid = galleryImages.filter((u) => typeof u === "string" && u.trim().length > 0);
      if (valid.length > 0) {
        await prisma.projectGalleryItem.createMany({
          data: valid.map((url, idx) => ({
            projectId: id,
            imageUrl: url.trim(),
            order: idx,
          })),
        });
      }
    }

    if (members !== undefined && Array.isArray(members)) {
      const memberModel = (prisma as any).projectMember;
      const currentMembers: any[] = await memberModel.findMany({ where: { projectId: id } });
      const keptIds = new Set(members.filter((m) => m.id).map((m) => m.id));

      for (const cm of currentMembers) {
        if (!keptIds.has(cm.id)) {
          await memberModel.update({
            where: { id: cm.id },
            data: { projectId: null },
          });
        }
      }

      for (const m of members) {
        if (m.name && m.name.trim()) {
          if (m.id && currentMembers.some((cm: any) => cm.id === m.id)) {
            await memberModel.update({
              where: { id: m.id },
              data: {
                name: m.name.trim(),
                role: m.role?.trim() || "Team Member",
                department: m.department?.trim() || "Faculty of Computer Science & IT",
                avatar: m.avatar?.trim() || null,
                github: m.github?.trim() || null,
                linkedin: m.linkedin?.trim() || null,
                facebook: m.facebook?.trim() || null,
                email: m.email?.trim() || null,
              },
            });
          } else {
            await memberModel.create({
              data: {
                projectId: id,
                name: m.name.trim(),
                role: m.role?.trim() || "Team Member",
                department: m.department?.trim() || "Faculty of Computer Science & IT",
                avatar: m.avatar?.trim() || null,
                github: m.github?.trim() || null,
                linkedin: m.linkedin?.trim() || null,
                facebook: m.facebook?.trim() || null,
                email: m.email?.trim() || null,
              },
            });
          }
        }
      }
    }

    return ProjectRepository.findById(id);
  }

  static async deleteProject(id: string) {
    return ProjectRepository.delete(id);
  }

  static async getCategories() {
    return ProjectRepository.getCategories();
  }
}
