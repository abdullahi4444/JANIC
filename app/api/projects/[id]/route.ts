/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ProjectService } from "@/services/projects/project.service";
import { requireAuth } from "@/lib/permissions/roles";
import { Role, ContentStatus } from "@prisma/client";

const projectUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  summary: z.string().min(10).optional(),
  problem: z.string().min(10).optional(),
  solution: z.string().min(10).optional(),
  technology: z.string().min(2).optional(),
  innovation: z.string().optional().nullable(),
  outcomes: z.string().optional().nullable(),
  status: z.nativeEnum(ContentStatus).optional(),
  isFeatured: z.boolean().optional(),
  heroImage: z.string().optional().nullable(),
  demoUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  teamMembers: z.string().optional().nullable(),
  order: z.number().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth([Role.ADMIN, Role.EDITOR]);
    const { id } = await params;
    const body = await req.json();

    const parsed = projectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updated = await ProjectService.updateProject(id, parsed.data as any);

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      project: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating project";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth([Role.ADMIN]);
    const { id } = await params;

    await ProjectService.deleteProject(id);

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting project";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
