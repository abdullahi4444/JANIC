import React from "react";
import { SubmissionService } from "@/services/submissions/submission.service";
import { SubmissionManager } from "@/components/admin/SubmissionManager";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const submissions = await SubmissionService.getAllAdmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Innovation Proposals CMS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, evaluate, and admit incoming student technology prototypes into the JANIC Innovation Hub.
        </p>
      </div>

      <SubmissionManager initialSubmissions={submissions as any} />
    </div>
  );
}
