import { PartnershipRepository } from "@/repositories/partnership.repository";
import { PartnershipStatus } from "@prisma/client";

export class PartnershipService {
  static async submitInquiry(data: {
    organizationName: string;
    organizationType: string;
    contactName: string;
    email: string;
    phone?: string;
    collaborationArea: string;
    proposalDetails: string;
  }) {
    return PartnershipRepository.create({
      organizationName: data.organizationName,
      organizationType: data.organizationType,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      collaborationArea: data.collaborationArea,
      proposalDetails: data.proposalDetails,
      status: PartnershipStatus.NEW,
    });
  }

  static async getAllAdmin(options?: { status?: PartnershipStatus; search?: string }) {
    return PartnershipRepository.findAllAdmin(options);
  }

  static async updateStatus(id: string, status: PartnershipStatus, adminNotes?: string) {
    return PartnershipRepository.updateStatus(id, status, adminNotes);
  }

  static async deleteInquiry(id: string) {
    return PartnershipRepository.delete(id);
  }
}
