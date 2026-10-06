import { SubmissionRepository } from "@/repositories/submission.repository";
import { SubmissionStatus } from "@prisma/client";

export class SubmissionService {
  static async submitInnovation(data: {
    title: string;
    category: string;
    problemStatement: string;
    solutionDescription: string;
    technologyStack?: string;
    submitterName: string;
    submitterEmail: string;
    submitterPhone: string;
    facultyOrDepartment?: string;
    studentId?: string;
    teamMembers?: string;
    prototypeUrl?: string;
    videoUrl?: string;
    attachmentUrl?: string;
  }) {
    return SubmissionRepository.create({
      title: data.title,
      category: data.category,
      problemStatement: data.problemStatement,
      solutionDescription: data.solutionDescription,
      technologyStack: data.technologyStack,
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail,
      submitterPhone: data.submitterPhone,
      facultyOrDepartment: data.facultyOrDepartment || "Faculty of Computer Science & IT",
      studentId: data.studentId,
      teamMembers: data.teamMembers,
      prototypeUrl: data.prototypeUrl,
      videoUrl: data.videoUrl,
      attachmentUrl: data.attachmentUrl,
      status: SubmissionStatus.PENDING,
    });
  }

  static async getAllAdmin(options?: { status?: SubmissionStatus; search?: string }) {
    return SubmissionRepository.findAllAdmin(options);
  }

  static async updateStatus(id: string, status: SubmissionStatus, reviewNotes?: string) {
    return SubmissionRepository.updateStatus(id, status, reviewNotes);
  }

  static async deleteSubmission(id: string) {
    return SubmissionRepository.delete(id);
  }
}
