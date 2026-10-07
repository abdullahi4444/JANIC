import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export interface KpiItem {
  title: string;
  value: number;
  sub: string;
}

export function KpiRow({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((i) => (
        <Card key={i.title}>
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {i.title}
            </span>
            <div className="mt-1.5 text-2xl font-bold text-foreground">{i.value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{i.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
