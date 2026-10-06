import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { InnovationSubmissionForm } from "@/components/forms/InnovationSubmissionForm";
import { Sparkles, CheckCircle2, Lightbulb, Users, Rocket, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Submit Innovation Proposal",
  description:
    "Submit your technology prototype, robotics invention, or software idea to the JANIC Innovation Hub at Jazeera University.",
};

export default function SubmitInnovationPage() {
  const criteria = [
    {
      title: "Solves a Real-World Problem",
      desc: "Clear target audience in health, education, business, agriculture, or logistics.",
    },
    {
      title: "Functional Feasibility",
      desc: "Realistic engineering path utilizing software, embedded hardware, or AI.",
    },
    {
      title: "Dedicated Team",
      desc: "Committed students or interdisciplinary researchers willing to iterate.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="Call for Innovations"
        title="Submit Your Innovation"
        description="Whether you have an initial concept, a functional breadboard prototype, or an early software platform, JANIC provides the mentorship, lab tools, and launchpad to bring it to life."
        breadcrumbs={[{ label: "Submit Innovation" }]}
      />

      {/* 2. SUBMISSION BENTO CANVAS - FADE UP */}
      <section className="py-8 sm:py-14 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-blue-100/70 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Guidelines & Benefits (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white p-7 sm:p-8 rounded-[28px] border border-blue-100/80 shadow-sm space-y-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block">
                      Evaluation Criteria
                    </span>
                    <h3 className="text-xl font-bold text-[#08245C] tracking-tight">
                      What the Review Committee Looks For
                    </h3>

                    <div className="space-y-4">
                      {criteria.map((c, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{c.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 pl-6 leading-relaxed">
                            {c.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0A224E] text-white p-7 sm:p-8 rounded-[28px] space-y-4 shadow-xl border border-blue-900/60">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold uppercase">
                      <Rocket className="w-3.5 h-3.5" />
                      What Accepted Projects Receive
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300 font-bold">•</span>
                        <span>Free access to JANIC Hardware &amp; Robotics Laboratory bench</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300 font-bold">•</span>
                        <span>Direct weekly mentoring from senior CS &amp; IT faculty</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300 font-bold">•</span>
                        <span>Showcase spot at the annual JANIC Demo Day with investors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300 font-bold">•</span>
                        <span>Intellectual property guidance and project hosting infrastructure</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Column: Submission Form (8 cols) */}
                <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-[28px] border border-blue-100/80 shadow-md space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1">
                      Application Form
                    </span>
                    <h2 className="text-2xl font-bold text-[#08245C] tracking-tight">
                      Innovation Proposal Details
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Open to all Jazeera University students, researchers, and alumni teams.
                    </p>
                  </div>

                  <InnovationSubmissionForm />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
