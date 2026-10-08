import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { TeamRepository } from "@/repositories/team.repository";
import {
  CheckCircle2,
  Shield,
  Target,
  Compass,
  Award,
  Lightbulb,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "About JANIC",
  description:
    "Learn about the history, vision, mission, and leadership of Jazeera Nexus Innovation Center at Jazeera University.",
};

export default async function AboutPage() {
  const teamMembers = await TeamRepository.findActive();

  const coreValues = [
    {
      title: "Excellence",
      desc: "We pursue uncompromising quality in research, software development, and technical education.",
      icon: Award,
    },
    {
      title: "Innovation & Agility",
      desc: "We continuously explore emerging technologies and adapt quickly to industry breakthroughs.",
      icon: Lightbulb,
    },
    {
      title: "Integrity & Professionalism",
      desc: "We operate with ethical rigor, transparency, and international institutional standards.",
      icon: Shield,
    },
    {
      title: "Teamwork & Collaboration",
      desc: "We believe transformative innovation is built through multidisciplinary teamwork.",
      icon: Users,
    },
    {
      title: "Localization of Knowledge",
      desc: "We adapt global technology to solve local infrastructure, health, and economic challenges.",
      icon: Compass,
    },
    {
      title: "Continuous Learning",
      desc: "We promote lifelong curiosity, ongoing technical certification, and skill refinement.",
      icon: BookOpen,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION (MATCHING HOME PAGE ROUNDED CARD) */}
      <SectionHero
        badge="About JANIC"
        title="Where Education Meets Innovation"
        description="Bridging the gap between academic theory, technological innovation, and real-world market needs in the Horn of Africa."
        breadcrumbs={[{ label: "About JANIC" }]}
      />

      {/* 2. HISTORY & ORIGIN (ICE-BLUE BENTO BOX) - FADE RIGHT */}
      <section className="py-8 sm:py-12 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-right" duration={850}>
            <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-blue-100/70 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Left Column: Narrative */}
                <div className="lg:col-span-7 space-y-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block">
                    Our History &amp; Origin
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#08245C] tracking-tight leading-tight">
                    Founded at Jazeera University in 2021
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed">
                    Jazeera Nexus Innovation Center (JANIC), formerly known as Jazeera Innovation Technology (JIT), was founded on October 25, 2021, by the Faculty of Computer Science &amp; IT at Jazeera University in Mogadishu, Somalia.
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed">
                    JANIC was established to resolve a persistent challenge in higher education: the disconnect between classroom curriculum and the practical, rapidly evolving demands of the technology market. Its operations combine software engineering, process automation, hands-on ICT training, applied scientific research, and startup incubation.
                  </p>
                  <div className="pt-3">
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all group"
                    >
                      Explore Student Innovations
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Visual with Overlapping Badge */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white aspect-[4/3] sm:aspect-[1.15/1]">
                    <Image
                      src="/images/janic-building-lobby.jpg"
                      alt="JANIC Innovation Center Atrium"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>

                  {/* Floating Oct 25 FOUNDED 2021 badge */}
                  <div className="absolute -bottom-6 -left-4 sm:-bottom-7 sm:-left-6 bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100/90 z-10 flex flex-col items-center min-w-[125px] text-center">
                    <div className="text-xl sm:text-2xl font-black text-[#08245C] leading-none">
                      Oct 25
                    </div>
                    <div className="text-[10px] font-bold text-[#0875D1] uppercase tracking-wider mt-1.5">
                      FOUNDED 2021
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. VISION & MISSION (DUAL BENTO BOXES) - ZOOM IN */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="zoom-in" duration={850}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              {/* Vision (Light Card) */}
              <div className="bg-[#F0F6FE] rounded-2xl sm:rounded-2xl p-8 sm:p-12 border border-blue-100/70 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#0875D1] flex items-center justify-center font-bold mb-6 shadow-sm">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-2">
                    Long-Term Ambition
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#08245C] mb-4 tracking-tight">
                    Our Vision
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    To be a premier technology innovation center and training hub in Africa and globally, delivering reliable, cutting-edge digital products, high-impact research, and world-class ICT certifications.
                  </p>
                </div>
              </div>

              {/* Mission (Dark Navy Card) */}
              <div className="bg-[#0A224E] text-white rounded-2xl sm:rounded-2xl p-8 sm:p-12 border border-blue-900/60 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-cyan-300 flex items-center justify-center font-bold mb-6">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block mb-2">
                    Institutional Mandate
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
                    Our Mission
                  </h3>
                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Transformative Solutions:</strong> Develop dynamic, high-quality digital platforms and automation services.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Capacity Building:</strong> Equip students and professionals with hands-on technical skills and recognized certifications.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Global Collaboration:</strong> Build strategic partnerships, research exchanges, and international networks.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. CORE VALUES (BENTO GRID) - FADE LEFT */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-left" duration={850}>
            <div className="mb-10 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1.5">
                INSTITUTIONAL PRINCIPLES
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#08245C] tracking-tight">
                Our Core Values
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
                The ethical framework and technological mindset guiding every project at JANIC.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0875D1] flex items-center justify-center font-bold mb-5 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] mb-2 tracking-tight group-hover:text-[#0875D1] transition">
                        {v.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. LEADERSHIP & FACULTY (BENTO CANVAS) - BLUR IN */}
      {teamMembers.length > 0 && (
        <section className="py-12 sm:py-16 bg-white overflow-hidden">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="blur-in" duration={850}>
              <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-blue-100/70 shadow-sm">
                <div className="mb-10 sm:mb-12">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1.5">
                    MENTORS &amp; FACULTY
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#08245C] tracking-tight">
                    Leadership &amp; Advisors
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
                    Distinguished educators and industry specialists guiding student innovators.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* 1. HARDCODED FOUNDER CARD (DISTINCT STYLING) */}
                  <div className="bg-gradient-to-b from-amber-50/70 via-white to-white rounded-2xl border-2 border-amber-300 shadow-md ring-2 ring-amber-400/20 p-6 text-center hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between relative overflow-hidden group">
                    <div className="w-full flex flex-col items-center">
                      {/* Distinctive Founder Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs mb-3">
                        <Award className="w-3 h-3 text-amber-200" />
                        <span>FOUNDER</span>
                      </span>

                      {/* Founder Avatar with Amber Ring */}
                      <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-full mx-auto mb-3.5 relative bg-amber-50 border-2 border-amber-400 shadow-md overflow-hidden ring-4 ring-amber-100/80 group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src="/images/Founder-img.jpeg"
                          alt="Jamila Hassan Mohamed - Founder & CS & IT Dean"
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 640px) 96px, 104px"
                          priority
                        />
                      </div>

                      {/* Identity */}
                      <h3 className="text-base sm:text-lg font-black text-[#08245C] tracking-tight group-hover:text-amber-700 transition-colors">
                        Jamila Hassan Mohamed
                      </h3>
                      <p className="text-xs font-bold text-amber-600 mt-0.5">
                        CS &amp; IT Dean
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1">
                        Faculty of Computer Science &amp; IT, Jazeera University
                      </p>
                      <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-3">
                        Visionary founder of JANIC and Dean of the Faculty of Computer Science &amp; IT, leading academic innovation, faculty mentorship, and youth technological empowerment.
                      </p>
                    </div>
                  </div>

                  {/* 2. OTHER LEADERS FROM THE DATABASE (FILTERING OUT DUPLICATE DEAN) */}
                  {teamMembers
                    .filter(
                      (m) =>
                        !m.name.toLowerCase().includes("jamiila") &&
                        !m.name.toLowerCase().includes("jamila")
                    )
                    .map((member) => (
                      <div
                        key={member.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-between"
                      >
                        <div>
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
                          <h3 className="text-base font-bold text-[#08245C] tracking-tight">
                            {member.name}
                          </h3>
                          <p className="text-xs font-semibold text-[#0875D1] mt-0.5">
                            {member.role}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {member.department}
                          </p>
                          {member.bio && (
                            <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                              {member.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 6. CALL TO ACTION (MATCHING HOME PAGE) - ZOOM IN */}
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
