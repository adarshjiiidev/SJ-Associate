import * as React from "react";
import { Link } from "react-router-dom";
import { FIRM_IDENTITY, PRINCIPAL_ADVOCATE } from "@/src/data/firmData";
import { ADVOCATE_DESK_IMAGE } from "@/src/data/assets";
import { Button } from "@/src/components/ui/button";
import { AdvocatePortrait } from "@/src/components/AdvocatePortrait";
import { ResilientImage } from "@/src/components/ResilientImage";
import { HonoursCertificatesSection } from "@/src/components/HonoursCertificatesSection";
import { FirmLogo } from "@/src/components/FirmLogo";
import { Scale, Landmark, ArrowRight, ShieldCheck } from "lucide-react";

interface AboutPageProps {
  onOpenConsultation: () => void;
}

export function AboutPage({ onOpenConsultation }: AboutPageProps) {
  const firstHalfPoints = [
    {
      code: "POINT 01 · ABOUT THE FOUNDER",
      heading: "Set Up In 2009 — Dedicated Legal & Taxation Practice",
      body: PRINCIPAL_ADVOCATE.overview[0],
    },
    {
      code: "POINT 02 · NATIONAL REACH & APPROACH",
      heading: "New Delhi, Delhi NCR & Pan-India Associate Representation",
      body: PRINCIPAL_ADVOCATE.overview[1],
    },
    {
      code: "POINT 03 · FULL-SPECTRUM TAX & LEGAL SERVICES",
      heading: "Serving Small Enterprises To Large Industrial Houses",
      body: PRINCIPAL_ADVOCATE.overview[2],
    },
  ];

  const secondHalfPoints = [
    {
      code: "POINT 04 · EXPERTISE & BROAD PRACTICE AREAS",
      heading: "Direct and Indirect Taxes & Regulatory Combination",
      body: PRINCIPAL_ADVOCATE.overview[3],
    },
    {
      code: "POINT 05 · CLIENT SATISFACTION & OUR VISION",
      heading: "Multi-Skilled Knowledge Based Law & Tax Firm",
      body: PRINCIPAL_ADVOCATE.overview[4],
    },
    {
      code: "POINT 06 · OUR MISSION",
      heading: "Qualitative, Innovative & Time-Bound Professional Advice",
      body: PRINCIPAL_ADVOCATE.overview[5],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3FAFF] text-[#0A2536]">
      {/* FIRST IMAGE PART: FOUNDER PORTRAIT + FIRST HALF OF RECTANGULAR POINTS (POINTS 01–03) */}
      <section className="bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/50 border-b border-[#0A2536]/15 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <AdvocatePortrait className="aspect-[4/5] w-full max-w-md mx-auto rounded-none border-[#0A2536]/25 shadow-sm" />
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <FirmLogo size={28} />
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#33566D]">
                  ETHICS · HUMAN VALUES · EXCELLENCE · NEW DELHI
                </div>
              </div>

              <div>
                <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#0A2536]">
                  {PRINCIPAL_ADVOCATE.name}
                </h1>
                <p className="mt-1.5 font-mono text-xs uppercase tracking-widest text-[#33566D]">
                  {PRINCIPAL_ADVOCATE.designation} · {FIRM_IDENTITY.name}
                </p>
              </div>

              {/* First Half of Rectangular Points (01, 02, 03) */}
              <div className="space-y-4">
                {firstHalfPoints.map((pt) => (
                  <div
                    key={pt.code}
                    className="rounded-none border border-[#0A2536]/20 bg-white p-5 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-[#0A2536]/10 pb-2 mb-2.5">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#0A2536]">
                        {pt.code}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#33566D]">
                        {FIRM_IDENTITY.name}
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-bold text-[#0A2536] mb-1.5">
                      {pt.heading}
                    </h2>
                    <p className="text-sm sm:text-[15px] text-[#33566D] leading-relaxed">
                      {pt.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-none"
                  onClick={() => onOpenConsultation()}
                >
                  Book a Consultation
                </Button>
                <Link to="/courts">
                  <Button variant="outline" size="lg" className="rounded-none">
                    Open Live Court Updates
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECOND IMAGE PART: LAW OFFICE DESK + SECOND HALF OF RECTANGULAR POINTS (POINTS 04–06) */}
      <section className="py-14 border-b border-[#0A2536]/15 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-none border border-[#0A2536]/20 bg-[#F3FAFF]/60 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <div className="rounded-none border border-[#0A2536]/20 bg-white overflow-hidden">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <ResilientImage
                    src={ADVOCATE_DESK_IMAGE}
                    alt="S J Associates Law and Tax Office Desk"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="border-t border-[#0A2536]/15 bg-[#0A2536] px-5 py-3.5 text-[#F3FAFF] flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#DAF6EF]">
                      NEW DELHI, NCR &amp; MUZAFFARPUR (BIHAR)
                    </p>
                    <p className="text-xs font-semibold text-[#F3FAFF] mt-0.5">
                      Direct &amp; Indirect Tax · Corporate · Labour, Civil &amp; Criminal Litigation
                    </p>
                  </div>
                  <FirmLogo size={26} variant="light" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#33566D]">
                  OUR VISION, MISSION &amp; CLIENT COMMITMENT · NEW DELHI
                </div>
                <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#0A2536] leading-tight">
                  Driven By Ethics, Human Values &amp; Excellence
                </h2>
              </div>

              {/* Second Half of Rectangular Points (04, 05, 06) */}
              <div className="space-y-4">
                {secondHalfPoints.map((pt, idx) => (
                  <div
                    key={pt.code}
                    className="rounded-none border border-[#0A2536]/20 bg-white p-5 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-[#0A2536]/10 pb-2 mb-2.5">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#0A2536]">
                        {pt.code}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#33566D]">
                        ETHICS · EXCELLENCE
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#0A2536] mb-1.5">
                      {pt.heading}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-[#33566D] leading-relaxed">
                      {pt.body}
                    </p>

                    {idx === 2 && (
                      <ul className="mt-3 border-t border-[#0A2536]/10 pt-3 space-y-1.5 text-xs sm:text-sm text-[#0A2536]">
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 bg-[#0A2536] shrink-0" />
                          <span>
                            Clients with qualitative and innovative professional advice in a time
                            bound and cost effective manner;
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 bg-[#0A2536] shrink-0" />
                          <span>
                            Advocates and tax professionals with a conducive environment for all
                            round growth and development.
                          </span>
                        </li>
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honours, Memberships & Certificates of Practice */}
      <HonoursCertificatesSection />

      {/* 3 Practice Teams Rectangular Summary */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-none border border-[#0A2536]/20 bg-white p-6 shadow-xs">
              <Scale className="h-6 w-6 text-[#0A2536] mb-3" />
              <h2 className="font-display text-2xl font-bold text-[#0A2536]">
                1. Goods and Services Tax
              </h2>
              <p className="mt-2 text-sm text-[#33566D] leading-relaxed">
                The Firm&apos;s Indirect Tax team is well-equipped and dedicated to render advice
                and litigate across the entire spectrum of indirect tax laws—covering Goods and
                Services Tax (&lsquo;GST&rsquo;), Customs, GST Registration, Return Filing, SCN
                Replies, Commissioner (Appeals), GSTAT Appeals, and High Court Tax Writs.
              </p>
            </div>

            <div className="rounded-none border border-[#0A2536]/20 bg-white p-6 shadow-xs">
              <Landmark className="h-6 w-6 text-[#0A2536] mb-3" />
              <h2 className="font-display text-2xl font-bold text-[#0A2536]">
                2. Income Tax, Corporate Tax &amp; Wealth Tax
              </h2>
              <p className="mt-2 text-sm text-[#33566D] leading-relaxed">
                The Direct Tax team comprising lawyers and tax professionals offers a comprehensive
                array of tax advisory, compliance, and litigation services—including Income Tax
                Consultancy, Income Tax Return Filing, TDS Return Filing, Corporate Tax, Wealth Tax,
                and representation before Assessing Authorities, CIT(Appeals), and High Courts.
              </p>
            </div>

            <div className="rounded-none border border-[#0A2536]/20 bg-white p-6 shadow-xs">
              <ShieldCheck className="h-6 w-6 text-[#0A2536] mb-3" />
              <h2 className="font-display text-2xl font-bold text-[#0A2536]">
                3. Corporate, Registrations &amp; Litigation
              </h2>
              <p className="mt-2 text-sm text-[#33566D] leading-relaxed">
                Comprehensive support across Bookkeeping &amp; Accounting, DGFT Compliances, MSME
                Registration, Trademark Registration, Partnership Firm Registration, Company
                Registration, and Criminal, Civil, Labour Law Litigation &amp; Arbitration across
                Delhi, Bihar, and India.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
