"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

interface Point {
  name: string;
  created: number;
  published: number;
}

const periods = ["7 Days", "30 Days", "3 Months", "1 Year"] as const;

export function ProjectActivity({ daily, monthly }: { daily: Point[]; monthly: Point[] }) {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30 Days");
  const data =
    period === "7 Days"
      ? daily.slice(-7)
      : period === "30 Days"
      ? daily
      : period === "3 Months"
      ? monthly.slice(-3)
      : monthly;

  return (
    <div>
      <div className="flex items-center gap-1 mb-3">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition",
              period === p
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="pa-created" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pa-published" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} fill="url(#pa-created)" name="Created" />
            <Area type="monotone" dataKey="published" stroke="#10b981" strokeWidth={2} fill="url(#pa-published)" name="Published" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
