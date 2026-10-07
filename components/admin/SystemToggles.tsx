"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle, Loader2, ToggleLeft, ToggleRight, Settings2 } from "lucide-react";

interface SettingItem {
  id: string;
  key: string;
  value: string;
  group: string;
}

const TOGGLES: { key: string; label: string; description: string }[] = [
  { key: "maintenance_mode", label: "Maintenance Mode", description: "Show a maintenance page to all public visitors." },
  { key: "allow_registrations", label: "Allow Registrations", description: "Allow new users to create staff accounts publicly." },
  { key: "allow_submissions", label: "Allow Innovation Submissions", description: "Accept new innovation submissions from students." },
  { key: "allow_contact_form", label: "Allow Contact Form", description: "Accept messages from the public contact form." },
];

export function SystemToggles({ settings }: { settings: SettingItem[] }) {
  const router = useRouter();
  const map = settings.reduce<Record<string, string>>((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const t of TOGGLES) init[t.key] = map[t.key] === "true" ? "true" : "false";
    init["featured_count"] = map["featured_count"] || "3";
    return init;
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (key: string) => {
    setValues((prev) => ({ ...prev, [key]: prev[key] === "true" ? "false" : "true" }));
    setSaved(false);
  };

  const save = async () => {
    setLoading(true);
    try {
      const payload = Object.entries(values).map(([key, value]) => ({ key, value, group: "system" }));
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save");
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-border/80 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Settings2 className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold text-foreground">System Toggles & Limits</h3>
      </div>

      {TOGGLES.map((t) => {
        const on = values[t.key] === "true";
        return (
          <button
            type="button"
            key={t.key}
            onClick={() => toggle(t.key)}
            className="w-full flex items-center justify-between gap-4 text-left p-2 rounded-lg hover:bg-slate-50 transition"
          >
            <span>
              <span className="block text-sm font-semibold text-foreground">{t.label}</span>
              <span className="block text-xs text-muted-foreground">{t.description}</span>
            </span>
            {on ? (
              <ToggleRight className="w-8 h-8 text-blue-600 shrink-0" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-slate-300 shrink-0" />
            )}
          </button>
        );
      })}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">Featured items per section</label>
        <input
          type="number"
          min={1}
          max={24}
          value={values["featured_count"]}
          onChange={(e) => {
            setValues((prev) => ({ ...prev, featured_count: e.target.value }));
            setSaved(false);
          }}
          className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
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
          Save Toggles
        </button>
      </div>
    </div>
  );
}
