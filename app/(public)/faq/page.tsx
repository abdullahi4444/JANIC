import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about JANIC programs, training, and partnerships.",
};

const faqs = [
  {
    q: "What is JANIC?",
    a: "The Jazeera Nexus Innovation Center (JANIC) is a technology innovation center and training hub at Jazeera University in Mogadishu, founded October 25, 2021.",
  },
  {
    q: "Who can submit an innovation idea?",
    a: "Any student, researcher, or technology enthusiast can submit ideas through the Submit Your Idea page for review and mentorship.",
  },
  {
    q: "How do I enroll in a training program?",
    a: "Browse the Training page, review program details, schedule, and certification, then register online or contact our office.",
  },
  {
    q: "Does JANIC offer internationally recognized certifications?",
    a: "Yes. JANIC delivers hands-on ICT training aligned with internationally recognized professional certifications.",
  },
  {
    q: "How can organizations partner with JANIC?",
    a: "Universities, companies, government institutions, and startups can reach out through the Partnerships page or by contacting us directly.",
  },
  {
    q: "Where is JANIC located?",
    a: "JANIC is based at Jazeera University's Faculty of Computer Science & IT campus in Mogadishu, Somalia.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      <SectionHero
        badge="Support"
        title="Frequently Asked Questions"
        description="Everything you need to know about JANIC programs, submissions, and partnerships."
        breadcrumbs={[{ label: "FAQ" }]}
      />

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
              {faqs.map((f, i) => (
                <details key={i} className="group p-5 open:bg-[#F0F6FE]">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-[#08245C] list-none">
                    {f.q}
                    <span className="text-[#0875D1] transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
