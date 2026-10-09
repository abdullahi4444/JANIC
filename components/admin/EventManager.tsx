"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  ExternalLink,
  Video,
  Image as ImageIcon,
  Users2,
  Calendar,
  Sparkles,
  Layers,
  FileText,
  UploadCloud,
  Upload,
  Clock,
  History,
  Check,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { FileUploadChoice } from "./FileUploadChoice";

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  eventDate: string | Date;
  location: string;
  capacity?: number | null;
  attendeesCount?: number | null;
  registrationUrl?: string | null;
  coverImage?: string | null;
  videoUrl?: string | null;
  gallery?: any;
  guests?: any;
  agenda?: any;
  keyHighlights?: any;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

interface GalleryPhoto {
  url: string;
  caption?: string;
  alt?: string;
}

interface GuestItem {
  name: string;
  role: string;
  organization?: string;
  avatar?: string;
}

interface AgendaSession {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

export function EventManager({ initialEvents }: { initialEvents: EventItem[] }) {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "media" | "gallery" | "guests" | "agenda">("general");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Innovation Showcase",
    summary: "",
    description: "",
    eventDate: "2026-11-20T09:00",
    location: "Jazeera University Main Auditorium, Mogadishu",
    capacity: 250,
    attendeesCount: 0,
    registrationUrl: "",
    coverImage: "",
    videoUrl: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    isFeatured: false,
  });

  const [galleryList, setGalleryList] = useState<GalleryPhoto[]>([]);
  const [guestsList, setGuestsList] = useState<GuestItem[]>([]);
  const [agendaList, setAgendaList] = useState<AgendaSession[]>([]);

  // Gallery multi-upload from device state
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUploadProgress, setGalleryUploadProgress] = useState("");
  const [galleryDragActive, setGalleryDragActive] = useState(false);
  const galleryFileInputRef = React.useRef<HTMLInputElement>(null);

  // Table pagination state
  const [tablePage, setTablePage] = useState(1);
  const TABLE_PAGE_SIZE = 10;

  // Admin filter states
  const [filterYear, setFilterYear] = useState<string>("ALL");
  const [filterTiming, setFilterTiming] = useState<"ALL" | "PAST" | "UPCOMING">("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Category & timing state for create/edit
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const availableFormCategories = React.useMemo(() => {
    const defaults = [
      "Student Hackathons",
      "Workshops & Training",
      "Tech Summits",
      "Innovation Showcase",
      "Robotics & IoT",
      "Competitions & CTFs",
      "Bootcamps & Labs",
      "FinTech & Digital Economy",
      "Cybersecurity Challenges",
      "AI & Machine Learning",
      "Women in Tech",
    ];
    const fromEvents = events.map((ev) => ev.category).filter(Boolean);
    const set = new Set([...defaults, ...fromEvents]);
    return Array.from(set);
  }, [events]);

  const isFormEventPast = React.useMemo(() => {
    if (!formData.eventDate) return false;
    return new Date(formData.eventDate) < new Date();
  }, [formData.eventDate]);

  const handleSelectTiming = (timing: "PAST" | "UPCOMING") => {
    const rightNow = new Date();
    if (timing === "PAST") {
      const past = new Date();
      past.setMonth(past.getMonth() - 1);
      past.setHours(9, 0, 0, 0);
      setFormData((prev) => ({
        ...prev,
        eventDate: past.toISOString().slice(0, 16),
      }));
    } else {
      const future = new Date();
      future.setMonth(future.getMonth() + 1);
      future.setHours(9, 0, 0, 0);
      setFormData((prev) => ({
        ...prev,
        eventDate: future.toISOString().slice(0, 16),
      }));
    }
  };

  React.useEffect(() => {
    setTablePage(1);
  }, [search, filterYear, filterTiming, filterCategory, filterStatus]);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setIsCustomCategory(false);
    const defaultUpcoming = new Date();
    defaultUpcoming.setDate(defaultUpcoming.getDate() + 14);
    defaultUpcoming.setHours(9, 0, 0, 0);

    setFormData({
      title: "",
      category: "Student Hackathons",
      summary: "",
      description: "",
      eventDate: defaultUpcoming.toISOString().slice(0, 16),
      location: "Jazeera University Main Auditorium, Mogadishu",
      capacity: 250,
      attendeesCount: 0,
      registrationUrl: "",
      coverImage: "",
      videoUrl: "",
      status: "DRAFT",
      isFeatured: false,
    });
    setGalleryList([]);
    setGuestsList([]);
    setAgendaList([]);
    setActiveTab("general");
    setModalOpen(true);
  };

  const handleOpenEdit = (e: EventItem) => {
    setEditingEvent(e);
    const isKnown = availableFormCategories.includes(e.category);
    setIsCustomCategory(!isKnown);

    // Parse gallery
    let parsedGallery: GalleryPhoto[] = [];
    try {
      if (typeof e.gallery === "string") parsedGallery = JSON.parse(e.gallery);
      else if (Array.isArray(e.gallery)) parsedGallery = e.gallery;
    } catch {}

    // Parse guests
    let parsedGuests: GuestItem[] = [];
    try {
      if (typeof e.guests === "string") parsedGuests = JSON.parse(e.guests);
      else if (Array.isArray(e.guests)) parsedGuests = e.guests;
    } catch {}

    // Parse agenda
    let parsedAgenda: AgendaSession[] = [];
    try {
      if (typeof e.agenda === "string") parsedAgenda = JSON.parse(e.agenda);
      else if (Array.isArray(e.agenda)) parsedAgenda = e.agenda;
    } catch {}

    setFormData({
      title: e.title,
      category: e.category,
      summary: e.summary,
      description: e.description,
      eventDate: new Date(e.eventDate).toISOString().slice(0, 16),
      location: e.location,
      capacity: e.capacity || 100,
      attendeesCount: e.attendeesCount || 0,
      registrationUrl: e.registrationUrl || "",
      coverImage: e.coverImage || "",
      videoUrl: e.videoUrl || "",
      status: e.status,
      isFeatured: false,
    });

    setGalleryList(parsedGallery);
    setGuestsList(parsedGuests);
    setAgendaList(parsedAgenda);
    setActiveTab("general");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const payload = {
        ...formData,
        capacity: Number(formData.capacity) || null,
        attendeesCount: Number(formData.attendeesCount) || null,
        gallery: galleryList.filter((g) => g.url.trim() !== ""),
        guests: guestsList.filter((g) => g.name.trim() !== ""),
        agenda: agendaList.filter((a) => a.title.trim() !== ""),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      setModalOpen(false);
      router.refresh();

      if (editingEvent) {
        setEvents((prev) =>
          prev.map((item) => (item.id === editingEvent.id ? ({ ...item, ...payload } as any) : item))
        );
      } else {
        setEvents((prev) => [data.item, ...prev]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      }
    } catch {
      alert("Error deleting event");
    }
  };

  // Multiple Gallery Upload from Device
  const handleMultipleGalleryUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(f.name)
    );
    if (fileArray.length === 0) {
      alert("Please select valid image files (JPG, PNG, WebP, etc.)");
      return;
    }

    setUploadingGallery(true);
    setGalleryUploadProgress(`Preparing ${fileArray.length} photos...`);

    try {
      const newPhotos: GalleryPhoto[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setGalleryUploadProgress(`Uploading ${i + 1} of ${fileArray.length}: ${file.name}`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "events");
        formData.append("source", "event-gallery");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }

        const uploadedUrl = data.url || data.media?.url;
        if (uploadedUrl) {
          const cleanName = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ")
            .trim();
          const formattedCaption = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          newPhotos.push({
            url: uploadedUrl,
            caption: formattedCaption,
            alt: file.name,
          });
        }
      }

      setGalleryList((prev) => [...prev, ...newPhotos]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error uploading photos");
    } finally {
      setUploadingGallery(false);
      setGalleryUploadProgress("");
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = "";
      }
    }
  };

  const handleGalleryDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setGalleryDragActive(true);
    } else if (e.type === "dragleave") {
      setGalleryDragActive(false);
    }
  };

  const handleGalleryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setGalleryDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultipleGalleryUpload(e.dataTransfer.files);
    }
  };

  // Gallery handlers
  const handleAddGalleryPhoto = () => {
    setGalleryList([...galleryList, { url: "", caption: "", alt: "" }]);
  };
  const handleUpdateGalleryPhoto = (index: number, field: keyof GalleryPhoto, value: string) => {
    const updated = [...galleryList];
    updated[index] = { ...updated[index], [field]: value };
    setGalleryList(updated);
  };
  const handleRemoveGalleryPhoto = (index: number) => {
    setGalleryList(galleryList.filter((_, i) => i !== index));
  };

  // Guest handlers
  const handleAddGuest = () => {
    setGuestsList([...guestsList, { name: "", role: "Keynote Speaker", organization: "", avatar: "" }]);
  };
  const handleUpdateGuest = (index: number, field: keyof GuestItem, value: string) => {
    const updated = [...guestsList];
    updated[index] = { ...updated[index], [field]: value };
    setGuestsList(updated);
  };
  const handleRemoveGuest = (index: number) => {
    setGuestsList(guestsList.filter((_, i) => i !== index));
  };

  // Agenda handlers
  const handleAddAgenda = () => {
    setAgendaList([...agendaList, { time: "09:00 - 10:00", title: "", speaker: "", description: "" }]);
  };
  const handleUpdateAgenda = (index: number, field: keyof AgendaSession, value: string) => {
    const updated = [...agendaList];
    updated[index] = { ...updated[index], [field]: value };
    setAgendaList(updated);
  };
  const handleRemoveAgenda = (index: number) => {
    setAgendaList(agendaList.filter((_, i) => i !== index));
  };

  // Extract years and categories for admin filters
  const adminYears = React.useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      const y = new Date(e.eventDate).getFullYear();
      if (!isNaN(y)) set.add(y.toString());
    });
    return ["ALL", ...Array.from(set).sort((a, b) => Number(b) - Number(a))];
  }, [events]);

  const adminCategories = React.useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [events]);

  const now = React.useMemo(() => new Date(), []);

  // Calculate timing counts for tabs
  const timingCounts = React.useMemo(() => {
    let past = 0;
    let upcoming = 0;
    events.forEach((e) => {
      if (new Date(e.eventDate) < now) past++;
      else upcoming++;
    });
    return { all: events.length, past, upcoming };
  }, [events, now]);

  const filtered = events.filter((e) => {
    // 1. Search query
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchLocation = e.location.toLowerCase().includes(q);
      const matchCategory = e.category.toLowerCase().includes(q);
      if (!matchTitle && !matchLocation && !matchCategory) return false;
    }

    // 2. Year filter
    if (filterYear !== "ALL") {
      const eventYear = new Date(e.eventDate).getFullYear().toString();
      if (eventYear !== filterYear) return false;
    }

    // 3. Timing filter (Past / Upcoming)
    if (filterTiming === "PAST" && new Date(e.eventDate) >= now) return false;
    if (filterTiming === "UPCOMING" && new Date(e.eventDate) < now) return false;

    // 4. Category filter
    if (filterCategory !== "ALL" && e.category !== filterCategory) return false;

    // 5. Status filter
    if (filterStatus !== "ALL" && e.status !== filterStatus) return false;

    return true;
  });

  const totalTablePages = Math.ceil(filtered.length / TABLE_PAGE_SIZE);
  const paginatedTableEvents = filtered.slice(
    (tablePage - 1) * TABLE_PAGE_SIZE,
    tablePage * TABLE_PAGE_SIZE
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    filterYear !== "ALL" ||
    filterTiming !== "ALL" ||
    filterCategory !== "ALL" ||
    filterStatus !== "ALL";

  return (
    <div className="space-y-4">
      {/* FILTER & ACTIONS CARD */}
      <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-xs space-y-4">
        {/* Classification / Timing Tabs: All | Upcoming Events | Past Events */}
        <div className="flex items-center gap-4 sm:gap-6 border-b border-border pb-0 text-xs sm:text-sm font-bold overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterTiming("ALL")}
            className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              filterTiming === "ALL"
                ? "text-blue-600 dark:text-sky-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>All Events</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                filterTiming === "ALL"
                  ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {timingCounts.all}
            </span>
            {filterTiming === "ALL" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-sky-400 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilterTiming("UPCOMING")}
            className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              filterTiming === "UPCOMING"
                ? "text-blue-600 dark:text-sky-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming Events</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                filterTiming === "UPCOMING"
                  ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {timingCounts.upcoming}
            </span>
            {filterTiming === "UPCOMING" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-sky-400 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilterTiming("PAST")}
            className={`pb-3 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              filterTiming === "PAST"
                ? "text-blue-600 dark:text-sky-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Past Events</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                filterTiming === "PAST"
                  ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {timingCounts.past}
            </span>
            {filterTiming === "PAST" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-sky-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Filter and Action Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events, workshops, summits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters: Year Dropdown, Category, Status & Add Event Button */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
            {/* Year Filter Dropdown with Calendar Icon */}
            <div className="relative">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="pl-8 pr-7 py-2 bg-muted/50 border border-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                title="Filter by Year"
              >
                {adminYears.map((y) => (
                  <option key={y} value={y}>
                    {y === "ALL" ? "All Years" : `Year ${y}`}
                  </option>
                ))}
              </select>
              <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-[170px] truncate"
              title="Filter by Category"
            >
              {adminCategories.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All Categories" : c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              title="Filter by Status"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilterYear("ALL");
                  setFilterTiming("ALL");
                  setFilterCategory("ALL");
                  setFilterStatus("ALL");
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-900/40 transition cursor-pointer"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {/* Add Event Primary Action Button */}
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Active Filter Badges & Count Feedback */}
        <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
              Showing {filtered.length} of {events.length} events
            </span>

            {filterYear !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-[11px] border border-blue-200 dark:border-blue-900">
                Year: {filterYear}
                <button
                  type="button"
                  onClick={() => setFilterYear("ALL")}
                  className="hover:text-blue-950 dark:hover:text-white cursor-pointer ml-0.5"
                  title="Remove year filter"
                >
                  &times;
                </button>
              </span>
            )}

            {filterTiming !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold text-[11px] border border-purple-200 dark:border-purple-900">
                Timing: {filterTiming === "PAST" ? "Past Events" : "Upcoming"}
                <button
                  type="button"
                  onClick={() => setFilterTiming("ALL")}
                  className="hover:text-purple-950 dark:hover:text-white cursor-pointer ml-0.5"
                  title="Remove timing filter"
                >
                  &times;
                </button>
              </span>
            )}

            {filterCategory !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-200 dark:border-emerald-900">
                Category: {filterCategory}
                <button
                  type="button"
                  onClick={() => setFilterCategory("ALL")}
                  className="hover:text-emerald-950 dark:hover:text-white cursor-pointer ml-0.5"
                  title="Remove category filter"
                >
                  &times;
                </button>
              </span>
            )}

            {filterStatus !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold text-[11px] border border-amber-200 dark:border-amber-900">
                Status: {filterStatus}
                <button
                  type="button"
                  onClick={() => setFilterStatus("ALL")}
                  className="hover:text-amber-950 dark:hover:text-white cursor-pointer ml-0.5"
                  title="Remove status filter"
                >
                  &times;
                </button>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterYear("ALL");
                setFilterTiming("ALL");
                setFilterCategory("ALL");
                setFilterStatus("ALL");
              }}
              className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Event Title</th>
              <th className="py-2.5 px-4">Date</th>
              <th className="py-2.5 px-4">Category</th>
              <th className="py-2.5 px-4">Recap Media</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedTableEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Calendar className="w-8 h-8 opacity-40" />
                    <p className="text-sm font-semibold">No events found matching your filters</p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setFilterYear("ALL");
                          setFilterTiming("ALL");
                          setFilterCategory("ALL");
                          setFilterStatus("ALL");
                        }}
                        className="mt-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900 transition cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTableEvents.map((e) => {
              const isPast = new Date(e.eventDate) < new Date();
              let photoCount = 0;
              try {
                if (typeof e.gallery === "string") photoCount = JSON.parse(e.gallery).length;
                else if (Array.isArray(e.gallery)) photoCount = e.gallery.length;
              } catch {}

              return (
                <tr key={e.id} className="hover:bg-muted/50 transition">
                  <td className="py-2.5 px-4 font-bold text-foreground">
                    <div className="flex flex-col">
                      <span>{e.title}</span>
                      <span className="text-[11px] font-normal text-muted-foreground">
                        {isPast ? "Past Event (Hosted by JANIC)" : "Upcoming Event"}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {formatDate(e.eventDate)}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">{e.category}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {e.videoUrl && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                          <Video className="w-3 h-3" /> Video
                        </span>
                      )}
                      {photoCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded-md">
                          <ImageIcon className="w-3 h-3" /> {photoCount} Photos
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                        e.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(e)}
                        className="p-1.5 text-muted-foreground hover:text-blue-600 rounded-lg hover:bg-muted transition cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>

        {/* NUMBERS UNDER: TABLE PAGINATION CONTROLS */}
        {totalTablePages > 1 && (
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Showing {(tablePage - 1) * TABLE_PAGE_SIZE + 1} to {Math.min(tablePage * TABLE_PAGE_SIZE, filtered.length)} of {filtered.length} events
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTablePage((p) => Math.max(p - 1, 1))}
                disabled={tablePage === 1}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted text-foreground transition cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: totalTablePages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTablePage(num)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    tablePage === num
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-background border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTablePage((p) => Math.min(p + 1, totalTablePages))}
                disabled={tablePage === totalTablePages}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted text-foreground transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SLIDE-OVER DRAWER FOR ADD / EDIT EVENT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-over Container (Slides in smoothly from the right) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10 z-50">
            <div className="w-screen max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
              {/* STICKY TOP HEADER */}
              <div className="px-6 py-5 border-b border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-20 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#08245C] dark:text-white">
                      {editingEvent ? "Edit Event & Media" : "Add New Event"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Configure details, video recap, photo gallery, guest speakers, and program agenda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                    title="Close Drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* TAB NAVIGATION */}
                <div className="flex items-center gap-1.5 pt-4 overflow-x-auto text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("general")}
                    className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      activeTab === "general"
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    General Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("media")}
                    className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      activeTab === "media"
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    Media &amp; Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("gallery")}
                    className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      activeTab === "gallery"
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Photo Gallery ({galleryList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("guests")}
                    className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      activeTab === "guests"
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Users2 className="w-3.5 h-3.5" />
                    Guests &amp; Speakers ({guestsList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("agenda")}
                    className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      activeTab === "agenda"
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Agenda ({agendaList.length})
                  </button>
                </div>
              </div>

              {/* FORM WITH SCROLLABLE BODY AND STICKY FOOTER */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
              {/* TAB 1: GENERAL INFO */}
              {activeTab === "general" && (
                <div className="space-y-5">
                  {/* 1. EVENT TIMING / CLASSIFICATION SELECTOR */}
                  <div className="p-4 bg-muted/40 rounded-2xl border border-border space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="block text-xs font-bold text-foreground">
                          Event Timing &amp; Stage *
                        </label>
                        <p className="text-[11px] text-muted-foreground">
                          Choose whether this event was already hosted in the past or is scheduled for the future.
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto shrink-0 ${
                        isFormEventPast
                          ? "bg-blue-100 text-[#08245C] dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      }`}>
                        {isFormEventPast ? (
                          <>
                            <History className="w-3.5 h-3.5" />
                            Classified: Past Event Hosted by JANIC
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            Classified: Upcoming Scheduled Event
                          </>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Option 1: Past Event Hosted by JANIC */}
                      <button
                        type="button"
                        onClick={() => handleSelectTiming("PAST")}
                        className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                          isFormEventPast
                            ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 shadow-xs ring-1 ring-blue-500"
                            : "border-border bg-background hover:bg-muted/60"
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${
                          isFormEventPast ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          <History className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-foreground">
                              Past Event Hosted by JANIC
                            </span>
                            {isFormEventPast && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                            Already conducted by JANIC. Shows under &quot;Past Events&quot; with recap gallery, video &amp; attendees.
                          </p>
                        </div>
                      </button>

                      {/* Option 2: Upcoming Event */}
                      <button
                        type="button"
                        onClick={() => handleSelectTiming("UPCOMING")}
                        className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                          !isFormEventPast
                            ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/50 shadow-xs ring-1 ring-emerald-500"
                            : "border-border bg-background hover:bg-muted/60"
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${
                          !isFormEventPast ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-foreground">
                              Upcoming Event (Scheduled)
                            </span>
                            {!isFormEventPast && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                            Scheduled future date. Shows under &quot;Upcoming Events&quot; with registration link &amp; countdown.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 2. EVENT TITLE */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. JANIC Annual Tech Showcase 2026"
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* 3. CATEGORY (DROPDOWN) & DATE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1 flex items-center justify-between">
                        <span>Category *</span>
                        <span className="text-[11px] text-muted-foreground">Select dropdown</span>
                      </label>
                      <div className="space-y-2">
                        <select
                          required
                          value={isCustomCategory ? "OTHER_CUSTOM" : formData.category}
                          onChange={(e) => {
                            if (e.target.value === "OTHER_CUSTOM") {
                              setIsCustomCategory(true);
                              setFormData({ ...formData, category: "" });
                            } else {
                              setIsCustomCategory(false);
                              setFormData({ ...formData, category: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          {availableFormCategories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                          <option value="OTHER_CUSTOM">+ Add Custom Category...</option>
                        </select>

                        {isCustomCategory && (
                          <div className="animate-in fade-in duration-150">
                            <input
                              type="text"
                              required
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              placeholder="Enter custom category name..."
                              className="w-full px-3 py-2 bg-background border border-blue-500 rounded-xl text-xs sm:text-sm focus:outline-none"
                              autoFocus
                            />
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Creating consistent categories keeps the filter bar clean.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-foreground">
                          Event Date &amp; Time *
                        </label>
                        <span className="text-[11px] text-muted-foreground">
                          {isFormEventPast ? "(Past date)" : "(Future scheduled date)"}
                        </span>
                      </div>
                      <input
                        type="datetime-local"
                        required
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                      />
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {isFormEventPast
                          ? "✓ Held in the past — displays under 'Past Events Hosted by JANIC'."
                          : "✓ Scheduled for future — displays under 'Upcoming Events'."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-foreground mb-1">Location *</label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Capacity (Seats)</label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Attendees (Past Events)</label>
                      <input
                        type="number"
                        value={formData.attendeesCount}
                        onChange={(e) => setFormData({ ...formData, attendeesCount: Number(e.target.value) })}
                        placeholder="e.g. 425"
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Summary (Short preview) *</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Brief 1-2 sentence description shown in event cards."
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Full Description &amp; Background *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed event background, highlights, outcomes, and keynote topics."
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Registration Link (For Upcoming Events)</label>
                    <input
                      type="url"
                      value={formData.registrationUrl}
                      onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & VIDEO */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <div>
                    <FileUploadChoice
                      label="Event Cover Image"
                      fileType="image"
                      value={formData.coverImage}
                      onChange={(url) => setFormData({ ...formData, coverImage: url })}
                      folder="events"
                      placeholder="https://... or /uploads/..."
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <FileUploadChoice
                      label="Event Video (Recap Player)"
                      fileType="video"
                      value={formData.videoUrl}
                      onChange={(url) => setFormData({ ...formData, videoUrl: url })}
                      folder="events"
                      placeholder="YouTube link (https://youtube.com/watch?v=...) or /uploads/...mp4"
                      helperText="Supports direct MP4 uploads as well as YouTube and Vimeo embed URLs."
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: PHOTO GALLERY */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  {/* Hidden multiple file input */}
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleMultipleGalleryUpload(e.target.files);
                      }
                    }}
                  />

                  {/* Header & Action Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Interactive Photo Gallery</h4>
                      <p className="text-xs text-muted-foreground">
                        Upload multiple photos directly from your device, or add image URLs manually.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        disabled={uploadingGallery}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Upload from Device
                      </button>
                      <button
                        type="button"
                        onClick={handleAddGalleryPhoto}
                        className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Add photo by URL"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add by URL
                      </button>
                    </div>
                  </div>

                  {/* Big Drag & Drop / Click Zone for Multiple Device Upload */}
                  <div
                    onDragEnter={handleGalleryDrag}
                    onDragOver={handleGalleryDrag}
                    onDragLeave={handleGalleryDrag}
                    onDrop={handleGalleryDrop}
                    onClick={() => !uploadingGallery && galleryFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      galleryDragActive
                        ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/30"
                        : "border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-muted/20 hover:bg-blue-50/20"
                    } ${uploadingGallery ? "opacity-75 pointer-events-none" : ""}`}
                  >
                    {uploadingGallery ? (
                      <div className="flex flex-col items-center gap-2 py-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="text-xs font-bold text-blue-600">{galleryUploadProgress}</span>
                        <span className="text-[11px] text-muted-foreground">Uploading directly to server...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-foreground">
                            Click to browse or Drag &amp; Drop photos from your device
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Select multiple JPG, PNG, WebP images simultaneously
                          </p>
                        </div>
                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 mt-1">
                          Multiple Uploads Allowed
                        </span>
                      </>
                    )}
                  </div>

                  {/* Gallery Photos List */}
                  {galleryList.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl text-xs text-muted-foreground">
                      No gallery photos added yet. Click &quot;Upload from Device&quot; to choose multiple photos.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                        <span className="font-semibold text-foreground">
                          {galleryList.length} {galleryList.length === 1 ? "photo" : "photos"} in gallery
                        </span>
                        <button
                          type="button"
                          onClick={() => setGalleryList([])}
                          className="text-rose-500 hover:underline text-[11px] cursor-pointer"
                        >
                          Clear all photos
                        </button>
                      </div>

                      {galleryList.map((photo, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-3.5 bg-muted/40 rounded-2xl border border-border flex items-start gap-3.5 group hover:border-blue-500/40 transition"
                        >
                          {/* Real Thumbnail Preview */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-border">
                            {photo.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={photo.url}
                                alt={photo.caption || `Photo ${pIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                            <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              #{pIdx + 1}
                            </div>
                          </div>

                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                Caption (displayed in Lightbox)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Student Innovators Demonstrating Prototypes"
                                value={photo.caption || ""}
                                onChange={(e) => handleUpdateGalleryPhoto(pIdx, "caption", e.target.value)}
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                Photo URL or Path
                              </label>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  placeholder="/uploads/... or https://..."
                                  value={photo.url}
                                  onChange={(e) => handleUpdateGalleryPhoto(pIdx, "url", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-mono truncate"
                                />
                                {photo.url && (
                                  <a
                                    href={photo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-muted-foreground hover:text-blue-600 rounded-lg hover:bg-muted shrink-0"
                                    title="Open photo"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryPhoto(pIdx)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer mt-5 shrink-0"
                            title="Remove photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: GUESTS & SPEAKERS */}
              {activeTab === "guests" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Distinguished Guests &amp; Speakers</h4>
                      <p className="text-xs text-muted-foreground">
                        Keynote speakers, guest judges, faculty leaders, and panelists.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddGuest}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Guest
                    </button>
                  </div>

                  {guestsList.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl text-xs text-muted-foreground">
                      No guests added yet. Click &quot;Add Guest&quot; to showcase speakers and judges.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {guestsList.map((guest, gIdx) => (
                        <div key={gIdx} className="p-3.5 bg-muted/40 rounded-2xl border border-border flex items-start gap-3">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                placeholder="Dr. Jane Doe"
                                value={guest.name}
                                onChange={(e) => handleUpdateGuest(gIdx, "name", e.target.value)}
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                Role / Title *
                              </label>
                              <input
                                type="text"
                                placeholder="Keynote Speaker / Judge"
                                value={guest.role}
                                onChange={(e) => handleUpdateGuest(gIdx, "role", e.target.value)}
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                Organization
                              </label>
                              <input
                                type="text"
                                placeholder="Jazeera University"
                                value={guest.organization || ""}
                                onChange={(e) => handleUpdateGuest(gIdx, "organization", e.target.value)}
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                Avatar Photo URL
                              </label>
                              <input
                                type="text"
                                placeholder="/uploads/... or https://..."
                                value={guest.avatar || ""}
                                onChange={(e) => handleUpdateGuest(gIdx, "avatar", e.target.value)}
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveGuest(gIdx)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer mt-5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: AGENDA & SCHEDULE */}
              {activeTab === "agenda" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Program Flow &amp; Agenda</h4>
                      <p className="text-xs text-muted-foreground">
                        Timelines, session titles, assigned leads, and descriptions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAgenda}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Session
                    </button>
                  </div>

                  {agendaList.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl text-xs text-muted-foreground">
                      No agenda sessions added yet. Click &quot;Add Session&quot; to build the chronological timeline.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {agendaList.map((session, sIdx) => (
                        <div key={sIdx} className="p-3.5 bg-muted/40 rounded-2xl border border-border flex items-start gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                  Time Slot
                                </label>
                                <input
                                  type="text"
                                  placeholder="09:00 - 10:00"
                                  value={session.time}
                                  onChange={(e) => handleUpdateAgenda(sIdx, "time", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-mono"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                  Session Title *
                                </label>
                                <input
                                  type="text"
                                  placeholder="Keynote Address: Catalyzing Innovation"
                                  value={session.title}
                                  onChange={(e) => handleUpdateAgenda(sIdx, "title", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                  Lead / Speaker
                                </label>
                                <input
                                  type="text"
                                  placeholder="Dr. Abdullahi Mohamed"
                                  value={session.speaker || ""}
                                  onChange={(e) => handleUpdateAgenda(sIdx, "speaker", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  placeholder="Brief overview of session topics"
                                  value={session.description || ""}
                                  onChange={(e) => handleUpdateAgenda(sIdx, "description", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAgenda(sIdx)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer mt-5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

                </div>

                {/* STICKY BOTTOM FOOTER */}
                <div className="px-6 py-4 border-t border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky bottom-0 z-20 shrink-0 flex items-center justify-between">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs font-bold uppercase cursor-pointer"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer transition"
                    >
                      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Save Event
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
