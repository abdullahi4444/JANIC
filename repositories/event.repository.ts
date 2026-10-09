import prisma from "@/lib/db/prisma";
import { ContentStatus, Prisma } from "@prisma/client";

export class EventRepository {
  static async findPublished(options?: {
    isFeatured?: boolean;
    upcomingOnly?: boolean;
    pastOnly?: boolean;
    limit?: number;
  }) {
    const where: Prisma.EventWhereInput = {
      status: ContentStatus.PUBLISHED,
    };

    if (options?.isFeatured !== undefined) {
      where.isFeatured = options.isFeatured;
    }

    if (options?.upcomingOnly) {
      where.eventDate = { gte: new Date() };
    } else if (options?.pastOnly) {
      where.eventDate = { lt: new Date() };
    }

    return prisma.event.findMany({
      where,
      orderBy: { eventDate: options?.pastOnly ? "desc" : "asc" },
      take: options?.limit,
    });
  }

  static async findBySlug(slug: string) {
    return prisma.event.findUnique({
      where: { slug },
    });
  }

  static async findAllAdmin(options?: {
    status?: ContentStatus;
    search?: string;
  }) {
    const where: Prisma.EventWhereInput = {};
    if (options?.status) where.status = options.status;
    if (options?.search) {
      where.OR = [
        { title: { contains: options.search } },
        { location: { contains: options.search } },
      ];
    }

    return prisma.event.findMany({
      where,
      orderBy: { eventDate: "desc" },
    });
  }

  static async create(data: any) {
    return prisma.event.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.event.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.event.delete({ where: { id } });
  }
}
