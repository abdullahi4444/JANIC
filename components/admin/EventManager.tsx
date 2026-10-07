"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit2, Trash2, X, Loader2, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  eventDate: string | Date;
  location: string;
  capacity?: number | null;
  registrationUrl?: string | null;
  coverImage?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export function EventManager({ initialEvents }: { initialEvents: EventItem[] }) {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Innovation Showcase",
    summary: "",
    description: "",
    eventDate: "2026-11-20T09:00",
    location: "Jazeera University Main Auditorium",
    capacity: 200,
    registrationUrl: "",
    coverImage: "",
    status: "DRAFT",
    isFeatured: false,
  });

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      category: "Innovation Showcase",
      summary: "",
      description: "",
      eventDate: "2026-11-20T09:00",
      location: "Jazeera University Main Auditorium, Mogadishu",
      capacity: 250,
      registrationUrl: "",
      coverImage: "",
      status: "DRAFT",
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (e: EventItem) => {
    setEditingEvent(e);
    setFormData({
      title: e.title,
      category: e.category,
      summary: e.summary,
      description: e.description,
      eventDate: new Date(e.eventDate).toISOString().slice(0, 16),
      location: e.location,
      capacity: e.capacity || 100,
      registrationUrl: e.registrationUrl || "",
      coverImage: e.coverImage || "",
      status: e.status,
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      setModalOpen(false);
      router.refresh();

      if (editingEvent) {
        setEvents((prev) =>
          prev.map((item) => (item.id === editingEvent.id ? { ...item, ...formData } as any : item))
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

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events & hackathons..."
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
          Add Event
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Event Title</th>
              <th className="py-2.5 px-4">Date</th>
              <th className="py-2.5 px-4">Category</th>
              <th className="py-2.5 px-4">Location</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-muted/50 transition">
                <td className="py-2.5 px-4 font-bold text-foreground">{e.title}</td>
                <td className="py-2.5 px-4 text-slate-600">{formatDate(e.eventDate)}</td>
                <td className="py-2.5 px-4 text-slate-600">{e.category}</td>
                <td className="py-2.5 px-4 text-muted-foreground text-xs">{e.location}</td>
                <td className="py-2.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      e.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
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
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
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
              {editingEvent ? "Edit Event" : "Add Event"}
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
                  <label className="block text-xs font-semibold text-foreground mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Event Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Capacity (Seats)</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
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
                <label className="block text-xs font-semibold text-foreground mb-1">Description *</label>
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
                  <label className="block text-xs font-semibold text-foreground mb-1">Registration Link URL</label>
                  <input
                    type="url"
                    value={formData.registrationUrl}
                    onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm"
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
                    Save Event
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
