"use client";

import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

export function Sparkline({ data }: { data: number[] }) {
  const points = data.map((value, i) => ({ i, value }));
  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${data.length}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={1.5}
            fill={`url(#spark-${data.length})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
