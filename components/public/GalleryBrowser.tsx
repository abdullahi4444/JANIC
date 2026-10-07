"use client";

import React, { useMemo, useState } from "react";
import { MediaViewer, GalleryMediaItem } from "@/components/public/MediaViewer";
import {
  Grid,
  Columns,
  Search,
  X,
  Sparkles,
  Camera,
  Film,
  FolderOpen,
  Filter,
} from "lucide-react";

export function GalleryBrowser({ items }: { items: GalleryMediaItem[] }) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [layoutMode, setLayoutMode] = useState<"cards" | "masonry">("cards");

  // Extract distinct folders
  const availableFolders = useMemo(() => {
    const set = new Set<string>();
    items.forEach((m) => {
      if (m.folder && m.folder.trim().length > 0 && m.folder.toLowerCase() !== "general") {
        set.add(m.folder);
      }
    });
    return Array.from(set);
  }, [items]);

  // Filter items
  const filtered = useMemo(() => {
    return items.filter((m) => {
      // Tab filter
      if (activeTab === "Photos") {
        const isVid = !!m.mimeType?.startsWith("video") || /\.(mp4|webm|ogg|mov|m4v)$/i.test(m.url);
        if (isVid) return false;
      } else if (activeTab === "Videos") {
        const isVid = !!m.mimeType?.startsWith("video") || /\.(mp4|webm|ogg|mov|m4v)$/i.test(m.url);
        if (!isVid) return false;
      } else if (activeTab !== "All") {
        // Tab is a folder name
        if ((m.folder || "").toLowerCase() !== activeTab.toLowerCase()) return false;
      }

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = (m.alt || "").toLowerCase().includes(query);
        const matchName = m.fileName.toLowerCase().includes(query);
        const matchFolder = (m.folder || "").toLowerCase().includes(query);
        if (!matchTitle && !matchName && !matchFolder) return false;
      }

      return true;
    });
  }, [items, activeTab, search]);

  const photosCount = useMemo(() => {
    return items.filter((m) => !m.mimeType || m.mimeType.startsWith("image")).length;
  }, [items]);

  const videosCount = useMemo(() => {
    return items.filter((m) => !!m.mimeType?.startsWith("video") || /\.(mp4|webm|ogg|mov|m4v)$/i.test(m.url)).length;
  }, [items]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("All")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === "All"
                ? "bg-[#08245C] text-white shadow-md shadow-blue-900/10 dark:bg-sky-500 dark:text-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-[#0875D1]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("Photos")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === "Photos"
                ? "bg-[#08245C] text-white shadow-md shadow-blue-900/10 dark:bg-sky-500 dark:text-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-[#0875D1]"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photos ({photosCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("Videos")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === "Videos"
                ? "bg-[#08245C] text-white shadow-md shadow-blue-900/10 dark:bg-sky-500 dark:text-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-[#0875D1]"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Videos ({videosCount})</span>
          </button>

          {availableFolders.map((folder) => (
            <button
              key={folder}
              onClick={() => setActiveTab(folder)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap capitalize transition flex items-center gap-1.5 ${
                activeTab === folder
                  ? "bg-[#08245C] text-white shadow-md shadow-blue-900/10 dark:bg-sky-500 dark:text-slate-950"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-[#0875D1]"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{folder}</span>
            </button>
          ))}
        </div>

        {/* Right side: Search & View switcher */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search showcases..."
              className="w-full pl-8 pr-7 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setLayoutMode("cards")}
              className={`p-1.5 rounded-lg transition ${
                layoutMode === "cards"
                  ? "bg-white dark:bg-slate-700 text-[#08245C] dark:text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              title="Catalog Cards Grid (like Training Page)"
              aria-label="Cards grid layout"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode("masonry")}
              className={`p-1.5 rounded-lg transition ${
                layoutMode === "masonry"
                  ? "bg-white dark:bg-slate-700 text-[#08245C] dark:text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              title="Masonry Columns Layout"
              aria-label="Masonry layout"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span className="flex items-center gap-1.5">
          <Filter className="w-3 h-3 text-[#0875D1]" />
          <span>
            Displaying <strong className="text-slate-800 dark:text-slate-200">{filtered.length}</strong> {filtered.length === 1 ? "asset" : "assets"}
            {activeTab !== "All" && ` in "${activeTab}"`}
            {search && ` matching "${search}"`}
          </span>
        </span>
        <span className="text-[11px] hidden sm:inline">Click any card for full-screen inspection & video stream</span>
      </div>

      {/* Main Catalog Display */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-slate-800 text-[#0875D1] flex items-center justify-center mx-auto mb-3">
            <Camera className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">No media found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            We couldn&apos;t find any media matching your current criteria. Try resetting your search or selecting another category.
          </p>
          {(activeTab !== "All" || search) && (
            <button
              onClick={() => {
                setActiveTab("All");
                setSearch("");
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#08245C] hover:bg-[#061B40] text-white text-xs font-semibold shadow-md transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <MediaViewer items={filtered} layoutMode={layoutMode} />
      )}
    </div>
  );
}
