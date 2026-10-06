import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export class TeamRepository {
  static async findActive() {
    return prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }

  static async findAllAdmin() {
    return prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
  }

  static async create(data: Prisma.TeamMemberCreateInput) {
    return prisma.teamMember.create({ data });
  }

  static async update(id: string, data: Prisma.TeamMemberUpdateInput) {
    return prisma.teamMember.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.teamMember.delete({ where: { id } });
  }
}
