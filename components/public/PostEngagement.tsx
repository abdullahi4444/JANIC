"use client";

import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Loader2,
  Pencil,
  Trash2,
  Check,
  X,
  ShieldCheck,
  AlertCircle,
  SmilePlus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Comment {
  id: string;
  name: string;
  message: string;
  createdAt: string | Date;
  reactions?: Record<string, number>;
  userReactions?: string[];
}

const AVAILABLE_REACTIONS = [
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "👏", label: "Clap" },
  { emoji: "💡", label: "Insightful" },
  { emoji: "🎉", label: "Celebrate" },
];

interface CurrentUser {
  id: string;
  name: string;
  username?: string;
  role: string;
}

export function PostEngagement({ mediaId, dark = false }: { mediaId: string; dark?: boolean }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reaction picker state
  const [pickerCommentId, setPickerCommentId] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${mediaId}/like`)
      .then((r) => r.json())
      .then((d) => {
        setCount(d.count ?? 0);
        setLiked(!!d.liked);
      })
      .catch(() => {});
  }, [mediaId]);

  const loadComments = () => {
    setLoading(true);
    fetch(`/api/posts/${mediaId}/comments`)
      .then((r) => r.json())
      .then((d) => {
        setComments(d.comments ?? []);
        if (d.currentUser) {
          setCurrentUser(d.currentUser);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const toggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next) {
      loadComments();
    }
  };

  const toggleLike = async () => {
    setError(null);
    const res = await fetch(`/api/posts/${mediaId}/like`, { method: "POST" });
    const d = await res.json();
    if (res.status === 401) {
      setError("Please sign in to like posts.");
      toast.info("Please sign in to like posts");
      return;
    }
    if (d.success) {
      setLiked(d.liked);
      setCount(d.count);
    }
  };

  // TOGGLE COMMENT REACTION
  const handleToggleReaction = async (commentId: string, emoji: string) => {
    setPickerCommentId(null);

    // Optimistic state update
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const currentReactions = { ...(c.reactions || {}) };
        const currentUserReactions = [...(c.userReactions || [])];
        const hasReacted = currentUserReactions.includes(emoji);

        if (hasReacted) {
          currentReactions[emoji] = Math.max(0, (currentReactions[emoji] || 1) - 1);
          if (currentReactions[emoji] === 0) delete currentReactions[emoji];
          const nextUser = currentUserReactions.filter((e) => e !== emoji);
          return { ...c, reactions: currentReactions, userReactions: nextUser };
        } else {
          currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
          currentUserReactions.push(emoji);
          return { ...c, reactions: currentReactions, userReactions: currentUserReactions };
        }
      })
    );

    try {
      const res = await fetch(`/api/posts/${mediaId}/comments/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, emoji }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, reactions: data.reactions, userReactions: data.userReactions }
              : c
          )
        );
      }
    } catch {
      loadComments();
    }
  };

  // CREATE COMMENT
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/${mediaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const d = await res.json();
      if (res.status === 401) {
        setError("Please sign in to comment.");
        toast.info("Please sign in to comment");
        setSending(false);
        return;
      }
      if (d.success) {
        setComments((prev) => [d.comment, ...prev]);
        setMessage("");
        toast.success("Comment posted!");
      } else {
        toast.error(d.message || "Could not post comment");
      }
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSending(false);
    }
  };

  // START EDITING
  const handleStartEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditingText(c.message);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // SAVE EDITED COMMENT
  const handleSaveEdit = async (commentId: string) => {
    if (!editingText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/posts/${mediaId}/comments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, message: editingText }),
      });
      const d = await res.json();

      if (!res.ok || !d.success) {
        throw new Error(d.message || "Failed to update comment");
      }

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, message: d.comment.message } : c))
      );
      setEditingId(null);
      setEditingText("");
      toast.success("Comment updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error updating comment");
    } finally {
      setSavingEdit(false);
    }
  };

  // DELETE COMMENT
  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/posts/${mediaId}/comments?commentId=${commentId}`, {
        method: "DELETE",
      });
      const d = await res.json();

      if (!res.ok || !d.success) {
        throw new Error(d.message || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error deleting comment");
    } finally {
      setDeletingId(null);
    }
  };

  const canModify = (c: Comment) => {
    if (!currentUser) return false;
    const isAuthor =
      currentUser.name.toLowerCase() === c.name.toLowerCase() ||
      Boolean(currentUser.username && currentUser.username.toLowerCase() === c.name.toLowerCase()) ||
      (currentUser.name.toLowerCase().includes("jamiila") && c.name.toLowerCase().includes("jamiila"));
    const isStaff = currentUser.role === "ADMIN" || currentUser.role === "EDITOR";
    return isAuthor || isStaff;
  };

  const textColor = dark ? "text-white/80" : "text-slate-600 dark:text-slate-300";

  return (
    <div className={`space-y-2.5 ${dark ? "" : "pt-1"}`}>
      {/* Alert error */}
      {error && (
        <div className={`text-[11px] font-semibold flex items-center gap-1.5 p-2 rounded-lg ${
          dark ? "bg-amber-950/40 text-amber-300 border border-amber-800/50" : "bg-amber-50 text-amber-800 border border-amber-200"
        }`}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
          <a href="/login" className="underline font-bold ml-auto hover:text-[#0875D1]">
            Sign in
          </a>
        </div>
      )}

      {/* Engagement Counters */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-xs font-semibold transition ${
            liked ? "text-red-500" : textColor
          } hover:scale-105`}
          aria-label="Like"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
          <span>
            {count} Like{count === 1 ? "" : "s"}
          </span>
        </button>

        <button
          onClick={toggleComments}
          className={`flex items-center gap-1.5 text-xs font-semibold ${textColor} hover:text-[#0875D1] transition`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>
            {comments.length > 0 ? `${comments.length} Comments` : "Comments"}
          </span>
        </button>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div
          className={`rounded-2xl p-4 space-y-3.5 max-h-80 overflow-y-auto border transition-all ${
            dark
              ? "bg-slate-900/90 border-slate-800 text-slate-100"
              : "bg-slate-50/90 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border/50 pb-2 text-xs font-bold text-foreground">
            <span>Community Conversation ({comments.length})</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#0875D1]" />
            </div>
          ) : comments.length === 0 ? (
            <p className={`text-xs text-center py-4 ${dark ? "text-white/50" : "text-slate-400"}`}>
              No comments yet. Share your thoughts below!
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => {
                const isEditing = editingId === c.id;
                const isDeleting = deletingId === c.id;

                return (
                  <div
                    key={c.id}
                    className={`p-3 rounded-xl border transition-all ${
                      dark
                        ? "bg-slate-800/60 border-slate-700/60"
                        : "bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 shadow-sm"
                    } ${isDeleting ? "opacity-40" : ""}`}
                  >
                    {/* Comment Header: Author & Date & Action buttons */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {(() => {
                          const isJamiila =
                            c.name.toLowerCase().includes("jamiila") ||
                            c.name.toLowerCase() === "jamiila";
                          return (
                            <div className="flex items-center gap-1.5 min-w-0 flex-nowrap">
                              <span className={`text-xs font-bold ${dark ? "text-sky-300" : "text-[#08245C] dark:text-sky-300"} shrink-0`}>
                                {isJamiila ? "@jamiila" : c.name}
                              </span>
                              {isJamiila ? (
                                <span
                                  title="Dean of Faculty of Computer Science & IT • System Administrator"
                                  className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#08245C] via-[#0855A5] to-[#0875D1] text-white text-[9px] font-extrabold tracking-wider uppercase inline-flex items-center gap-1 shadow-xs shrink-0"
                                >
                                  <ShieldCheck className="w-2.5 h-2.5 text-sky-300" />
                                  <span>Dean of CS & IT</span>
                                </span>
                              ) : null}
                              {!isJamiila && currentUser && c.name.toLowerCase() === currentUser.name.toLowerCase() && (
                                currentUser.role === "ADMIN" ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase bg-blue-600 text-white shrink-0">
                                    Admin
                                  </span>
                                ) : currentUser.role === "EDITOR" ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase bg-purple-600 text-white shrink-0">
                                    Editor
                                  </span>
                                ) : null
                              )}
                              <span className={`text-[10px] ${dark ? "text-white/40" : "text-slate-400"} shrink-0 ml-1`}>
                                • {formatDate(c.createdAt)}
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Edit / Delete Buttons if authorized */}
                      {canModify(c) && !isEditing && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEdit(c)}
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            title="Edit comment"
                            aria-label="Edit comment"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={isDeleting}
                            className="p-1 rounded-md text-slate-400 hover:text-red-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50"
                            title="Delete comment"
                            aria-label="Delete comment"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3 h-3 animate-spin text-red-500" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Comment Body or Inline Editor */}
                    {isEditing ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={2}
                          className={`w-full rounded-lg p-2 text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none ${
                            dark
                              ? "bg-slate-900 border-slate-700 text-white"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                          }`}
                        />
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={handleCancelEdit}
                            disabled={savingEdit}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(c.id)}
                            disabled={savingEdit}
                            className="px-3 py-1 rounded-md bg-[#0875D1] hover:bg-[#065ea8] text-white text-xs font-semibold shadow-sm transition flex items-center gap-1 disabled:opacity-50"
                          >
                            {savingEdit ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className={`text-xs leading-relaxed break-words ${dark ? "text-white/80" : "text-slate-700 dark:text-slate-200"}`}>
                        {c.message}
                      </p>
                    )}

                    {/* Comment Reactions */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-2 mt-2 border-t border-slate-100 dark:border-slate-700/60">
                      {/* Active reaction pills */}
                      {Object.entries(c.reactions || {}).map(([emoji, rCount]) => {
                        if (rCount <= 0) return null;
                        const userReacted = (c.userReactions || []).includes(emoji);
                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleToggleReaction(c.id, emoji)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all select-none hover:scale-105 active:scale-95 ${
                              userReacted
                                ? "bg-[#0875D1]/15 text-[#0875D1] dark:text-sky-300 border border-[#0875D1]/40 shadow-xs"
                                : dark
                                ? "bg-slate-700/60 text-slate-300 border border-slate-600/50 hover:bg-slate-700"
                                : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80"
                            }`}
                            title={`Reacted with ${emoji} (${rCount}) - click to toggle`}
                          >
                            <span className="text-sm leading-none">{emoji}</span>
                            <span className="text-[11px] font-bold">{rCount}</span>
                          </button>
                        );
                      })}

                      {/* Add reaction trigger button with popover */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setPickerCommentId(pickerCommentId === c.id ? null : c.id)}
                          className={`p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center ${
                            pickerCommentId === c.id
                              ? "bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                              : ""
                          }`}
                          title="Add reaction"
                          aria-label="Add reaction"
                        >
                          <SmilePlus className="w-3.5 h-3.5" />
                        </button>

                        {/* Floating Emoji Picker Popover */}
                        {pickerCommentId === c.id && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => setPickerCommentId(null)}
                            />
                            <div
                              className={`absolute left-0 bottom-full mb-1.5 z-40 p-1 rounded-full shadow-xl border backdrop-blur-md flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150 ${
                                dark
                                  ? "bg-slate-900/95 border-slate-700 shadow-black/50"
                                  : "bg-white/95 border-slate-200 shadow-slate-400/30"
                              }`}
                            >
                              {AVAILABLE_REACTIONS.map((r) => {
                                const isSelected = (c.userReactions || []).includes(r.emoji);
                                return (
                                  <button
                                    key={r.emoji}
                                    type="button"
                                    onClick={() => handleToggleReaction(c.id, r.emoji)}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-base hover:scale-125 active:scale-95 transition-all ${
                                      isSelected
                                        ? "bg-blue-100 dark:bg-blue-900/60 ring-1 ring-blue-500"
                                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                                    title={r.label}
                                  >
                                    {r.emoji}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* New Comment Form */}
          <form onSubmit={send} className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={currentUser ? "Write a comment..." : "Sign in to join the conversation..."}
                disabled={!currentUser && !loading}
                className={`flex-1 rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition ${
                  dark
                    ? "bg-slate-800/80 border-slate-700 text-white placeholder:text-white/40"
                    : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400"
                }`}
              />
              <button
                disabled={sending || !message.trim()}
                type="submit"
                className="rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/10 disabled:opacity-40 transition"
              >
                {sending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Post</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
