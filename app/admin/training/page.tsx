import React from "react";
import { TrainingService } from "@/services/training/training.service";
import { TrainingManager } from "@/components/admin/TrainingManager";

export const dynamic = "force-dynamic";

export default async function AdminTrainingPage() {
  const programs = await TrainingService.getAllAdmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Training & Certifications CMS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage hands-on ICT programs, syllabi, class schedules, and credentials.
        </p>
      </div>

      <TrainingManager initialPrograms={programs as any} />
    </div>
  );
}
