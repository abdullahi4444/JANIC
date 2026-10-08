"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Images,
  ChevronDown,
  ChevronUp,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

export interface GalleryItem {
  id?: string;
  imageUrl: string;
  caption?: string | null;
  alt?: string | null;
  order?: number;
}

interface ProjectSidebarGalleryProps {
  gallery: GalleryItem[];
  projectTitle: string;
}

export function ProjectSidebarGallery({
  gallery,
  projectTitle,
}: ProjectSidebarGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  const initialLimit = 6;
  const visibleItems = isExpanded ? gallery : gallery.slice(0, initialLimit);
  const hasMore = gallery.length > initialLimit;
  const remainingCount = gallery.length - initialLimit;

  const handlePrev = () => {
    if (activeModalIndex === null) return;
    setActiveModalIndex((prev) =>
      prev! > 0 ? prev! - 1 : gallery.length - 1
    );
  };

  const handleNext = () => {
    if (activeModalIndex === null) return;
    setActiveModalIndex((prev) =>
      prev! < gallery.length - 1 ? prev! + 1 : 0
    );
  };

  return (
    <>
      {/* Sidebar Gallery Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0875D1] flex items-center justify-center">
              <Images className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#08245C] dark:text-white">
                Project Gallery
              </h3>
              <p className="text-[10px] text-slate-400">
                Prototypes &amp; Screenshots
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {gallery.length} {gallery.length === 1 ? "photo" : "photos"}
          </span>
        </div>

        {/* Thumbnail Grid (2 or 3 cols) */}
        <div className="grid grid-cols-3 gap-2.5">
          {visibleItems.map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => setActiveModalIndex(idx)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 hover:ring-2 hover:ring-[#0875D1] transition-all hover:scale-[1.03] cursor-pointer"
            >
              <Image
                src={item.imageUrl}
                alt={item.alt || `${projectTitle} gallery item ${idx + 1}`}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>

        {/* Load More / Load Less Button */}
        {hasMore && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 hover:from-blue-100 hover:to-indigo-100 dark:hover:bg-slate-700/80 text-[#0875D1] dark:text-sky-400 font-bold text-xs flex items-center justify-center gap-2 border border-blue-200/60 dark:border-slate-700 transition-all shadow-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Load Less (Show 6)</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                  <span>Load More (+{remainingCount} more)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveModalIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Modal Content */}
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={gallery[activeModalIndex].imageUrl}
                alt={gallery[activeModalIndex].alt || projectTitle}
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Caption & Counter */}
            <div className="mt-4 text-center text-white/90 space-y-1">
              <p className="text-xs uppercase font-bold tracking-wider text-white/60">
                Photo {activeModalIndex + 1} of {gallery.length}
              </p>
              {gallery[activeModalIndex].caption && (
                <p className="text-sm font-medium">
                  {gallery[activeModalIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
