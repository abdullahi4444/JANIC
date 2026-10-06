import React from "react";
import prisma from "@/lib/db/prisma";
import { MediaManager } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Media & Storage Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload and manage images, project logos, diagrams, and media attachments.
        </p>
      </div>

      <MediaManager initialMedia={media as any} />
    </div>
  );
}
