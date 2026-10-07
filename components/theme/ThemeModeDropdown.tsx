"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeModeDropdownProps {
  className?: string;
}

type ThemeValue = "light" | "dark" | "system";

export function ThemeModeDropdown({ className }: ThemeModeDropdownProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const currentTheme = (theme ?? "system") as ThemeValue;

  // Cycle: Light -> Dark -> System -> Light
  const handleToggle = () => {
    if (currentTheme === "light") {
      setTheme("dark");
    } else if (currentTheme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeDetails = (val: ThemeValue) => {
    switch (val) {
      case "light":
        return {
          label: "Theme: Light (Click for Dark)",
          nextMode: "Dark mode",
          Icon: Sun,
          iconClass: "text-amber-500",
          ringHover: "hover:border-amber-400/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
          dotClass: "bg-amber-500",
        };
      case "dark":
        return {
          label: "Theme: Dark (Click for System)",
          nextMode: "System theme",
          Icon: Moon,
          iconClass: "text-sky-400",
          ringHover: "hover:border-sky-400/50 hover:bg-sky-50/50 dark:hover:bg-sky-950/20",
          dotClass: "bg-sky-400",
        };
      case "system":
      default:
        return {
          label: "Theme: System (Click for Light)",
          nextMode: "Light mode",
          Icon: Monitor,
          iconClass: "text-[#0875D1] dark:text-sky-400",
          ringHover: "hover:border-blue-400/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
          dotClass: "bg-blue-500",
        };
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Theme mode"
        className={cn(
          "relative inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 shadow-sm",
          className
        )}
      >
        <Sun className="w-4 h-4 xl:w-[18px] xl:h-[18px]" />
      </button>
    );
  }

  const { label, Icon, iconClass, ringHover, dotClass } = getThemeDetails(currentTheme);

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={label}
      aria-label={label}
      className={cn(
        "group relative inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_18px_-10px_rgba(8,36,92,0.12)] transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0875D1]",
        ringHover,
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={currentTheme}
          initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center justify-center"
        >
          <Icon className={cn("w-4 h-4 xl:w-[18px] xl:h-[18px] transition-colors stroke-[2.25]", iconClass)} />
        </motion.span>
      </AnimatePresence>

      {/* Subtle indicator dot on the corner */}
      <span
        className={cn(
          "absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ring-2 ring-white dark:ring-slate-900 transition-colors",
          dotClass
        )}
      />
    </button>
  );
}
