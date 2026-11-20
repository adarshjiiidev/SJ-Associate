import * as React from "react";
import { Link } from "react-router-dom";
import { PRACTICE_AREAS } from "@/src/data/firmData";
import { Button } from "@/src/components/ui/button";
import { CorporateSolutionsSection } from "@/src/components/CorporateSolutionsSection";
import { PracticeWorkflowShowcase } from "@/src/components/PracticeWorkflowShowcase";
import { FirmLogo } from "@/src/components/FirmLogo";
import { Scale, ArrowRight, CheckCircle2, Landmark } from "lucide-react";

interface PracticeAreasPageProps {
  onOpenConsultation: (briefNote?: string) => void;
}

export function PracticeAreasPage({ onOpenConsultation }: PracticeAreasPageProps) {
  return (
    <div className="min-h-screen bg-[#F3FAFF] text-[#0A2536]">
      <section className="bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/45 border-b border-border py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <FirmLogo size={24} />
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#33566D]">
                  PRACTICE AREAS · DIRECT AND INDIRECT TAXES &amp; REGULATORY PRACTICE
                </div>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#0A2536]">
                Direct and Indirect Taxes &amp; Regulatory Practice
              </h1>
              <p className="mt-3 text-[#33566D] max-w-3xl text-base leading-relaxed">
                The Firm&apos;s Direct Tax and Indirect Tax teams are well-equipped and dedicated to
                render advice, handle managed compliances, and litigate across the entire spectrum
                of Goods and Services Tax (&lsquo;GST&rsquo;), Customs, Income Tax, Foreign Trade
                Policy, and allied regulatory laws. We understand the business, accounting and legal
                intricacies affecting taxation.
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-none"
              onClick={() => onOpenConsultation()}
            >
              Book Consultation
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* FULL DIRECT TAX & INDIRECT TAX (GOODS AND SERVICES TAX) PRACTICE PROFILES — VAISH LAW STYLE */}
      <section className="py-12 border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Indirect Tax / Goods and Services Tax */}
          <div className="rounded-none border border-[#0A2536]/20 bg-[#F3FAFF]/60 p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#0A2536]/15 pb-3">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#33566D]">
                  INDIRECT TAXATION WING
                </div>
                <h2 className="font-display text-3xl font-bold text-[#0A2536] mt-0.5">
                  Goods and Services Tax &amp; Customs
                </h2>
              </div>
              <Scale className="h-6 w-6 text-[#0A2536] shrink-0" />
            </div>

            <p className="text-sm text-[#33566D] leading-relaxed">
              The Firm&apos;s Indirect Tax team is well-equipped and dedicated to render advice and
              litigate across the entire spectrum of indirect tax laws. The team aims at suggesting
              practical and innovative solutions to its clients and has expertise in the following
              areas: Goods and Services Tax (&lsquo;GST&rsquo;), Customs, Service Tax, Central Sales
              Tax/Value Added Tax (&lsquo;VAT&rsquo;), Central Excise, etc.
            </p>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-mono uppercase tracking-wider font-bold text-[#0A2536]">
                The Firm has a dedicated team of experts who are engaged in providing, inter alia,
                the following services:
              </p>
              <ul className="space-y-2 text-sm text-[#0A2536] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0A2536] shrink-0 mt-0.5" />
                  <span>
                    Litigation before all forums (Commissioner (Appeals), GST Appellate Tribunal
                    &lsquo;GSTAT&rsquo;, High Court, Supreme Court, and tax authorities)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0A2536] shrink-0 mt-0.5" />
                  <span>
                    Advisory and Consultancy across Trading, Manufacturing, Infrastructure, Real
                    Estate, Hospitality, Software, Retail Trade, Management Consultancy, Education,
                    Automobile, Auto-ancillaries, Logistics and Service Industries, etc.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0A2536] shrink-0 mt-0.5" />
                  <span>
                    Managed Services in the area of Compliance and Regulatory matters on an
                    all-India basis which includes within its ambit Goods and Services Tax
                    registration, filing of returns, bookkeeping, Show Cause Notice (SCN)
                    replies, refunds under Foreign Trade Policy Schemes, etc.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Direct Tax / Income Tax */}
          <div className="rounded-none border border-[#0A2536]/20 bg-[#F3FAFF]/60 p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#0A2536]/15 pb-3">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#33566D]">
                  DIRECT TAXATION WING
                </div>
                <h2 className="font-display text-3xl font-bold text-[#0A2536] mt-0.5">
                  Income Tax, Corporate Tax &amp; Wealth Tax
                </h2>
              </div>
              <Landmark className="h-6 w-6 text-[#0A2536] shrink-0" />
            </div>

            <p className="text-sm text-[#33566D] leading-relaxed">
              The Direct Tax team comprising lawyers and tax professionals offers a comprehensive
              array of Income Tax, Corporate Tax, and Wealth Tax advisory, compliance, and
              litigation services for businesses, partnership firms, and organisations in various
              sectors. We understand the business, accounting and legal intricacies affecting
              taxation.
            </p>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-mono uppercase tracking-wider font-bold text-[#0A2536]">
                The Firm has a dedicated team of experts who are engaged in providing, inter alia,
                the following services:
              </p>
              <ul className="space-y-2 text-sm text-[#0A2536] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0A2536] shrink-0 mt-0.5" />
                  <span>
                    Litigation before all forums (Supreme Court, High Court, CIT (Appeals), and tax
                    authorities)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0A2536] shrink-0 mt-0.5" />
                  <span>
                    Income Tax Consultancy and Income Tax Return (ITR) Filing relating to domestic
                    and cross-border tax issues, Corporate Tax, Wealth Tax, strategic tax planning,
                    and capital gains structuring
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0A2536] shrink-0 mt-0.5" />
                  <span>
                    Quarterly TDS Return Filing, Compliance and Regulatory services including
                    scrutiny assessments (Sec. 143(3)), and reassessment representation
                    (Sec. 148A/148)
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-xs text-[#33566D] leading-relaxed border-t border-[#0A2536]/10 pt-3">
              The Direct Tax team is acclaimed for its ability to find novel solutions to meet
              clients&apos; needs while addressing the complexities of constantly changing tax
              regimes. We have always endeavored to deliver efficient and cost effective services
              appreciating the specific needs of clients, so as to provide maximum value.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRACTICE_AREAS.map((area, index) => (
              <div
                key={area.id}
                className="rounded-none border border-[#0A2536]/20 bg-white p-7 flex flex-col justify-between hover:border-[#0A2536]/50 transition-colors shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#33566D]">
                      0{index + 1} · {area.typicalForums[0]}
                    </span>
                    <Scale className="h-4 w-4 text-[#0A2536]" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#0A2536]">
                    {area.title}
                  </h2>
                  <p className="mt-3 text-sm text-[#33566D] leading-relaxed">
                    {area.summary}
                  </p>

                  <div className="mt-6 pt-5 border-t border-border">
                    <div className="font-mono text-[11px] uppercase tracking-widest text-[#0A2536] font-semibold mb-3">
                      The Firm Has A Dedicated Team Engaged In Providing, Inter Alia, The Following Services:
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {area.representationScope.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-[#0A2536] leading-relaxed"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#33566D] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <Link
                    to="/courts"
                    className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-[#0A2536]"
                  >
                    See Courts &amp; Tribunals →
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none"
                    onClick={() => onOpenConsultation(area.title)}
                  >
                    Consult on {area.shortTitle}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete 15 Services & Practice Distribution Graph */}
      <CorporateSolutionsSection
        onSelectSolution={(solution) => onOpenConsultation(solution.title)}
        onRequestSelected={(briefNote) => onOpenConsultation(briefNote)}
      />

      {/* Interactive Workflow Showcase */}
      <PracticeWorkflowShowcase onOpenConsultation={(briefNote) => onOpenConsultation(briefNote)} />
    </div>
  );
}
