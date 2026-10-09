"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export interface GalleryItem {
  url: string;
  caption?: string;
  alt?: string;
}

interface EventGalleryProps {
  gallery: GalleryItem[] | string;
  eventTitle: string;
}

export function EventGallery({ gallery, eventTitle }: EventGalleryProps) {
  // Parse gallery if string
  let items: GalleryItem[] = [];
  try {
    if (typeof gallery === "string") {
      items = JSON.parse(gallery);
    } else if (Array.isArray(gallery)) {
      items = gallery;
    }
  } catch {
    items = [];
  }

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleOpen = (idx: number) => {
    setActiveIndex(idx);
  };

  const handleClose = () => {
    setActiveIndex(null);
  };

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev! > 0 ? prev! - 1 : items.length - 1));
  }, [activeIndex, items.length]);

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev! < items.length - 1 ? prev! + 1 : 0));
  }, [activeIndex, items.length]);

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, handlePrev, handleNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#08245C] dark:text-white tracking-tight">
              Event Photo Gallery
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {items.length} captured moments from this JANIC-hosted gathering. Click any photo to view full size.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {items.length} Photos
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleOpen(idx)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Image
              src={item.url}
              alt={item.caption || item.alt || `${eventTitle} photo ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="flex items-center justify-between text-white mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                  Photo {idx + 1} of {items.length}
                </span>
                <Maximize2 className="w-4 h-4 text-white/80" />
              </div>
              {item.caption && (
                <p className="text-xs text-white/95 font-medium line-clamp-2 leading-snug">
                  {item.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 transition-all"
          onClick={handleClose}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between max-w-7xl w-full mx-auto text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-0.5">
              <div className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider">
                {eventTitle}
              </div>
              <div className="text-xs text-slate-400">
                Photo {activeIndex + 1} of {items.length}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Central Image View */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 max-w-7xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Current Image */}
            <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center">
              <Image
                src={items[activeIndex].url}
                alt={items[activeIndex].caption || `Photo ${activeIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar / Caption & Thumbnails */}
          <div
            className="max-w-4xl w-full mx-auto space-y-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {items[activeIndex].caption && (
              <p className="text-center text-xs sm:text-sm text-slate-200 bg-black/40 backdrop-blur-sm py-2 px-4 rounded-xl border border-white/10 mx-auto max-w-2xl">
                {items[activeIndex].caption}
              </p>
            )}

            {/* Thumbnail Strip */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
              {items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                    activeIndex === idx
                      ? "border-blue-500 scale-105"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.url}
                    alt={`Thumb ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
