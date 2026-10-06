"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Trash2, X, Mail, Phone, Clock, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  adminNotes?: string | null;
  createdAt: string | Date;
}

export function MessageManager({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [statusInput, setStatusInput] = useState<Message["status"]>("UNREAD");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleOpen = async (m: Message) => {
    setSelected(m);
    setStatusInput(m.status === "UNREAD" ? "READ" : m.status);
    setNotes(m.adminNotes || "");

    // If unread, auto mark as read
    if (m.status === "UNREAD") {
      try {
        await fetch(`/api/messages/${m.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "READ" }),
        });
        setMessages((prev) =>
          prev.map((item) => (item.id === m.id ? { ...item, status: "READ" } : item))
        );
      } catch {}
    }
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/messages/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusInput, adminNotes: notes }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === selected.id ? { ...item, status: statusInput, adminNotes: notes } : item
          )
        );
        setSelected(null);
        router.refresh();
      }
    } catch {
      alert("Error saving message");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        router.refresh();
      }
    } catch {
      alert("Error deleting message");
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search contact messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-6">Sender</th>
              <th className="py-3.5 px-4">Subject</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((m) => (
              <tr
                key={m.id}
                className={`hover:bg-slate-50/80 transition ${
                  m.status === "UNREAD" ? "bg-blue-50/30 font-semibold" : ""
                }`}
              >
                <td className="py-4 px-6 text-slate-900">
                  {m.name}
                  <span className="block text-[11px] text-slate-400 font-mono font-normal">
                    {m.email}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-700 max-w-xs truncate">{m.subject}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      m.status === "UNREAD"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : m.status === "REPLIED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-500 text-xs">{formatDate(m.createdAt)}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpen(m)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Read
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
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
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase text-slate-400">Message from</span>
            <h3 className="text-xl font-extrabold text-[#08245C] mt-0.5 mb-1">
              {selected.name}
            </h3>
            <p className="text-xs text-slate-500 font-mono mb-4">
              {selected.email} {selected.phone ? `• ${selected.phone}` : ""}
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl mb-4 space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-500">Subject:</h4>
              <p className="text-sm font-semibold text-slate-900">{selected.subject}</p>
              <div className="pt-2 border-t border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {selected.message}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-slate-700">Status:</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold uppercase"
                >
                  <option value="UNREAD">UNREAD</option>
                  <option value="READ">READ</option>
                  <option value="REPLIED">REPLIED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record reply or notes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
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
