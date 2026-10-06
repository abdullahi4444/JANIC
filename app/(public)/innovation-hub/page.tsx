import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { InnovationPipelineNodes } from "@/components/public/InnovationPipelineNodes";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { Sparkles, ArrowRight, Wrench, Shield, CheckCircle2, Laptop, Layers } from "lucide-react";

export const metadata = {
  title: "Innovation Hub",
  description:
    "The 6-stage lifecycle at JANIC Innovation Hub: Idea, Design, Build, Test, Showcase, and Scale.",
};

export default function InnovationHubPage() {
  const steps = [
    {
      num: "01",
      title: "IDEA",
      headline: "Identify a real-world problem.",
      desc: "Students investigate community and industrial pain points in health, agriculture, logistics, education, or government automation.",
    },
    {
      num: "02",
      title: "DESIGN",
      headline: "Develop concept & architecture.",
      desc: "Creating wireframes, user personas, system workflows, database schemas, and hardware electrical schematics.",
    },
    {
      num: "03",
      title: "BUILD",
      headline: "Create functional prototype.",
      desc: "Engineering hardware sensors, writing production code, assembling Arduino/ESP32 chassis, and deploying backend APIs.",
    },
    {
      num: "04",
      title: "TEST",
      headline: "Evaluate & iterate in lab.",
      desc: "Stress testing in university laboratories, gathering end-user feedback, and resolving security or mechanical vulnerabilities.",
    },
    {
      num: "05",
      title: "SHOWCASE",
      headline: "Present at Demo Days.",
      desc: "Demonstrating live systems to faculty deans, technology leaders, media representatives, and industry investors.",
    },
    {
      num: "06",
      title: "SCALE",
      headline: "Commercial incubation & scale.",
      desc: "Spinning out startups, acquiring intellectual property guidance, and securing pilot contracts with regional organizations.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="JANIC Innovation Hub"
        title="Ideas. Prototypes. Possibilities."
        description="The JANIC Innovation Hub supports student founders from the initial whiteboard spark through working prototype to commercial deployment."
        breadcrumbs={[{ label: "Innovation Hub" }]}
      >
        <div className="pt-2">
          <Link
            href="/submit-innovation"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#08245C] hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-[#0875D1]" />
            Submit Your Innovation Proposal →
          </Link>
        </div>
      </SectionHero>

      {/* 2. INNOVATION PIPELINE (DARK NAVY CANVAS BOX) - FADE UP */}
      <section className="py-8 sm:py-12 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="bg-[#051329] text-white rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-blue-900/60 shadow-xl relative overflow-hidden">
              <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#38bdf8] text-xs font-bold uppercase tracking-wider">
                  Innovation Lifecycle
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  From Concept to Production
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                  A connected sandbox for student-led innovation and industrial prototyping.
                </p>
              </div>

              {/* Connected Pipeline Nodes */}
              <InnovationPipelineNodes />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. SIX-STAGE BENTO CARDS - FADE RIGHT */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-right" duration={850}>
            <div className="mb-10 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1.5">
                THE 6-PHASE METHODOLOGY
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#08245C] tracking-tight">
                Rigorous Engineering Stages
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
                Our structured approach ensures idea viability, execution rigor, and regional impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className="bg-white rounded-[24px] border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0875D1] flex items-center justify-center font-black text-sm mb-5 group-hover:scale-105 transition-transform">
                      {s.num}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Stage {s.num}
                    </span>
                    <h3 className="text-xl font-bold text-[#08245C] tracking-tight mb-1 group-hover:text-[#0875D1] transition">
                      {s.title}
                    </h3>
                    <h4 className="text-xs font-semibold text-[#0875D1] mb-3">
                      {s.headline}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. LAB FACILITIES & PROTOTYPING (ICE-BLUE BENTO BOX) - BLUR IN */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="blur-in" duration={850}>
            <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-blue-100/70 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-2">
                      PHYSICAL INFRASTRUCTURE
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#08245C] tracking-tight leading-tight">
                      World-Class Prototyping Laboratory
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2">
                      Located on the main campus of Jazeera University, the JANIC Innovation Hub provides student engineering teams with direct access to hardware tools, testing benches, and compute workstations.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-5 border border-blue-100/80 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center shrink-0">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#08245C]">
                          High-Performance Compute &amp; Cloud Workstations
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Dedicated development machines configured for machine learning model training and container builds.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-blue-100/80 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center shrink-0">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#08245C]">
                          Robotics &amp; Embedded Electronics Workbench
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Arduino Mega, ESP32 microcontrollers, ultrasonic, infrared, conductivity sensors, oscilloscopes, and soldering stations.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-blue-100/80 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#08245C]">
                          Collaborative Co-Working &amp; Demo Pitch Hall
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Flexible modular desks, smart screens, and presentation stages for investor meetings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Dark Navy CTA Bento Card */}
                <div className="lg:col-span-5 bg-[#0A224E] text-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 shadow-xl border border-blue-900/60 space-y-6">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                    INCUBATION ADMISSIONS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black leading-snug">
                    Have a project you want to build?
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Any enrolled student or multidisciplinary team at Jazeera University can submit an innovation idea. Shortlisted projects receive dedicated lab workspace, electronics components, and faculty mentorship.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/submit-innovation"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white font-bold text-xs sm:text-sm shadow-md transition"
                    >
                      Submit Proposal Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. CALL TO ACTION (MATCHING HOME PAGE) - ZOOM IN */}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-white text-center overflow-hidden">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] tracking-tight leading-tight">
              Have an Idea? Let&apos;s Turn It Into Innovation.
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-normal tracking-wide max-w-xl mx-auto">
              Join our vibrant ecosystem of developers, researchers, and visionaries.
            </p>
            <div className="pt-3">
              <Link
                href="/submit-innovation"
                className="inline-flex items-center px-8 py-3.5 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg transition-all"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
