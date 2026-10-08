"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit2, Trash2, ExternalLink, X, Loader2 } from "lucide-react";
import { FileUploadChoice } from "./FileUploadChoice";

interface TrainingProgram {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  level: string;
  duration: string;
  schedule: string;
  mode: string;
  certification?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  coverImage?: string | null;
  maxSeats?: number | null;
  syllabus?: string | null;
  updatedAt: string | Date;
}

export function TrainingManager({ initialPrograms }: { initialPrograms: TrainingProgram[] }) {
  const router = useRouter();
  const [programs, setPrograms] = useState<TrainingProgram[]>(initialPrograms);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Software Engineering",
    summary: "",
    description: "",
    level: "Intermediate",
    duration: "10 Weeks",
    schedule: "Mon & Wed, 4:00 PM - 7:00 PM",
    mode: "On-Campus",
    certification: "",
    status: "DRAFT",
    isFeatured: false,
    coverImage: "",
    syllabus: "",
  });

  const handleOpenAdd = () => {
    setEditingProgram(null);
    setFormData({
      title: "",
      category: "Software Engineering",
      summary: "",
      description: "",
      level: "Intermediate",
      duration: "10 Weeks",
      schedule: "Mon & Wed, 4:00 PM - 7:00 PM",
      mode: "On-Campus",
      certification: "JANIC Certified Practitioner",
      status: "DRAFT",
      isFeatured: false,
      coverImage: "",
      syllabus: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: TrainingProgram) => {
    setEditingProgram(p);
    setFormData({
      title: p.title,
      category: p.category,
      summary: p.summary,
      description: p.description,
      level: p.level,
      duration: p.duration,
      schedule: p.schedule,
      mode: p.mode,
      certification: p.certification || "",
      status: p.status,
      isFeatured: p.isFeatured,
      coverImage: p.coverImage || "",
      syllabus: p.syllabus || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingProgram ? `/api/training/${editingProgram.id}` : "/api/training";
      const method = editingProgram ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      setModalOpen(false);
      router.refresh();

      if (editingProgram) {
        setPrograms((prev) =>
          prev.map((item) => (item.id === editingProgram.id ? { ...item, ...formData, updatedAt: new Date() } as any : item))
        );
      } else {
        setPrograms((prev) => [data.item, ...prev]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      const res = await fetch(`/api/training/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      }
    } catch {
      alert("Error deleting program");
    }
  };

  const filtered = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search training programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Training Program
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Program Title</th>
              <th className="py-2.5 px-4">Category</th>
              <th className="py-2.5 px-4">Duration & Schedule</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/50 transition">
                <td className="py-2.5 px-4 font-bold text-foreground">{p.title}</td>
                <td className="py-2.5 px-4 text-slate-600">{p.category}</td>
                <td className="py-2.5 px-4 text-muted-foreground text-xs">
                  {p.duration} • {p.schedule}
                </td>
                <td className="py-2.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      p.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-muted-foreground hover:text-blue-600 rounded-lg hover:bg-muted transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-6 p-2 text-muted-foreground hover:text-slate-600 rounded-lg hover:bg-muted transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-[#08245C] mb-6">
              {editingProgram ? "Edit Training Program" : "Add Training Program"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Level</label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Schedule *</label>
                  <input
                    type="text"
                    required
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Full Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Certification Title</label>
                  <input
                    type="text"
                    value={formData.certification}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FileUploadChoice
                    label="Cover Image"
                    fileType="image"
                    value={formData.coverImage}
                    onChange={(url) => setFormData({ ...formData, coverImage: url })}
                    folder="training"
                    placeholder="https://... or /uploads/..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs font-bold uppercase"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-muted rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Program
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
