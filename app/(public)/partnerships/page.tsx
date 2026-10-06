import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { PartnershipForm } from "@/components/forms/PartnershipForm";
import { Handshake, Building2, Globe2, Rocket, Award, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Partnerships & Collaboration",
  description:
    "Partner with JANIC at Jazeera University. Collaborative research, student incubators, hardware lab sponsorships, and IT certifications.",
};

export default function PartnershipsPage() {
  const benefits = [
    {
      title: "Direct Access to Top Tech Talent",
      desc: "Connect directly with graduating software engineers, robotics developers, and cybersecurity practitioners.",
      icon: Rocket,
    },
    {
      title: "Custom Prototyping & R&D",
      desc: "Leverage our university hardware lab and faculty expertise to prototype custom digital solutions.",
      icon: Building2,
    },
    {
      title: "High-Impact Regional CSR & Branding",
      desc: "Co-brand student hackathons, technology summits, and community digital literacy bootcamps.",
      icon: Award,
    },
    {
      title: "Institutional Research Exchanges",
      desc: "Joint peer-reviewed papers, faculty fellowships, and international academic credit transfers.",
      icon: Globe2,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="Strategic Alliances"
        title="Let's Build the Future Together"
        description="JANIC welcomes collaboration with universities, technology companies, government ministries, NGOs, and venture investors."
        breadcrumbs={[{ label: "Partnerships" }]}
      />

      {/* 2. PARTNERSHIPS BENTO CANVAS */}
      <section className="py-8 sm:py-14 bg-white">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-14 border border-blue-100/70 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Why Partner (6 cols) */}
              <div className="lg:col-span-6 space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1">
                    Collaboration Framework
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#08245C] tracking-tight leading-tight">
                    Why Partner with JANIC?
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2.5">
                    As the innovation arm of Jazeera University Faculty of Computer Science &amp; IT, JANIC serves as the premier bridge between academic capability and regional market execution.
                  </p>
                </div>

                <div className="space-y-4">
                  {benefits.map((b) => {
                    const Icon = b.icon;
                    return (
                      <div
                        key={b.title}
                        className="bg-white p-6 rounded-[24px] border border-blue-100/80 flex items-start gap-4 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#08245C] tracking-tight">
                            {b.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">
                            {b.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-7 rounded-[26px] bg-[#0A224E] text-white space-y-2 border border-blue-900/60 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" /> Institutional Integrity
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All partnerships are governed under formal Memorandums of Understanding (MoU) with the Senate and Dean of Faculty at Jazeera University.
                  </p>
                </div>
              </div>

              {/* Right Column: Partnership Form (6 cols) */}
              <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-[28px] border border-blue-100/80 shadow-md space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1">
                    Partnership Inquiries
                  </span>
                  <h3 className="text-2xl font-bold text-[#08245C] tracking-tight">
                    Start a Collaboration
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Tell us about your organization and how we can work together.
                  </p>
                </div>

                <PartnershipForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CALL TO ACTION (MATCHING HOME PAGE) */}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-white text-center">
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
      </section>
    </div>
  );
}
