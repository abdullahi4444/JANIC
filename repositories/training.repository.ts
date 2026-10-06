import prisma from "@/lib/db/prisma";
import { ContentStatus, Prisma } from "@prisma/client";

export class TrainingRepository {
  static async findPublished(options?: {
    category?: string;
    isFeatured?: boolean;
    limit?: number;
  }) {
    const where: Prisma.TrainingProgramWhereInput = {
      status: ContentStatus.PUBLISHED,
    };

    if (options?.category && options.category !== "all") {
      where.category = { contains: options.category };
    }

    if (options?.isFeatured !== undefined) {
      where.isFeatured = options.isFeatured;
    }

    return prisma.trainingProgram.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: options?.limit,
    });
  }

  static async findBySlug(slug: string) {
    return prisma.trainingProgram.findUnique({
      where: { slug },
    });
  }

  static async findAllAdmin(options?: {
    status?: ContentStatus;
    search?: string;
  }) {
    const where: Prisma.TrainingProgramWhereInput = {};
    if (options?.status) where.status = options.status;
    if (options?.search) {
      where.OR = [
        { title: { contains: options.search } },
        { category: { contains: options.search } },
      ];
    }

    return prisma.trainingProgram.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });
  }

  static async create(data: Prisma.TrainingProgramCreateInput) {
    return prisma.trainingProgram.create({ data });
  }

  static async update(id: string, data: Prisma.TrainingProgramUpdateInput) {
    return prisma.trainingProgram.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.trainingProgram.delete({ where: { id } });
  }
}
