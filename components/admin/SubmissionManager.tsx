"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Trash2, X, CheckCircle2, Clock, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Submission {
  id: string;
  title: string;
  category: string;
  problemStatement: string;
  solutionDescription: string;
  technologyStack?: string | null;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  facultyOrDepartment?: string | null;
  studentId?: string | null;
  teamMembers?: string | null;
  prototypeUrl?: string | null;
  videoUrl?: string | null;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  reviewNotes?: string | null;
  createdAt: string | Date;
}

export function SubmissionManager({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [statusInput, setStatusInput] = useState<Submission["status"]>("PENDING");
  const [saving, setSaving] = useState(false);

  const handleOpenReview = (s: Submission) => {
    setSelectedSub(s);
    setReviewNotes(s.reviewNotes || "");
    setStatusInput(s.status);
  };

  const handleSaveReview = async () => {
    if (!selectedSub) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/submissions/${selectedSub.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusInput, reviewNotes }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === selectedSub.id ? { ...item, status: statusInput, reviewNotes } : item
        )
      );
      setSelectedSub(null);
      router.refresh();
    } catch {
      alert("Error saving review");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        router.refresh();
      }
    } catch {
      alert("Error deleting");
    }
  };

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      search === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.submitterName.toLowerCase().includes(search.toLowerCase()) ||
      s.submitterEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === "all" || s.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search proposals by title or student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="all">All Review States</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-6">Project Title</th>
              <th className="py-3.5 px-4">Student Submitter</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Submitted</th>
              <th className="py-3.5 px-6 text-right">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No submissions found.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-bold text-slate-900 max-w-xs truncate">{s.title}</td>
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {s.submitterName}
                    <span className="block text-[11px] text-slate-400 font-mono">{s.submitterEmail}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{s.category}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                        s.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : s.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : s.status === "UNDER_REVIEW"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {s.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 text-xs">{formatDate(s.createdAt)}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenReview(s)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
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

      {selectedSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSub(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {selectedSub.category}
            </span>
            <h3 className="text-2xl font-extrabold text-[#08245C] mt-1 mb-4">
              {selectedSub.title}
            </h3>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl mb-6 text-xs text-slate-700">
              <div>
                <strong>Submitter:</strong> {selectedSub.submitterName} ({selectedSub.submitterEmail})
              </div>
              <div>
                <strong>Phone:</strong> {selectedSub.submitterPhone}
              </div>
              <div>
                <strong>Department:</strong> {selectedSub.facultyOrDepartment || "N/A"}
              </div>
              <div>
                <strong>Student ID:</strong> {selectedSub.studentId || "N/A"}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Problem Statement</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl leading-relaxed">
                  {selectedSub.problemStatement}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Proposed Solution</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl leading-relaxed">
                  {selectedSub.solutionDescription}
                </p>
              </div>

              {selectedSub.technologyStack && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Tech Stack</h4>
                  <p className="text-xs text-slate-600">{selectedSub.technologyStack}</p>
                </div>
              )}

              {selectedSub.teamMembers && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Team Members</h4>
                  <p className="text-xs text-slate-600">{selectedSub.teamMembers}</p>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                {selectedSub.prototypeUrl && (
                  <a
                    href={selectedSub.prototypeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Prototype URL <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedSub.videoUrl && (
                  <a
                    href={selectedSub.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Video Demo <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Review Decision Form */}
            <div className="p-6 bg-slate-100/70 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-slate-800">Faculty Review Decision</h4>

              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-slate-700">Set Status:</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as any)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold uppercase"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="APPROVED">APPROVED (Admit to Hub)</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internal Faculty Notes / Feedback
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Notes on laboratory requirements, mentors assigned, or reasons for rejection..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveReview}
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Review Decision"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
