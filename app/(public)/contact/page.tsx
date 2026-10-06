import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapPin, Mail, Phone, Clock, Building, Globe, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Contact JANIC",
  description:
    "Get in touch with the Jazeera Nexus Innovation Center at Jazeera University in Mogadishu, Somalia.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const resolvedParams = await searchParams;
  const initialSubject = resolvedParams.subject || "";

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="Get in Touch"
        title="Contact JANIC"
        description="Have questions about student projects, professional training cohorts, or institutional research collaboration? Reach out to our team."
        breadcrumbs={[{ label: "Contact" }]}
      />

      {/* 2. CONTACT BENTO CANVAS - FADE UP */}
      <section className="py-8 sm:py-14 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-14 border border-blue-100/70 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Contact Details (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-8 rounded-[28px] border border-blue-100/80 shadow-sm space-y-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1">
                        Campus Location
                      </span>
                      <h3 className="text-xl font-bold text-[#08245C] tracking-tight">
                        Jazeera University Main Campus
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Faculty of Computer Science &amp; IT, 2nd Floor Innovation Wing
                      </p>
                    </div>

                    <div className="space-y-4 text-xs text-slate-600">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0875D1] flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-[#08245C]">Address:</strong>
                          <p>KM4 District, Airport Road, Mogadishu, Somalia</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0875D1] flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-[#08245C]">Email:</strong>
                          <p>
                            <a
                              href="mailto:info@janic.edu.so"
                              className="text-[#0875D1] font-semibold hover:underline"
                            >
                              info@janic.edu.so
                            </a>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0875D1] flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-[#08245C]">Telephone:</strong>
                          <p>+252 61 555 1234 / +252 61 987 6543</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0875D1] flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-[#08245C]">Office Hours:</strong>
                          <p>Saturday – Thursday: 8:00 AM – 5:00 PM</p>
                          <p className="text-[11px] text-slate-400">Friday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Institution Accreditation Card (Dark Navy) */}
                  <div className="bg-[#0A224E] text-white p-7 sm:p-8 rounded-[28px] space-y-2 shadow-lg border border-blue-900/60">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                      <ShieldCheck className="w-4 h-4" /> Academic Affiliation
                    </div>
                    <h4 className="text-base font-bold text-white">Jazeera University</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Accredited by the Ministry of Education, Culture and Higher Education of the Federal Government of Somalia.
                    </p>
                  </div>
                </div>

                {/* Contact Form (7 cols) */}
                <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[28px] border border-blue-100/80 shadow-md space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1">
                      Send a Message
                    </span>
                    <h2 className="text-2xl font-bold text-[#08245C] tracking-tight">
                      How Can We Collaborate?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Complete the form below. A JANIC department coordinator will respond within 1–2 business days.
                    </p>
                  </div>

                  <ContactForm initialSubject={initialSubject} />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
