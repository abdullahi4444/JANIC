import { ResearchRepository } from "@/repositories/research.repository";
import { slugify } from "@/lib/utils";
import { ContentStatus, Prisma } from "@prisma/client";

export class ResearchService {
  static async getFeaturedPapers(limit = 3) {
    return ResearchRepository.findPublished({ isFeatured: true, limit });
  }

  static async getPublishedPapers(options?: { category?: string; limit?: number }) {
    return ResearchRepository.findPublished(options);
  }

  static async getPaperBySlug(slug: string) {
    return ResearchRepository.findBySlug(slug);
  }

  static async getAllAdmin(options?: { status?: ContentStatus; search?: string }) {
    return ResearchRepository.findAllAdmin(options);
  }

  static async createPaper(data: {
    title: string;
    abstract: string;
    content?: string;
    authors: string;
    category: string;
    publicationDate?: Date;
    journalOrConference?: string;
    doi?: string;
    pdfUrl?: string;
    status?: ContentStatus;
    isFeatured?: boolean;
  }) {
    let slug = slugify(data.title);
    const existing = await ResearchRepository.findBySlug(slug);
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const createInput: Prisma.ResearchPaperCreateInput = {
      title: data.title,
      slug,
      abstract: data.abstract,
      content: data.content,
      authors: data.authors,
      category: data.category,
      publicationDate: data.publicationDate || new Date(),
      journalOrConference: data.journalOrConference,
      doi: data.doi,
      pdfUrl: data.pdfUrl,
      status: data.status || ContentStatus.DRAFT,
      isFeatured: !!data.isFeatured,
    };

    return ResearchRepository.create(createInput);
  }

  static async updatePaper(id: string, data: Prisma.ResearchPaperUpdateInput) {
    return ResearchRepository.update(id, data);
  }

  static async deletePaper(id: string) {
    return ResearchRepository.delete(id);
  }
}
