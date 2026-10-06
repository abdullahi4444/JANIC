import prisma from "@/lib/db/prisma";
import { PartnershipStatus, Prisma } from "@prisma/client";

export class PartnershipRepository {
  static async create(data: Prisma.PartnershipInquiryCreateInput) {
    return prisma.partnershipInquiry.create({ data });
  }

  static async findAllAdmin(options?: {
    status?: PartnershipStatus;
    search?: string;
  }) {
    const where: Prisma.PartnershipInquiryWhereInput = {};
    if (options?.status) where.status = options.status;
    if (options?.search) {
      where.OR = [
        { organizationName: { contains: options.search } },
        { contactName: { contains: options.search } },
        { email: { contains: options.search } },
      ];
    }

    return prisma.partnershipInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateStatus(id: string, status: PartnershipStatus, adminNotes?: string) {
    return prisma.partnershipInquiry.update({
      where: { id },
      data: { status, adminNotes },
    });
  }

  static async delete(id: string) {
    return prisma.partnershipInquiry.delete({ where: { id } });
  }
}
