import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-1.5 text-[12px] sm:text-[13px] text-slate-400 dark:text-slate-500" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-[#0875D1] dark:hover:text-sky-300 transition flex items-center gap-1 font-medium">
        <Home className="w-3 h-3" aria-hidden="true" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" aria-hidden="true" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#0875D1] dark:hover:text-sky-300 transition font-medium text-slate-500 dark:text-slate-400">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#08245C] dark:text-slate-100 font-semibold truncate max-w-xs">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
