"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  User,
  FolderGit2,
  Mail,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FileUploadChoice } from "./FileUploadChoice";
import { cn } from "@/lib/utils";

export interface ProjectOption {
  id: string;
  title: string;
  slug: string;
  category: string;
  order: number;
}

export interface AdminProjectMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio?: string | null;
  avatar?: string | null;
  projectId?: string | null;
  project?: {
    id: string;
    title: string;
    slug: string;
    category: string;
    order: number;
  } | null;
  facebook?: string | null;
  github?: string | null;
  email?: string | null;
  linkedin?: string | null;
  tags?: string | null;
  order: number;
  isActive: boolean;
}

// Brand SVG Icons
function FacebookIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="#1877F2" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function GitHubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GmailIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.248l8.073-5.755c1.618-1.214 3.927-.059 3.927 1.964z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="#0A66C2" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

interface ProjectMemberManagerProps {
  initialMembers: AdminProjectMember[];
  projects: ProjectOption[];
}

export function ProjectMemberManager({
  initialMembers,
  projects,
}: ProjectMemberManagerProps) {
  const router = useRouter();
  const [members, setMembers] = useState<AdminProjectMember[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminProjectMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state: Only Facebook, GitHub, Gmail (Email), LinkedIn
  const [formData, setFormData] = useState({
    name: "",
    role: "Team Member",
    department: "Faculty of Computer Science & IT",
    bio: "",
    avatar: "",
    projectId: "",
    facebook: "",
    github: "",
    email: "",
    linkedin: "",
    tags: "",
    order: 0,
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "Team Member",
      department: "Faculty of Computer Science & IT",
      bio: "",
      avatar: "",
      projectId: projects[0]?.id || "",
      facebook: "",
      github: "",
      email: "",
      linkedin: "",
      tags: "",
      order: members.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (m: AdminProjectMember) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      role: m.role,
      department: m.department || "Faculty of Computer Science & IT",
      bio: m.bio || "",
      avatar: m.avatar || "",
      projectId: m.projectId || "",
      facebook: m.facebook || "",
      github: m.github || "",
      email: m.email || "",
      linkedin: m.linkedin || "",
      tags: m.tags || "",
      order: m.order,
      isActive: m.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Member name is required.");
      return;
    }
    setLoading(true);

    try {
      const url = editingMember
        ? `/api/project-members/${editingMember.id}`
        : "/api/project-members";
      const method = editingMember ? "PUT" : "POST";

      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        department: formData.department.trim(),
        projectId: formData.projectId || null,
        bio: formData.bio.trim() || null,
        avatar: formData.avatar.trim() || null,
        facebook: formData.facebook.trim() || null,
        github: formData.github.trim() || null,
        email: formData.email.trim() || null,
        linkedin: formData.linkedin.trim() || null,
        tags: formData.tags.trim() || null,
        order: formData.order,
        isActive: formData.isActive,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Save failed");
      }

      setModalOpen(false);
      router.refresh();

      if (editingMember) {
        const assignedProj = projects.find((p) => p.id === formData.projectId);
        setMembers((prev) =>
          prev.map((item) =>
            item.id === editingMember.id
              ? {
                  ...item,
                  ...payload,
                  project: assignedProj
                    ? {
                        id: assignedProj.id,
                        title: assignedProj.title,
                        slug: assignedProj.slug,
                        category: assignedProj.category,
                        order: assignedProj.order,
                      }
                    : null,
                }
              : item
          )
        );
      } else {
        setMembers((prev) => [...prev, data.item]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving project member");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/project-members/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Delete failed");
      }

      setMembers((prev) => prev.filter((m) => m.id !== id));
      setDeleteConfirmId(null);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting member");
    } finally {
      setLoading(false);
    }
  };

  // Filtered members list
  const filtered = members.filter((m) => {
    if (selectedYear !== "all") {
      // In this portal, all active registered members belong to cohort 2026
      if (selectedYear !== "2026") {
        return false;
      }
    }

    if (selectedProject !== "all" && m.projectId !== selectedProject) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchRole = m.role.toLowerCase().includes(q);
      const matchProj = m.project?.title.toLowerCase().includes(q);
      const matchTags = (m.tags || "").toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchProj && !matchTags) return false;
    }

    return true;
  });

  // 12 items per page pagination
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedProject, selectedYear]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = useMemo(() => {
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, startIndex]);

  return (
    <div className="space-y-6">
      {/* Top Filter and Add Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3.5 sm:p-4 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member, role, skill tag, or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Project Dropdown Filter */}
          <div className="w-full sm:w-56">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
            >
              <option value="all">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.order <= 10 ? `Group ${p.order}: ` : "Individual: "}
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Cohort Year Dropdown Filter */}
          <div className="w-full sm:w-44">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
            >
              <option value="all">All Cohort Years</option>
              <option value="2026">Cohort 2026 (Current)</option>
              <option value="2027">Cohort 2027 (Upcoming)</option>
              <option value="2028">Cohort 2028 (Upcoming)</option>
            </select>
          </div>
        </div>

        {/* Add Member Button */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project Member</span>
        </button>
      </div>

      {/* Members Grid (9 items per page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedMembers.map((member) => {
          const hasSocials =
            Boolean(member.facebook) ||
            Boolean(member.github) ||
            Boolean(member.email) ||
            Boolean(member.linkedin);

          return (
            <div
              key={member.id}
              className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all relative group"
            >
              <div>
                {/* Header: Project Badge & Active status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-900 text-[10px] font-bold text-[#0875D1] dark:text-sky-300 truncate max-w-[200px]">
                    <FolderGit2 className="w-3 h-3 shrink-0" />
                    {member.project?.title || "Unassigned Project"}
                  </span>

                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      member.isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {member.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Profile row */}
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-muted border border-border shrink-0 relative">
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-muted-foreground bg-muted">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground text-sm truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#0875D1] dark:text-sky-400 truncate">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {member.department}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {member.tags && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {member.tags.split(",").map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bio snippet */}
                {member.bio && (
                  <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Bottom: 4 Social Media Icons (Facebook, GitHub, Gmail, LinkedIn) + Action buttons */}
              <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between gap-2">
                {/* 4 Social Media Icons with active/sample states */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Facebook */}
                  {member.facebook ? (
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1877F2] hover:bg-blue-100 transition shadow-2xs"
                      title={`Facebook: ${member.facebook}`}
                    >
                      <FacebookIcon className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span
                      className="p-1.5 rounded-lg bg-muted text-muted-foreground/35 cursor-not-allowed opacity-35"
                      title="Facebook (Not added)"
                    >
                      <FacebookIcon className="w-3.5 h-3.5" />
                    </span>
                  )}

                  {/* GitHub */}
                  {member.github ? (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-muted text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 transition shadow-2xs"
                      title={`GitHub: ${member.github}`}
                    >
                      <GitHubIcon className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span
                      className="p-1.5 rounded-lg bg-muted text-muted-foreground/35 cursor-not-allowed opacity-35"
                      title="GitHub (Not added)"
                    >
                      <GitHubIcon className="w-3.5 h-3.5" />
                    </span>
                  )}

                  {/* Gmail */}
                  {member.email ? (
                    <a
                      href={member.email.startsWith("mailto:") ? member.email : `mailto:${member.email}`}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-[#EA4335] hover:bg-red-100 transition shadow-2xs"
                      title={`Gmail: ${member.email}`}
                    >
                      <GmailIcon className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span
                      className="p-1.5 rounded-lg bg-muted text-muted-foreground/35 cursor-not-allowed opacity-35"
                      title="Gmail (Not added)"
                    >
                      <GmailIcon className="w-3.5 h-3.5" />
                    </span>
                  )}

                  {/* LinkedIn */}
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0A66C2] hover:bg-blue-100 transition shadow-2xs"
                      title={`LinkedIn: ${member.linkedin}`}
                    >
                      <LinkedInIcon className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span
                      className="p-1.5 rounded-lg bg-muted text-muted-foreground/35 cursor-not-allowed opacity-35"
                      title="LinkedIn (Not added)"
                    >
                      <LinkedInIcon className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Edit / Delete Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
                    title="Edit Member Information & Socials"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(member.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/60 text-muted-foreground hover:text-red-600 transition"
                    title="Delete Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Numbers Below - Displayed when list reaches 9 (more than 9 items) */}
      {filtered.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 bg-card border border-border p-3.5 sm:p-4 rounded-2xl shadow-xs">
          <div className="text-xs text-muted-foreground">
            Showing <span className="font-bold text-foreground">{startIndex + 1}</span> to{" "}
            <span className="font-bold text-foreground">
              {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}
            </span>{" "}
            of <span className="font-bold text-foreground">{filtered.length}</span> members
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* Previous Button */}
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted disabled:opacity-35 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Page Numbers */}
            {getPageNumbers(safeCurrentPage, totalPages).map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-muted-foreground select-none">
                  …
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  type="button"
                  onClick={() => {
                    setCurrentPage(p as number);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={cn(
                    "w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center",
                    safeCurrentPage === p
                      ? "bg-[#0875D1] text-white shadow-xs"
                      : "border border-border hover:bg-muted text-foreground"
                  )}
                >
                  {p}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              type="button"
              disabled={safeCurrentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted disabled:opacity-35 disabled:cursor-not-allowed transition"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
          <User className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-semibold text-foreground text-sm">
            {selectedYear === "2027" || selectedYear === "2028"
              ? `No members registered for Cohort ${selectedYear} yet`
              : "No project members found"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedYear === "2027" || selectedYear === "2028"
              ? "Student innovator admissions for upcoming cohorts will appear here once registered."
              : "Try adjusting your search query, project filter, or cohort year."}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-foreground">Delete Project Member?</h3>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to remove this member? This will also update the project team list.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER DRAWER (SLIDER PANEL) - Close button NEVER disappears */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-over Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
            <div className="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
              {/* STICKY TOP HEADER - Close button is ALWAYS visible */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-border bg-card/95 backdrop-blur-xs sticky top-0 z-20 shrink-0">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    {editingMember ? "Edit Project Member" : "Add New Project Member"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Personal details, assignment, and social media handles.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition shrink-0"
                  title="Close Slider"
                  aria-label="Close Slider"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* SCROLLABLE FORM BODY */}
              <form
                id="project-member-form"
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto p-6 space-y-5"
              >
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Abdi Najiib Artan Osman"
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Role / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Lead Full-Stack Engineer"
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                    />
                  </div>
                </div>

                {/* Project Assignment & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Assigned Project *
                    </label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                    >
                      <option value="">-- No Project Assigned --</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.order <= 10 ? `Group ${p.order}: ` : "Individual: "}
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Faculty of Computer Science & IT"
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                    />
                  </div>
                </div>

                {/* Avatar Upload / Choice */}
                <div>
                  <FileUploadChoice
                    label="Profile Photo / Avatar"
                    value={formData.avatar}
                    onChange={(url) => setFormData({ ...formData, avatar: url })}
                    fileType="image"
                    folder="avatars"
                    placeholder="https://images.unsplash.com/... or upload photo"
                    helperText="Upload student headshot or paste photo link (recommended: square image)"
                  />
                </div>

                {/* Skills / Tags & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Skills / Tags (Comma-Separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g. Next.js, Arduino, UI/UX, C++, FastApi"
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Biography / Summary
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Short bio or technical contribution to the project..."
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                  />
                </div>

                {/* ONLY 4 SOCIAL MEDIA PROFILES: Facebook, GitHub, Gmail, LinkedIn */}
                <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0875D1]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Social Media Profiles & Contact
                    </h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Provide their profile links. If left empty, a placeholder icon will be shown on cards.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {/* 1. Facebook */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-1">
                        <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />
                        <span>Facebook Profile URL</span>
                      </label>
                      <input
                        type="url"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        placeholder="https://facebook.com/username"
                        className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                      />
                    </div>

                    {/* 2. GitHub */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-1">
                        <GitHubIcon className="w-3.5 h-3.5 text-foreground" />
                        <span>GitHub Profile URL</span>
                      </label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        placeholder="https://github.com/username"
                        className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                      />
                    </div>

                    {/* 3. Gmail / Email */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-1">
                        <GmailIcon className="w-3.5 h-3.5 text-[#EA4335]" />
                        <span>Gmail / Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@gmail.com"
                        className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                      />
                    </div>

                    {/* 4. LinkedIn */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-1">
                        <LinkedInIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                        <span>LinkedIn Profile URL</span>
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-border text-[#0875D1] focus:ring-[#0875D1]"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-foreground cursor-pointer">
                    Active (visible on the public project members directory)
                  </label>
                </div>
              </form>

              {/* STICKY BOTTOM FOOTER - Always visible */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-card/95 backdrop-blur-xs sticky bottom-0 z-20 shrink-0">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="project-member-form"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white text-xs font-bold transition shadow-xs disabled:opacity-60"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingMember ? "Save Changes" : "Create Member"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
