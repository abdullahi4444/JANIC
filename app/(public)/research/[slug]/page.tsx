import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResearchService } from "@/services/research/research.service";
import { SectionHero } from "@/components/layout/SectionHero";
import { FileText, Calendar, User, ArrowLeft, ExternalLink, Bookmark } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = await ResearchService.getPaperBySlug(slug);
  if (!paper) return { title: "Paper Not Found | JANIC" };

  return {
    title: `${paper.title} | JANIC`,
    description: paper.abstract,
  };
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = await ResearchService.getPaperBySlug(slug);

  if (!paper || paper.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div>
      <SectionHero
        badge={paper.category}
        title={paper.title}
        description={`Authored by ${paper.authors}`}
        breadcrumbs={[
          { label: "Research", href: "/research" },
          { label: paper.title },
        ]}
      />

      <div className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <User className="w-3.5 h-3.5 text-[#0875D1]" />
                {paper.authors}
              </span>
              {paper.publicationDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(paper.publicationDate)}
                </span>
              )}
            </div>

            {paper.journalOrConference && (
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 font-medium">
                <strong>Publication Source:</strong> {paper.journalOrConference}
                {paper.doi && <span className="block text-[11px] text-blue-700 mt-0.5">DOI: {paper.doi}</span>}
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-[#08245C] mb-3">Abstract</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {paper.abstract}
              </p>
            </div>

            {paper.content && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-[#08245C] mb-3">Key Findings & Discussion</h3>
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {paper.content}
                </div>
              </div>
            )}

            {paper.pdfUrl && (
              <div className="pt-6 border-t border-slate-100">
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white font-semibold text-xs shadow-md transition"
                >
                  <FileText className="w-4 h-4" />
                  Download Full Manuscript (PDF)
                </a>
              </div>
            )}
          </div>

          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0875D1] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
