import { MessageRepository } from "@/repositories/message.repository";
import { MessageStatus } from "@prisma/client";

export class MessageService {
  static async submitMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    return MessageRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      status: MessageStatus.UNREAD,
    });
  }

  static async getAllAdmin(options?: { status?: MessageStatus; search?: string }) {
    return MessageRepository.findAllAdmin(options);
  }

  static async updateStatus(id: string, status: MessageStatus, adminNotes?: string) {
    return MessageRepository.updateStatus(id, status, adminNotes);
  }

  static async deleteMessage(id: string) {
    return MessageRepository.delete(id);
  }
}
