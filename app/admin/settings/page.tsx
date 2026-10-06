import React from "react";
import { SettingService } from "@/services/settings/setting.service";
import { SettingsManager } from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await SettingService.getAll();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System & Institutional Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure organization identity, campus contacts, social channels, and system parameters.
        </p>
      </div>

      <SettingsManager initialSettings={settings} />
    </div>
  );
}
