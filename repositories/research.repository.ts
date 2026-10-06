import prisma from "@/lib/db/prisma";
import { ContentStatus, Prisma } from "@prisma/client";

export class ResearchRepository {
  static async findPublished(options?: {
    category?: string;
    isFeatured?: boolean;
    limit?: number;
  }) {
    const where: Prisma.ResearchPaperWhereInput = {
      status: ContentStatus.PUBLISHED,
    };

    if (options?.category && options.category !== "all") {
      where.category = { contains: options.category };
    }

    if (options?.isFeatured !== undefined) {
      where.isFeatured = options.isFeatured;
    }

    return prisma.researchPaper.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { publicationDate: "desc" }],
      take: options?.limit,
    });
  }

  static async findBySlug(slug: string) {
    return prisma.researchPaper.findUnique({
      where: { slug },
    });
  }

  static async findAllAdmin(options?: {
    status?: ContentStatus;
    search?: string;
  }) {
    const where: Prisma.ResearchPaperWhereInput = {};
    if (options?.status) where.status = options.status;
    if (options?.search) {
      where.OR = [
        { title: { contains: options.search } },
        { authors: { contains: options.search } },
      ];
    }

    return prisma.researchPaper.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });
  }

  static async create(data: Prisma.ResearchPaperCreateInput) {
    return prisma.researchPaper.create({ data });
  }

  static async update(id: string, data: Prisma.ResearchPaperUpdateInput) {
    return prisma.researchPaper.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.researchPaper.delete({ where: { id } });
  }
}
