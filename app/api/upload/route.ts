import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/permissions/roles";
import { Role } from "@prisma/client";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    await requireAuth([Role.ADMIN, Role.EDITOR]);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";
    const alt = (formData.get("alt") as string) || "";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeName = file.name.replace(/[^\w.-]/g, "_");
    const uniqueFileName = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    const mediaRecord = await prisma.media.create({
      data: {
        fileName: file.name,
        url: publicUrl,
        alt: alt || file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        folder,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      media: mediaRecord,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error uploading file";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
