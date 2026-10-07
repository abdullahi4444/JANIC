"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle, Loader2, ShieldCheck } from "lucide-react";

interface SettingItem {
  id: string;
  key: string;
  value: string;
  group: string;
}

const CAPABILITIES = [
  "manage_users",
  "manage_settings",
  "edit_content",
  "publish_content",
  "delete_content",
  "review_submissions",
  "manage_media",
  "manage_team",
];

const DEFAULTS: Record<string, string[]> = {
  ADMIN: [...CAPABILITIES],
  EDITOR: ["edit_content", "publish_content", "review_submissions", "manage_media"],
  STAFF: ["review_submissions"],
};

export function PermissionsMatrix({ settings }: { settings: SettingItem[] }) {
  const router = useRouter();
  const raw = settings.find((s) => s.key === "role_permissions")?.value;

  const [matrix, setMatrix] = useState<Record<string, string[]>>(() => {
    try {
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.ADMIN && parsed.EDITOR && parsed.STAFF) return parsed;
      }
    } catch {
      // fall through
    }
    return DEFAULTS;
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (role: string, cap: string) => {
    setMatrix((prev) => {
      const has = prev[role].includes(cap);
      return {
        ...prev,
        [role]: has ? prev[role].filter((c) => c !== cap) : [...prev[role], cap],
      };
    });
    setSaved(false);
  };

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [{ key: "role_permissions", value: JSON.stringify(matrix), group: "permissions" }],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save");
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving permissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-border/80 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <ShieldCheck className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold text-foreground">Role Permissions Matrix</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Controls which roles can perform each capability. Enforced on settings and user-management APIs.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4 font-semibold text-foreground">Capability</th>
              {Object.keys(matrix).map((role) => (
                <th key={role} className="text-center py-2 px-2 font-semibold text-foreground">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAPABILITIES.map((cap) => (
              <tr key={cap} className="border-t border-border">
                <td className="py-2 pr-4 font-mono text-[11px] text-muted-foreground">{cap}</td>
                {Object.keys(matrix).map((role) => (
                  <td key={role} className="text-center py-2 px-2">
                    <input
                      type="checkbox"
                      checked={matrix[role].includes(cap)}
                      onChange={() => toggle(role, cap)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle className="w-4 h-4" /> Saved!
          </span>
        )}
        <button
          type="button"
          onClick={save}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Permissions
        </button>
      </div>
    </div>
  );
}
