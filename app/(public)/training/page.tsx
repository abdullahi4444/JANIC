import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { TrainingService } from "@/services/training/training.service";
import { GraduationCap, Clock, Calendar, CheckCircle2, Award, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Training & Certification",
  description:
    "Hands-on ICT training, coding bootcamps, and internationally recognized professional certifications at JANIC, Jazeera University.",
};

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const programs = await TrainingService.getPublishedPrograms();

  const tracks = [
    "Programming",
    "Web Development",
    "Software Engineering",
    "Networking",
    "Cybersecurity",
    "Cloud Computing",
    "Database Technology",
    "Digital Design",
    "Emerging Technologies",
  ];

  return (
    <div>
      <SectionHero
        badge="Learn • Build • Certify"
        title="Professional ICT Training & Certifications"
        description="Equipping students, software engineers, and IT professionals with practical, industry-grade technical skills and globally recognized credentials."
        breadcrumbs={[{ label: "Training" }]}
      />

      {/* Focus Disciplines Bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Core Learning Disciplines
          </p>
          <div className="flex flex-wrap gap-2">
            {tracks.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-blue-50 hover:text-[#0875D1] transition cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section className="py-20 bg-slate-50 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1]">
              Available Programs
            </span>
            <h2 className="text-3xl font-extrabold text-[#08245C]">
              Current Training Cohorts
            </h2>
            <p className="text-slate-500 text-sm">
              Hands-on lab sessions, experienced industry instructors, and project-based assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1"
              >
                <div>
                  <div className="aspect-[16/9] relative bg-slate-100 overflow-hidden">
                    <Image
                      src={
                        program.coverImage ||
                        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#08245C]">
                      {program.level}
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[11px] font-bold text-[#0875D1] uppercase tracking-wider">
                      {program.category}
                    </span>
                    <h3 className="text-lg font-bold text-[#08245C] mt-1 mb-2 leading-snug">
                      {program.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {program.summary}
                    </p>

                    <div className="space-y-2 py-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#0875D1]" />
                        <span><strong>Duration:</strong> {program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#0875D1]" />
                        <span><strong>Schedule:</strong> {program.schedule}</span>
                      </div>
                      {program.certification && (
                        <div className="flex items-center gap-2 text-emerald-700 font-medium">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{program.certification}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/training/${program.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#08245C] hover:bg-[#061B40] text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                  >
                    View Curriculum & Enroll
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
