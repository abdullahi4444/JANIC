/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React from "react";
import { KpiRow } from "@/components/admin/KpiRow";
import prisma from "@/lib/db/prisma";
import { MediaManager } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Media & Storage Library
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Upload and manage images, project logos, diagrams, and media attachments.
        </p>
      </div>

      <KpiRow items={[
      { title: "Files", value: media.length, sub: "total uploads" },
      { title: "Images", value: media.filter((m) => m.mimeType?.startsWith("image")).length, sub: "media assets" },
      { title: "Folders", value: new Set(media.map((m) => m.folder)).size, sub: "collections" },
      { title: "Size", value: Math.round(media.reduce((a, m) => a + (m.sizeBytes || 0), 0) / 1024), sub: "KB total" },
    ]} />

      <MediaManager initialMedia={media as any} />
    </div>
  );
}
