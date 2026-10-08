"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit2, Trash2, X, Loader2, ExternalLink } from "lucide-react";
import { FileUploadChoice } from "./FileUploadChoice";

interface ResearchPaper {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  authors: string;
  category: string;
  journalOrConference?: string | null;
  doi?: string | null;
  pdfUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  publicationDate?: string | Date | null;
}

export function ResearchManager({ initialPapers }: { initialPapers: ResearchPaper[] }) {
  const router = useRouter();
  const [papers, setPapers] = useState<ResearchPaper[]>(initialPapers);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Applied Research",
    authors: "",
    abstract: "",
    journalOrConference: "",
    doi: "",
    pdfUrl: "",
    status: "DRAFT",
    isFeatured: false,
  });

  const handleOpenAdd = () => {
    setEditingPaper(null);
    setFormData({
      title: "",
      category: "Applied Research",
      authors: "",
      abstract: "",
      journalOrConference: "",
      doi: "",
      pdfUrl: "",
      status: "DRAFT",
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: ResearchPaper) => {
    setEditingPaper(p);
    setFormData({
      title: p.title,
      category: p.category,
      authors: p.authors,
      abstract: p.abstract,
      journalOrConference: p.journalOrConference || "",
      doi: p.doi || "",
      pdfUrl: p.pdfUrl || "",
      status: p.status,
      isFeatured: p.isFeatured,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingPaper ? `/api/research/${editingPaper.id}` : "/api/research";
      const method = editingPaper ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      setModalOpen(false);
      router.refresh();

      if (editingPaper) {
        setPapers((prev) =>
          prev.map((item) => (item.id === editingPaper.id ? { ...item, ...formData } as any : item))
        );
      } else {
        setPapers((prev) => [data.item, ...prev]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research paper?")) return;
    try {
      const res = await fetch(`/api/research/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPapers((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      }
    } catch {
      alert("Error deleting paper");
    }
  };

  const filtered = papers.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.authors.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search research papers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Research Paper
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Paper Title</th>
              <th className="py-2.5 px-4">Authors</th>
              <th className="py-2.5 px-4">Category</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/50 transition">
                <td className="py-2.5 px-4 font-bold text-foreground max-w-sm truncate">{p.title}</td>
                <td className="py-2.5 px-4 text-slate-600">{p.authors}</td>
                <td className="py-2.5 px-4">
                  <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold">
                    {p.category}
                  </span>
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
                      className="p-1.5 text-muted-foreground hover:text-blue-600 rounded-lg hover:bg-muted transition cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
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
              className="absolute top-4 right-6 p-2 text-muted-foreground hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-[#08245C] mb-6">
              {editingPaper ? "Edit Research Paper" : "Add Research Paper"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Title *</label>
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
                  <label className="block text-xs font-semibold text-foreground mb-1">Authors *</label>
                  <input
                    type="text"
                    required
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    placeholder="Dr. Hassan Omar, Eng. Amina Farah"
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Abstract *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Journal / Conference</label>
                  <input
                    type="text"
                    value={formData.journalOrConference}
                    onChange={(e) => setFormData({ ...formData, journalOrConference: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">DOI Identifier</label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    placeholder="10.1016/..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* PDF Document (Two Choices: Link URL or Upload PDF File) */}
              <div className="bg-slate-50/70 dark:bg-muted/30 p-3.5 rounded-xl border border-border">
                <FileUploadChoice
                  label="PDF Document"
                  fileType="pdf"
                  value={formData.pdfUrl}
                  onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
                  folder="research"
                  placeholder="https://... or /uploads/..."
                  helperText="Provide an external paper link or upload a PDF directly"
                />
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
                    Save Paper
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
