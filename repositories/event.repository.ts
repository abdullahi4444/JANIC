import prisma from "@/lib/db/prisma";
import { ContentStatus, Prisma } from "@prisma/client";

export class EventRepository {
  private static async populateExtras(items: any[]) {
    if (!items || items.length === 0) return items;
    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        "SELECT id, videoUrl, attendeesCount, gallery, guests, agenda, keyHighlights FROM Event"
      );
      const rowMap = new Map(rows.map((r) => [r.id, r]));
      return items.map((item) => {
        const extra = rowMap.get(item.id);
        if (!extra) return item;
        return {
          ...item,
          videoUrl: extra.videoUrl ?? (item as any).videoUrl ?? null,
          attendeesCount: extra.attendeesCount ?? (item as any).attendeesCount ?? null,
          gallery: extra.gallery ?? (item as any).gallery ?? null,
          guests: extra.guests ?? (item as any).guests ?? null,
          agenda: extra.agenda ?? (item as any).agenda ?? null,
          keyHighlights: extra.keyHighlights ?? (item as any).keyHighlights ?? null,
        };
      });
    } catch {
      return items;
    }
  }

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

    const items = await prisma.event.findMany({
      where,
      orderBy: { eventDate: options?.pastOnly ? "desc" : "asc" },
      take: options?.limit,
    });

    return this.populateExtras(items);
  }

  static async findBySlug(slug: string) {
    const item = await prisma.event.findUnique({
      where: { slug },
    });
    if (!item) return null;

    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        "SELECT videoUrl, attendeesCount, gallery, guests, agenda, keyHighlights FROM Event WHERE slug = ?",
        slug
      );
      if (rows && rows.length > 0) {
        return {
          ...item,
          videoUrl: rows[0].videoUrl ?? (item as any).videoUrl ?? null,
          attendeesCount: rows[0].attendeesCount ?? (item as any).attendeesCount ?? null,
          gallery: rows[0].gallery ?? (item as any).gallery ?? null,
          guests: rows[0].guests ?? (item as any).guests ?? null,
          agenda: rows[0].agenda ?? (item as any).agenda ?? null,
          keyHighlights: rows[0].keyHighlights ?? (item as any).keyHighlights ?? null,
        };
      }
    } catch {}

    return item;
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

    const items = await prisma.event.findMany({
      where,
      orderBy: { eventDate: "desc" },
    });

    return this.populateExtras(items);
  }

  static async create(data: any) {
    const { videoUrl, attendeesCount, gallery, guests, agenda, keyHighlights, ...coreData } = data;
    const created = await prisma.event.create({ data: coreData });

    try {
      await prisma.$executeRawUnsafe(
        "UPDATE Event SET videoUrl = ?, attendeesCount = ?, gallery = ?, guests = ?, agenda = ?, keyHighlights = ? WHERE id = ?",
        videoUrl || null,
        attendeesCount !== undefined && attendeesCount !== null ? Number(attendeesCount) : null,
        typeof gallery === "object" ? JSON.stringify(gallery) : gallery || null,
        typeof guests === "object" ? JSON.stringify(guests) : guests || null,
        typeof agenda === "object" ? JSON.stringify(agenda) : agenda || null,
        typeof keyHighlights === "object" ? JSON.stringify(keyHighlights) : keyHighlights || null,
        created.id
      );
    } catch (e) {
      console.warn("Event extra fields update notice:", e);
    }

    return {
      ...created,
      videoUrl,
      attendeesCount,
      gallery,
      guests,
      agenda,
      keyHighlights,
    };
  }

  static async update(id: string, data: any) {
    const { videoUrl, attendeesCount, gallery, guests, agenda, keyHighlights, ...coreData } = data;
    const updated = await prisma.event.update({ where: { id }, data: coreData });

    try {
      await prisma.$executeRawUnsafe(
        "UPDATE Event SET videoUrl = ?, attendeesCount = ?, gallery = ?, guests = ?, agenda = ?, keyHighlights = ? WHERE id = ?",
        videoUrl || null,
        attendeesCount !== undefined && attendeesCount !== null ? Number(attendeesCount) : null,
        typeof gallery === "object" ? JSON.stringify(gallery) : gallery || null,
        typeof guests === "object" ? JSON.stringify(guests) : guests || null,
        typeof agenda === "object" ? JSON.stringify(agenda) : agenda || null,
        typeof keyHighlights === "object" ? JSON.stringify(keyHighlights) : keyHighlights || null,
        id
      );
    } catch (e) {
      console.warn("Event extra fields update notice:", e);
    }

    return {
      ...updated,
      videoUrl,
      attendeesCount,
      gallery,
      guests,
      agenda,
      keyHighlights,
    };
  }

  static async delete(id: string) {
    return prisma.event.delete({ where: { id } });
  }
}
