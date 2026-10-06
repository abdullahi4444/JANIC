import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TrainingService } from "@/services/training/training.service";
import { requireAuth } from "@/lib/permissions/roles";
import { Role, ContentStatus } from "@prisma/client";

const trainingSchema = z.object({
  title: z.string().min(2, "Title is required"),
  category: z.string().min(2, "Category is required"),
  summary: z.string().min(10, "Summary is required"),
  description: z.string().min(10, "Description is required"),
  level: z.string().default("All Levels"),
  duration: z.string().min(2, "Duration is required"),
  schedule: z.string().min(2, "Schedule is required"),
  mode: z.string().default("On-Campus"),
  certification: z.string().optional().nullable(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  isFeatured: z.boolean().default(false),
  coverImage: z.string().optional().nullable(),
  maxSeats: z.number().optional().nullable(),
  syllabus: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const items = await TrainingService.getAllAdmin();
    return NextResponse.json({ success: true, items });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth([Role.ADMIN, Role.EDITOR]);
    const body = await req.json();
    const parsed = trainingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const item = await TrainingService.createProgram(parsed.data as any);
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
