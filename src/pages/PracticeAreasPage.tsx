import * as React from "react";
import { Link } from "react-router-dom";
import { PRACTICE_AREAS } from "@/src/data/firmData";
import { Button } from "@/src/components/ui/button";
import { CorporateSolutionsSection } from "@/src/components/CorporateSolutionsSection";
import { PracticeWorkflowShowcase } from "@/src/components/PracticeWorkflowShowcase";
import { Scale, ArrowRight, CheckCircle2 } from "lucide-react";

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
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#33566D] mb-2">
                AREAS OF PRACTICE · NEW DELHI CHAMBERS
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#0A2536]">
                How We Can Help You
              </h1>
              <p className="mt-3 text-[#33566D] max-w-2xl text-base leading-relaxed">
                Our chambers represent clients across three structured sections: GST &amp; Tax
                (Registration, Return Filing, SCN Reply, GSTAT Appeal, Commissioner Appeal, High
                Court Appeal), Income Tax (Return Filing, TDS Return Filing, Consultancy, Other
                Matters), and Others (Accounting &amp; Bookkeeping, DGFT Work, MSME Registration,
                Trademark Registration, Partnership Firm Registration).
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-full"
              onClick={() => onOpenConsultation()}
            >
              Book Consultation
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRACTICE_AREAS.map((area, index) => (
              <div
                key={area.id}
                className="rounded-[24px] border border-border bg-white/90 p-7 flex flex-col justify-between hover:border-[#0A2536]/40 transition-colors shadow-sm"
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
                    <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                      How We Help
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {area.representationScope.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-[#0A2536]"
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
                    See Courts We Appear In →
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => onOpenConsultation(area.title)}
                  >
                    Discuss a {area.shortTitle} Case
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
