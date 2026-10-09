import { EventRepository } from "@/repositories/event.repository";
import { slugify } from "@/lib/utils";
import { ContentStatus, Prisma } from "@prisma/client";

export class EventService {
  static async getUpcomingEvents(limit = 4) {
    return EventRepository.findPublished({ upcomingOnly: true, limit });
  }

  static async getPublishedEvents(options?: {
    isFeatured?: boolean;
    upcomingOnly?: boolean;
    pastOnly?: boolean;
    limit?: number;
  }) {
    return EventRepository.findPublished(options);
  }

  static async getEventBySlug(slug: string) {
    return EventRepository.findBySlug(slug);
  }

  static async getAllAdmin(options?: { status?: ContentStatus; search?: string }) {
    return EventRepository.findAllAdmin(options);
  }

  static async createEvent(data: {
    title: string;
    summary: string;
    description: string;
    category: string;
    eventDate: Date;
    endDate?: Date;
    location: string;
    isVirtual?: boolean;
    registrationUrl?: string | null;
    capacity?: number | null;
    status?: ContentStatus;
    isFeatured?: boolean;
    coverImage?: string | null;
    videoUrl?: string | null;
    attendeesCount?: number | null;
    gallery?: any;
    guests?: any;
    agenda?: any;
    keyHighlights?: any;
  }) {
    let slug = slugify(data.title);
    const existing = await EventRepository.findBySlug(slug);
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const createInput: any = {
      title: data.title,
      slug,
      summary: data.summary,
      description: data.description,
      category: data.category,
      eventDate: data.eventDate,
      endDate: data.endDate,
      location: data.location,
      isVirtual: !!data.isVirtual,
      registrationUrl: data.registrationUrl,
      capacity: data.capacity,
      status: data.status || ContentStatus.DRAFT,
      isFeatured: !!data.isFeatured,
      coverImage: data.coverImage,
      videoUrl: data.videoUrl,
      attendeesCount: data.attendeesCount,
      gallery: data.gallery,
      guests: data.guests,
      agenda: data.agenda,
      keyHighlights: data.keyHighlights,
    };

    return EventRepository.create(createInput);
  }

  static async updateEvent(id: string, data: Prisma.EventUpdateInput) {
    return EventRepository.update(id, data);
  }

  static async deleteEvent(id: string) {
    return EventRepository.delete(id);
  }
}
