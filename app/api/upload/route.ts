import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/jwt";
import { hasPermission } from "@/lib/permissions/roles";
import { Role } from "@prisma/client";
import fs from "fs";
import path from "path";
import { formatPostCaption } from "@/lib/media/post-media";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await req.formData();
    const folder = (formData.get("folder") as string) || "general";
    const alt = (formData.get("alt") as string) || "";
    const caption = (formData.get("caption") as string) || "";
    const groupPost = formData.get("groupPost") === "true";
    const source = (formData.get("source") as string) || "post";

    // 3. Permission check: Avatar uploads allowed for any authenticated user.
    // For other folders, require media:create or media:update unless admin.
    if (folder !== "avatars" && user.role !== Role.ADMIN) {
      const canCreate = await hasPermission(user.role, "media:create");
      const canUpdate = await hasPermission(user.role, "media:update");
      if (!canCreate && !canUpdate) {
        return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });
      }
    }

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

    // Video vs Image validation rule:
    // User can post 1 image, or 2+ images on one card, but video MUST be 1 at a time!
    const isVideoFile = (f: File) =>
      f.type.startsWith("video/") || /\.(mp4|webm|ogg|mov|m4v|avi)$/i.test(f.name);
    const videoFiles = allFiles.filter(isVideoFile);
    const imageFiles = allFiles.filter((f) => !isVideoFile(f));

    if (videoFiles.length > 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Only one video can be uploaded at a time. Please upload each video individually.",
        },
        { status: 400 }
      );
    }

    if (videoFiles.length === 1 && imageFiles.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Videos cannot be combined with images in the same post. Please upload the video separately.",
        },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // MULTI-IMAGE POST: If 2 or more images and grouped into one card
    if (groupPost && imageFiles.length > 1) {
      const uploadedUrls: string[] = [];

      for (const file of imageFiles) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const safeName = file.name.replace(/[^\w.-]/g, "_");
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${safeName}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        await fs.promises.writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${uniqueFileName}`);
      }

      const primaryFile = imageFiles[0];
      const formattedCaption = formatPostCaption(caption, uploadedUrls);

      const mediaRecord = await prisma.media.create({
        data: {
          fileName: `${primaryFile.name} (+${imageFiles.length - 1} photos)`,
          url: uploadedUrls[0],
          alt: alt || formattedCaption || primaryFile.name,
          mimeType: primaryFile.type,
          sizeBytes: imageFiles.reduce((acc, f) => acc + f.size, 0),
          folder,
          source,
        },
      });

      return NextResponse.json({
        success: true,
        url: mediaRecord.url,
        media: mediaRecord,
        items: [mediaRecord],
      });
    }

    // Standard individual upload loop (for single image, single video, or ungrouped files)
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
          alt: alt || caption || file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          folder,
          source,
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
