import { ProjectRepository } from "@/repositories/project.repository";
import { slugify } from "@/lib/utils";
import { ContentStatus, Prisma } from "@prisma/client";

export class ProjectService {
  static async getFeaturedProjects(limit = 6) {
    return ProjectRepository.findPublished({ isFeatured: true, limit });
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
      innovation: data.innovation,
      outcomes: data.outcomes,
      category: data.category,
      status: data.status || ContentStatus.DRAFT,
      isFeatured: !!data.isFeatured,
      heroImage: data.heroImage,
      demoUrl: data.demoUrl,
      videoUrl: data.videoUrl,
      githubUrl: data.githubUrl,
      teamMembers: data.teamMembers,
      order: data.order || 0,
      publishedAt: data.status === ContentStatus.PUBLISHED ? new Date() : null,
    };

    return ProjectRepository.create(createInput);
  }

  static async updateProject(
    id: string,
    data: {
      title?: string;
      summary?: string;
      problem?: string;
      solution?: string;
      technology?: string;
      innovation?: string;
      outcomes?: string;
      category?: string;
      status?: ContentStatus;
      isFeatured?: boolean;
      heroImage?: string;
      demoUrl?: string;
      videoUrl?: string;
      githubUrl?: string;
      teamMembers?: string;
      order?: number;
    }
  ) {
    const updateInput: Prisma.ProjectUpdateInput = { ...data };

    if (data.status === ContentStatus.PUBLISHED) {
      updateInput.publishedAt = new Date();
    }

    return ProjectRepository.update(id, updateInput);
  }

  static async deleteProject(id: string) {
    return ProjectRepository.delete(id);
  }

  static async getCategories() {
    return ProjectRepository.getCategories();
  }
}
