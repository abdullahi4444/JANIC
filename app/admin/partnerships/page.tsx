import React from "react";
import { PartnershipService } from "@/services/partnerships/partnership.service";
import { PartnershipManager } from "@/components/admin/PartnershipManager";

export const dynamic = "force-dynamic";

export default async function AdminPartnershipsPage() {
  const inquiries = await PartnershipService.getAllAdmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Partnership Inquiries CMS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review external collaboration proposals from universities, technology companies, and NGOs.
        </p>
      </div>

      <PartnershipManager initialPartnerships={inquiries as any} />
    </div>
  );
}
