"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Slice {
  name: string;
  value: number;
}

export function PaymentMethodChart({ data }: { data: Slice[] }) {
  return (
    <div className="h-32 w-full lg:h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
            {data.map((_, index) => (
              <Cell key={index} fill="var(--primary)" opacity={1 - index * 0.2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
