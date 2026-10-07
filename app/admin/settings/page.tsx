/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { KpiRow } from "@/components/admin/KpiRow";
import { SettingService } from "@/services/settings/setting.service";
import { SettingsManager } from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await SettingService.getAll();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          System & Institutional Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Configure organization identity, campus contacts, social channels, and system parameters.
        </p>
      </div>

      <KpiRow items={[
      { title: "Settings", value: settings.length, sub: "configured" },
      { title: "Groups", value: new Set(settings.map((s) => s.group)).size, sub: "categories" },
      { title: "General", value: settings.filter((s) => s.group === "general").length, sub: "core options" },
      { title: "Custom", value: settings.filter((s) => s.group !== "general").length, sub: "extensions" },
    ]} />

      <SettingsManager initialSettings={settings} />
    </div>
  );
}
