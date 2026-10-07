/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React from "react";
import { KpiRow } from "@/components/admin/KpiRow";
import { PartnershipService } from "@/services/partnerships/partnership.service";
import { PartnershipManager } from "@/components/admin/PartnershipManager";

export const dynamic = "force-dynamic";

export default async function AdminPartnershipsPage() {
  const inquiries = await PartnershipService.getAllAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Partnership Inquiries CMS
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review external collaboration proposals from universities, technology companies, and NGOs.
        </p>
      </div>

      <KpiRow items={[
      { title: "Total", value: inquiries.length, sub: "all inquiries" },
      { title: "New", value: inquiries.filter((p) => p.status === "NEW").length, sub: "unreviewed" },
      { title: "In Progress", value: inquiries.filter((p) => p.status === "IN_PROGRESS").length, sub: "active" },
      { title: "Closed", value: inquiries.filter((p) => p.status === "CLOSED").length, sub: "completed" },
    ]} />

      <PartnershipManager initialPartnerships={inquiries as any} />
    </div>
  );
}
