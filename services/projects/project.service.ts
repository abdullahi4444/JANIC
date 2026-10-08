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
    innovation?: string;
    outcomes?: string;
    category: string;
    status?: ContentStatus;
    isFeatured?: boolean;
    heroImage?: string;
    demoUrl?: string;
    videoUrl?: string;
    githubUrl?: string;
    teamMembers?: string;
    order?: number;
    galleryImages?: string[];
  }) {
    let slug = slugify(data.title);
    const existing = await ProjectRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

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
      teamMembers: data.teamMembers || null,
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
    }
  ) {
    const { galleryImages, ...scalarData } = data;

    const updateInput: Prisma.ProjectUpdateInput = {
      ...scalarData,
      heroImage: scalarData.heroImage !== undefined ? (scalarData.heroImage || null) : undefined,
      demoUrl: scalarData.demoUrl !== undefined ? (scalarData.demoUrl || null) : undefined,
      videoUrl: scalarData.videoUrl !== undefined ? (scalarData.videoUrl || null) : undefined,
      githubUrl: scalarData.githubUrl !== undefined ? (scalarData.githubUrl || null) : undefined,
      teamMembers: scalarData.teamMembers !== undefined ? (scalarData.teamMembers || null) : undefined,
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

    return ProjectRepository.findById(id);
  }

  static async deleteProject(id: string) {
    return ProjectRepository.delete(id);
  }

  static async getCategories() {
    return ProjectRepository.getCategories();
  }
}
