import React from "react";
import { ResearchService } from "@/services/research/research.service";
import { ResearchManager } from "@/components/admin/ResearchManager";

export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  const papers = await ResearchService.getAllAdmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Research Papers CMS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage peer-reviewed publications, student research papers, and technical manuscripts.
        </p>
      </div>

      <ResearchManager initialPapers={papers as any} />
    </div>
  );
}
