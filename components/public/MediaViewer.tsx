"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Film,
  Camera,
  Calendar,
  Folder,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export interface GalleryMediaItem {
  id: string;
  url: string;
  alt: string | null;
  fileName: string;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  folder?: string | null;
  createdAt?: string | Date;
}

function isVideo(item: GalleryMediaItem) {
  return !!item.mimeType?.startsWith("video") || /\.(mp4|webm|ogg|mov|m4v)$/i.test(item.url);
}

export function MediaViewer({
  items,
  layoutMode = "cards",
}: {
  items: GalleryMediaItem[];
  layoutMode?: "cards" | "masonry";
}) {
  const [active, setActive] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setActive(null);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const prev = useCallback(
    () => setActive((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length]
  );

  const next = useCallback(
    () => setActive((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length]
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleShare = (item: GalleryMediaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${item.url}` : item.url;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(item.id);
    toast.success("Media link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (item: GalleryMediaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement("a");
    link.href = item.url;
    link.download = item.fileName || "janic-media";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info(`Downloading ${item.fileName}`);
  };

  // Keyboard navigation
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, prev, next]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (active !== null && thumbnailContainerRef.current) {
      const activeBtn = thumbnailContainerRef.current.children[active] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [active]);

  return (
    <>
      {/* GALLERY DISPLAY */}
      {layoutMode === "cards" ? (
        /* TRAINING STYLE CARDS GRID (3 Columns, clean white/slate card with meta details & enroll-style CTA) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => {
            const isVid = isVideo(item);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1"
              >
                <div>
                  {/* Aspect 16:9 Image/Video Container */}
                  <div
                    onClick={() => setActive(i)}
                    className="aspect-[16/9] relative bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
                  >
                    {isVid ? (
                      <div className="w-full h-full bg-slate-950 flex items-center justify-center relative">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          preload="metadata"
                          muted
                          playsInline
                        />
                        <span className="absolute w-12 h-12 rounded-full bg-white text-[#08245C] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-[#08245C]" />
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.alt || item.fileName || "JANIC Media"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {/* Top Left Level/Type Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#08245C] dark:text-sky-400 shadow-sm flex items-center gap-1.5 backdrop-blur-sm border border-slate-100/50 dark:border-slate-800">
                      {isVid ? (
                        <Film className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Camera className="w-3.5 h-3.5 text-[#0875D1]" />
                      )}
                      <span>{isVid ? "Video Clip" : "High-Res Photo"}</span>
                    </div>

                    {/* Top Right Folder Badge */}
                    <div className="absolute top-3 right-3 bg-[#08245C]/90 dark:bg-sky-500/90 text-white dark:text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
                      {item.folder || "General"}
                    </div>
                  </div>

                  {/* Card Body Content */}
                  <div className="p-6">
                    <span className="text-[11px] font-bold text-[#0875D1] uppercase tracking-wider block mb-1">
                      {item.folder ? `${item.folder} showcase` : "Campus Highlights"}
                    </span>
                    <h3
                      onClick={() => setActive(i)}
                      className="text-lg font-bold text-[#08245C] dark:text-white mt-1 mb-2 leading-snug line-clamp-1 group-hover:text-[#0875D1] transition cursor-pointer"
                    >
                      {item.alt || item.fileName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {item.alt
                        ? `${item.alt}. Documented and archived from JANIC innovation workshops and activities.`
                        : `Captured during Jazeera Nexus Innovation Center initiatives and student engineering showcases.`}
                    </p>

                    {/* Meta rows with icons */}
                    <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#0875D1]" />
                        <span>
                          <strong>Captured:</strong> {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Folder className="w-3.5 h-3.5 text-[#0875D1]" />
                        <span>
                          <strong>Collection:</strong> {item.folder || "general"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {isVid ? "Streaming Ready MP4 Highlight" : "Verified High-Resolution Asset"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA Action Area */}
                <div className="p-6 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setActive(i)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#08245C] hover:bg-[#061B40] text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-sm group-hover:bg-[#0875D1]"
                  >
                    <span>View Fullscreen & Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={(e) => handleShare(item, e)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                    title="Share Link"
                    aria-label="Share media link"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleDownload(item, e)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                    title="Download File"
                    aria-label="Download original file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MASONRY VIEW (PINTEREST STYLE COLUMNS) */
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {items.map((item, i) => {
            const isVid = isVideo(item);
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 break-inside-avoid"
              >
                <div onClick={() => setActive(i)} className="cursor-pointer relative overflow-hidden block">
                  {isVid ? (
                    <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-all duration-700 group-hover:scale-105"
                        preload="metadata"
                        muted
                        playsInline
                      />
                      <span className="absolute w-12 h-12 rounded-full bg-white text-[#08245C] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                        <Play className="w-5 h-5 ml-0.5 fill-[#08245C]" />
                      </span>
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
                        <Film className="w-3 h-3 text-sky-400" /> Video
                      </span>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden">
                      <Image
                        src={item.url}
                        alt={item.alt || item.fileName || "JANIC Media"}
                        width={item.width || 800}
                        height={item.height || 600}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-auto object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                        <Camera className="w-3 h-3 text-sky-400" /> Photo
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 text-white">
                    {item.folder && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sky-300 mb-1">
                        {item.folder}
                      </span>
                    )}
                    <h4 className="text-sm font-bold leading-snug line-clamp-2 drop-shadow-sm">
                      {item.alt || item.fileName}
                    </h4>
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActive(i);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={(e) => handleShare(item, e)}
                        className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition"
                        title="Copy share link"
                        aria-label="Copy share link"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDownload(item, e)}
                        className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition"
                        title="Download file"
                        aria-label="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN CINEMA LIGHTBOX */}
      <AnimatePresence>
        {active !== null && items[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6"
            onClick={close}
          >
            {/* Top Navigation Bar */}
            <div
              className="flex items-center justify-between z-20 text-white/90 gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 truncate">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold tracking-wider text-sky-300">
                  {active + 1} / {items.length}
                </span>
                {items[active].folder && (
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-white/70">
                    {items[active].folder}
                  </span>
                )}
                <span className="text-xs sm:text-sm font-semibold truncate max-w-[200px] sm:max-w-md text-white/90">
                  {items[active].alt || items[active].fileName}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleShare(items[active])}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur text-white flex items-center gap-1.5 text-xs font-medium transition"
                  title="Share / Copy Link"
                  aria-label="Share or copy link"
                >
                  {copiedId === items[active].id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="hidden sm:inline text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">Copy Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload(items[active])}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur text-white flex items-center gap-1.5 text-xs font-medium transition"
                  title="Download Asset"
                  aria-label="Download asset"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur text-white transition"
                  title="Toggle Fullscreen (F)"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={close}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 backdrop-blur text-white transition"
                  title="Close (Esc)"
                  aria-label="Close lightbox"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Stage: Prev, Content, Next */}
            <div className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden">
              {items.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Previous item"
                  className="absolute left-1 sm:left-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <motion.div
                key={items[active].id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="max-w-6xl max-h-[75vh] sm:max-h-[78vh] w-full flex items-center justify-center p-2"
                onClick={(e) => e.stopPropagation()}
              >
                {isVideo(items[active]) ? (
                  <video
                    key={items[active].id}
                    src={items[active].url}
                    controls
                    autoPlay
                    className="max-h-[72vh] max-w-full rounded-2xl shadow-2xl bg-black ring-1 ring-white/10"
                  />
                ) : (
                  <Image
                    src={items[active].url}
                    alt={items[active].alt || items[active].fileName || "JANIC Media"}
                    width={items[active].width || 1920}
                    height={items[active].height || 1080}
                    priority
                    className="max-h-[72vh] max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
                  />
                )}
              </motion.div>

              {items.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Next item"
                  className="absolute right-1 sm:right-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Filmstrip Carousel */}
            {items.length > 1 && (
              <div className="z-20 flex justify-center pb-1" onClick={(e) => e.stopPropagation()}>
                <div
                  ref={thumbnailContainerRef}
                  className="flex gap-2 max-w-[85vw] sm:max-w-[70vw] overflow-x-auto p-1.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 scrollbar-none"
                >
                  {items.map((it, i) => {
                    const isVid = isVideo(it);
                    return (
                      <button
                        key={it.id}
                        onClick={() => setActive(i)}
                        aria-label={`View item ${i + 1}`}
                        className={`relative w-14 h-10 sm:w-16 sm:h-11 flex-shrink-0 overflow-hidden rounded-xl ring-2 transition-all duration-200 ${
                          i === active
                            ? "ring-sky-400 scale-105 opacity-100 shadow-lg"
                            : "ring-transparent opacity-50 hover:opacity-85"
                        }`}
                      >
                        {isVid ? (
                          <span className="flex w-full h-full bg-slate-900 items-center justify-center text-white">
                            <Play className="w-3.5 h-3.5" fill="currentColor" />
                          </span>
                        ) : (
                          <Image
                            src={it.url}
                            alt={it.alt || "Thumbnail"}
                            width={112}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
