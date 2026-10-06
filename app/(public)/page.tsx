import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Cpu,
  GraduationCap,
  Rocket,
  FlaskConical,
  Briefcase,
  Globe2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Activity,
  Layers,
  Award,
  BookOpen,
  Users2,
  ExternalLink,
  Shield,
  Cloud,
  Binary,
  Code2,
} from "lucide-react";
import { ProjectService } from "@/services/projects/project.service";
import { TrainingService } from "@/services/training/training.service";
import { ResearchService } from "@/services/research/research.service";
import { EventService } from "@/services/events/event.service";
import { InnovationPipelineNodes } from "@/components/public/InnovationPipelineNodes";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, researchPapers, upcomingEvents] = await Promise.all([
    ProjectService.getPublishedProjects({ limit: 6 }),
    ResearchService.getPublishedPapers({ limit: 3 }),
    EventService.getUpcomingEvents(3),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION (MATCHING DESIGN MOCKUP) */}
      <section className="bg-white pt-6 pb-10 sm:pt-8 sm:pb-12">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Hero Card with Futuristic Lab Backdrop */}
          <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[580px] lg:min-h-[640px] flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-2xl">
            {/* Background Image */}
            <Image
              src="/images/janic-hero-lab.jpg"
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
                  <div className="text-xl font-black text-white leading-tight">18+</div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                    STUDENT INNOVATION PROJECTS
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Two-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10 pt-10 sm:pt-16">
              {/* Left Column: Main Typography */}
              <div className="lg:col-span-7 space-y-5">
                <h1 className="text-4xl sm:text-5xl lg:text-[4.25rem] font-black text-white tracking-tight leading-[1.08]">
                  Innovating <br />
                  Technology. <br />
                  Empowering the <br />
                  Future.
                </h1>
                <p className="text-white/90 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl">
                  The leading institutional hub for technological transformation, advanced research, and digital excellence.
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

          {/* 2. IMPACT STATS BAR (MATCHING MOCKUP STRIP) */}
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
        </div>
      </section>

      {/* 3. ABOUT THE CENTER (MATCHING DESIGN MOCKUP) */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* 4. OUR FUNCTIONS — COMPREHENSIVE TECH SOLUTIONS (MATCHING DESIGN MOCKUP) */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* 5. INNOVATION HUB WORKFLOW PIPELINE */}
      <section className="py-16 sm:py-24 bg-[#051329] text-white relative overflow-hidden border-b border-blue-900/60">
        {/* Subtle architectural backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
        </div>
      </section>

      {/* 6. PROJECTS PORTFOLIO: INNOVATION IN ACTION & FEATURED CASE STUDY */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <span className="text-xs sm:text-sm font-bold text-[#0875D1] tracking-wider uppercase block mb-1.5">
              PROJECTS PORTFOLIO
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#08245C] tracking-tight">
              Innovation in Action
            </h2>
          </div>

          {/* 4 Projects Bento Grid (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
            {/* Column 1 (Left): MAAL HUB (Tall) & SAHAL SACCO (Compact) */}
            <div className="flex flex-col gap-5 lg:gap-6">
              {/* Card 1: MAAL HUB */}
              <Link
                href="/projects/maal-hub"
                className="group relative rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[320px] sm:h-[370px] lg:h-[390px] flex flex-col justify-end p-6 sm:p-8"
              >
                <Image
                  src="/images/maal-hub.jpg"
                  alt="MAAL HUB"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:via-black/40 transition-colors" />

                {/* Badge Top Left */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-800 uppercase shadow-sm">
                    FINTECH
                  </span>
                </div>

                {/* Text Bottom Left */}
                <div className="relative z-10 space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    MAAL HUB
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-md">
                    Integrated financial management system for micro-enterprises.
                  </p>
                </div>
              </Link>

              {/* Card 2: SAHAL SACCO */}
              <Link
                href="/projects/sahal-sacco"
                className="group relative rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[220px] sm:h-[250px] lg:h-[270px] flex flex-col justify-end p-6 sm:p-8"
              >
                <Image
                  src="/images/sahal-sacco.jpg"
                  alt="SAHAL SACCO"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:via-black/40 transition-colors" />

                {/* Badge Top Left */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-800 uppercase shadow-sm">
                    SAAS
                  </span>
                </div>

                {/* Text Bottom Left */}
                <div className="relative z-10 space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    SAHAL SACCO
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-md">
                    Automating credit and savings operations.
                  </p>
                </div>
              </Link>
            </div>

            {/* Column 2 (Right): Robot Car Cleaner & BADBAADO Platform */}
            <div className="flex flex-col gap-5 lg:gap-6">
              {/* Card 3: Robot Car Cleaner */}
              <Link
                href="/projects/robot-car-cleaner"
                className="group relative rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[270px] sm:h-[310px] lg:h-[330px] flex flex-col justify-end p-6 sm:p-7"
              >
                <Image
                  src="/images/robot-car-cleaner.jpg"
                  alt="Robot Car Cleaner"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:via-black/40 transition-colors" />

                {/* Badge Top Left */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-800 uppercase shadow-sm">
                    ROBOTICS
                  </span>
                </div>

                {/* Text Bottom Left */}
                <div className="relative z-10 space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Robot Car Cleaner
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed max-w-md">
                    Autonomous cleaning solutions for urban environments.
                  </p>
                </div>
              </Link>

              {/* Card 4: BADBAADO Platform */}
              <Link
                href="/projects/badbaado"
                className="group relative rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[270px] sm:h-[310px] lg:h-[330px] flex flex-col justify-end p-6 sm:p-7"
              >
                <Image
                  src="/images/badbaado-safety.jpg"
                  alt="BADBAADO Platform"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:via-black/40 transition-colors" />

                {/* Badge Top Left */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-800 uppercase shadow-sm">
                    SAFETY TECH
                  </span>
                </div>

                {/* Text Bottom Left */}
                <div className="relative z-10 space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    BADBAADO Platform
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed max-w-md">
                    Digital coordination for emergency health services.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Featured Case Study: BADBAADO Healthcare Coordination Platform */}
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <div className="bg-[#F0F6FE] rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] p-6 sm:p-8 md:p-10 lg:p-12 border border-blue-100/60 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left: Clinical Visual */}
                <div className="lg:col-span-6">
                  <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden aspect-[4/3] w-full shadow-sm border border-white/60">
                    <Image
                      src="/images/badbaado-healthcare.jpg"
                      alt="BADBAADO Healthcare Coordination Platform"
                      fill
                      className="object-cover object-center hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Right: Content */}
                <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                  <span className="text-xs font-bold text-[#0875D1] tracking-wider uppercase block">
                    FEATURED PROJECT
                  </span>

                  <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#08245C] tracking-tight leading-snug">
                    BADBAADO Healthcare Coordination Platform
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                    A revolutionary platform designed to synchronize medical emergency responses and healthcare data across regional clinics. It streamlines patient data transfer and reduces critical response times by 35%.
                  </p>

                  {/* Metrics */}
                  <div className="flex items-center gap-10 sm:gap-14 pt-2">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#08245C] tracking-tight">
                        35%
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        Faster Response Time
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#08245C] tracking-tight">
                        12k+
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        Patients Managed
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <Link
                      href="/projects/badbaado"
                      className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all group"
                    >
                      View Case Study
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 9. SCIENTIFIC INQUIRY ("Research & Insights") */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dark Navy Rounded Box */}
          <div className="bg-[#0A224E] text-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 lg:p-14 shadow-xl relative overflow-hidden">
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

            {/* 3 Dark Blue Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Paper 1 */}
              <Link
                href="/research/applied-technology"
                className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-[22px] sm:rounded-[24px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">
                    Applied Technological Research
                  </h3>
                  <p className="text-xs text-slate-300/90 leading-relaxed mb-6">
                    Focusing on practical solutions for immediate industrial challenges in the local market.
                  </p>
                </div>
                <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">
                  Explore →
                </div>
              </Link>

              {/* Paper 2 */}
              <Link
                href="/research/student-innovations"
                className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-[22px] sm:rounded-[24px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">
                    Student-Led Innovations
                  </h3>
                  <p className="text-xs text-slate-300/90 leading-relaxed mb-6">
                    Empowering the next generation of researchers to push academic boundaries into the real world.
                  </p>
                </div>
                <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">
                  Explore →
                </div>
              </Link>

              {/* Paper 3 */}
              <Link
                href="/research/digital-transformation"
                className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-[22px] sm:rounded-[24px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">
                    Digital Future Transformation
                  </h3>
                  <p className="text-xs text-slate-300/90 leading-relaxed mb-6">
                    Strategic research into AI, Blockchain, and the impact of the 4th Industrial Revolution.
                  </p>
                </div>
                <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">
                  Explore →
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. COMMUNITY HUB ("Upcoming Events") */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* 3 Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {/* Event 1 */}
            <Link
              href="/events/janic-innovation-summit-2024"
              className="group block"
            >
              <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100">
                <Image
                  src="/images/event-summit.jpg"
                  alt="JANIC Innovation Summit 2024"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Date Badge */}
                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 min-w-[46px]">
                  <div className="text-base sm:text-lg font-black text-[#08245C] leading-none">
                    18
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    OCT
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#08245C] tracking-tight mb-2 group-hover:text-[#0875D1] transition">
                  JANIC Innovation Summit 2024
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Main Campus Auditorium</span>
                </div>
                <span className="text-xs font-bold text-[#08245C] group-hover:text-[#0875D1] transition-colors inline-flex items-center gap-1">
                  Read More →
                </span>
              </div>
            </Link>

            {/* Event 2 */}
            <Link
              href="/events/cybersecurity-challenge-4"
              className="group block"
            >
              <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100">
                <Image
                  src="/images/event-cyber.jpg"
                  alt="Cybersecurity Challenge 4.0"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Date Badge */}
                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 min-w-[46px]">
                  <div className="text-base sm:text-lg font-black text-[#08245C] leading-none">
                    04
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    NOV
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#08245C] tracking-tight mb-2 group-hover:text-[#0875D1] transition">
                  Cybersecurity Challenge 4.0
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Tech Lab B-02</span>
                </div>
                <span className="text-xs font-bold text-[#08245C] group-hover:text-[#0875D1] transition-colors inline-flex items-center gap-1">
                  Read More →
                </span>
              </div>
            </Link>

            {/* Event 3 */}
            <Link
              href="/events/ai-workshop-for-developers"
              className="group block"
            >
              <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100">
                <Image
                  src="/images/event-workshop.jpg"
                  alt="AI Workshop for Developers"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Date Badge */}
                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 min-w-[46px]">
                  <div className="text-base sm:text-lg font-black text-[#08245C] leading-none">
                    15
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    DEC
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#08245C] tracking-tight mb-2 group-hover:text-[#0875D1] transition">
                  AI Workshop for Developers
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Hybrid / Online</span>
                </div>
                <span className="text-xs font-bold text-[#08245C] group-hover:text-[#0875D1] transition-colors inline-flex items-center gap-1">
                  Read More →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. PARTNERSHIPS ("Let's Build the Future Together") */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Light Blue Outer Container */}
          <div className="bg-[#E9F3FD] rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] p-8 sm:p-12 lg:p-14 border border-blue-100/80 shadow-sm relative overflow-hidden">
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
                <div className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden aspect-[16/10] w-full shadow-lg border-2 border-white/80">
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
        </div>
      </section>

      {/* 12. CALL TO ACTION (MATCHING DESIGN MOCKUP) */}
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
