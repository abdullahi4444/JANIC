import { cache } from "react";
import { SettingService } from "@/services/settings/setting.service";

export const getSettingsMap = cache(async (): Promise<Record<string, string>> => {
  try {
    const settings = await SettingService.getAll();
    return settings.reduce<Record<string, string>>((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  } catch {
    return {};
  }
});

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const map = await getSettingsMap();
  return map[key] ?? fallback;
}

export async function isEnabled(key: string, fallback = false): Promise<boolean> {
  const value = await getSetting(key, fallback ? "true" : "false");
  return value === "true" || value === "1" || value === "yes";
}
