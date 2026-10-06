import prisma from "@/lib/db/prisma";

export class SettingRepository {
  static async getAll() {
    return prisma.siteSetting.findMany({
      orderBy: { key: "asc" },
    });
  }

  static async getByKey(key: string) {
    return prisma.siteSetting.findUnique({
      where: { key },
    });
  }

  static async upsert(key: string, value: string, group: string = "general") {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value, group },
      create: { key, value, group },
    });
  }

  static async updateMany(settings: { key: string; value: string; group?: string }[]) {
    const operations = settings.map((s) =>
      prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value, ...(s.group ? { group: s.group } : {}) },
        create: { key: s.key, value: s.value, group: s.group || "general" },
      })
    );
    return prisma.$transaction(operations);
  }
}
