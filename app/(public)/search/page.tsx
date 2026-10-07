import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import prisma from "@/lib/db/prisma";

export const metadata = {
  title: "Search",
  description: "Search JANIC projects, research papers, events, and training programs.",
};

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const [projects, papers, events, programs] = query
    ? await Promise.all([
        prisma.project.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: query } },
              { summary: { contains: query } },
              { category: { contains: query } },
            ],
          },
          take: 5,
        }),
        prisma.researchPaper.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: query } },
              { abstract: { contains: query } },
              { authors: { contains: query } },
            ],
          },
          take: 5,
        }),
        prisma.event.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: query } },
              { summary: { contains: query } },
              { location: { contains: query } },
            ],
          },
          take: 5,
        }),
        prisma.trainingProgram.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: query } },
              { summary: { contains: query } },
              { category: { contains: query } },
            ],
          },
          take: 5,
        }),
      ])
    : [[], [], [], []];

  const total = projects.length + papers.length + events.length + programs.length;

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      <SectionHero
        badge="Search"
        title="Search JANIC"
        description="Find projects, research papers, training programs, and events."
        breadcrumbs={[{ label: "Search" }]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form action="/search" className="flex gap-3">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search..."
              className="flex-1 rounded-full border border-slate-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1]/40"
            />
            <button className="rounded-full bg-[#008A08] px-6 py-3 text-sm font-semibold text-white">
              Search
            </button>
          </form>

          {query && (
            <p className="mt-6 text-sm text-slate-500">
              {total} result{total === 1 ? "" : "s"} for &quot;{query}&quot;
            </p>
          )}

          {projects.length > 0 && (
            <Group title="Projects" items={projects.map((p) => ({ title: p.title, href: `/projects/${p.slug}`, meta: p.category }))} />
          )}
          {programs.length > 0 && (
            <Group title="Training" items={programs.map((p) => ({ title: p.title, href: `/training/${p.slug}`, meta: p.category }))} />
          )}
          {papers.length > 0 && (
            <Group title="Research" items={papers.map((p) => ({ title: p.title, href: `/research/${p.slug}`, meta: p.authors }))} />
          )}
          {events.length > 0 && (
            <Group title="Events" items={events.map((e) => ({ title: e.title, href: `/events/${e.slug}`, meta: e.location }))} />
          )}

          {query && total === 0 && (
            <p className="mt-10 text-center text-slate-400">No results found. Try another keyword.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function Group({
  title,
  items,
}: {
  title: string;
  items: { title: string; href: string; meta: string }[];
}) {
  return (
    <div className="mt-8">
      <h2 className="text-xs font-bold uppercase tracking-wider text-[#0875D1] mb-3">{title}</h2>
      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li key={item.href} className="py-3">
            <Link href={item.href} className="text-sm font-bold text-[#08245C] hover:text-[#0875D1]">
              {item.title}
            </Link>
            <p className="text-xs text-slate-400">{item.meta}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
