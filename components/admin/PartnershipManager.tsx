"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Partnership {
  id: string;
  organizationName: string;
  organizationType: string;
  contactName: string;
  email: string;
  phone?: string | null;
  collaborationArea: string;
  proposalDetails: string;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CLOSED";
  adminNotes?: string | null;
  createdAt: string | Date;
}

export function PartnershipManager({ initialPartnerships }: { initialPartnerships: Partnership[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Partnership[]>(initialPartnerships);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Partnership | null>(null);
  const [statusInput, setStatusInput] = useState<Partnership["status"]>("NEW");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleOpen = (p: Partnership) => {
    setSelected(p);
    setStatusInput(p.status);
    setNotes(p.adminNotes || "");
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/partnerships/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusInput, adminNotes: notes }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === selected.id ? { ...item, status: statusInput, adminNotes: notes } : item
          )
        );
        setSelected(null);
        router.refresh();
      }
    } catch {
      alert("Error saving status");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/partnerships/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      }
    } catch {
      alert("Error deleting inquiry");
    }
  };

  const filtered = items.filter(
    (p) =>
      p.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      p.contactName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search partnerships..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Organization</th>
              <th className="py-2.5 px-4">Contact Person</th>
              <th className="py-2.5 px-4">Area of Collaboration</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Date</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/50 transition">
                <td className="py-2.5 px-4 font-bold text-foreground">
                  {p.organizationName}
                  <span className="block text-[11px] text-muted-foreground font-normal">{p.organizationType}</span>
                </td>
                <td className="py-2.5 px-4 text-foreground">
                  {p.contactName}
                  <span className="block text-[11px] text-muted-foreground font-mono">{p.email}</span>
                </td>
                <td className="py-2.5 px-4 text-slate-600">{p.collaborationArea}</td>
                <td className="py-2.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      p.status === "NEW"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : p.status === "IN_PROGRESS"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : p.status === "CONTACTED"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {p.status.replace("_", " ")}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-muted-foreground text-xs">{formatDate(p.createdAt)}</td>
                <td className="py-2.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpen(p)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
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

      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-6 p-2 text-muted-foreground hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase text-blue-600">{selected.organizationType}</span>
            <h3 className="text-2xl font-extrabold text-[#08245C] mt-1 mb-4">
              {selected.organizationName}
            </h3>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl mb-4 text-xs text-foreground">
              <div><strong>Contact:</strong> {selected.contactName}</div>
              <div><strong>Email:</strong> {selected.email}</div>
              <div><strong>Phone:</strong> {selected.phone || "N/A"}</div>
              <div><strong>Focus:</strong> {selected.collaborationArea}</div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Proposal Details</h4>
              <p className="text-xs sm:text-sm text-foreground bg-slate-50 p-4 rounded-xl leading-relaxed whitespace-pre-line">
                {selected.proposalDetails}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-foreground">Status:</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as any)}
                  className="px-3 py-1.5 bg-muted/50 border border-slate-300 rounded-xl text-xs font-bold uppercase"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Staff Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record follow-up actions..."
                  className="w-full px-3 py-2 bg-muted/50 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-muted rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                >
                  {saving ? "Saving..." : "Save Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
