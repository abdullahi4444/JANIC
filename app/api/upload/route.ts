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
    const folder = (formData.get("folder") as string) || "general";
    const alt = (formData.get("alt") as string) || "";

    // Support both single "file" and multiple "files" or multiple "file" entries
    const allFiles: File[] = [];
    const singleFile = formData.get("file") as File | null;
    const multiFiles = formData.getAll("files") as File[];
    const allFileEntries = formData.getAll("file") as File[];

    if (multiFiles.length > 0) {
      allFiles.push(...multiFiles.filter((f) => f instanceof File));
    } else if (allFileEntries.length > 1) {
      allFiles.push(...allFileEntries.filter((f) => f instanceof File));
    } else if (singleFile && singleFile instanceof File) {
      allFiles.push(singleFile);
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const createdRecords = [];

    for (const file of allFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = file.name.replace(/[^\w.-]/g, "_");
      const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${safeName}`;
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

      createdRecords.push(mediaRecord);
    }

    // Return the primary media (for backward compatibility) and array of all created items
    return NextResponse.json({
      success: true,
      url: createdRecords[0].url,
      media: createdRecords[0],
      items: createdRecords,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error uploading file";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
