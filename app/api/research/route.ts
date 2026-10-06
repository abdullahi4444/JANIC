import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ResearchService } from "@/services/research/research.service";
import { requireAuth } from "@/lib/permissions/roles";
import { Role, ContentStatus } from "@prisma/client";

const researchSchema = z.object({
  title: z.string().min(2, "Title is required"),
  category: z.string().min(2, "Category is required"),
  abstract: z.string().min(10, "Abstract is required"),
  content: z.string().optional().nullable(),
  authors: z.string().min(2, "Authors are required"),
  journalOrConference: z.string().optional().nullable(),
  doi: z.string().optional().nullable(),
  pdfUrl: z.string().optional().nullable(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  isFeatured: z.boolean().default(false),
});

export async function GET() {
  try {
    const items = await ResearchService.getAllAdmin();
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
    const parsed = researchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const item = await ResearchService.createPaper(parsed.data as any);
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
