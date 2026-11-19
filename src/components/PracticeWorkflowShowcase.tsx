import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Gavel,
  Landmark,
  Radar,
  Scale,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface PracticeWorkflowShowcaseProps {
  onOpenConsultation: () => void;
}

const STAGES = [
  {
    id: 0,
    step: "01",
    label: "Tax & Corporate Scrutiny",
    shortLabel: "01. Audit & Filing",
    headline: "Statutory Audit, SCN Reply & Writ Filing",
    summary:
      "Every tax notice, GST return mismatch, Section 148 reassessment, or corporate petition is vetted line by line by Advocate Sanjay Kumar Singh—aligning financial computation with writ maintainability.",
    metricLabel: "Statutory Scrutiny",
    metricTarget: 100,
    nodes: [
      {
        title: "GST & Income Tax Record Audit",
        meta: "Delhi HC · ITAT · CESTAT Desk",
        status: "Completed"
      },
      {
        title: "Stay Against Coercive Recovery",
        meta: "Article 226 / Bank Attachment Relief",
        status: "Completed"
      },
      {
        title: "Board Resolution & Paperbook",
        meta: "e-Filing & NCLT Registry Standard",
        status: "Completed"
      }
    ]
  },
  {
    id: 1,
    step: "02",
    label: "Tax & NCLT Benches",
    shortLabel: "02. Benches",
    headline: "High Courts, GSTAT & Tax Tribunals",
    summary:
      "Track connected corporate appeals, GST writ petitions, and tax orders across the Supreme Court, High Court of Delhi, GSTAT, and eleven regional High Courts.",
    metricLabel: "13 Courts & Tribunals",
    metricTarget: 13,
    nodes: [
      {
        title: "Delhi High Court Tax Bench",
        meta: "Sher Shah Road · GST & Corporate",
        status: "Active Watch"
      },
      {
        title: "Supreme Court & NCLAT Desk",
        meta: "Tilak Marg · Tax SLPs & IBC",
        status: "Active Watch"
      },
      {
        title: "Chandigarh, Patna, Bombay & Regional HCs",
        meta: "Connected Corporate Counsel",
        status: "Synced"
      }
    ]
  },
  {
    id: 2,
    step: "03",
    label: "Commercial Relief",
    shortLabel: "03. Orders",
    headline: "Quashed Demands & Board Closure",
    summary:
      "Focused oral submissions on statutory interpretation, certified copy collection, and clear post-order guidance for CFOs, tax teams, and company boards.",
    metricLabel: "Corporate Resolution",
    metricTarget: 100,
    nodes: [
      {
        title: "Assessment & Demand Stays",
        meta: "Grounded Tax & Corporate Precedents",
        status: "Ready"
      },
      {
        title: "Certified Copy & Audit Briefing",
        meta: "Direct CFO & Board Reporting",
        status: "Ready"
      },
      {
        title: "Refund & Compliance Follow-Through",
        meta: "Appellate Steps Mapped Cleanly",
        status: "Ready"
      }
    ]
  }
] as const;

export function PracticeWorkflowShowcase({
  onOpenConsultation
}: PracticeWorkflowShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: "some" });
  const [activeStage, setActiveStage] = useState<0 | 1 | 2>(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;
    const id = setInterval(() => {
      setActiveStage((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 5200);
    return () => clearInterval(id);
  }, [inView, paused]);

  const current = STAGES[activeStage];

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F3FAFF] py-16 sm:py-24 border-y border-border overflow-hidden"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 space-y-10">
        {/* Top Row matching Video Frame Aesthetic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7 space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#33566D]">
              Chambers Process
            </p>
            <h2
              className="text-4xl sm:text-5xl font-extrabold text-[#0A2536] leading-[0.98]"
              style={{ textWrap: "balance" }}
            >
              Corporate &amp; Tax Disputes.
              <span className="block text-[#33566D]">Handled Methodically.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-sm sm:text-base text-[#33566D] leading-relaxed">
            Every business matter follows a disciplined chambers sequence—from Income Tax &amp; GST computation scrutiny to daily bench tracking across GSTAT, Delhi, and regional High Courts.
          </p>
        </div>

        {/* Main Architectural Workflow Canvas */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative rounded-[28px] border border-border bg-white shadow-sm overflow-hidden p-5 sm:p-8 lg:p-10"
        >
          {/* Subtle Concentric Blueprint Arcs Background */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 520"
            className="hidden lg:block pointer-events-none absolute inset-0 h-full w-full opacity-55"
          >
            <circle cx="600" cy="260" r="145" fill="none" stroke="#D5E4ED" strokeWidth="1.2" />
            <circle cx="600" cy="260" r="245" fill="none" stroke="#D5E4ED" strokeDasharray="6 6" strokeWidth="1.2" />
            <circle cx="600" cy="260" r="355" fill="none" stroke="#E6F2F7" strokeWidth="1.2" />

            {/* Animated dotted workflow paths radiating from central hub */}
            <motion.path
              key={`left-${activeStage}`}
              d="M 455 240 C 370 240, 340 165, 270 165"
              fill="none"
              stroke="#33566D"
              strokeWidth="1.75"
              strokeDasharray="5 5"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            />
            <motion.path
              key={`bottom-left-${activeStage}`}
              d="M 470 295 C 380 315, 345 365, 270 365"
              fill="none"
              stroke="#33566D"
              strokeWidth="1.75"
              strokeDasharray="5 5"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 0.85, delay: 0.08, ease: "easeOut" }}
            />
            <motion.path
              key={`right-${activeStage}`}
              d="M 745 255 C 830 255, 860 195, 925 195"
              fill="none"
              stroke="#0A2536"
              strokeWidth="1.75"
              strokeDasharray="5 5"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 0.95 }}
              transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
            />
          </svg>

          {/* Desktop Radial Layout matching Video Canvas */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Checklist / Readiness Dial */}
            <div className="lg:col-span-4 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`left-card-${activeStage}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.32 }}
                  className="space-y-3"
                >
                  <div className="inline-flex items-center gap-3 rounded-2xl border border-[#0A2536]/15 bg-[#0A2536] px-4 py-3 text-[#F3FAFF] shadow-sm">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#DAF6EF]/40 bg-[#33566D]/50 text-sm font-extrabold tabular-nums text-[#DAF6EF]">
                      {current.step}
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[#DAF6EF]/80">
                        {current.metricLabel}
                      </p>
                      <p className="text-sm font-bold text-[#F3FAFF]">{current.label}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-[#F3FAFF]/80 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0A2536]">{current.nodes[0].title}</span>
                      <span className="rounded-full bg-[#DAF6EF] px-2.5 py-0.5 text-[11px] font-bold text-[#0A2536]">
                        {current.nodes[0].status}
                      </span>
                    </div>
                    <p className="text-xs text-[#33566D]">{current.nodes[0].meta}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Center Architectural Crest Node */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center py-4 lg:py-8">
              <motion.div
                key={`hub-${activeStage}`}
                initial={{ scale: 0.94, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative flex flex-col items-center gap-3 rounded-full border border-border bg-white p-7 sm:p-8 shadow-md max-w-[260px]"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DAF6EF] text-[#0A2536]">
                  {activeStage === 0 ? (
                    <FileCheck2 className="h-7 w-7" aria-hidden="true" />
                  ) : activeStage === 1 ? (
                    <Radar className="h-7 w-7" aria-hidden="true" />
                  ) : (
                    <Gavel className="h-7 w-7" aria-hidden="true" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#0A2536] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#DAF6EF]">
                    <Scale className="h-3 w-3" aria-hidden="true" />
                    SJ Associates
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#0A2536] leading-tight pt-1">
                    {current.headline}
                  </h3>
                </div>
              </motion.div>
            </div>

            {/* Right Status Cards */}
            <div className="lg:col-span-4 space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`right-cards-${activeStage}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-3"
                >
                  {current.nodes.slice(1).map((node, i) => (
                    <div
                      key={node.title}
                      className="rounded-2xl border border-border bg-white p-4 shadow-xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className="h-4 w-4 text-[#33566D] shrink-0"
                            aria-hidden="true"
                          />
                          <p className="text-sm font-bold text-[#0A2536] leading-snug">
                            {node.title}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap ${
                            i === 0
                              ? "bg-[#DAF6EF] text-[#0A2536]"
                              : "bg-[#F3FAFF] text-[#33566D] border border-border"
                          }`}
                        >
                          {node.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#33566D]">{node.meta}</p>
                    </div>
                  ))}

                  <div className="rounded-2xl border border-border bg-[#0A2536] p-4 text-[#F3FAFF] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-[#DAF6EF] font-semibold">
                        Direct Chambers Desk
                      </p>
                      <p className="text-xs text-[#F3FAFF]/80 line-clamp-2 leading-relaxed">
                        {current.summary}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={onOpenConsultation}
                      className="rounded-full bg-[#DAF6EF] text-[#0A2536] hover:bg-white shrink-0"
                    >
                      Consult
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Stage Switcher Bar (matching Bottom Timeline in Reference Video) */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div
              className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0"
              role="tablist"
              aria-label="Chambers workflow stages"
            >
              {STAGES.map((stage, idx) => {
                const isActive = activeStage === idx;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setPaused(true);
                      setActiveStage(idx as 0 | 1 | 2);
                    }}
                    className={`relative min-h-[42px] px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? "bg-[#0A2536] text-[#F3FAFF] shadow-xs"
                        : "bg-[#F3FAFF] text-[#33566D] hover:bg-[#DAF6EF]/70 border border-border"
                    }`}
                  >
                    <span>{stage.shortLabel}</span>
                    {isActive && (
                      <ArrowRight className="h-3.5 w-3.5 text-[#DAF6EF]" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            <Link
              to="/courts"
              className="inline-flex items-center justify-center sm:justify-end gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#0A2536] hover:text-[#33566D] transition-colors min-h-[40px]"
            >
              <Landmark className="h-4 w-4 text-[#33566D]" aria-hidden="true" />
              Open 13 Live Courts &amp; GSTAT
              <ShieldCheck className="h-4 w-4 text-[#33566D]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
