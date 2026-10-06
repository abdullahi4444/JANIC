import prisma from "@/lib/db/prisma";
import { SubmissionStatus, Prisma } from "@prisma/client";

export class SubmissionRepository {
  static async create(data: Prisma.InnovationSubmissionCreateInput) {
    return prisma.innovationSubmission.create({ data });
  }

  static async findAllAdmin(options?: {
    status?: SubmissionStatus;
    search?: string;
  }) {
    const where: Prisma.InnovationSubmissionWhereInput = {};
    if (options?.status) where.status = options.status;
    if (options?.search) {
      where.OR = [
        { title: { contains: options.search } },
        { submitterName: { contains: options.search } },
        { submitterEmail: { contains: options.search } },
      ];
    }

    return prisma.innovationSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: string) {
    return prisma.innovationSubmission.findUnique({ where: { id } });
  }

  static async updateStatus(id: string, status: SubmissionStatus, reviewNotes?: string) {
    return prisma.innovationSubmission.update({
      where: { id },
      data: { status, reviewNotes },
    });
  }

  static async delete(id: string) {
    return prisma.innovationSubmission.delete({ where: { id } });
  }
}
