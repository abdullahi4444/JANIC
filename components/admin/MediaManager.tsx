"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UploadCloud, Copy, Check, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface MediaItem {
  id: string;
  fileName: string;
  url: string;
  alt?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  createdAt: string | Date;
}

export function MediaManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");

      setItems([data.media, ...items]);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error uploading file");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-border text-center hover:border-blue-400 transition">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Upload Project & Center Media</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              PNG, JPG, SVG, WebP up to 10MB. Stored locally with public serving URLs.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer">
            <span>Select File to Upload</span>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground text-xs">
            No media uploaded yet. Use the upload zone above to add images.
          </div>
        ) : (
          items.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-border overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                <Image src={m.url} alt={m.alt || m.fileName} fill className="object-cover" />
              </div>

              <div className="p-3.5 space-y-2">
                <p className="text-xs font-semibold text-slate-800 truncate" title={m.fileName}>
                  {m.fileName}
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{formatDate(m.createdAt)}</span>
                  <button
                    onClick={() => handleCopy(m.url, m.id)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1 transition"
                  >
                    {copiedId === m.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
