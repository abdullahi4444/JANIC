import prisma from "@/lib/db/prisma";
import { MessageStatus, Prisma } from "@prisma/client";

export class MessageRepository {
  static async create(data: Prisma.ContactMessageCreateInput) {
    return prisma.contactMessage.create({ data });
  }

  static async findAllAdmin(options?: {
    status?: MessageStatus;
    search?: string;
  }) {
    const where: Prisma.ContactMessageWhereInput = {};
    if (options?.status) where.status = options.status;
    if (options?.search) {
      where.OR = [
        { name: { contains: options.search } },
        { email: { contains: options.search } },
        { subject: { contains: options.search } },
      ];
    }

    return prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateStatus(id: string, status: MessageStatus, adminNotes?: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: { status, adminNotes },
    });
  }

  static async delete(id: string) {
    return prisma.contactMessage.delete({ where: { id } });
  }
}
