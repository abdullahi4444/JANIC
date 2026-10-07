/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React from "react";
import { KpiRow } from "@/components/admin/KpiRow";
import { ResearchService } from "@/services/research/research.service";
import { ResearchManager } from "@/components/admin/ResearchManager";

export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  const papers = await ResearchService.getAllAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Research Papers CMS
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage peer-reviewed publications, student research papers, and technical manuscripts.
        </p>
      </div>

      <KpiRow items={[
      { title: "Papers", value: papers.length, sub: "total publications" },
      { title: "Published", value: papers.filter((p) => p.status === "PUBLISHED").length, sub: "in library" },
      { title: "Drafts", value: papers.filter((p) => p.status === "DRAFT").length, sub: "under review" },
      { title: "Categories", value: new Set(papers.map((p) => p.category)).size, sub: "research areas" },
    ]} />

      <ResearchManager initialPapers={papers as any} />
    </div>
  );
}
