import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  COURTS_REGISTRY,
  TAX_AND_REGIONAL_OFFICES,
  buildArchiveFallbackReport,
  type CourtImageKey,
} from "@/src/data/courtsRegistry";
import {
  FIRM_IDENTITY,
  PRINCIPAL_ADVOCATE,
  CORPORATE_SOLUTIONS,
} from "@/src/data/firmData";
import {
  HERO_IMAGE,
  COURT_IMAGES,
  ADVOCATE_CORRIDOR_IMAGE,
} from "@/src/data/assets";
import { AdvocatePortrait } from "@/src/components/AdvocatePortrait";
import { ResilientImage } from "@/src/components/ResilientImage";
import { CorporateSolutionsSection } from "@/src/components/CorporateSolutionsSection";
import { PracticeWorkflowShowcase } from "@/src/components/PracticeWorkflowShowcase";
import { HonoursCertificatesSection } from "@/src/components/HonoursCertificatesSection";
import {
  ArrowRight,
  ArrowLeft,
  Scale,
  RefreshCw,
  FileText,
  Landmark,
  CheckCircle2,
  Send,
  Briefcase,
} from "lucide-react";

interface LiveFeedItem {
  id: string;
  courtSlug: CourtImageKey;
  courtName: string;
  courtShortName?: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  sourceUrl?: string;
}

interface HomePageProps {
  onOpenConsultation: (briefNote?: string) => void;
}

const STANDING_METRICS = [
  {
    id: "years",
    value: "15+",
    buttonLabel: "Practice Since 2009",
    caption:
      "The Firm renders advice and litigates across Direct & Indirect Taxation, Corporate Law, Labour Law, Civil & Criminal Litigation before Courts and Tribunals.",
  },
  {
    id: "services",
    value: "17",
    buttonLabel: "Core Services",
    caption:
      "Structured across 3 sections: 6 Goods and Services Tax, 4 Income Tax (Consultancy, ITR & TDS), and 7 Others including Bookkeeping & Accounting, DGFT Compliances, Company Registration & Criminal/Civil Litigation.",
  },
  {
    id: "forums",
    value: "10+",
    buttonLabel: "Courts & Tax Forums",
    caption:
      "Active representation across the Supreme Court, GSTAT, 8 High Courts, and Delhi, Bihar & regional tax authorities.",
  },
];

export function HomePage({ onOpenConsultation }: HomePageProps) {
  const [feedItems, setFeedItems] = useState<LiveFeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  const [activeMetricIndex, setActiveMetricIndex] = useState<number>(0);
  const [activeCourtIndex, setActiveCourtIndex] = useState<number>(2);

  // Quick inline support form state
  const [quickForm, setQuickForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    forumSlug: TAX_AND_REGIONAL_OFFICES[0].slug,
    service: CORPORATE_SOLUTIONS[0].title,
    message: "",
  });
  const [quickSending, setQuickSending] = useState(false);
  const [quickSentRef, setQuickSentRef] = useState<string | null>(null);

  const fetchLiveFeed = async () => {
    setLoadingFeed(true);
    try {
      const res = await fetch("/api/courts/live-feed");
      if (res.ok) {
        const data = await res.json();
        const list = data.items || data.briefings;
        if (Array.isArray(list)) {
          setFeedItems(list);
        }
      }
    } catch {
      // Fallback handled below
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    fetchLiveFeed();
  }, []);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickForm.firstName.trim() || !quickForm.phone.trim()) return;
    setQuickSending(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: `${quickForm.firstName} ${quickForm.lastName}`.trim(),
          email: quickForm.email || "client@sjalaw.in",
          phone: quickForm.phone,
          courtSlug: quickForm.forumSlug,
          practiceArea: quickForm.service,
          briefSummary:
            quickForm.message && quickForm.message.trim().length >= 12
              ? quickForm.message.trim()
              : `Consultation requested for ${quickForm.service} at ${quickForm.forumSlug}.`,
        }),
      });
      const data = await res.json();
      setQuickSentRef(data?.referenceId || "SJA-Logged");
    } catch {
      setQuickSentRef("SJA-Logged");
    } finally {
      setQuickSending(false);
    }
  };

  const activeMetric = STANDING_METRICS[activeMetricIndex];

  const getCarouselCourts = () => {
    const total = COURTS_REGISTRY.length;
    const offsets = [-2, -1, 0, 1, 2];
    return offsets.map((offset) => {
      const idx = (activeCourtIndex + offset + total) % total;
      return {
        court: COURTS_REGISTRY[idx],
        offset,
        index: idx,
      };
    });
  };

  const carouselCourts = getCarouselCourts();
  const top3Sections = [
    {
      id: "section-01-gst",
      title: "Goods and Services Tax — Registration, Return Filing, SCN & Appeals",
      summary:
        "The Firm’s Indirect Tax team renders advice, manages statutory compliances, and litigates across Goods and Services Tax (‘GST’) and Customs before Adjudicating Authorities, Commissioner (Appeals), GSTAT, High Courts, and the Supreme Court.",
      representationScope: [
        "GST Registration (REG-01), amendments, revocation (REG-21) & compliance advisory",
        "Periodic & annual GST Return Filing (GSTR-1, GSTR-3B, GSTR-9/9C) & GSTR-2B reconciliation",
        "Show Cause Notice (DRC-01 / Sec. 73 & 74) replies & ASMT-10 adjudication defence",
        "Commissioner (Appeals) Section 107, GSTAT Section 112 & High Court Tax Appeals",
      ],
      typicalForums: ["Vyapar Bhawan GST · Commissioner (Appeals) · GSTAT · High Courts"],
    },
    {
      id: "section-02-income-tax",
      title: "Income Tax — Consultancy, ITR & TDS Return Filing",
      summary:
        "The Direct Tax team offers comprehensive Income Tax Consultancy, Income Tax Return (ITR) Filing, quarterly TDS Return Filing, Corporate Tax, Wealth Tax, and representation in scrutiny assessments and appeals before CIT(Appeals) and Tax Authorities.",
      representationScope: [
        "Income Tax Consultancy on domestic & cross-border tax planning, Corporate Tax & Wealth Tax",
        "Income Tax Return (ITR) Filing (ITR-1 to ITR-7), bookkeeping & AIS/TIS reconciliation",
        "Quarterly TDS & TCS Return Filing (24Q, 26Q, 27Q, 27EQ), Form 16/16A & TRACES rectification",
        "Scrutiny assessments (Sec. 143(3)), Sec. 148A/148 notices & CIT(Appeals) representation",
      ],
      typicalForums: ["Pratyaksh Kar Bhawan (ITO) · NFAC · CIT(Appeals) · TRACES"],
    },
    {
      id: "section-03-others",
      title: "Others — Bookkeeping & Accounting, DGFT Compliances, Corporate & Litigation",
      summary:
        "End-to-end Bookkeeping & Accounting, DGFT Compliances, Customs, Corporate Law Practice, statutory registrations, Labour Law, Corporate, Criminal & Civil Litigation, and Arbitration across Delhi NCR, Bihar, and India.",
      representationScope: [
        "Bookkeeping & Accounting, Trial Balance, P&L, Balance Sheet & ledger reconciliation",
        "DGFT Compliances (IEC), Company Registration, Partnership Firm, MSME Udyam & Trademark",
        "Corporate Law Practice, Labour Law, Corporate Litigation & Arbitration representation",
        "Criminal & Civil Litigation before District Courts, High Courts & Supreme Court",
      ],
      typicalForums: ["MCA / ROC · DGFT · Trade Marks Registry · District & High Courts"],
    },
  ];
  const gstSolutions = CORPORATE_SOLUTIONS.filter((s) => s.category === "Goods and Services Tax");
  const incomeTaxSolutions = CORPORATE_SOLUTIONS.filter((s) => s.category === "Income Tax");
  const otherSolutions = CORPORATE_SOLUTIONS.filter((s) => s.category === "Others");

  const fallbackFeedItems: LiveFeedItem[] = COURTS_REGISTRY.slice(0, 4).map((c) => {
    const fb = buildArchiveFallbackReport(c, new Date().toISOString());
    return {
      id: c.slug,
      courtSlug: c.slug,
      courtName: c.shortName,
      courtShortName: c.shortName,
      title: fb.rulings[0]?.title || `${c.shortName} Goods and Services Tax Bench Update`,
      date: fb.rulings[0]?.date || "Current Roster",
      category: fb.rulings[0]?.category || "GST & Income Tax",
      summary: fb.rulings[0]?.holdingSummary || c.summary,
      sourceUrl: c.officialUrl,
    };
  });

  const displayFeed = feedItems.length > 0 ? feedItems.slice(0, 4) : fallbackFeedItems;

  return (
    <div className="min-h-screen bg-[#F3FAFF] text-[#0A2536]">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden border-b border-border pt-14 pb-10 sm:pt-20 sm:pb-12">
        {/* 4K Delhi High Court background image with vibrant natural colors on left & right sides */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <ResilientImage
            src={HERO_IMAGE}
            alt="High Court of Delhi 4K Background"
            className="h-full w-full object-cover object-center saturate-[1.14] contrast-[1.03]"
          />
        </div>

        {/* Low-intensity localized blur only over the central portico signage, leaving left & right sides crisp and colorful */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 backdrop-blur-[2.5px] [mask-image:radial-gradient(ellipse_36%_42%_at_50%_48%,#000_38%,transparent_92%)]"
        />

        {/* Soft center-only radial halo for text contrast while keeping left & right court wings in full glorious color */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_44%_54%_at_50%_46%,rgba(243,250,255,0.68)_0%,rgba(243,250,255,0.36)_54%,transparent_90%)]"
        />

        {/* Subtle bottom bar strip readability gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-[#F3FAFF]/82 via-[#F3FAFF]/35 to-transparent"
        />

        {/* Hero text & controls with normal solid typography */}
        <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center [text-shadow:0_1px_14px_rgba(243,250,255,0.95)]">
          <h1 className="font-display tracking-tight text-[#0A2536] max-w-5xl mx-auto">
            <span className="block text-6xl sm:text-8xl lg:text-[104px] font-extrabold leading-[0.94]">
              S J Associates
            </span>
            <span className="block mt-2 pb-1 text-3xl sm:text-5xl lg:text-[62px] font-bold italic leading-[1.05]">
              Stands For You
            </span>
          </h1>

          <div className="mt-6 space-y-1">
            <p className="text-lg sm:text-xl font-bold text-[#0A2536]">
              Advocate Sanjay Kumar Singh
            </p>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-[#0A2536]">
              DELHI HIGH COURT
            </p>
            <p className="text-xs sm:text-sm font-semibold text-[#0A2536]">
              Member of International Council Of Jurists
            </p>
          </div>

          <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base font-medium text-[#0A2536] leading-relaxed">
            Focused on Direct &amp; Indirect Taxation, Financial Accounting and Bookkeeping,
            Corporate Law and Practice, Labour Law, Corporate Litigation, Criminal and Civil
            Litigation, and Arbitration.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => onOpenConsultation()}
              className="inline-flex items-center justify-center rounded-full bg-[#0A2536] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#F3FAFF] hover:bg-[#33566D] transition-all shadow-sm cursor-pointer"
            >
              BOOK CONSULTATION
            </button>
            <Link
              to="/courts"
              className="inline-flex items-center gap-3 rounded-full border border-[#0A2536]/15 bg-white/95 pl-6 pr-2.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0A2536] hover:bg-[#DAF6EF]/60 transition-all shadow-xs"
            >
              <span>LIVE COURT UPDATES</span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#DAF6EF] text-[#0A2536]">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          <div className="mt-14 pt-5 border-t border-[#0A2536]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs font-bold text-[#0A2536]">
              <span>Direct &amp; Indirect Taxation</span>
              <span>Financial Accounting &amp; Bookkeeping</span>
              <span>Corporate &amp; Labour Law</span>
              <span>Corporate, Criminal &amp; Civil Litigation</span>
              <span>Arbitration</span>
            </div>
            <a
              href="#what-we-do"
              className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0A2536] hover:text-[#33566D]"
            >
              <span>SCROLL DOWN</span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#0A2536]/12 bg-white text-xs shadow-xs">
                ↓
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHAT WE DO — 3 CORE SECTIONS */}
      <section id="what-we-do" className="py-16 sm:py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#33566D] mb-2">
              WHAT WE DO · ETHICS · HUMAN VALUES · EXCELLENCE
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#0A2536] leading-[1.02]">
              Practical, Innovative &amp; Time-Bound Tax &amp; Legal Counsel
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#33566D] leading-relaxed">
              The Firm&apos;s Direct and Indirect Tax teams are well-equipped and dedicated to
              render advice, manage statutory compliances, and litigate across Goods and Services
              Tax (&lsquo;GST&rsquo;), Customs, Income Tax, Corporate Tax, Wealth Tax, GSTAT, High
              Courts, and Foreign Trade Policy (DGFT Compliances) schemes.
            </p>
            <div className="mt-5">
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 rounded-full bg-[#0A2536] px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.18em] font-semibold text-[#F3FAFF] hover:bg-[#33566D] transition-colors"
              >
                Learn More
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3Sections.map((area, idx) => {
              const isHighlighted = idx === 1;
              const IconComp = idx === 0 ? Scale : idx === 1 ? FileText : Briefcase;
              return (
                <div
                  key={area.id}
                  className={`rounded-[26px] border p-7 flex flex-col justify-between transition-all duration-200 ${
                    isHighlighted
                      ? "border-[#0A2536]/25 bg-[#DAF6EF]/65 shadow-md"
                      : "border-[#0A2536]/12 bg-white/85 hover:border-[#0A2536]/30 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A2536] text-[#F3FAFF]">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-[#0A2536]/8 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#0A2536]">
                        Section 0{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0A2536] leading-tight">
                      {area.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-[#33566D] leading-relaxed">
                      {area.summary}
                    </p>

                    <ul className="mt-5 space-y-2 border-t border-[#0A2536]/10 pt-4">
                      {area.representationScope.slice(0, 4).map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-xs font-medium text-[#0A2536]"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0A2536] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#0A2536]/10 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#33566D]">
                      {area.typicalForums[0]}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenConsultation(area.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A2536] hover:text-[#33566D] cursor-pointer"
                    >
                      Consult
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: 15 SERVICES & PRACTICE DISTRIBUTION GRAPH */}
      <CorporateSolutionsSection
        onSelectSolution={(solution) => onOpenConsultation(solution.title)}
        onRequestSelected={(briefNote) => onOpenConsultation(briefNote)}
      />

      {/* SECTION 4: INTERACTIVE WORKFLOW DIAGRAM */}
      <PracticeWorkflowShowcase onOpenConsultation={(briefNote) => onOpenConsultation(briefNote)} />

      {/* SECTION 5: OUR STANDING + COURTS CAROUSEL */}
      <section className="py-16 sm:py-20 border-b border-border bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#33566D] mb-2">
            OUR STANDING
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#0A2536] leading-tight">
            Together, We Protect Your Legal Rights
          </h2>

          {/* Interactive metric counter */}
          <div className="mt-8">
            <div className="font-display text-7xl sm:text-8xl font-bold text-[#0A2536] leading-none">
              {activeMetric.value}
            </div>
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2">
              {STANDING_METRICS.map((metric, idx) => (
                <button
                  key={metric.id}
                  type="button"
                  onClick={() => setActiveMetricIndex(idx)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    idx === activeMetricIndex
                      ? "bg-[#0A2536] text-[#F3FAFF] shadow-sm"
                      : "border border-[#0A2536]/15 bg-white/80 text-[#33566D] hover:text-[#0A2536]"
                  }`}
                >
                  {metric.buttonLabel}
                </button>
              ))}
            </div>
            <p className="mt-4 max-w-md mx-auto text-xs sm:text-sm text-[#33566D]">
              {activeMetric.caption}
            </p>
          </div>

          {/* 5-card Courts Carousel */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
            {carouselCourts.map(({ court, offset }) => {
              const isCenter = offset === 0;
              const imgSrc =
                COURT_IMAGES[court.slug] || COURT_IMAGES["supreme-court-of-india"];
              return (
                <Link
                  key={court.slug}
                  to={`/courts/${court.slug}`}
                  className={`group relative overflow-hidden rounded-[26px] border transition-all duration-300 ${
                    isCenter
                      ? "h-72 sm:h-80 border-[#0A2536] shadow-lg scale-[1.02]"
                      : "h-60 sm:h-64 border-[#0A2536]/15 opacity-85 hover:opacity-100"
                  } ${Math.abs(offset) === 2 ? "hidden lg:block" : offset !== 0 ? "hidden sm:block" : ""}`}
                >
                  <ResilientImage
                    src={imgSrc}
                    alt={court.name}
                    className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      isCenter ? "" : "grayscale group-hover:grayscale-0"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2536]/90 via-[#0A2536]/35 to-transparent" />

                  {isCenter && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#DAF6EF]/95 text-[#0A2536] font-mono text-[10px] font-bold uppercase tracking-wider shadow-md text-center px-2">
                        Open Report
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-4 text-left text-[#F3FAFF]">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#DAF6EF]">
                      {court.city}
                    </div>
                    <div className="font-display text-lg font-bold leading-snug mt-0.5">
                      {court.shortName}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Carousel Controls */}
          <div className="mt-6 inline-flex items-center gap-4">
            <button
              type="button"
              aria-label="Previous court"
              onClick={() =>
                setActiveCourtIndex(
                  (prev) => (prev - 1 + COURTS_REGISTRY.length) % COURTS_REGISTRY.length
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0A2536]/20 bg-white text-[#0A2536] hover:bg-[#0A2536] hover:text-[#F3FAFF] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-[#33566D]">
              {activeCourtIndex + 1} / {COURTS_REGISTRY.length}
            </span>
            <button
              type="button"
              aria-label="Next court"
              onClick={() =>
                setActiveCourtIndex((prev) => (prev + 1) % COURTS_REGISTRY.length)
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0A2536]/20 bg-white text-[#0A2536] hover:bg-[#0A2536] hover:text-[#F3FAFF] transition-colors cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: GET HELP — DARK CORRIDOR SUPPORT SECTION */}
      <section className="relative overflow-hidden bg-[#0A2536] text-[#F3FAFF] py-16 sm:py-20">
        <div className="absolute inset-0 opacity-35">
          <ResilientImage
            src={ADVOCATE_CORRIDOR_IMAGE}
            alt="S J Associates Legal Support"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2536] via-[#0A2536]/85 to-[#0A2536]/55" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center mb-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#DAF6EF] mb-2">
              GET HELP
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#F3FAFF] leading-tight">
              We&apos;re Here To Support You Every Step Of The Way
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 rounded-[26px] border border-[#F3FAFF]/20 bg-[#0A2536]/80 backdrop-blur-md p-6 sm:p-8 shadow-xl">
              <h3 className="font-display text-2xl font-bold text-[#F3FAFF]">
                What&apos;s going on?
              </h3>
              <p className="text-xs text-[#DAF6EF]/85 mt-1">
                Select your Goods and Services Tax, Income Tax, Company Registration, or Litigation
                matter and the relevant Delhi, Bihar, or regional court/tax office below.
              </p>

              {quickSentRef ? (
                <div className="mt-6 rounded-2xl border border-[#DAF6EF]/30 bg-[#DAF6EF]/15 p-5">
                  <div className="flex items-center gap-2 text-[#DAF6EF] font-semibold text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Consultation Inquiry Logged ({quickSentRef})</span>
                  </div>
                  <p className="mt-2 text-xs text-[#F3FAFF]/85 leading-relaxed">
                    Thank you. Your inquiry for <strong>{quickForm.service}</strong> has been
                    routed to <span className="font-mono">services@sjalaw.in</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuickSentRef(null)}
                    className="mt-4 rounded-full bg-[#DAF6EF] px-4 py-1.5 text-xs font-semibold text-[#0A2536] cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="mt-5 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="First Name *"
                      value={quickForm.firstName}
                      onChange={(e) =>
                        setQuickForm({ ...quickForm, firstName: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#F3FAFF]/20 bg-[#F3FAFF]/10 px-3.5 py-2.5 text-xs text-[#F3FAFF] placeholder:text-[#F3FAFF]/55 focus:outline-none focus:border-[#DAF6EF]"
                    />
                    <input
                      type="text"
                      placeholder="Last Name / Firm"
                      value={quickForm.lastName}
                      onChange={(e) =>
                        setQuickForm({ ...quickForm, lastName: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#F3FAFF]/20 bg-[#F3FAFF]/10 px-3.5 py-2.5 text-xs text-[#F3FAFF] placeholder:text-[#F3FAFF]/55 focus:outline-none focus:border-[#DAF6EF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={quickForm.email}
                      onChange={(e) =>
                        setQuickForm({ ...quickForm, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#F3FAFF]/20 bg-[#F3FAFF]/10 px-3.5 py-2.5 text-xs text-[#F3FAFF] placeholder:text-[#F3FAFF]/55 focus:outline-none focus:border-[#DAF6EF]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number *"
                      value={quickForm.phone}
                      onChange={(e) =>
                        setQuickForm({ ...quickForm, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#F3FAFF]/20 bg-[#F3FAFF]/10 px-3.5 py-2.5 text-xs text-[#F3FAFF] placeholder:text-[#F3FAFF]/55 focus:outline-none focus:border-[#DAF6EF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      aria-label="Select Service"
                      value={quickForm.service}
                      onChange={(e) =>
                        setQuickForm({ ...quickForm, service: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#F3FAFF]/20 bg-[#0A2536] px-3.5 py-2.5 text-xs text-[#F3FAFF] focus:outline-none focus:border-[#DAF6EF]"
                    >
                      <optgroup label="1. Goods and Services Tax">
                        {gstSolutions.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="2. Income Tax">
                        {incomeTaxSolutions.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="3. Others">
                        {otherSolutions.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </optgroup>
                    </select>

                    <select
                      aria-label="Select Court or Tax Office"
                      value={quickForm.forumSlug}
                      onChange={(e) =>
                        setQuickForm({ ...quickForm, forumSlug: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#F3FAFF]/20 bg-[#0A2536] px-3.5 py-2.5 text-xs text-[#F3FAFF] focus:outline-none focus:border-[#DAF6EF]"
                    >
                      <optgroup label="Delhi & Regional Tax Offices">
                        {TAX_AND_REGIONAL_OFFICES.map((o) => (
                          <option key={o.slug} value={o.slug}>
                            {o.name} ({o.city})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Courts & GSTAT">
                        {COURTS_REGISTRY.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Briefly describe your GST SCN, Commissioner/GSTAT appeal, Income Tax notice, or registration requirement..."
                    value={quickForm.message}
                    onChange={(e) =>
                      setQuickForm({ ...quickForm, message: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#F3FAFF]/20 bg-[#F3FAFF]/10 px-3.5 py-2.5 text-xs text-[#F3FAFF] placeholder:text-[#F3FAFF]/55 focus:outline-none focus:border-[#DAF6EF]"
                  />

                  <button
                    type="submit"
                    disabled={quickSending}
                    className="inline-flex items-center gap-2 rounded-full bg-[#DAF6EF] px-6 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold text-[#0A2536] hover:bg-white transition-colors cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {quickSending ? "Submitting..." : "Submit"}
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-[24px] border border-[#F3FAFF]/15 bg-[#0A2536]/75 backdrop-blur-md p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#DAF6EF] mb-2">
                  DELHI &amp; REGIONAL TAX OFFICES COVERED
                </div>
                <h3 className="font-display text-2xl font-bold text-[#F3FAFF]">
                  Direct Representation Across Tax Commissionerates &amp; High Courts
                </h3>
                <p className="mt-2 text-xs text-[#F3FAFF]/80 leading-relaxed">
                  We represent clients before Delhi CGST/SGST Zones, Income Tax Civic Centre &amp;
                  C.R. Building, GSTAT Principal Bench, DGFT CLA New Delhi, and regional tax
                  offices located near every major High Court.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TAX_AND_REGIONAL_OFFICES.slice(0, 6).map((office) => (
                    <button
                      key={office.slug}
                      type="button"
                      onClick={() =>
                        onOpenConsultation(
                          `SCN Reply / Representation at ${office.name} (${office.city})`
                        )
                      }
                      className="text-left rounded-xl border border-[#F3FAFF]/15 bg-[#F3FAFF]/5 hover:bg-[#DAF6EF]/15 p-3 transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-semibold text-[#F3FAFF] line-clamp-1">
                        {office.name}
                      </div>
                      <div className="text-[11px] text-[#DAF6EF]/80 mt-0.5">
                        {office.city} · {office.jurisdiction}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: UPDATES FROM COURTS ACROSS INDIA (ZERO AI CREDITS) */}
      <section className="py-16 sm:py-20 border-b border-border bg-[#F3FAFF]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#33566D] mb-1.5">
                RECENT NOTES &amp; DIRECT PUBLIC RSS FEEDS
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#0A2536] leading-tight">
                Updates From Courts Across India
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/courts"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0A2536] px-5 py-2.5 text-[11px] font-mono uppercase tracking-wider font-semibold text-[#F3FAFF] hover:bg-[#33566D] transition-colors"
              >
                See All
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={fetchLiveFeed}
                disabled={loadingFeed}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#0A2536]/20 bg-white px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider font-semibold text-[#0A2536] hover:bg-[#DAF6EF] transition-colors cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingFeed ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayFeed.map((item) => {
              const imgSrc =
                COURT_IMAGES[item.courtSlug] || COURT_IMAGES["delhi-high-court"];
              return (
                <Link
                  key={item.id}
                  to={`/courts/${item.courtSlug}`}
                  className="group relative h-80 overflow-hidden rounded-[26px] border border-[#0A2536]/15 shadow-sm flex flex-col justify-between p-5 text-[#F3FAFF]"
                >
                  <ResilientImage
                    src={imgSrc}
                    alt={item.courtName}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2536]/95 via-[#0A2536]/55 to-[#0A2536]/25" />

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#0A2536]/80 backdrop-blur-sm border border-[#F3FAFF]/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#DAF6EF]">
                      {item.courtShortName || item.courtName}
                    </span>
                    <span className="font-mono text-[10px] text-[#F3FAFF]/85">
                      {item.date}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#DAF6EF] mb-1">
                      {item.category}
                    </div>
                    <h3 className="font-display text-xl font-bold leading-snug line-clamp-3 group-hover:text-[#DAF6EF] transition-colors">
                      {item.title}
                    </h3>
                    <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#DAF6EF]">
                      Open Court Report
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8: PRINCIPAL COUNSEL SPLIT CARD */}
      <section className="py-16 sm:py-20 border-b border-border bg-[#F3FAFF]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-[#0A2536]/12 bg-white/90 p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <AdvocatePortrait className="aspect-[4/5] w-full max-w-sm mx-auto rounded-[22px] shadow-md" />
              </div>
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#DAF6EF] px-3.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#0A2536]">
                  <Landmark className="h-3.5 w-3.5" />
                  FOUNDER &amp; ADVOCATE, DELHI HIGH COURT · NEW DELHI
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#0A2536] leading-[1.02]">
                  {PRINCIPAL_ADVOCATE.name}
                </h2>
                <p className="text-sm sm:text-base text-[#33566D] leading-relaxed">
                  {PRINCIPAL_ADVOCATE.overview[0]} {PRINCIPAL_ADVOCATE.overview[1]}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-2xl border border-[#0A2536]/10 bg-[#F3FAFF] p-3.5">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#33566D]">
                      Section 01
                    </div>
                    <div className="font-display text-lg font-bold text-[#0A2536] mt-0.5">
                      Goods and Services Tax (6)
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#0A2536]/10 bg-[#F3FAFF] p-3.5">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#33566D]">
                      Section 02
                    </div>
                    <div className="font-display text-lg font-bold text-[#0A2536] mt-0.5">
                      Income Tax (4 Services)
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#0A2536]/10 bg-[#F3FAFF] p-3.5">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#33566D]">
                      Section 03
                    </div>
                    <div className="font-display text-lg font-bold text-[#0A2536] mt-0.5">
                      Others (7 Services)
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A2536] px-6 py-3 text-xs font-mono uppercase tracking-wider font-semibold text-[#F3FAFF] hover:bg-[#33566D] transition-colors"
                  >
                    About {PRINCIPAL_ADVOCATE.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/practice"
                    className="inline-flex items-center gap-2 rounded-full border border-[#0A2536]/20 bg-[#F3FAFF] px-6 py-3 text-xs font-mono uppercase tracking-wider font-semibold text-[#0A2536] hover:bg-[#DAF6EF] transition-colors"
                  >
                    See All Practice Areas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: HONOURS & CERTIFICATES (WITH ATTACHED ICJ CERTIFICATE) */}
      <HonoursCertificatesSection />
    </div>
  );
}
