import React from "react";
import Image from "next/image";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { TeamRepository } from "@/repositories/team.repository";

export const metadata = {
  title: "Our Team",
  description: "Meet the mentors, faculty, and innovators behind JANIC.",
};

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const teamMembers = await TeamRepository.findActive();

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      <SectionHero
        badge="People"
        title="Meet the JANIC Team"
        description="Faculty, mentors, and student leaders driving innovation, research, and training at Jazeera University."
        breadcrumbs={[{ label: "Team" }]}
      />

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          {teamMembers.length === 0 ? (
            <p className="text-center text-slate-400 py-20">Team information coming soon.</p>
          ) : (
            <ScrollReveal animation="fade-up" duration={700}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 relative bg-slate-100 border-2 border-blue-100 overflow-hidden shadow-sm">
                      <Image
                        src={
                          member.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                        }
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-base font-bold text-[#08245C]">{member.name}</h3>
                    <p className="text-xs font-semibold text-[#0875D1] mt-0.5">{member.role}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{member.department}</p>
                    {member.bio && (
                      <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-[11px] text-[#0875D1] hover:underline mt-2 inline-block"
                      >
                        {member.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  );
}
