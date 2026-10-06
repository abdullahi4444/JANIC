"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle, Loader2, Globe, Mail, Phone, MapPin, Building, ShieldCheck } from "lucide-react";

interface SettingItem {
  id: string;
  key: string;
  value: string;
  group: string;
}

interface SettingsManagerProps {
  initialSettings: SettingItem[];
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Map settings into an accessible object
  const settingsMap = initialSettings.reduce<Record<string, string>>((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const [form, setForm] = useState({
    site_name: settingsMap["site_name"] || "Jazeera Nexus Innovation Center (JANIC)",
    site_tagline: settingsMap["site_tagline"] || "Innovating Technology. Empowering the Future.",
    contact_email: settingsMap["contact_email"] || "info@janic.edu.so",
    contact_phone: settingsMap["contact_phone"] || "+252 61 555 1234",
    campus_address: settingsMap["campus_address"] || "Jazeera University Main Campus, KM4, Mogadishu, Somalia",
    founded_date: settingsMap["founded_date"] || "October 25, 2021",
    linkedin_url: settingsMap["linkedin_url"] || "https://linkedin.com/school/jazeera-university",
    github_url: settingsMap["github_url"] || "https://github.com/janic-innovation",
    portal_notice: settingsMap["portal_notice"] || "Official Innovation Hub of the Faculty of Computer Science & IT",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const payload = Object.entries(form).map(([key, value]) => ({
        key,
        value,
        group:
          key.includes("email") || key.includes("phone") || key.includes("address")
            ? "contact"
            : key.includes("site") || key.includes("notice")
            ? "general"
            : "institutional",
      }));

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update settings");
      }

      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Save action floating or top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Institutional Configuration</h2>
            <p className="text-xs text-slate-500">
              Changes reflect dynamically across public headers, footers, and portals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fadeIn">
              <CheckCircle className="w-4 h-4" /> Changes Saved!
            </span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">General Identity</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Center Name</label>
            <input
              type="text"
              value={form.site_name}
              onChange={(e) => handleChange("site_name", e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Motto / Tagline</label>
            <input
              type="text"
              value={form.site_tagline}
              onChange={(e) => handleChange("site_tagline", e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Official Portal Subtitle</label>
            <input
              type="text"
              value={form.portal_notice}
              onChange={(e) => handleChange("portal_notice", e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Founded Date</label>
            <input
              type="text"
              value={form.founded_date}
              onChange={(e) => handleChange("founded_date", e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Institutional Contact & Location</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Primary Email
            </label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => handleChange("contact_email", e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Telephone / Helpline
            </label>
            <input
              type="text"
              value={form.contact_phone}
              onChange={(e) => handleChange("contact_phone", e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Campus Address
            </label>
            <textarea
              rows={3}
              value={form.campus_address}
              onChange={(e) => handleChange("campus_address", e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Official LinkedIn URL</label>
            <input
              type="url"
              value={form.linkedin_url}
              onChange={(e) => handleChange("linkedin_url", e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
