import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrainingService } from "@/services/training/training.service";
import { SectionHero } from "@/components/layout/SectionHero";
import { Clock, Calendar, MapPin, Award, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await TrainingService.getProgramBySlug(slug);
  if (!program) return { title: "Training Program Not Found | JANIC" };

  return {
    title: `${program.title} | JANIC`,
    description: program.summary,
  };
}

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await TrainingService.getProgramBySlug(slug);

  if (!program || program.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div>
      <SectionHero
        badge={program.category}
        title={program.title}
        description={program.summary}
        breadcrumbs={[
          { label: "Training", href: "/training" },
          { label: program.title },
        ]}
      />

      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Details (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {program.coverImage && (
                <div className="aspect-[16/9] relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
                  <Image
                    src={program.coverImage}
                    alt={program.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="text-2xl font-extrabold text-[#08245C]">
                  Program Overview & Objectives
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {program.description}
                </p>
              </div>

              {program.syllabus && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h2 className="text-2xl font-extrabold text-[#08245C]">
                    Curriculum & Learning Modules
                  </h2>
                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-xl border border-slate-100">
                    {program.syllabus}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-[#08245C]">Enrollment Information</h3>

                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#0875D1]" />
                    <span><strong>Duration:</strong> {program.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#0875D1]" />
                    <span><strong>Schedule:</strong> {program.schedule}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#0875D1]" />
                    <span><strong>Mode:</strong> {program.mode}</span>
                  </div>
                  {program.certification && (
                    <div className="flex items-center gap-3 text-emerald-700 font-semibold">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>{program.certification}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href={`/contact?subject=Enrollment%20Inquiry:%20${encodeURIComponent(program.title)}`}
                    className="w-full py-3 px-4 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    Inquire / Register for Cohort
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <Link
                href="/training"
                className="w-full py-3 px-4 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
