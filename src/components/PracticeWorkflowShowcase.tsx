import React, { useState, useEffect } from "react";
import { CheckCircle2, Radar, Scale, Calculator, Briefcase } from "lucide-react";

interface WorkflowStage {
  id: string;
  step: string;
  badgeSubtitle: string;
  badgeTitle: string;
  leftCardTitle: string;
  leftCardSubtitle: string;
  leftCardStatus: string;
  centerHubTitle: string;
  rightTopTitle: string;
  rightTopSubtitle: string;
  rightTopStatus: string;
  rightMiddleTitle: string;
  rightMiddleSubtitle: string;
  rightMiddleStatus: string;
  ctaTitle: string;
  ctaDescription: string;
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: "gst-and-tax",
    step: "01",
    badgeSubtitle: "SECTION 01 · 6 GOODS AND SERVICES TAX SERVICES (40%)",
    badgeTitle: "Goods and Services Tax Wing",
    leftCardTitle: "GST Registration & Return Filing",
    leftCardSubtitle: "REG-01/21 · GSTR-1, 3B, 2B & GSTR-9/9C",
    leftCardStatus: "Active Desk",
    centerHubTitle: "GST Registration, Returns, SCN & 3-Tier Appeals",
    rightTopTitle: "SCN Reply & Commissioner Appeal",
    rightTopSubtitle: "DRC-01 / Sec. 73–74 Replies · Sec. 107 APL-01",
    rightTopStatus: "Active Watch",
    rightMiddleTitle: "GSTAT Appeal & High Court Appeal",
    rightMiddleSubtitle: "Sec. 112 GSTAT APL-05 · Art. 226 Tax Writs",
    rightMiddleStatus: "Synced",
    ctaTitle: "Direct GST & Appellate Desk",
    ctaDescription:
      "Registration, Return Filing, SCN Reply, Commissioner Appeal, GSTAT Appeal & High Court Appeal.",
  },
  {
    id: "income-tax",
    step: "02",
    badgeSubtitle: "SECTION 02 · 4 INCOME TAX SERVICES (27%)",
    badgeTitle: "Income Tax Practice Wing",
    leftCardTitle: "Income Tax Return (ITR) Filing",
    leftCardSubtitle: "ITR-1 to ITR-7 · Tax Audit & 26AS/AIS",
    leftCardStatus: "Active Desk",
    centerHubTitle: "ITR Filing, TDS Returns, Consultancy & Assessments",
    rightTopTitle: "TDS Return Filing (24Q / 26Q / 27Q)",
    rightTopSubtitle: "Quarterly Filings · Form 16/16A & TRACES",
    rightTopStatus: "Active Watch",
    rightMiddleTitle: "Income Tax Consultancy & Other Matters",
    rightMiddleSubtitle: "Tax Planning · Sec. 143(3) Scrutiny · Sec. 148 & CIT(A)",
    rightMiddleStatus: "Synced",
    ctaTitle: "Direct Income Tax Desk",
    ctaDescription:
      "ITR Return Filing, TDS Return Filing, Income Tax Consultancy & Assessment Matters.",
  },
  {
    id: "others-registrations",
    step: "03",
    badgeSubtitle: "SECTION 03 · 5 REGISTRATION & ADVISORY SERVICES (33%)",
    badgeTitle: "Others — Accounts, DGFT & Registrations",
    leftCardTitle: "Accounting & Bookkeeping",
    leftCardSubtitle: "Tally / Zoho Books · Trial Balance & Audit P&L",
    leftCardStatus: "Active Desk",
    centerHubTitle: "Accounting, DGFT Work, MSME, Trademark & Partnership",
    rightTopTitle: "DGFT Work & MSME Registration",
    rightTopSubtitle: "IEC Code · Advance Auth · EPCG · Udyam Certificate",
    rightTopStatus: "Active Watch",
    rightMiddleTitle: "Trademark & Partnership Firm Registration",
    rightMiddleSubtitle: "TM-A Filing & Objections · Partnership Deed & ROF",
    rightMiddleStatus: "Synced",
    ctaTitle: "Registrations & DGFT Desk",
    ctaDescription:
      "Accounting & Bookkeeping, DGFT Work, MSME, Trademark & Partnership Firm Registration.",
  },
];

interface PracticeWorkflowShowcaseProps {
  onNavigatePractice?: () => void;
  onNavigateCourts?: () => void;
  onOpenConsultation?: (briefNote?: string) => void;
}

export const PracticeWorkflowShowcase: React.FC<PracticeWorkflowShowcaseProps> = ({
  onNavigatePractice,
  onOpenConsultation,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % WORKFLOW_STAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const stage = WORKFLOW_STAGES[activeIndex];

  const handleConsultClick = () => {
    if (onOpenConsultation) {
      onOpenConsultation(`${stage.badgeTitle}: ${stage.ctaDescription}`);
    } else if (onNavigatePractice) {
      onNavigatePractice();
    }
  };

  return (
    <section
      aria-label="Chambers Process and 3-Section Work Graph"
      className="bg-[#F3FAFF] border-t border-border py-16 sm:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 space-y-10">
        {/* Top Editorial Row (Exact Original Layout from r12-workflow-fixed.png) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#33566D]">
              CHAMBERS PROCESS · 3 SECTIONS OF WORK
            </p>
            <h2
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A2536] leading-[0.98]"
              style={{ textWrap: "balance" }}
            >
              Litigation, Tax &amp; Compliance.
              <br />
              Handled Methodically.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#33566D] leading-relaxed">
              Every matter across our three sections—<strong className="text-[#0A2536]">1. Goods and Services Tax</strong>, <strong className="text-[#0A2536]">2. Income Tax</strong>, and <strong className="text-[#0A2536]">3. Others (Accounting, DGFT, MSME, Trademark &amp; Partnership)</strong>—follows a disciplined sequence across Delhi and regional tax offices, tribunals &amp; courts.
            </p>
          </div>
        </div>

        {/* Main White Hub Diagram Card (Exact Original Layout from r12-workflow-fixed.png) */}
        <div className="relative rounded-[28px] border border-border bg-white p-6 sm:p-10 shadow-2xs overflow-hidden">
          {/* Background Concentric Dashed Rings & Connector Curves */}
          <svg
            viewBox="0 0 1000 460"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
            aria-hidden="true"
          >
            <circle
              cx="500"
              cy="220"
              r="145"
              fill="none"
              stroke="#D5E4ED"
              strokeWidth="1.5"
              strokeDasharray="5 6"
            />
            <circle
              cx="500"
              cy="220"
              r="205"
              fill="none"
              stroke="#D5E4ED"
              strokeWidth="1.2"
              strokeDasharray="4 7"
            />
            <circle
              cx="500"
              cy="220"
              r="265"
              fill="none"
              stroke="#D5E4ED"
              strokeWidth="1"
              strokeDasharray="3 8"
            />
            {/* Left to Center Connectors */}
            <path
              d="M 290 155 C 350 185, 375 205, 405 210"
              fill="none"
              stroke="#33566D"
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />
            <path
              d="M 290 315 C 350 285, 375 255, 415 245"
              fill="none"
              stroke="#33566D"
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />
            {/* Center to Right Connectors */}
            <path
              d="M 595 190 C 635 180, 665 155, 710 135"
              fill="none"
              stroke="#33566D"
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />
            <path
              d="M 595 235 C 635 235, 665 230, 710 225"
              fill="none"
              stroke="#33566D"
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />
          </svg>

          {/* 3-Column Hub Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column (4 cols) */}
            <div className="lg:col-span-4 space-y-3.5">
              {/* Dark Stage Badge Card */}
              <div className="rounded-[20px] bg-[#0A2536] text-[#F3FAFF] p-4 flex items-center gap-3.5 shadow-sm">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-sm font-bold tabular-nums">
                  {stage.step}
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#DAF6EF]">
                    {stage.badgeSubtitle}
                  </p>
                  <p className="text-base font-extrabold text-white leading-snug">
                    {stage.badgeTitle}
                  </p>
                </div>
              </div>

              {/* Light Node Card */}
              <div className="rounded-[20px] border border-border bg-[#F3FAFF]/80 p-4 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-extrabold text-[#0A2536]">
                    {stage.leftCardTitle}
                  </p>
                  <p className="text-xs text-[#33566D]">
                    {stage.leftCardSubtitle}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#DAF6EF] px-3 py-1 text-[11px] font-bold text-[#0A2536] whitespace-nowrap">
                  {stage.leftCardStatus}
                </span>
              </div>
            </div>

            {/* Center Hub Circle (4 cols) */}
            <div className="lg:col-span-4 flex items-center justify-center py-4">
              <div className="mx-auto w-60 h-60 sm:w-68 sm:h-68 rounded-full border border-border bg-white shadow-md flex flex-col items-center justify-center p-6 text-center gap-2.5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DAF6EF] text-[#0A2536]">
                  {activeIndex === 0 ? (
                    <Scale className="h-6 w-6" aria-hidden="true" />
                  ) : activeIndex === 1 ? (
                    <Calculator className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Briefcase className="h-6 w-6" aria-hidden="true" />
                  )}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0A2536] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F3FAFF]">
                  <Radar className="h-3 w-3 text-[#DAF6EF]" aria-hidden="true" />
                  SJ ASSOCIATES
                </span>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A2536] leading-tight px-2">
                  {stage.centerHubTitle}
                </h3>
              </div>
            </div>

            {/* Right Column (4 cols) */}
            <div className="lg:col-span-4 space-y-3.5">
              {/* Top Right Node Card */}
              <div className="rounded-[20px] border border-border bg-white p-4 flex items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <p className="text-sm font-extrabold text-[#0A2536] flex items-center gap-1.5">
                    <CheckCircle2
                      className="h-4 w-4 text-[#33566D] shrink-0"
                      aria-hidden="true"
                    />
                    <span>{stage.rightTopTitle}</span>
                  </p>
                  <p className="text-xs text-[#33566D] pl-5.5">
                    {stage.rightTopSubtitle}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#DAF6EF] px-3 py-1 text-[11px] font-bold text-[#0A2536] whitespace-nowrap">
                  {stage.rightTopStatus}
                </span>
              </div>

              {/* Middle Right Node Card */}
              <div className="rounded-[20px] border border-border bg-white p-4 flex items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <p className="text-sm font-extrabold text-[#0A2536] flex items-center gap-1.5">
                    <CheckCircle2
                      className="h-4 w-4 text-[#33566D] shrink-0"
                      aria-hidden="true"
                    />
                    <span>{stage.rightMiddleTitle}</span>
                  </p>
                  <p className="text-xs text-[#33566D] pl-5.5">
                    {stage.rightMiddleSubtitle}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full border border-border bg-[#F3FAFF] px-3 py-1 text-[11px] font-semibold text-[#33566D] whitespace-nowrap">
                  {stage.rightMiddleStatus}
                </span>
              </div>

              {/* Bottom Right Dark CTA Card */}
              <div className="rounded-[20px] bg-[#0A2536] text-[#F3FAFF] p-4 flex items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5">
                  <p className="text-xs font-extrabold text-white">
                    {stage.ctaTitle}
                  </p>
                  <p className="text-[11px] text-[#F3FAFF]/80 leading-snug line-clamp-2">
                    {stage.ctaDescription}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConsultClick}
                  className="rounded-full bg-[#DAF6EF] px-4 py-2 text-xs font-bold text-[#0A2536] hover:bg-white transition-colors shrink-0 cursor-pointer"
                >
                  Consult
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Stage Switcher Bar */}
          <div className="relative z-10 mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {WORKFLOW_STAGES.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`min-h-[38px] rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0A2536] text-[#F3FAFF]"
                        : "border border-border bg-[#F3FAFF] text-[#33566D] hover:bg-[#DAF6EF]/50 hover:text-[#0A2536]"
                    }`}
                  >
                    {item.step} · {item.badgeTitle}
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-[#33566D] tabular-nums">
              Section {stage.step} of 03 · 15 Services Total
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
