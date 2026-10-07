"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeModeDropdownProps {
  className?: string;
}

const THEME_OPTIONS = [
  {
    value: "light",
    label: "Light mode",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Dark mode",
    Icon: Moon,
  },
  {
    value: "system",
    label: "System theme",
    Icon: Monitor,
  },
] as const;

type ThemeValue = (typeof THEME_OPTIONS)[number]["value"];

function ThemeIconSegment({
  value,
  activeValue,
  onSelect,
  Icon,
  label,
}: {
  value: ThemeValue;
  activeValue: ThemeValue;
  onSelect: (v: ThemeValue) => void;
  Icon: typeof Sun;
  label: string;
}) {
  const isActive = activeValue === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      aria-label={label}
      title={label}
      onClick={() => onSelect(value)}
      className={cn(
        "relative inline-flex items-center justify-center w-8 h-8 xl:w-9 xl:h-9 rounded-full transition-all duration-300",
        isActive
          ? "bg-gradient-to-br from-[#0875D1] to-[#08245C] text-white shadow-[0_8px_20px_-10px_rgba(8,117,209,0.7)] ring-1 ring-[#0875D1]/20"
          : "text-slate-500 hover:text-[#0875D1] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 xl:w-[18px] xl:h-[18px] transition-transform duration-300",
          isActive ? "scale-110" : ""
        )}
        strokeWidth={isActive ? 2.25 : 2}
      />
    </button>
  );
}

export function ThemeModeDropdown({ className }: ThemeModeDropdownProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const currentTheme = (theme ?? "system") as ThemeValue;

  if (!mounted) {
    return (
      <div
        role="radiogroup"
        aria-label="Theme mode"
        aria-hidden="true"
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-950",
          className
        )}
      >
        {THEME_OPTIONS.map(({ value, Icon, label }) => (
          <button
            key={value}
            type="button"
            disabled
            aria-label={label}
            aria-hidden="true"
            tabIndex={-1}
            className="inline-flex items-center justify-center w-8 h-8 xl:w-9 xl:h-9 rounded-full text-slate-400 dark:text-slate-600"
          >
            <Icon className="w-4 h-4 xl:w-[18px] xl:h-[18px]" />
          </button>
        ))}
      </div>
    );
  }

  const handleSelect = (v: ThemeValue) => {
    setTheme(v);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Theme mode"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-gradient-to-r from-white via-slate-50 to-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_18px_-10px_rgba(8,36,92,0.12)] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_10px_28px_-10px_rgba(8,36,92,0.2)] dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:hover:border-slate-700",
        className
      )}
    >
      {THEME_OPTIONS.map(({ value, Icon, label }) => (
        <ThemeIconSegment
          key={value}
          value={value}
          activeValue={currentTheme}
          onSelect={handleSelect}
          Icon={Icon}
          label={label}
        />
      ))}
    </div>
  );
}
