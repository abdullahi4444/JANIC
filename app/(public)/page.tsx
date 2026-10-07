import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Rocket,
  MapPin,
  CheckCircle2,
  Shield,
  Cloud,
  Binary,
  Code2,
  ArrowUpRight,
  Sparkles,
  Users,
  Zap,
  Award,
  Target,
} from "lucide-react";
import { ResearchService } from "@/services/research/research.service";
import { EventService } from "@/services/events/event.service";
import { ProjectService } from "@/services/projects/project.service";
import { InnovationPipelineNodes } from "@/components/public/InnovationPipelineNodes";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [researchPapers, upcomingEvents, featuredProjects] = await Promise.all([
    ResearchService.getFeaturedPapers(3),
    EventService.getUpcomingEvents(3),
    ProjectService.getFeaturedProjects(5),
  ]);

  const heroTitle = await getSetting("hero_title", "Innovating Technology. Empowering the Future.");
  const heroSubtitle = await getSetting("hero_subtitle", "The leading institutional hub for technological transformation, advanced research, and digital excellence.");
  const heroImage = await getSetting("hero_image", "/images/janic-hero-lab.jpg");
  const heroBadgeValue = await getSetting("hero_badge_value", "18+");
  const heroBadgeLabel = await getSetting("hero_badge_label", "STUDENT INNOVATION PROJECTS");

  return (
    <div className="flex flex-col min-h-screen overflow-x-clip">
      {/* 1. HERO SECTION (MATCHING DESIGN MOCKUP) - FADE DOWN ENTRANCE */}
      <section className="bg-white pt-6 pb-10 sm:pt-8 sm:pb-12 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-down" duration={850} rootMargin="0px">
            {/* Main Hero Card with Futuristic Lab Backdrop */}
            <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[580px] lg:min-h-[640px] flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-2xl">
              {/* Background Image */}
              <Image
                src={heroImage}
                alt="JANIC Innovation Lab"
                fill
                className="object-cover object-center"
                priority
                quality={95}
              />

              {/* Glowing Tech Blue Overlays matching mock */}
              <div className="absolute inset-0 bg-[#06509e]/65 mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#031d4e]/95 via-[#06428a]/80 to-[#0256a4]/60 pointer-events-none" />
              <div className="absolute inset-0 bg-blue-600/20 backdrop-brightness-[0.92] pointer-events-none" />

              {/* Top Row: Floating Glassmorphism Badge at Top-Right */}
              <div className="flex justify-end relative z-10">
                <div className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#09224f]/60 backdrop-blur-md border border-white/20 shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-[#0875D1] text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white leading-tight">{heroBadgeValue}</div>
                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                      {heroBadgeLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Two-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10 pt-10 sm:pt-16">
                {/* Left Column: Main Typography */}
                <div className="lg:col-span-7 space-y-5">
                  <h1 className="text-4xl sm:text-5xl lg:text-[4.25rem] font-black text-white tracking-tight leading-[1.08] whitespace-pre-line">
                    {heroTitle}
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl">
                    {heroSubtitle}
                  </p>
                </div>

                {/* Right Column: Floating White Innovation Hub Card */}
                <div className="lg:col-span-5 flex justify-start lg:justify-end">
                  <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-slate-100/90">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-1 bg-[#0875D1] rounded-full inline-block" />
                      <span className="text-xs font-black tracking-wider uppercase text-[#0875D1]">
                        Innovation Hub
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#08245C] tracking-tight leading-snug">
                      Ideas <span className="text-[#0875D1] mx-1">→</span> Prototypes <span className="text-[#0875D1] mx-1">→</span> Solutions
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                      Bridging the gap between academic theory and real-world industrial impact through cutting-edge technology development.
                    </p>
                    <Link
                      href="/innovation-hub"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#08245C] hover:text-[#0875D1] transition-colors mt-5 group"
                    >
                      <span>Explore the Hub</span>
                      <ArrowRight className="w-4 h-4 text-[#0875D1] transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* 2. IMPACT STATS BAR (MATCHING MOCKUP STRIP) - ZOOM IN ENTRANCE */}
          <ScrollReveal animation="zoom-in" duration={750} delay={150}>
            <div className="mt-10 sm:mt-14 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-y-6 max-w-6xl mx-auto px-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                <div className="flex-1 min-w-[140px] flex items-baseline justify-center gap-2.5 px-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#08245C]">2021</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 tracking-wider uppercase">FOUNDED</span>
                </div>
                <div className="flex-1 min-w-[140px] flex items-baseline justify-center gap-2.5 px-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#08245C]">18+</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 tracking-wider uppercase">PROJECTS</span>
                </div>
                <div className="flex-1 min-w-[140px] flex items-baseline justify-center gap-2.5 px-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#08245C]">6</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 tracking-wider uppercase">FUNCTIONS</span>
                </div>
                <div className="flex-1 min-w-[140px] flex items-baseline justify-center gap-2.5 px-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#08245C]">1</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 tracking-wider uppercase">HUB</span>
                </div>
                <div className="flex-1 min-w-[140px] flex items-baseline justify-center gap-2.5 px-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#08245C]">∞</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 tracking-wider uppercase">IDEAS</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. ABOUT THE CENTER (MATCHING DESIGN MOCKUP) - FADE RIGHT ENTRANCE */}
      <section className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-right" duration={850}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Content (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-bold text-[#0875D1] uppercase tracking-wider block">
                  ABOUT THE CENTER
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#08245C] tracking-tight leading-[1.15]">
                  Empowering Digital <br />
                  Evolution in the Region
                </h2>

                <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl">
                  Jazeera Nexus Innovation Center (JANIC) is at the forefront of technological advancement, dedicated to fostering a culture of innovation and excellence. We serve as a catalyst for growth, providing the tools and environment needed for students and researchers to thrive.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-[#0875D1] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#08245C]">
                        Applied Research Excellence
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Solving complex problems through targeted technical research.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-[#0875D1] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#08245C]">
                        Skill Transformation
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Bridging the gap between education and industrial requirements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/about"
                    className="px-8 py-3.5 rounded-full bg-[#08245C] hover:bg-[#051532] text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow transition inline-block cursor-pointer"
                  >
                    Discover Our Story
                  </Link>
                </div>
              </div>

              {/* Right Visual Image (5 cols) */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 aspect-[4/3] sm:aspect-[1.15/1]">
                  <Image
                    src="/images/janic-building-lobby.jpg"
                    alt="JANIC Innovation Center Atrium"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>

                {/* Floating Oct 25 FOUNDED 2021 badge overlapping bottom left */}
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
          </ScrollReveal>
        </div>
      </section>

      {/* 4. OUR FUNCTIONS — COMPREHENSIVE TECH SOLUTIONS (MATCHING DESIGN MOCKUP) - BLUR IN ENTRANCE */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="blur-in" duration={850}>
            {/* Light ice-blue outer canvas card with rounded-[2.5rem] */}
            <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16">
              {/* Header: Title on Left, Subtext on Right */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
                <div>
                  <span className="text-xs font-bold text-[#0875D1] uppercase tracking-wider block mb-2">
                    OUR FUNCTIONS
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#08245C] tracking-tight">
                    Comprehensive Tech Solutions
                  </h2>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm max-w-sm leading-relaxed">
                  We provide a full spectrum of services from fundamental development to advanced AI implementations.
                </p>
              </div>

              {/* Asymmetrical Grid: Top Row (2 Cards), Bottom Row (3 Cards) */}
              <div className="space-y-6">
                {/* Top Row: 1 Wide White Card + 1 Dark Navy Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* 01 Technology & Platform Development */}
                  <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100/80 flex flex-col justify-between relative overflow-hidden group">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-[#0875D1] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-slate-100/90 select-none">
                        01
                      </span>
                    </div>

                    <div className="space-y-3 mb-8">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#08245C] tracking-tight">
                        Technology & Platform Development
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xl">
                        Building scalable web applications, mobile platforms, and enterprise software solutions tailored for local and international markets.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0875D1] text-xs font-bold">
                        Full Stack
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0875D1] text-xs font-bold">
                        Mobile App
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0875D1] text-xs font-bold">
                        Cloud Native
                      </span>
                    </div>
                  </div>

                  {/* Cybersecurity & Trust (Dark Navy Card) */}
                  <div className="lg:col-span-4 bg-[#08245C] text-white rounded-3xl p-8 sm:p-10 shadow-md flex flex-col justify-between relative overflow-hidden group">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-8">
                      <Shield className="w-6 h-6" />
                    </div>

                    <div className="space-y-3 mb-8">
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        Cybersecurity & Trust
                      </h3>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        Ensuring digital assets are protected through rigorous security protocols and auditing.
                      </p>
                    </div>

                    <div>
                      <Link
                        href="/what-we-do"
                        className="text-xs font-bold text-white hover:text-blue-300 transition inline-flex items-center gap-1 group-hover:underline"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: 3 Equal White Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cloud Infrastructure */}
                  <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-sm border border-slate-100/80 flex flex-col justify-between group">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center mb-5">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] mb-2 tracking-tight">
                        Cloud Infrastructure
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Optimizing deployments for scalability and performance across multi-cloud environments.
                      </p>
                    </div>
                  </div>

                  {/* AI & Machine Learning */}
                  <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-sm border border-slate-100/80 flex flex-col justify-between group">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center mb-5">
                        <Binary className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] mb-2 tracking-tight">
                        AI & Machine Learning
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Implementing intelligent automation and predictive analytics to drive business insights.
                      </p>
                    </div>
                  </div>

                  {/* Embedded Systems */}
                  <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-sm border border-slate-100/80 flex flex-col justify-between group">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center mb-5">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] mb-2 tracking-tight">
                        Embedded Systems
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Developing hardware-software integrations for smart city and IoT applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. INNOVATION HUB WORKFLOW PIPELINE - TILT UP ENTRANCE */}
      <section className="py-16 sm:py-24 bg-[#051329] text-white relative overflow-hidden border-b border-blue-900/60">
        {/* Subtle architectural backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal animation="tilt-up" duration={850}>
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#38bdf8] text-xs font-bold uppercase tracking-wider">
                Innovation Lifecycle
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Ideas. Prototypes. Possibilities.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                The JANIC Innovation Hub is where radical ideas meet rigorous engineering. We provide a sandbox for student-led innovation and industrial prototyping.
              </p>
            </div>

            {/* Connected Pipeline Component */}
            <InnovationPipelineNodes />
          </ScrollReveal>
        </div>
      </section>

      {/* 6. PROJECT SHOWCASES: ASYMMETRIC BENTO LAYOUT — TILT UP ENTRANCE */}
      <section className="py-16 sm:py-24 lg:py-28 bg-gradient-to-b from-white via-[#F5F9FF] to-white border-b border-slate-200/80 overflow-hidden relative isolate">
        {/* Decorative soft blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#0875D1]/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-[#08245C]/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[60%] left-10 w-[260px] h-[260px] bg-emerald-400/[0.03] rounded-full blur-3xl pointer-events-none" />
        {/* Fine grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(8, 117, 209, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(8, 36, 92, 0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 75%)",
          }}
        />

        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal animation="fade-up" duration={850}>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-11 sm:mb-16">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#E9F3FD] to-white border border-[#0875D1]/15 shadow-[0_1px_2px_rgba(8,117,209,0.06),0_8px_24px_-12px_rgba(8,117,209,0.2)] mb-4 hover:shadow-[0_2px_4px_rgba(8,117,209,0.08),0_12px_32px_-12px_rgba(8,117,209,0.3)] transition-shadow duration-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#0875D1]" />
                  <span className="text-[11px] font-extrabold text-[#08245C] tracking-[0.18em] uppercase">
                    PROJECT SHOWCASES
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-[54px] font-black tracking-tight leading-[1.05] bg-gradient-to-br from-[#08245C] via-[#0A2C6B] to-[#0875D1] bg-clip-text text-transparent">
                  Innovation in Action
                </h2>
                <p className="mt-4 text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-xl">
                  From fintech platforms and robotics hardware to AI-driven healthcare coordination systems — explore real-world prototypes engineered by Jazeera University students.
                </p>
              </div>

              <Link
                href="/projects"
                className="group shrink-0 inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full border-2 border-[#08245C]/10 hover:border-[#08245C] text-[#08245C] hover:bg-[#08245C] hover:text-white text-xs sm:text-sm font-bold transition-all duration-300 shadow-[0_1px_2px_rgba(8,36,92,0.04),0_12px_32px_-16px_rgba(8,36,92,0.2)] hover:shadow-[0_2px_4px_rgba(8,36,92,0.06),0_20px_40px_-12px_rgba(8,36,92,0.35)] hover:-translate-y-0.5"
              >
                View Full Portfolio
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </ScrollReveal>

          {/* ASYMMETRIC BENTO GRID */}
          <ScrollReveal animation="tilt-up" duration={900} delay={80}>
            {featuredProjects && featuredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                {(() => {
                  const mainProject = featuredProjects[0];
                  const restProjects = featuredProjects.slice(1, 5);
                  const fallbackImg = [
                    "/images/maal-hub.jpg",
                    "/images/sahal-sacco.jpg",
                    "/images/robot-car-cleaner.jpg",
                    "/images/badbaado-safety.jpg",
                    "/images/maal-hub.jpg",
                  ];
                  const iconsByCategory = [Sparkles, Zap, Target, Award, Users];

                  return (
                    <>
                      {/* BIG SPOTLIGHT CARD - xl:col-span-7 */}
                      <Link
                        href={`/projects/${mainProject.slug}`}
                        className="group relative rounded-3xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_40px_-20px_rgba(8,117,209,0.25)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_35px_70px_-20px_rgba(8,36,92,0.45)] transition-all duration-500 xl:col-span-7 xl:row-span-2 min-h-[340px] sm:min-h-[380px] lg:min-h-[430px] xl:min-h-[540px] flex flex-col justify-between ring-1 ring-black/5 hover:ring-[#0875D1]/20 before:absolute before:inset-0 before:z-20 before:pointer-events-none before:rounded-3xl before:ring-1 before:ring-inset before:ring-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
                      >
                        {/* Background */}
                        <div className="absolute inset-0">
                          <Image
                            src={mainProject.heroImage || fallbackImg[0]}
                            alt={mainProject.title}
                            fill
                            priority
                            className="object-cover object-center group-hover:scale-[1.08] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050D24]/97 via-[#08245C]/60 to-[#0875D1]/15 group-hover:from-[#050D24]/97 group-hover:via-[#0A2C6B]/70 group-hover:to-[#0875D1]/25 transition-all duration-700" />
                          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
                          {/* Radial glow accent */}
                          <div className="absolute -top-1/3 -right-1/4 w-[500px] h-[500px] bg-[#0875D1]/25 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </div>

                        {/* Top Meta Row */}
                        <div className="relative z-10 p-6 sm:p-8 lg:p-9 flex items-start justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] sm:text-[11px] font-extrabold tracking-[0.14em] text-[#08245C] uppercase shadow-[0_10px_25px_-8px_rgba(0,0,0,0.2)] border border-white/70">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-0.5 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                              {mainProject.category}
                            </span>
                            {mainProject.demoUrl && (
                              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0875D1] to-cyan-500 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wide shadow-[0_8px_20px_-8px_rgba(8,117,209,0.6)] border border-white/15">
                                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                                Live Demo
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] group-hover:bg-white group-hover:text-[#0875D1] group-hover:scale-110 group-hover:rotate-[3deg] group-hover:shadow-[0_15px_35px_-10px_rgba(255,255,255,0.25)] transition-all duration-500">
                            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                        </div>

                        {/* Bottom Content */}
                        <div className="relative z-10 p-6 sm:p-8 lg:p-9 space-y-4 sm:space-y-5">
                          {/* Large Title */}
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[44px] font-black text-white tracking-tight leading-[1.08] max-w-2xl transition-all duration-500 group-hover:drop-shadow-[0_4px_20px_rgba(8,117,209,0.35)]">
                            {mainProject.title}
                          </h3>
                          <p className="text-sm sm:text-[15px] text-white/78 leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none group-hover:text-white/85 transition-colors duration-300">
                            {mainProject.summary}
                          </p>

                          {/* Technology pills */}
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {String(mainProject.technology || "")
                              .split(",")
                              .slice(0, 5)
                              .filter((t) => t.trim().length > 0)
                              .map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-[11px] font-semibold text-white/92 group-hover:bg-white/15 group-hover:border-white/25 group-hover:shadow-[0_4px_12px_-4px_rgba(8,117,209,0.35)] transition-all duration-300"
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                          </div>

                          {/* Bottom action row */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-1 border-t border-white/15 group-hover:border-white/25 transition-colors duration-300">
                            <div className="flex items-center gap-5">
                              <div className="flex -space-x-2">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#0875D1] to-[#08245C] border-2 border-white/40 flex items-center justify-center text-[10px] sm:text-[11px] font-black text-white shadow-[0_4px_12px_-2px_rgba(8,117,209,0.45)]">
                                  JU
                                </div>
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-white/40 flex items-center justify-center text-[10px] sm:text-[11px] font-black text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.45)]">
                                  CS
                                </div>
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-white/90 group-hover:bg-white/20 transition-colors duration-300">
                                  +{String(mainProject.technology || "").split(",").length}
                                </div>
                              </div>
                              <div>
                                <div className="text-[11px] font-bold text-white/92 group-hover:text-white transition-colors">JANIC Cohort</div>
                                <div className="text-[10px] text-white/55 font-medium">Faculty of CS &amp; IT</div>
                              </div>
                            </div>

                            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-[#08245C] text-xs sm:text-[13px] font-bold shadow-[0_12px_30px_-8px_rgba(0,0,0,0.2)] group-hover:bg-gradient-to-r group-hover:from-[#0875D1] group-hover:to-cyan-500 group-hover:text-white group-hover:shadow-[0_15px_35px_-8px_rgba(8,117,209,0.65)] transition-all duration-300">
                              View Project
                              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* SECONDARY CARDS — xl:col-span-5 */}
                      <div className="xl:col-span-5 flex flex-col gap-4 sm:gap-5">
                        {restProjects.map((project, idx) => {
                          const IconComp = iconsByCategory[(idx + 1) % iconsByCategory.length];
                          return (
                            <Link
                              key={project.id}
                              href={`/projects/${project.slug}`}
                              className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-15px_rgba(8,36,92,0.18)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_25px_60px_-15px_rgba(8,117,209,0.4)] hover:border-[#0875D1]/30 transition-all duration-500 hover:-translate-y-1 min-h-[150px] sm:min-h-[160px] lg:min-h-[175px] flex ring-1 ring-black/[0.03] hover:ring-[#0875D1]/10"
                            >
                              <div className="grid grid-cols-5 w-full">
                                {/* LEFT: Thumbnail */}
                                <div className="col-span-2 relative overflow-hidden min-h-[150px] sm:min-h-[160px] lg:min-h-[175px]">
                                  <Image
                                    src={project.heroImage || fallbackImg[(idx + 1) % fallbackImg.length]}
                                    alt={project.title}
                                    fill
                                    className="object-cover object-center group-hover:scale-[1.12] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#08245C]/5 to-white/70 group-hover:from-transparent group-hover:via-[#0875D1]/10 group-hover:to-white/60 transition-colors duration-500" />
                                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-[#0875D1]/10 transition-colors duration-500" />
                                  {/* Corner accent */}
                                  <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                                {/* RIGHT: Content */}
                                <div className="col-span-3 p-4 sm:p-5 lg:p-6 flex flex-col justify-between gap-3">
                                  <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#E9F3FD] to-white border border-[#0875D1]/15 text-[10px] sm:text-[11px] font-extrabold tracking-wider text-[#08245C] uppercase shadow-[0_1px_2px_rgba(8,117,209,0.06)]">
                                        {project.category}
                                      </span>
                                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-gradient-to-br group-hover:from-[#08245C] group-hover:to-[#0875D1] text-slate-500 group-hover:text-white transition-all duration-400 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] group-hover:shadow-[0_6px_16px_-6px_rgba(8,117,209,0.5)]">
                                        <IconComp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                                      </div>
                                    </div>
                                    <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-[#08245C] tracking-tight leading-tight group-hover:text-[#0875D1] transition-colors duration-300 line-clamp-2 group-hover:drop-shadow-[0_2px_8px_rgba(8,117,209,0.15)]">
                                      {project.title}
                                    </h3>
                                  </div>
                                  <div className="space-y-2.5">
                                    <div className="flex flex-wrap gap-1.5">
                                      {String(project.technology || "")
                                        .split(",")
                                        .slice(0, 3)
                                        .filter((t) => t.trim().length > 0)
                                        .map((tech, i) => (
                                          <span
                                            key={i}
                                            className="px-2 py-0.5 rounded-lg bg-slate-50 group-hover:bg-blue-50 border border-slate-200/60 group-hover:border-[#0875D1]/20 text-[10px] font-semibold text-slate-600 group-hover:text-[#08245C] transition-all duration-300"
                                          >
                                            {tech.trim()}
                                          </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100/80 group-hover:border-[#0875D1]/10 transition-colors duration-300">
                                      <span className="text-[11px] font-bold text-[#08245C]/50 group-hover:text-[#0875D1] transition-colors duration-300">
                                        Read Case Study
                                      </span>
                                      <div className="w-7 h-7 rounded-full bg-[#08245C]/5 group-hover:bg-gradient-to-r group-hover:from-[#0875D1] group-hover:to-cyan-500 text-[#08245C] group-hover:text-white flex items-center justify-center transition-all duration-400 group-hover:scale-[1.15] group-hover:shadow-[0_6px_16px_-6px_rgba(8,117,209,0.55)]">
                                        <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              /* HARDCODED FALLBACK BENTO (same layout) */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                <Link
                  href="/projects/maal-hub"
                  className="group relative rounded-3xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_40px_-20px_rgba(8,117,209,0.25)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_35px_70px_-20px_rgba(8,36,92,0.45)] transition-all duration-500 xl:col-span-7 xl:row-span-2 min-h-[340px] sm:min-h-[380px] lg:min-h-[430px] xl:min-h-[540px] flex flex-col justify-between ring-1 ring-black/5 hover:ring-[#0875D1]/20 before:absolute before:inset-0 before:z-20 before:pointer-events-none before:rounded-3xl before:ring-1 before:ring-inset before:ring-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
                >
                  <div className="absolute inset-0">
                    <Image
                      src="/images/maal-hub.jpg"
                      alt="MAAL HUB Fintech Platform"
                      fill
                      priority
                      className="object-cover object-center group-hover:scale-[1.08] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050D24]/97 via-[#08245C]/60 to-[#0875D1]/15 group-hover:from-[#050D24]/97 group-hover:via-[#0A2C6B]/70 group-hover:to-[#0875D1]/25 transition-all duration-700" />
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
                    <div className="absolute -top-1/3 -right-1/4 w-[500px] h-[500px] bg-[#0875D1]/25 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </div>
                  <div className="relative z-10 p-6 sm:p-8 lg:p-9 flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] sm:text-[11px] font-extrabold tracking-[0.14em] text-[#08245C] uppercase shadow-[0_10px_25px_-8px_rgba(0,0,0,0.2)] border border-white/70">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-0.5 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        FINTECH
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] group-hover:bg-white group-hover:text-[#0875D1] group-hover:scale-110 group-hover:rotate-[3deg] group-hover:shadow-[0_15px_35px_-10px_rgba(255,255,255,0.25)] transition-all duration-500">
                      <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                  <div className="relative z-10 p-6 sm:p-8 lg:p-9 space-y-4 sm:space-y-5">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[44px] font-black text-white tracking-tight leading-[1.08] max-w-2xl transition-all duration-500 group-hover:drop-shadow-[0_4px_20px_rgba(8,117,209,0.35)]">
                      MAAL HUB: Fintech for Micro-Enterprises
                    </h3>
                    <p className="text-sm sm:text-[15px] text-white/78 leading-relaxed max-w-xl group-hover:text-white/85 transition-colors duration-300">
                      Integrated financial management platform empowering Somali micro-enterprises with bookkeeping, digital payments, and micro-loan orchestration.
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {["Next.js", "Prisma", "MySQL", "Stripe API"].map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-[11px] font-semibold text-white/92 group-hover:bg-white/15 group-hover:border-white/25 group-hover:shadow-[0_4px_12px_-4px_rgba(8,117,209,0.35)] transition-all duration-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-1 border-t border-white/15 group-hover:border-white/25 transition-colors duration-300">
                      <div className="flex items-center gap-5">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#0875D1] to-[#08245C] border-2 border-white/40 flex items-center justify-center text-[11px] font-black text-white shadow-[0_4px_12px_-2px_rgba(8,117,209,0.45)]">JU</div>
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-white/40 flex items-center justify-center text-[11px] font-black text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.45)]">CS</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-white/92 group-hover:text-white transition-colors">JANIC Cohort</div>
                          <div className="text-[10px] text-white/55 font-medium">Faculty of CS &amp; IT</div>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-[#08245C] text-xs sm:text-[13px] font-bold shadow-[0_12px_30px_-8px_rgba(0,0,0,0.2)] group-hover:bg-gradient-to-r group-hover:from-[#0875D1] group-hover:to-cyan-500 group-hover:text-white group-hover:shadow-[0_15px_35px_-8px_rgba(8,117,209,0.65)] transition-all duration-300">
                        View Project
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="xl:col-span-5 flex flex-col gap-4 sm:gap-5">
                  {[
                    { slug: "sahal-sacco", title: "SAHAL SACCO: Credit &amp; Savings Automation", category: "SAAS", img: "/images/sahal-sacco.jpg", icon: Zap, tech: ["React", "Node.js", "Finflux"] },
                    { slug: "robot-car-cleaner", title: "Autonomous Robot Car Cleaner", category: "ROBOTICS", img: "/images/robot-car-cleaner.jpg", icon: Target, tech: ["Arduino", "IoT", "Python"] },
                    { slug: "badbaado", title: "BADBAADO Emergency Health Platform", category: "SAFETY TECH", img: "/images/badbaado-safety.jpg", icon: Award, tech: ["Next.js", "AI/ML", "Telehealth"] },
                  ].map((project) => (
                    <Link
                      key={project.slug}
                      href={`/projects/${project.slug}`}
                      className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-15px_rgba(8,36,92,0.18)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_25px_60px_-15px_rgba(8,117,209,0.4)] hover:border-[#0875D1]/30 transition-all duration-500 hover:-translate-y-1 min-h-[150px] sm:min-h-[160px] lg:min-h-[175px] flex ring-1 ring-black/[0.03] hover:ring-[#0875D1]/10"
                    >
                      <div className="grid grid-cols-5 w-full">
                        <div className="col-span-2 relative overflow-hidden min-h-[150px] sm:min-h-[160px] lg:min-h-[175px]">
                          <Image
                            src={project.img}
                            alt={project.title}
                            fill
                            className="object-cover object-center group-hover:scale-[1.12] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#08245C]/5 to-white/70 group-hover:from-transparent group-hover:via-[#0875D1]/10 group-hover:to-white/60 transition-colors duration-500" />
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-[#0875D1]/10 transition-colors duration-500" />
                          <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="col-span-3 p-4 sm:p-5 lg:p-6 flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#E9F3FD] to-white border border-[#0875D1]/15 text-[10px] sm:text-[11px] font-extrabold tracking-wider text-[#08245C] uppercase shadow-[0_1px_2px_rgba(8,117,209,0.06)]">
                                {project.category}
                              </span>
                              <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-gradient-to-br group-hover:from-[#08245C] group-hover:to-[#0875D1] text-slate-500 group-hover:text-white transition-all duration-400 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] group-hover:shadow-[0_6px_16px_-6px_rgba(8,117,209,0.5)]">
                                <project.icon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                              </div>
                            </div>
                            <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-[#08245C] tracking-tight leading-tight group-hover:text-[#0875D1] transition-colors duration-300 line-clamp-2 group-hover:drop-shadow-[0_2px_8px_rgba(8,117,209,0.15)]">
                              {project.title}
                            </h3>
                          </div>
                          <div className="space-y-2.5">
                            <div className="flex flex-wrap gap-1.5">
                              {project.tech.map((t) => (
                                <span key={t} className="px-2 py-0.5 rounded-lg bg-slate-50 group-hover:bg-blue-50 border border-slate-200/60 group-hover:border-[#0875D1]/20 text-[10px] font-semibold text-slate-600 group-hover:text-[#08245C] transition-all duration-300">
                                  {t}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100/80 group-hover:border-[#0875D1]/10 transition-colors duration-300">
                              <span className="text-[11px] font-bold text-[#08245C]/50 group-hover:text-[#0875D1] transition-colors duration-300">Read Case Study</span>
                              <div className="w-7 h-7 rounded-full bg-[#08245C]/5 group-hover:bg-gradient-to-r group-hover:from-[#0875D1] group-hover:to-cyan-500 text-[#08245C] group-hover:text-white flex items-center justify-center transition-all duration-400 group-hover:scale-[1.15] group-hover:shadow-[0_6px_16px_-6px_rgba(8,117,209,0.55)]">
                                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </ScrollReveal>

          {/* 7. FEATURED CASE STUDY: BADBAADO — ZOOM OUT ENTRANCE */}
          <ScrollReveal animation="zoom-out" duration={900} className="mt-14 sm:mt-20 lg:mt-24">
            <div className="relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#08245C] via-[#0A2C6B] to-[#051740] border border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_40px_80px_-30px_rgba(8,36,92,0.55)]">
              {/* Glow blobs */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#0875D1]/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-16 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_50%)]" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* LEFT: Hero visual */}
                <div className="lg:col-span-6 relative p-6 sm:p-10 lg:p-12 xl:p-14 order-2 lg:order-1">
                  <div className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] border border-white/10">
                    <Image
                      src="/images/badbaado-healthcare.jpg"
                      alt="BADBAADO Healthcare Coordination Platform"
                      fill
                      className="object-cover object-center hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050D24]/40 via-transparent to-transparent" />
                    {/* Floating metric badge */}
                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5 p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] border border-white/70 flex items-center gap-3 max-w-[220px]">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-extrabold tracking-wider text-emerald-700 uppercase">Live Pilot</div>
                        <div className="text-sm font-black text-[#08245C] tracking-tight">6 Regional Clinics</div>
                      </div>
                    </div>
                    {/* Floating response-time badge */}
                    <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 p-3.5 sm:p-4 rounded-2xl bg-[#08245C]/95 backdrop-blur-xl text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.35)] border border-white/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0875D1] to-cyan-500 flex items-center justify-center text-white shadow-md">
                      <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-extrabold tracking-wider text-white/60 uppercase">Saved</div>
                        <div className="text-sm font-black tracking-tight">35% Faster Response</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Content */}
                <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center space-y-5 sm:space-y-6 relative z-10 order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 self-start mb-2">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-[11px] font-extrabold tracking-[0.18em] text-white/85 uppercase">
                      Featured Case Study
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[44px] font-black text-white tracking-tight leading-[1.08]">
                    BADBAADO: Emergency Healthcare Coordination Platform
                  </h3>

                  <p className="text-sm sm:text-[15px] text-white/70 leading-relaxed max-w-xl">
                    A revolutionary AI-driven system designed to synchronize medical emergency responses and healthcare data across regional clinics. Streamlines patient triage, real-time ambulance routing, and cross-facility patient record transfer — reducing critical response times by 35%.
                  </p>

                  {/* Metric cards grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { value: "35%", label: "Faster Response", icon: Zap, accent: "from-[#0875D1]" },
                      { value: "12k+", label: "Patients / Managed", icon: Users, accent: "from-emerald-500" },
                      { value: "6", label: "Partner Clinics", icon: Target, accent: "from-amber-500" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="group p-3.5 sm:p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.accent} to-transparent flex items-center justify-center text-white shadow-md mb-2.5`}>
                          <stat.icon className="w-[18px] h-[18px]" />
                        </div>
                        <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-none">
                          {stat.value}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-white/55 font-semibold mt-1 leading-tight">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/projects/badbaado"
                      className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-[#0875D1] text-[#08245C] hover:text-white text-xs sm:text-sm font-bold shadow-[0_15px_35px_-10px_rgba(255,255,255,0.2)] transition-all duration-300 hover:shadow-[0_18px_40px_-10px_rgba(8,117,209,0.6)]">
                      View Full Case Study
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white/85 hover:text-white text-xs sm:text-sm font-bold backdrop-blur-sm transition-all"
                    >
                      Browse All Projects
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. SCIENTIFIC INQUIRY ("Research & Insights") - FADE RIGHT ENTRANCE */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-right" duration={850}>
            {/* Dark Navy Rounded Box */}
            <div className="bg-[#0A224E] text-white rounded-2xl sm:rounded-2xl p-8 sm:p-12 lg:p-14 shadow-xl relative overflow-hidden">
              {/* Header: Scientific Inquiry / Research & Insights / View Publications */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                  <span className="text-xs font-bold text-[#00B4D8] tracking-wider uppercase block mb-2">
                    SCIENTIFIC INQUIRY
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    Research &amp; Insights
                  </h2>
                </div>

                <Link
                  href="/research"
                  className="px-6 py-2.5 rounded-full bg-white text-[#0A224E] hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-sm transition self-start sm:self-auto shrink-0"
                >
                  View Publications
                </Link>
              </div>

              {/* 3 Dark Blue Cards Grid — Dynamic from DB */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {researchPapers && researchPapers.length > 0 ? (
                  researchPapers.slice(0, 3).map((paper) => (
                    <Link
                      key={paper.id}
                      href={`/research/${paper.slug}`}
                      className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-2xl sm:rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">
                          {paper.title}
                        </h3>
                        <p className="text-xs text-slate-300/90 leading-relaxed mb-6">
                          {paper.abstract}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">
                        Explore →
                      </div>
                    </Link>
                  ))
                ) : (
                  <>
                    <Link
                      href="/research/applied-technology"
                      className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-2xl sm:rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">Applied Technological Research</h3>
                        <p className="text-xs text-slate-300/90 leading-relaxed mb-6">Focusing on practical solutions for immediate industrial challenges in the local market.</p>
                      </div>
                      <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">Explore →</div>
                    </Link>
                    <Link
                      href="/research/student-innovations"
                      className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-2xl sm:rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">Student-Led Innovations</h3>
                        <p className="text-xs text-slate-300/90 leading-relaxed mb-6">Empowering the next generation of researchers to push academic boundaries into the real world.</p>
                      </div>
                      <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">Explore →</div>
                    </Link>
                    <Link
                      href="/research/digital-transformation"
                      className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-2xl sm:rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">Digital Future Transformation</h3>
                        <p className="text-xs text-slate-300/90 leading-relaxed mb-6">Strategic research into AI, Blockchain, and the impact of the 4th Industrial Revolution.</p>
                      </div>
                      <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">Explore →</div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9. COMMUNITY HUB ("Upcoming Events") - FADE UP ENTRANCE */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
              <div>
                <span className="text-xs font-bold text-[#0875D1] tracking-wider uppercase block mb-1.5">
                  COMMUNITY HUB
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#08245C] tracking-tight">
                  Upcoming Events
                </h2>
              </div>

              <Link
                href="/events"
                className="text-xs sm:text-sm font-bold text-[#0875D1] hover:underline underline-offset-4 transition shrink-0"
              >
                See All Events
              </Link>
            </div>

            {/* 3 Events Grid — Dynamic from DB */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              {upcomingEvents && upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 3).map((event) => {
                  const d = new Date(event.eventDate);
                  const day = d.getDate();
                  const month = d.toLocaleString("en", { month: "short" }).toUpperCase();
                  const fallbackImages = ["/images/event-summit.jpg", "/images/event-cyber.jpg", "/images/event-workshop.jpg"];
                  const coverImg =
                    event.coverImage && event.coverImage.startsWith("/")
                      ? event.coverImage
                      : event.coverImage && event.coverImage.startsWith("http")
                      ? event.coverImage
                      : null;
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="group block"
                    >
                      <div className="relative rounded-2xl sm:rounded-2xl overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100">
                        {coverImg ? (
                          <Image
                            src={coverImg}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Image
                            src={fallbackImages[upcomingEvents.indexOf(event) % 3]}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        {/* Date Badge */}
                        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 min-w-[46px]">
                          <div className="text-base sm:text-lg font-black text-[#08245C] leading-none">
                            {day}
                          </div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                            {month}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#08245C] tracking-tight mb-2 group-hover:text-[#0875D1] transition">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        <span className="text-xs font-bold text-[#08245C] group-hover:text-[#0875D1] transition-colors inline-flex items-center gap-1">
                          Read More →
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <>
                  <Link href="/events/janic-innovation-summit-2024" className="group block">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100">
                      <Image src="/images/event-summit.jpg" alt="JANIC Innovation Summit 2024" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 min-w-[46px]">
                        <div className="text-base font-black text-[#08245C] leading-none">18</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">OCT</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] tracking-tight mb-2 group-hover:text-[#0875D1] transition">JANIC Innovation Summit 2024</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3"><MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span>Main Campus Auditorium</span></div>
                      <span className="text-xs font-bold text-[#08245C] group-hover:text-[#0875D1] transition-colors inline-flex items-center gap-1">Read More →</span>
                    </div>
                  </Link>
                  <Link href="/events/cybersecurity-challenge-4" className="group block">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100">
                      <Image src="/images/event-cyber.jpg" alt="Cybersecurity Challenge 4.0" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 min-w-[46px]">
                        <div className="text-base font-black text-[#08245C] leading-none">04</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">NOV</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] tracking-tight mb-2 group-hover:text-[#0875D1] transition">Cybersecurity Challenge 4.0</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3"><MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span>Tech Lab B-02</span></div>
                      <span className="text-xs font-bold text-[#08245C] group-hover:text-[#0875D1] transition-colors inline-flex items-center gap-1">Read More →</span>
                    </div>
                  </Link>
                  <Link href="/events/ai-workshop-for-developers" className="group block">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100">
                      <Image src="/images/event-workshop.jpg" alt="AI Workshop for Developers" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 min-w-[46px]">
                        <div className="text-base font-black text-[#08245C] leading-none">15</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">DEC</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] tracking-tight mb-2 group-hover:text-[#0875D1] transition">AI Workshop for Developers</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3"><MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span>Hybrid / Online</span></div>
                      <span className="text-xs font-bold text-[#08245C] group-hover:text-[#0875D1] transition-colors inline-flex items-center gap-1">Read More →</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 10. PARTNERSHIPS ("Let's Build the Future Together") - BLUR IN ENTRANCE */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="blur-in" duration={850}>
            {/* Light Blue Outer Container */}
            <div className="bg-[#E9F3FD] rounded-2xl sm:rounded-2xl lg:rounded-2xl p-8 sm:p-12 lg:p-14 border border-blue-100/80 shadow-sm relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Side: Content & Actions */}
                <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                  <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] tracking-tight leading-tight">
                    Let&apos;s Build the Future Together
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md">
                    We believe in the power of collaboration. Partner with JANIC to drive technological advancement and impact.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/partnerships"
                      className="px-7 py-3.5 rounded-full bg-[#0A224E] hover:bg-[#071938] text-white font-bold text-xs sm:text-sm shadow-md transition"
                    >
                      Partner With Us
                    </Link>
                    <Link
                      href="/partnerships#partners"
                      className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0A224E] border border-slate-200/80 font-bold text-xs sm:text-sm shadow-sm transition"
                    >
                      View Our Partners
                    </Link>
                  </div>
                </div>

                {/* Right Side: Network Graph Visual */}
                <div className="lg:col-span-6">
                  <div className="relative rounded-2xl sm:rounded-2xl overflow-hidden aspect-[16/10] w-full shadow-lg border-2 border-white/80">
                    <Image
                      src="/images/partnership-network.jpg"
                      alt="Network Nodes Collaboration"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 11. CALL TO ACTION (MATCHING DESIGN MOCKUP) - ZOOM IN ENTRANCE */}
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
