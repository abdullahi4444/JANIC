"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Copy,
  Check,
  Loader2,
  Trash2,
  Pencil,
  Play,
  X,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Download,
  Eye,
  Folder,
  HardDrive,
  FileImage,
  Film,
  FileCode,
  ArrowUpDown,
  Plus,
  CheckSquare,
  Square,
  Sparkles,
  Images,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { extractMediaGallery, cleanCaption } from "@/lib/media/post-media";

export interface MediaItem {
  id: string;
  fileName: string;
  url: string;
  alt?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  folder?: string;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: string | Date;
}

interface MediaStats {
  totalFiles: number;
  totalSizeBytes: number;
  imageCount: number;
  videoCount: number;
  foldersCount: number;
}

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function isVideo(m: MediaItem): boolean {
  return !!m.mimeType?.startsWith("video") || /\.(mp4|webm|ogg|mov|m4v)$/i.test(m.url);
}

function getFormatBadge(m: MediaItem): string {
  if (isVideo(m)) return "VIDEO";
  const gallery = extractMediaGallery(m);
  if (gallery.length > 1) return `${gallery.length} PHOTOS`;
  if (m.mimeType) {
    const sub = m.mimeType.split("/")[1];
    if (sub) return sub.toUpperCase();
  }
  const ext = m.url.split(".").pop();
  return ext ? ext.toUpperCase() : "IMG";
}

const PRESET_FOLDERS = ["general", "events", "projects", "showcase", "training", "team", "documents"];

export function MediaManager({
  initialMedia,
  folders: initialFolders = [],
  stats: initialStats,
}: {
  initialMedia: MediaItem[];
  folders?: string[];
  stats?: MediaStats;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [items, setItems] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);

  // Selection & Batch
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchLoading, setBatchLoading] = useState(false);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "image" | "video">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "size">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Upload config
  const [uploadFolder, setUploadFolder] = useState<string>("general");
  const [uploadAlt, setUploadAlt] = useState<string>("");
  const [uploadCaption, setUploadCaption] = useState<string>("" );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [groupPost, setGroupPost] = useState<boolean>(true);

  // Modals
  const [inspectItem, setInspectItem] = useState<MediaItem | null>(null);
  const [inspectPhotoIdx, setInspectPhotoIdx] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  const openInspect = (m: MediaItem) => {
    setInspectItem(m);
    setInspectPhotoIdx(0);
  };

  // Copy indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available folders
  const allFolders = useMemo(() => {
    const set = new Set<string>(["general", ...initialFolders, ...items.map((m) => m.folder || "general")]);
    return Array.from(set).filter(Boolean);
  }, [items, initialFolders]);

  // Derived stats
  const stats = useMemo(() => {
    if (initialStats && items.length === initialMedia.length) return initialStats;
    const totalFiles = items.length;
    const totalSizeBytes = items.reduce((a, m) => a + (m.sizeBytes || 0), 0);
    const imageCount = items.filter((m) => !m.mimeType || m.mimeType.startsWith("image")).length;
    const videoCount = items.filter((m) => isVideo(m)).length;
    const foldersCount = new Set(items.map((m) => m.folder || "general")).size;
    return { totalFiles, totalSizeBytes, imageCount, videoCount, foldersCount };
  }, [items, initialMedia.length, initialStats]);

  // Folder Counts
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of items) {
      const f = m.folder || "general";
      counts[f] = (counts[f] || 0) + 1;
    }
    return counts;
  }, [items]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((m) => {
        // Search filter
        if (search) {
          const query = search.toLowerCase();
          const matchName = m.fileName.toLowerCase().includes(query);
          const matchAlt = (m.alt || "").toLowerCase().includes(query);
          const matchFolder = (m.folder || "").toLowerCase().includes(query);
          if (!matchName && !matchAlt && !matchFolder) return false;
        }

        // Folder filter
        if (selectedFolder !== "all") {
          const itemFolder = m.folder || "general";
          if (itemFolder !== selectedFolder) return false;
        }

        // Type filter
        if (mediaTypeFilter === "image") {
          if (isVideo(m)) return false;
        } else if (mediaTypeFilter === "video") {
          if (!isVideo(m)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "name") {
          return a.fileName.localeCompare(b.fileName);
        }
        if (sortBy === "size") {
          return (b.sizeBytes || 0) - (a.sizeBytes || 0);
        }
        return 0;
      });
  }, [items, search, selectedFolder, mediaTypeFilter, sortBy]);

  // Handlers
  const handleCopy = (url: string, id: string, label = "URL") => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (item: MediaItem) => {
    const link = document.createElement("a");
    link.href = item.url;
    link.download = item.fileName || "download";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info(`Downloading ${item.fileName}`);
  };

  const isVideoFile = (f: File) =>
    f.type.startsWith("video/") || /\.(mp4|webm|ogg|mov|m4v|avi)$/i.test(f.name);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incomingFiles = Array.from(files);

    const incomingVideos = incomingFiles.filter(isVideoFile);
    const incomingImages = incomingFiles.filter((f) => !isVideoFile(f));

    // Rule: Video must be one time each video!
    if (incomingVideos.length > 1) {
      toast.error("Only one video can be uploaded at a time. Please select videos individually.");
      return;
    }

    if (incomingVideos.length === 1 && incomingImages.length > 0) {
      toast.error("Videos cannot be combined with images in the same post. Please upload the video separately.");
      return;
    }

    if (incomingVideos.length === 1) {
      setSelectedFiles([incomingVideos[0]]);
      toast.info("1 video selected for upload.");
      setUploadDrawerOpen(true);
      return;
    }

    // Multiple images (or 1 image) allowed:
    setSelectedFiles((prev) => {
      const existingImages = prev.filter((f) => !isVideoFile(f));
      const total = [...existingImages, ...incomingImages];
      if (total.length > 1) {
        toast.info(`${total.length} images selected. They can be published together on 1 card.`);
      }
      return total;
    });
    setUploadDrawerOpen(true);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExecuteUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please choose at least one file to upload");
      return;
    }

    const videoFiles = selectedFiles.filter(isVideoFile);
    const imageFiles = selectedFiles.filter((f) => !isVideoFile(f));

    if (videoFiles.length > 1) {
      toast.error("Only one video can be uploaded at a time. Please upload each video individually.");
      return;
    }

    if (videoFiles.length === 1 && imageFiles.length > 0) {
      toast.error("Videos cannot be combined with images in the same post. Please upload the video separately.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append("files", f));
    formData.append("folder", uploadFolder);
    if (uploadAlt) formData.append("alt", uploadAlt);
    if (uploadCaption) formData.append("caption", uploadCaption);
    formData.append("groupPost", groupPost ? "true" : "false");
    formData.append("source", "post");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");

      const createdItems: MediaItem[] = data.items || (data.media ? [data.media] : []);
      setItems((prev) => [...createdItems, ...prev]);
      setSelectedFiles([]);
      setUploadAlt("");
      setUploadCaption("");
      setUploadDrawerOpen(false);
      toast.success(
        groupPost && selectedFiles.length > 1
          ? `Successfully published multi-image post with ${selectedFiles.length} photos on 1 card!`
          : `Successfully uploaded ${createdItems.length} media file(s)!`
      );
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error uploading files");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteOne = async (m: MediaItem) => {
    if (!confirm(`Delete "${m.fileName}"? This removes the file permanently.`)) return;
    try {
      const res = await fetch(`/api/media/${m.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");

      setItems((prev) => prev.filter((i) => i.id !== m.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(m.id);
        return next;
      });
      if (inspectItem?.id === m.id) setInspectItem(null);
      toast.success(`Deleted "${m.fileName}"`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error deleting file");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      const original = items.find((i) => i.id === editingItem.id);
      const existingMatch = (original?.caption || "").match(/<!--GALLERY:(.*?)-->/);
      let finalCaption = (editingItem.caption || "").trim();
      if (existingMatch && !finalCaption.includes("<!--GALLERY:")) {
        finalCaption = finalCaption ? `${finalCaption}\n${existingMatch[0]}` : existingMatch[0];
      }

      const res = await fetch(`/api/media/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: editingItem.alt, folder: editingItem.folder, caption: finalCaption }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

      setItems((prev) => prev.map((i) => (i.id === editingItem.id ? { ...i, ...data.item } : i)));
      if (inspectItem?.id === editingItem.id) {
        setInspectItem({ ...inspectItem, ...data.item });
      }
      setEditingItem(null);
      toast.success("Media information updated!");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error updating media");
    }
  };

  // Batch Handlers
  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((m) => m.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected file(s)? This action cannot be undone.`)) {
      return;
    }

    setBatchLoading(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulk-delete",
          ids: Array.from(selectedIds),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Batch delete failed");

      setItems((prev) => prev.filter((m) => !selectedIds.has(m.id)));
      toast.success(`Successfully deleted ${data.deletedCount || selectedIds.size} file(s)`);
      setSelectedIds(new Set());
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Batch delete error");
    } finally {
      setBatchLoading(false);
    }
  };

  const handleBatchMove = async (targetFolder: string) => {
    if (selectedIds.size === 0 || !targetFolder) return;
    setBatchLoading(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulk-move",
          ids: Array.from(selectedIds),
          folder: targetFolder,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Batch move failed");

      setItems((prev) =>
        prev.map((m) => (selectedIds.has(m.id) ? { ...m, folder: targetFolder } : m))
      );
      toast.success(`Moved ${selectedIds.size} file(s) to "${targetFolder}"`);
      setSelectedIds(new Set());
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Batch move error");
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-card rounded-2xl p-4 border border-border/80 shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Assets</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground tracking-tight">{stats.totalFiles}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">stored objects</div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60" />
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border/80 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Photos & Graphics</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileImage className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground tracking-tight">{stats.imageCount}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">visual media</div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60" />
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border/80 shadow-sm relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Videos & Motion</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground tracking-tight">{stats.videoCount}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">clips & highlights</div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 opacity-60" />
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border/80 shadow-sm relative overflow-hidden group hover:border-sky-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Storage Used</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground tracking-tight">{formatBytes(stats.totalSizeBytes)}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">disk footprint</div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 opacity-60" />
        </div>

        <div className="col-span-2 sm:col-span-1 bg-card rounded-2xl p-4 border border-border/80 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Collections</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Folder className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground tracking-tight">{stats.foldersCount}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">active folders</div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 opacity-60" />
        </div>
      </div>

      {/* Upload Zone / Collapsible Section */}
      <div className="bg-card rounded-3xl border border-border/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-500" />
              Upload Assets
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag files directly here or choose from your computer. Supports images, videos, graphics up to 50MB.
            </p>
          </div>
          <button
            onClick={() => setUploadDrawerOpen(!uploadDrawerOpen)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/10 transition"
          >
            {uploadDrawerOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{uploadDrawerOpen ? "Hide Upload Panel" : "Open Upload Panel"}</span>
          </button>
        </div>

        <AnimatePresence>
          {uploadDrawerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="pt-5 space-y-4 overflow-hidden"
            >
              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFilesSelected(e.dataTransfer.files);
                }}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  dragOver
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[0.99]"
                    : "border-border hover:border-blue-400/80 bg-muted/20"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  {uploading ? <Loader2 className="w-7 h-7 animate-spin" /> : <UploadCloud className="w-7 h-7" />}
                </div>
                <p className="text-sm font-bold text-foreground">
                  Drop files to upload, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload 1 image or 2+ images on 1 card. Videos must be uploaded one at a time.
                </p>
              </div>

              {/* Upload Settings & Staged Files */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Target Folder
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={uploadFolder}
                      onChange={(e) => setUploadFolder(e.target.value.toLowerCase().trim())}
                      placeholder="e.g. events, projects, showcase"
                      className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  {/* Preset folder pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {PRESET_FOLDERS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setUploadFolder(f)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                          uploadFolder === f
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-muted/40 text-muted-foreground border-border hover:border-blue-400"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Default Alt Description (Optional)
                  </label>
                  <input
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    placeholder="Brief description of media context"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    Applied to uploaded files for accessibility and SEO.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Caption (Optional)
                  </label>
                  <input
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="Caption shown on the public Posts page"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              {/* Staged file queue */}
              {selectedFiles.length > 0 && (
                <div className="rounded-2xl border border-border bg-muted/30 p-3.5 space-y-3">
                  {/* Mode banner */}
                  {selectedFiles.some((f) => isVideoFile(f)) ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold">
                      <Film className="w-4 h-4 shrink-0" />
                      <span>Single Video Post (1 video)</span>
                    </div>
                  ) : selectedFiles.length > 1 ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300">
                      <div className="flex items-center gap-2">
                        <Images className="w-4 h-4 shrink-0" />
                        <div>
                          <p className="text-xs font-bold">
                            Multi-Image Post ({selectedFiles.length} photos)
                          </p>
                          <p className="text-[11px] opacity-80">
                            Photos will be displayed together on 1 card (with carousel & counter)
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold shrink-0 select-none bg-card/80 px-2.5 py-1.5 rounded-lg border border-border/60">
                        <input
                          type="checkbox"
                          checked={groupPost}
                          onChange={(e) => setGroupPost(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Publish on 1 card</span>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      <FileImage className="w-4 h-4 shrink-0" />
                      <span>Single Image Post (1 photo on 1 card)</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span>Staged Files ({selectedFiles.length})</span>
                    <button
                      onClick={() => setSelectedFiles([])}
                      className="text-red-500 hover:text-red-600 text-[11px] font-medium"
                    >
                      Clear queue
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-card px-3 py-1.5 rounded-lg border border-border text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-medium text-foreground truncate max-w-[220px] sm:max-w-md">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            ({formatBytes(file.size)})
                          </span>
                        </div>
                        <button
                          onClick={() => removeSelectedFile(idx)}
                          className="p-1 text-muted-foreground hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      disabled={uploading}
                      onClick={handleExecuteUpload}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading {selectedFiles.length} item(s)...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Confirm Upload ({selectedFiles.length})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Toolbar: Search, Folders, Types, Sort, View Modes */}
      <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-sm space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by file name, alt text, or folder..."
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-input bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter buttons & Selects */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type Filter */}
            <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border text-xs">
              <button
                onClick={() => setMediaTypeFilter("all")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  mediaTypeFilter === "all"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMediaTypeFilter("image")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  mediaTypeFilter === "image"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setMediaTypeFilter("video")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  mediaTypeFilter === "video"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Videos
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-background border border-input px-3 py-1.5 rounded-xl text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name" | "size")}
                aria-label="Sort media by"
                className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name (A-Z)</option>
                <option value="size">Size (Desc)</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
                title="List view"
                aria-label="List view"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Folder Filter Pill Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-border/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Folders:
          </span>
          <button
            onClick={() => setSelectedFolder("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedFolder === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Folders ({items.length})
          </button>
          {allFolders.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedFolder === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f} ({folderCounts[f] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Selection Sticky / Floating Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="sticky top-20 z-30 bg-card/95 backdrop-blur-md rounded-2xl border border-blue-500/30 p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-foreground">
                {selectedIds.size} file(s) selected
              </span>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Deselect all
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Move to folder */}
              <div className="flex items-center gap-1 bg-muted px-2.5 py-1.5 rounded-xl border border-border">
                <Folder className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  onChange={(e) => {
                    if (e.target.value) handleBatchMove(e.target.value);
                  }}
                  defaultValue=""
                  disabled={batchLoading}
                  aria-label="Move selected items to folder"
                  className="bg-transparent text-xs text-foreground font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Move to folder...
                  </option>
                  {allFolders.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Delete */}
              <button
                onClick={handleBatchDelete}
                disabled={batchLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                {batchLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete Selected</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Select All Row */}
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-2 hover:text-foreground font-medium transition"
        >
          {selectedIds.size === filteredItems.length && filteredItems.length > 0 ? (
            <CheckSquare className="w-4 h-4 text-blue-600" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          <span>
            {selectedIds.size === filteredItems.length && filteredItems.length > 0
              ? "Deselect All"
              : "Select All Displayed"}
          </span>
        </button>
        <span>
          Showing {filteredItems.length} of {items.length} assets
        </span>
      </div>

      {/* MEDIA GRID / LIST VIEW */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center bg-card">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-foreground">No media assets match your criteria</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, selecting &quot;All Folders&quot;, or uploading new assets to this collection.
          </p>
          {(search || selectedFolder !== "all" || mediaTypeFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedFolder("all");
                setMediaTypeFilter("all");
              }}
              className="mt-4 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-semibold transition"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((m) => {
            const isSel = selectedIds.has(m.id);
            const isVid = isVideo(m);
            return (
              <div
                key={m.id}
                className={`group bg-card rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative ${
                  isSel ? "border-blue-500 ring-2 ring-blue-500/20" : "border-border hover:border-blue-400/60"
                }`}
              >
                {/* Media Preview Container */}
                <div className="aspect-[4/3] relative bg-slate-900/5 dark:bg-slate-900/40 overflow-hidden">
                  {isVid ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                      <video
                        src={m.url}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                        preload="metadata"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition">
                        <span className="w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={m.url}
                      alt={m.alt || m.fileName}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Badges on preview */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider">
                      {getFormatBadge(m)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-600/80 backdrop-blur-sm text-white text-[9px] font-semibold">
                      {m.folder || "general"}
                    </span>
                  </div>

                  {/* Selection Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectOne(m.id);
                    }}
                    aria-label={`Select ${m.fileName}`}
                    className={`absolute top-2 right-2 w-6 h-6 rounded-lg flex items-center justify-center transition z-10 ${
                      isSel
                        ? "bg-blue-600 text-white shadow"
                        : "bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-black/60"
                    }`}
                  >
                    {isSel ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Square className="w-3.5 h-3.5" />}
                  </button>

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 dark:bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-[2px]">
                    <button
                      onClick={() => openInspect(m)}
                      className="p-2.5 rounded-xl bg-white/95 hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-800 text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Inspect / Preview"
                      aria-label="Inspect or preview media"
                    >
                      <Eye className="w-4 h-4 stroke-[2.25]" />
                    </button>
                    <button
                      onClick={() => handleCopy(m.url, m.id)}
                      className="p-2.5 rounded-xl bg-white/95 hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-800 text-blue-600 hover:text-blue-700 dark:text-sky-400 dark:hover:text-sky-300 border border-slate-200/80 dark:border-slate-700 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Copy URL"
                      aria-label="Copy media URL"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.25]" />
                      ) : (
                        <Copy className="w-4 h-4 stroke-[2.25]" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingItem({ ...m, caption: cleanCaption(m.caption) })}
                      className="p-2.5 rounded-xl bg-white/95 hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-800 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 border border-slate-200/80 dark:border-slate-700 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Edit metadata"
                      aria-label="Edit metadata"
                    >
                      <Pencil className="w-4 h-4 stroke-[2.25]" />
                    </button>
                    <button
                      onClick={() => handleDeleteOne(m)}
                      className="p-2.5 rounded-xl bg-white/95 hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-800 text-red-600 hover:text-red-700 dark:text-rose-400 dark:hover:text-rose-300 border border-slate-200/80 dark:border-slate-700 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Delete"
                      aria-label="Delete media item"
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.25]" />
                    </button>
                  </div>
                </div>

                {/* Card Meta & Bottom Details */}
                <div className="p-3 space-y-2">
                  <p className="text-xs font-semibold text-foreground truncate" title={m.fileName}>
                    {m.fileName}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{formatDate(m.createdAt)}</span>
                    <span>{formatBytes(m.sizeBytes)}</span>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-1 flex items-center gap-1 border-t border-border/50">
                    <button
                      onClick={() => handleCopy(m.url, m.id)}
                      className="flex-1 py-1 px-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 flex items-center justify-center gap-1 transition text-[11px] font-semibold"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload(m)}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition"
                      title="Download File"
                      aria-label="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST / TABLE VIEW */
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <button
                      onClick={toggleSelectAll}
                      aria-label="Select all items in list"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {selectedIds.size === filteredItems.length && filteredItems.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Folder</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Uploaded</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((m) => {
                  const isSel = selectedIds.has(m.id);
                  const isVid = isVideo(m);
                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-muted/40 transition ${isSel ? "bg-blue-500/5" : ""}`}
                    >
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleSelectOne(m.id)}
                          aria-label={`Select ${m.fileName}`}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {isSel ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => setInspectItem(m)}
                            className="w-12 h-10 relative rounded-lg overflow-hidden bg-slate-900/10 shrink-0 cursor-pointer group"
                          >
                            {isVid ? (
                              <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                                <Play className="w-3.5 h-3.5" fill="currentColor" />
                              </div>
                            ) : (
                              <Image src={m.url} alt={m.fileName} fill className="object-cover" />
                            )}
                          </div>
                          <div className="truncate max-w-[200px] sm:max-w-xs">
                            <p
                              onClick={() => openInspect(m)}
                              className="font-semibold text-foreground truncate cursor-pointer hover:text-blue-600"
                            >
                              {m.fileName}
                            </p>
                            {m.alt && <p className="text-[11px] text-muted-foreground truncate">{m.alt}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[10px]">
                          {m.folder || "general"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-muted-foreground font-medium uppercase text-[10px]">
                          {getFormatBadge(m)}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{formatBytes(m.sizeBytes)}</td>
                      <td className="p-3 text-muted-foreground">{formatDate(m.createdAt)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openInspect(m)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                            title="Inspect"
                            aria-label="Inspect media details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopy(m.url, m.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-500/10 rounded-lg"
                            title="Copy URL"
                            aria-label="Copy media URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingItem({ ...m, caption: cleanCaption(m.caption) })}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                            title="Edit"
                            aria-label="Edit media"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOne(m)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                            title="Delete"
                            aria-label="Delete media"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECT / FULL PREVIEW MODAL */}
      <AnimatePresence>
        {inspectItem && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setInspectItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full max-w-4xl max-h-[90vh] rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Top Bar */}
              <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                    <FileImage className="w-4 h-4" />
                  </span>
                  <div className="truncate">
                    <h3 className="text-sm font-bold text-foreground truncate max-w-md">
                      {inspectItem.fileName}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Asset Details & Snippets</p>
                  </div>
                </div>
                <button
                  onClick={() => setInspectItem(null)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Left Preview, Right Specs */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                {/* Preview Window */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center bg-muted/30 rounded-2xl p-4 border border-border/80 min-h-[280px] relative">
                  {isVideo(inspectItem) ? (
                    <video
                      src={inspectItem.url}
                      controls
                      autoPlay
                      className="max-h-[50vh] w-full rounded-xl shadow-lg bg-black"
                    />
                  ) : (() => {
                    const gallery = extractMediaGallery(inspectItem);
                    const currentImg = gallery[inspectPhotoIdx] || inspectItem.url;
                    return (
                      <div className="relative w-full h-[45vh] max-h-[420px] flex items-center justify-center">
                        <Image
                          key={currentImg}
                          src={currentImg}
                          alt={inspectItem.alt || inspectItem.fileName}
                          fill
                          className="object-contain rounded-xl"
                        />
                        {gallery.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectPhotoIdx((s) => (s - 1 + gallery.length) % gallery.length);
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition z-10 shadow"
                              aria-label="Previous photo"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectPhotoIdx((s) => (s + 1) % gallery.length);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition z-10 shadow"
                              aria-label="Next photo"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold z-10">
                              <Images className="w-3 h-3 text-sky-400" />
                              <span>
                                Photo {inspectPhotoIdx + 1} of {gallery.length}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Metadata & Embed Snippets */}
                <div className="lg:col-span-5 space-y-4">
                  {/* File Metadata */}
                  <div className="bg-muted/20 rounded-2xl p-4 border border-border/60 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Folder</span>
                        <span className="font-semibold text-foreground">{inspectItem.folder || "general"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">File Size</span>
                        <span className="font-semibold text-foreground">{formatBytes(inspectItem.sizeBytes)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Format</span>
                        <span className="font-semibold text-foreground uppercase">{getFormatBadge(inspectItem)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Uploaded</span>
                        <span className="font-semibold text-foreground">{formatDate(inspectItem.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Copy Snippets */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Embed Codes
                    </h4>

                    {/* Direct URL */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-muted-foreground">Direct URL</label>
                      <div className="flex gap-1.5">
                        <input
                          readOnly
                          value={inspectItem.url}
                          className="flex-1 rounded-xl border border-input bg-muted/40 px-3 py-1.5 text-xs text-foreground select-all"
                        />
                        <button
                          onClick={() => handleCopy(inspectItem.url, "modal-url", "Direct URL")}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Markdown snippet */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-muted-foreground">Markdown Snippet</label>
                      <div className="flex gap-1.5">
                        <input
                          readOnly
                          value={`![${inspectItem.alt || inspectItem.fileName}](${inspectItem.url})`}
                          className="flex-1 rounded-xl border border-input bg-muted/40 px-3 py-1.5 text-xs text-foreground select-all"
                        />
                        <button
                          onClick={() =>
                            handleCopy(
                              `![${inspectItem.alt || inspectItem.fileName}](${inspectItem.url})`,
                              "modal-md",
                              "Markdown code"
                            )
                          }
                          className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-xl text-xs font-semibold"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* HTML Image Tag */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-muted-foreground">HTML Snippet</label>
                      <div className="flex gap-1.5">
                        <input
                          readOnly
                          value={`<img src="${inspectItem.url}" alt="${inspectItem.alt || inspectItem.fileName}" />`}
                          className="flex-1 rounded-xl border border-input bg-muted/40 px-3 py-1.5 text-xs text-foreground select-all"
                        />
                        <button
                          onClick={() =>
                            handleCopy(
                              `<img src="${inspectItem.url}" alt="${inspectItem.alt || inspectItem.fileName}" />`,
                              "modal-html",
                              "HTML code"
                            )
                          }
                          className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-xl text-xs font-semibold"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Download & Edit */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleDownload(inspectItem)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download File</span>
                    </button>
                    <button
                      onClick={() => {
                        const it = inspectItem;
                        setInspectItem(null);
                        setEditingItem({ ...it, caption: cleanCaption(it.caption) });
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Edit Info</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT METADATA MODAL */}
      <AnimatePresence>
        {editingItem && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-3xl p-6 w-full max-w-md space-y-4 border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-blue-500" />
                  Edit Media Info
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    value={editingItem.alt || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, alt: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Describe image content"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Caption
                  </label>
                  <input
                    value={editingItem.caption || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Caption shown publicly"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Folder / Category
                  </label>
                  <input
                    value={editingItem.folder || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, folder: e.target.value.toLowerCase().trim() })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="e.g. events, projects"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {PRESET_FOLDERS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, folder: f })}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground hover:text-foreground border border-border"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold py-2.5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 rounded-xl bg-blue-600 text-white text-xs font-bold py-2.5 hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
