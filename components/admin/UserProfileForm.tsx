"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, User, Mail, Lock, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUploadChoice } from "./ImageUploadChoice";

interface UserProfileFormProps {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar: string | null;
    role: string;
  };
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar || "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDirectAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image file size exceeds 15MB limit");
      return;
    }

    setAvatarUploading(true);
    const toastId = toast.loading("Uploading avatar photo...");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "avatars");
      form.append("source", "user_profile");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload avatar");
      }

      const uploadedUrl = data.url || data.media?.url;
      if (!uploadedUrl) throw new Error("No URL returned from server");

      setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
      toast.success("Avatar image uploaded! Click 'Save Profile' to apply changes.", { id: toastId });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error uploading avatar", { id: toastId });
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          avatar: formData.avatar,
          ...(formData.password ? { password: formData.password } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" }));
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card text-foreground rounded-2xl border border-border shadow-sm p-6 space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-border">
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div
            className="relative group cursor-pointer"
            onClick={() => !avatarUploading && avatarInputRef.current?.click()}
            title="Click to upload a new avatar photo"
          >
            <Avatar className="w-24 h-24 ring-4 ring-primary/10 transition-transform group-hover:scale-105 shadow-md">
              <AvatarImage src={formData.avatar} alt={formData.name} className="object-cover" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-[#0875D1] to-[#08245C] text-white font-bold">
                {formData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className={`absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center text-white transition-opacity ${
              avatarUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}>
              {avatarUploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-semibold">Upload</span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={avatarUploading}
            onClick={() => avatarInputRef.current?.click()}
            className="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Camera className="w-3.5 h-3.5" />
            {avatarUploading ? "Uploading..." : "Upload Photo"}
          </button>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleDirectAvatarUpload}
          />
        </div>

        <div className="flex-1 w-full space-y-3">
          <ImageUploadChoice
            label="Avatar Image"
            value={formData.avatar}
            onChange={(url) => setFormData((prev) => ({ ...prev, avatar: url }))}
            folder="avatars"
            placeholder="https://example.com/avatar.png or upload an image file"
            source="user_profile"
          />

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">Account Role:</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-primary/15 text-primary">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full text-sm rounded-xl border border-input bg-background px-3.5 py-2.5 text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-primary transition outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Username
          </label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full text-sm rounded-xl border border-input bg-background px-3.5 py-2.5 text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-primary transition outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full text-sm rounded-xl border border-input bg-background px-3.5 py-2.5 text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-primary transition outline-none"
          />
        </div>

        <div className="sm:col-span-2 pt-4 border-t border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> New Password (Optional)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full text-sm rounded-xl border border-input bg-background px-3.5 py-2.5 text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-primary transition outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <button
          type="submit"
          disabled={loading || avatarUploading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Profile
        </button>
      </div>
    </form>
  );
}
