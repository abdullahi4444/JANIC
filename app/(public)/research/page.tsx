import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ResearchService } from "@/services/research/research.service";
import { FlaskConical, FileText, ArrowRight, ExternalLink, Calendar, User, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Applied Research & Publications",
  description:
    "Peer-reviewed publications, student research papers, and technical whitepapers produced at JANIC, Faculty of CS & IT, Jazeera University.",
};

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const papers = await ResearchService.getPublishedPapers();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="Applied Research"
        title="Research That Creates Impact"
        description="Connecting academic computer science research with practical technology development to resolve healthcare, urban infrastructure, and educational challenges in Somalia."
        breadcrumbs={[{ label: "Research" }]}
      />

      {/* 2. RESEARCH PUBLICATIONS BENTO SECTION */}
      <section className="py-8 sm:py-14 bg-white min-h-[500px]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-blue-100/70 shadow-sm">
            <div className="mb-10 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1.5">
                PUBLICATIONS &amp; WORKING PAPERS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#08245C] tracking-tight">
                Peer-Reviewed Publications
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
                Authored by faculty researchers and student engineering fellows.
              </p>
            </div>

            <div className="space-y-6">
              {papers.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-white p-7 sm:p-9 rounded-[26px] border border-blue-100/80 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-[#0875D1] uppercase tracking-wide">
                      {paper.category}
                    </span>
                    {paper.publicationDate && (
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0875D1]" />
                        {formatDate(paper.publicationDate)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#08245C] tracking-tight leading-snug">
                    <Link
                      href={`/research/${paper.slug}`}
                      className="hover:text-[#0875D1] transition"
                    >
                      {paper.title}
                    </Link>
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <User className="w-3.5 h-3.5 text-[#0875D1]" />
                    <span>{paper.authors}</span>
                  </div>

                  {paper.journalOrConference && (
                    <p className="text-xs italic text-slate-500">
                      Published in: {paper.journalOrConference}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {paper.abstract}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs text-slate-400 font-medium">
                      {paper.doi ? `DOI: ${paper.doi}` : "JANIC Academic Working Paper"}
                    </div>
                    <div className="flex items-center gap-3">
                      {paper.pdfUrl && (
                        <a
                          href={paper.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-red-500" />
                          PDF Document
                        </a>
                      )}
                      <Link
                        href={`/research/${paper.slug}`}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs font-bold transition shadow-sm"
                      >
                        Read Paper <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
