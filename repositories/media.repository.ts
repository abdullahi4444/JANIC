import prisma from "@/lib/db/prisma";

export class MediaRepository {
  static async findAll(folder?: string) {
    return prisma.media.findMany({
      where: folder ? { folder } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }
}
