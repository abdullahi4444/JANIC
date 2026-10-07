"use client";

import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

export function ExerciseChart({ value }: { value: number }) {
  const data = [{ name: "Progress", value, fill: "var(--primary)" }];
  return (
    <div className="h-[100px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={10}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={5} fill="var(--primary)" angleAxisId={0} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
