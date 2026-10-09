/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React from "react";
import { requireAuth } from "@/lib/permissions/roles";
import { KpiRow } from "@/components/admin/KpiRow";
import { SubmissionService } from "@/services/submissions/submission.service";
import { SubmissionManager } from "@/components/admin/SubmissionManager";

export const dynamic = "force-dynamic";

export default async function StaffSubmissionsPage() {
  await requireAuth(null, "submissions:read");
  const submissions = await SubmissionService.getAllAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Innovation Proposals CMS
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review, evaluate, and admit incoming student technology prototypes into the JANIC Innovation Hub.
        </p>
      </div>

      <KpiRow items={[
        { title: "Total", value: submissions.length, sub: "all submissions" },
        { title: "Pending", value: submissions.filter((s) => s.status === "PENDING").length, sub: "awaiting review" },
        { title: "Approved", value: submissions.filter((s) => s.status === "APPROVED").length, sub: "admitted" },
        { title: "Rejected", value: submissions.filter((s) => s.status === "REJECTED").length, sub: "declined" },
      ]} />

      <SubmissionManager initialSubmissions={submissions as any} />
    </div>
  );
}
