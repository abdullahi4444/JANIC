"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ImageUploadChoice } from "./ImageUploadChoice";
import { FileUploadChoice } from "./FileUploadChoice";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  technology: string;
  innovation?: string | null;
  outcomes?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  heroImage?: string | null;
  demoUrl?: string | null;
  videoUrl?: string | null;
  githubUrl?: string | null;
  teamMembers?: string | null;
  gallery?: { id?: string; imageUrl: string; caption?: string | null; order?: number }[];
  updatedAt: string | Date;
}

interface ProjectManagerProps {
  initialProjects: Project[];
  categories: string[];
}

export function ProjectManager({ initialProjects, categories }: ProjectManagerProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    category: "Web Platform",
    summary: "",
    problem: "",
    solution: "",
    technology: "",
    innovation: "",
    outcomes: "",
    status: "PUBLISHED",
    isFeatured: false,
    heroImage: "",
    demoUrl: "",
    videoUrl: "",
    githubUrl: "",
    teamMembers: "",
    galleryImages: [] as string[],
  });

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      category: categories[0] || "Web Platform",
      summary: "",
      problem: "",
      solution: "",
      technology: "",
      innovation: "",
      outcomes: "",
      status: "PUBLISHED",
      isFeatured: false,
      heroImage: "",
      demoUrl: "",
      videoUrl: "",
      githubUrl: "",
      teamMembers: "",
      galleryImages: [],
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    const existingGallery =
      p.gallery && Array.isArray(p.gallery)
        ? p.gallery.map((g: any) => g.imageUrl || "").filter(Boolean)
        : [];

    setFormData({
      title: p.title,
      category: p.category,
      summary: p.summary,
      problem: p.problem,
      solution: p.solution,
      technology: p.technology,
      innovation: p.innovation || "",
      outcomes: p.outcomes || "",
      status: p.status,
      isFeatured: p.isFeatured,
      heroImage: p.heroImage || "",
      demoUrl: p.demoUrl || "",
      videoUrl: p.videoUrl || "",
      githubUrl: p.githubUrl || "",
      teamMembers: p.teamMembers || "",
      galleryImages: existingGallery,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const payload = {
        ...formData,
        heroImage: formData.heroImage.trim() ? formData.heroImage.trim() : null,
        demoUrl: formData.demoUrl.trim() ? formData.demoUrl.trim() : null,
        videoUrl: formData.videoUrl.trim() ? formData.videoUrl.trim() : null,
        githubUrl: formData.githubUrl.trim() ? formData.githubUrl.trim() : null,
        innovation: formData.innovation.trim() ? formData.innovation.trim() : null,
        outcomes: formData.outcomes.trim() ? formData.outcomes.trim() : null,
        teamMembers: formData.teamMembers.trim() ? formData.teamMembers.trim() : null,
        galleryImages: formData.galleryImages.filter((img) => img && img.trim().length > 0),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Operation failed");
      }

      setModalOpen(false);
      router.refresh();

      // Optimistic update
      if (editingProject) {
        setProjects((prev) =>
          prev.map((item) => (item.id === editingProject.id ? { ...item, ...formData, updatedAt: new Date() } as any : item))
        );
      } else {
        setProjects((prev) => [data.project, ...prev]);
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error saving project");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (p: Project, nextStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    try {
      const res = await fetch(`/api/projects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, status: nextStatus } : item))
        );
        router.refresh();
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete project");
      }
    } catch {
      alert("Error deleting project");
    }
  };

  // Filtered List
  const filtered = projects.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()) ||
      p.technology.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter dropdowns + Add Button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Project</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-center">Featured</th>
                <th className="py-2.5 px-4">Updated</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No matching projects found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50 transition">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted relative overflow-hidden shrink-0 border border-border">
                          {p.heroImage ? (
                            <Image src={p.heroImage} alt={p.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                              {p.title.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{p.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">/projects/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleToggleStatus(p, e.target.value as any)}
                        className={`text-xs font-bold uppercase rounded-lg px-2.5 py-1 border cursor-pointer ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : p.status === "DRAFT"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-muted text-slate-600 border-border"
                        }`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {p.isFeatured ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-500">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground text-xs">
                      {formatDate(p.updatedAt)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.status === "PUBLISHED" && (
                          <a
                            href={`/projects/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-muted-foreground hover:text-blue-600 rounded-lg hover:bg-muted transition"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-muted-foreground hover:text-blue-600 rounded-lg hover:bg-muted transition cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-slate-600 rounded-lg hover:bg-muted transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-[#08245C] mb-1">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Complete the project showcase details. Published projects are immediately visible to the public.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. MAAL HUB"
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Web Platform, IoT, HealthTech..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Summary / Elevator Pitch *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Short 1-2 sentence description shown on project cards..."
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    The Problem *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="What specific issue was this project engineered to resolve?"
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    The Solution *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="How does this system solve the problem? Architecture & approach..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Key Innovation
                  </label>
                  <input
                    type="text"
                    value={formData.innovation}
                    onChange={(e) => setFormData({ ...formData, innovation: e.target.value })}
                    placeholder="e.g. Offline-first sync engine..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Outcomes & Metrics
                  </label>
                  <input
                    type="text"
                    value={formData.outcomes}
                    onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                    placeholder="e.g. 48% reduction in delay across 4 hospitals..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Technologies (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.technology}
                  onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                  placeholder="e.g. Next.js, Arduino Mega, TypeScript, MySQL, Docker"
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Hero Image Selection (Two Choices: Link URL or Upload File) */}
              <div className="bg-slate-50/70 dark:bg-muted/30 p-3.5 rounded-xl border border-border">
                <ImageUploadChoice
                  label="Hero Image"
                  value={formData.heroImage}
                  onChange={(url) => setFormData({ ...formData, heroImage: url })}
                  folder="projects"
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                />
              </div>

              {/* Project Gallery Images (Upload / Link with Add Gallery Image Button) */}
              <div className="bg-slate-50/70 dark:bg-muted/30 p-3.5 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-foreground">
                        Project Gallery Photos ({formData.galleryImages.length})
                      </label>
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Upload multiple screenshots &amp; photos to display in the project gallery
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        galleryImages: [...formData.galleryImages, ""],
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0875D1] hover:bg-[#0663B3] text-white text-xs font-bold transition-all shadow-xs"
                    title="Add another photo to this project gallery"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Gallery</span>
                  </button>
                </div>

                {formData.galleryImages.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {formData.galleryImages.map((imgUrl, index) => (
                      <div
                        key={index}
                        className="relative p-3 rounded-xl bg-white dark:bg-card border border-border flex items-start gap-3 shadow-xs"
                      >
                        <div className="flex-1">
                          <ImageUploadChoice
                            label={`Gallery Photo #${index + 1}`}
                            value={imgUrl}
                            onChange={(newUrl) => {
                              const next = [...formData.galleryImages];
                              next[index] = newUrl;
                              setFormData({ ...formData, galleryImages: next });
                            }}
                            folder="projects/gallery"
                            placeholder="https://... or upload photo"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = formData.galleryImages.filter((_, i) => i !== index);
                            setFormData({ ...formData, galleryImages: next });
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors mt-6 shrink-0"
                          title="Remove this gallery photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Team Members
                </label>
                <input
                  type="text"
                  value={formData.teamMembers}
                  onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                  placeholder="Ahmed Nur (Lead), Hafsa Ali (Firmware)"
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Format: &quot;Member Name (Role), Next Member (Role)&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Video Demo (Two Choices: Video Link or Upload Video File) */}
              <div className="bg-slate-50/70 dark:bg-muted/30 p-3.5 rounded-xl border border-border">
                <FileUploadChoice
                  label="Video Demo"
                  fileType="video"
                  value={formData.videoUrl}
                  onChange={(url) => setFormData({ ...formData, videoUrl: url })}
                  folder="videos"
                  placeholder="https://youtube.com/... or /uploads/..."
                  helperText="Provide a YouTube/Vimeo link or upload an MP4/WebM video file"
                />
              </div>

              {/* Status & Featured */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Publication Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs font-bold uppercase focus:outline-none"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="PUBLISHED">PUBLISHED (Live)</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer pt-5">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-muted transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Project"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
