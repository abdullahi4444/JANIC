import { TrainingRepository } from "@/repositories/training.repository";
import { slugify } from "@/lib/utils";
import { ContentStatus, Prisma } from "@prisma/client";

export class TrainingService {
  static async getFeaturedPrograms(limit = 4) {
    return TrainingRepository.findPublished({ isFeatured: true, limit });
  }

  static async getPublishedPrograms(options?: { category?: string; limit?: number }) {
    return TrainingRepository.findPublished(options);
  }

  static async getProgramBySlug(slug: string) {
    return TrainingRepository.findBySlug(slug);
  }

  static async getAllAdmin(options?: { status?: ContentStatus; search?: string }) {
    return TrainingRepository.findAllAdmin(options);
  }

  static async createProgram(data: {
    title: string;
    summary: string;
    description: string;
    category: string;
    level?: string;
    duration: string;
    schedule: string;
    mode?: string;
    certification?: string;
    status?: ContentStatus;
    isFeatured?: boolean;
    coverImage?: string;
    maxSeats?: number;
    syllabus?: string;
  }) {
    let slug = slugify(data.title);
    const existing = await TrainingRepository.findBySlug(slug);
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const createInput: Prisma.TrainingProgramCreateInput = {
      title: data.title,
      slug,
      summary: data.summary,
      description: data.description,
      category: data.category,
      level: data.level || "All Levels",
      duration: data.duration,
      schedule: data.schedule,
      mode: data.mode || "On-Campus",
      certification: data.certification,
      status: data.status || ContentStatus.DRAFT,
      isFeatured: !!data.isFeatured,
      coverImage: data.coverImage,
      maxSeats: data.maxSeats,
      syllabus: data.syllabus,
    };

    return TrainingRepository.create(createInput);
  }

  static async updateProgram(id: string, data: Prisma.TrainingProgramUpdateInput) {
    return TrainingRepository.update(id, data);
  }

  static async deleteProgram(id: string) {
    return TrainingRepository.delete(id);
  }
}
