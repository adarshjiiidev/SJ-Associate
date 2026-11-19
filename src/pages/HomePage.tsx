import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform
} from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Scale,
  ShieldCheck
} from "lucide-react";
import { ADVOCATE_CORRIDOR_IMAGE, COURT_IMAGES, HERO_IMAGE } from "@/src/data/assets";
import {
  COURTS_REGISTRY,
  validateConsultationInput,
  type CourtImageKey
} from "@/src/data/courtsRegistry";
import { CHAMBERS_OFFICES, PRACTICE_AREAS, PRINCIPAL_ADVOCATE } from "@/src/data/firmData";
import { parseJsonSafely } from "@/src/utils/http";
import { AdvocatePortrait } from "@/src/components/AdvocatePortrait";
import { CorporateSolutionsSection } from "@/src/components/CorporateSolutionsSection";
import { HonoursCertificatesSection } from "@/src/components/HonoursCertificatesSection";
import { PracticeWorkflowShowcase } from "@/src/components/PracticeWorkflowShowcase";
import { ResilientImage } from "@/src/components/ResilientImage";
import { Button } from "@/src/components/ui/button";

interface HomePageProps {
  onOpenConsultation: (briefNote?: string) => void;
}

interface CrossCourtBriefingItem {
  courtSlug: CourtImageKey;
  courtName: string;
  title: string;
  citation: string;
  date: string;
  category: string;
  summary: string;
  sourceUrl?: string;
}

const IMPACT_MILESTONES = [
  { value: 1450, suffix: "+", label: "Corporate & Tax Matters Argued Before Courts" },
  { value: 13, suffix: "", label: "GSTAT, High Courts & Supreme Court Tracked Live" },
  { value: 20, suffix: "+", label: "Years in Taxation & Corporate Litigation" },
  { value: 3, suffix: "", label: "Chambers Desks — Delhi, Mumbai & Bengaluru" }
];

const MATTER_STAGES = ["Pre-Filing", "Pending Appeal", "Urgent Stay"] as const;

function AnimatedCounter({
  target,
  suffix,
  active
}: {
  target: number;
  suffix: string;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const currentRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const duration = 680;
    const from = currentRef.current;
    const start = performance.now();

    function step(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (target - from) * eased);
      currentRef.current = next;
      setDisplay(next);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);

  return (
    <span className="tabular-nums">
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const SCROLL_EASE = [0.22, 1, 0.36, 1] as const;

export function HomePage({ onOpenConsultation }: HomePageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const impactRef = useRef<HTMLElement>(null);
  const counselRef = useRef<HTMLElement>(null);
  const courtsRef = useRef<HTMLElement>(null);
  const supportRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const [briefings, setBriefings] = useState<CrossCourtBriefingItem[]>([]);
  const [briefingsLoading, setBriefingsLoading] = useState(true);
  const [briefingsError, setBriefingsError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [updateOffset, setUpdateOffset] = useState(0);
  const [updateDirection, setUpdateDirection] = useState<1 | -1>(1);

  // Dynamic sand card active state (matching video frames 00:01-00:02)
  const [hoveredCard, setHoveredCard] = useState<0 | 1 | 2>(0);

  // Impact counter cycling (matching frames 00:03-00:07)
  const [impactIdx, setImpactIdx] = useState(0);
  const impactInView = useInView(impactRef, { once: true, amount: 0.3 });

  // Courts carousel (matching frames 00:10-00:12, defaults to High Court of Delhi)
  const [activeCourtIdx, setActiveCourtIdx] = useState(1);

  // Scroll-scrubbed tracks with smooth spring damping
  const { scrollYProgress: heroRaw } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroScroll = useSpring(heroRaw, { stiffness: 120, damping: 24 });
  const heroTitleY = useTransform(heroScroll, [0, 1], [0, -52]);
  const heroOpacity = useTransform(heroScroll, [0, 0.9], [1, 0.3]);
  const heroPillScale = useTransform(heroScroll, [0, 1], [1, 1.18]);

  const { scrollYProgress: impactRaw } = useScroll({
    target: impactRef,
    offset: ["start end", "end start"]
  });
  const impactScroll = useSpring(impactRaw, { stiffness: 120, damping: 24 });
  const impactCounterY = useTransform(impactScroll, [0, 1], [28, -28]);
  const archScaleY = useTransform(impactScroll, [0, 0.6], [0.7, 1.15]);

  const { scrollYProgress: counselRaw } = useScroll({
    target: counselRef,
    offset: ["start end", "end start"]
  });
  const counselScroll = useSpring(counselRaw, { stiffness: 120, damping: 24 });
  const portraitY = useTransform(counselScroll, [0, 1], [32, -32]);
  const counselTextY = useTransform(counselScroll, [0, 1], [20, -14]);

  const { scrollYProgress: courtsRaw } = useScroll({
    target: courtsRef,
    offset: ["start end", "end start"]
  });
  const courtsScroll = useSpring(courtsRaw, { stiffness: 120, damping: 24 });
  const centerSpotScale = useTransform(courtsScroll, [0, 0.5, 1], [0.94, 1.04, 0.98]);
  const sideSpreadLeft = useTransform(courtsScroll, [0, 0.5, 1], [26, 0, -14]);
  const sideSpreadRight = useTransform(courtsScroll, [0, 0.5, 1], [-26, 0, 14]);

  const { scrollYProgress: supportRaw } = useScroll({
    target: supportRef,
    offset: ["start end", "end start"]
  });
  const supportScroll = useSpring(supportRaw, { stiffness: 120, damping: 24 });
  const supportBgY = useTransform(supportScroll, [0, 1], ["-10%", "10%"]);
  const supportCardY = useTransform(supportScroll, [0, 0.5, 1], [36, 0, -18]);

  const { scrollYProgress: ctaRaw } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });
  const ctaScroll = useSpring(ctaRaw, { stiffness: 120, damping: 24 });
  const orbitLeftTopY = useTransform(ctaScroll, [0, 1], [48, -58]);
  const orbitLeftBottomY = useTransform(ctaScroll, [0, 1], [76, -40]);
  const orbitRightTopY = useTransform(ctaScroll, [0, 1], [-36, 56]);
  const orbitRightBottomY = useTransform(ctaScroll, [0, 1], [64, -64]);
  const ctaHeadingScale = useTransform(ctaScroll, [0, 0.5, 1], [0.95, 1.02, 0.99]);

  // Full-bleed translucent consultation form (matching frames 00:13-00:14)
  const [quickCourt, setQuickCourt] = useState("delhi-high-court");
  const [quickPractice, setQuickPractice] = useState(PRACTICE_AREAS[0].title);
  const [quickStage, setQuickStage] = useState<(typeof MATTER_STAGES)[number]>("Urgent Stay");
  const [quickName, setQuickName] = useState("");
  const [quickEmail, setQuickEmail] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [quickError, setQuickError] = useState<string | null>(null);
  const [quickSending, setQuickSending] = useState(false);
  const [quickSuccessRef, setQuickSuccessRef] = useState<string | null>(null);
  const [quickEmailForwarded, setQuickEmailForwarded] = useState(false);

  async function loadBriefings(refresh = false) {
    setBriefingsLoading(true);
    setBriefingsError(null);
    try {
      const url = refresh
        ? "/api/courts/briefings/latest?refresh=1"
        : "/api/courts/briefings/latest";
      const res = await fetch(url);
      const data = await parseJsonSafely<{
        items?: CrossCourtBriefingItem[];
        fetchedAt?: string;
        error?: string;
      }>(res);
      if (!res.ok || !data) {
        throw new Error(data?.error || "Unable to fetch court updates right now.");
      }
      setBriefings(data.items ?? []);
      setFetchedAt(data.fetchedAt ?? null);
      setUpdateOffset(0);
    } catch (err) {
      setBriefingsError(
        err instanceof Error ? err.message : "Could not load live court updates."
      );
    } finally {
      setBriefingsLoading(false);
    }
  }

  useEffect(() => {
    void loadBriefings(false);
  }, []);

  useEffect(() => {
    if (!impactInView) return;
    const timer = setInterval(() => {
      setImpactIdx((prev) => (prev + 1) % IMPACT_MILESTONES.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [impactInView]);

  async function handleQuickSubmit(e: FormEvent) {
    e.preventDefault();
    setQuickError(null);

    const check = validateConsultationInput({
      fullName: quickName,
      email: quickEmail,
      phone: quickPhone,
      courtSlug: quickCourt,
      practiceArea: quickPractice,
      briefSummary: `[${quickStage}] ${quickNote}`
    });

    if (!check.valid) {
      const firstErr = Object.values(check.errors)[0];
      setQuickError(firstErr || "Please complete all fields before sending.");
      return;
    }

    setQuickSending(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: quickName,
          email: quickEmail,
          phone: quickPhone,
          courtSlug: quickCourt,
          practiceArea: quickPractice,
          briefSummary: `[${quickStage}] ${quickNote}`
        })
      });
      const data = await parseJsonSafely<{
        referenceId?: string;
        emailForwarded?: boolean;
        error?: string;
      }>(res);
      if (!res.ok || !data?.referenceId) {
        throw new Error(data?.error || "Could not send your note.");
      }
      setQuickSuccessRef(data.referenceId);
      setQuickEmailForwarded(Boolean(data.emailForwarded));
      setQuickName("");
      setQuickEmail("");
      setQuickPhone("");
      setQuickNote("");
    } catch (err) {
      setQuickError(err instanceof Error ? err.message : "Unable to reach Chambers right now.");
    } finally {
      setQuickSending(false);
    }
  }

  const visibleCourts = [-2, -1, 0, 1, 2].map((delta) => {
    const idx = (activeCourtIdx + delta + COURTS_REGISTRY.length) % COURTS_REGISTRY.length;
    return { court: COURTS_REGISTRY[idx], idx, isCenter: delta === 0 };
  });

  const visibleBriefings =
    briefings.length <= 4
      ? briefings
      : [0, 1, 2, 3].map((i) => briefings[(updateOffset + i) % briefings.length]);

  const currentMilestone = IMPACT_MILESTONES[impactIdx];

  return (
    <div>
      {/* 1. Hero Section: Pure White (#F3FAFF) -> Pure Mint (#DAF6EF) Wash + Darker Grotesque Display */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-[#F3FAFF] via-[#ECF7FC] to-[#DAF6EF]/55"
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 pt-12 pb-10 sm:pt-24 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: SCROLL_EASE }}
            style={{ y: heroTitleY, opacity: heroOpacity }}
            className="mx-auto max-w-5xl text-center space-y-5 sm:space-y-6 will-change-transform"
          >
            <h1
              className="font-black tracking-tight text-[#0A2536] leading-[0.94]"
              style={{ fontSize: "clamp(1.85rem, 6.8vw, 5.5rem)", textWrap: "balance" }}
            >
              <span className="inline-flex flex-nowrap items-center justify-center gap-x-2 sm:gap-x-4 whitespace-nowrap max-w-full">
                <span>SJ</span>
                <motion.span
                  style={{ scale: heroPillScale }}
                  className="inline-block h-8 w-14 sm:h-16 sm:w-36 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm align-middle will-change-transform"
                >
                  <ResilientImage
                    src={COURT_IMAGES["delhi-high-court"]}
                    alt="High Court of Delhi building exterior"
                    fallbackLabel="Delhi HC"
                  />
                </motion.span>
                <span>Associates</span>
              </span>
              <span className="block mt-1">Stands For You</span>
            </h1>

            <div className="mx-auto max-w-2xl space-y-1.5 text-center px-1">
              <p className="text-base sm:text-xl font-extrabold text-[#0A2536]">
                {PRINCIPAL_ADVOCATE.name}
              </p>
              <p className="text-xs sm:text-base font-bold uppercase tracking-[0.12em] text-[#0A2536] whitespace-nowrap">
                {PRINCIPAL_ADVOCATE.courtLine}
              </p>
              <p className="text-[11px] sm:text-base font-semibold text-[#33566D] whitespace-nowrap">
                {PRINCIPAL_ADVOCATE.membership}
              </p>
              <p className="pt-2 text-sm sm:text-base text-[#33566D] leading-relaxed">
                Focused on Income Tax &amp; GST filings, GSTAT appeals, customs, business setup, and corporate litigation before Indian courts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 max-w-md sm:max-w-none mx-auto">
              <Button
                type="button"
                size="lg"
                onClick={() => onOpenConsultation()}
                className="w-full sm:w-auto min-h-[48px] rounded-full px-8 text-xs uppercase tracking-[0.08em]"
              >
                Book Consultation
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-h-[48px] rounded-full bg-white hover:bg-[#DAF6EF]/70 px-6 text-xs uppercase tracking-[0.08em]"
              >
                <Link to="/courts">
                  Live Court Updates
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-[#F3FAFF]">
                    <ArrowRight className="h-3.5 w-3.5 text-[#0A2536]" aria-hidden="true" />
                  </span>
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Bottom Trust Bar */}
          <div className="mt-10 sm:mt-14 pt-5 sm:pt-6 border-t border-[#0A2536]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 text-xs text-[#33566D]">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 sm:gap-x-8 gap-y-2 font-semibold text-[#0A2536]/80">
              <span>Income Tax &amp; GST Filing</span>
              <span>GSTAT &amp; Customs Appeals</span>
              <span>Business &amp; MSME Setup</span>
              <span>Delhi HC &amp; Supreme Court</span>
            </div>
            <button
              type="button"
              onClick={() =>
                document.getElementById("what-we-do")?.scrollIntoView({ behavior: "smooth" })
              }
              className="hidden sm:inline-flex items-center gap-2 font-bold uppercase tracking-[0.08em] text-[#0A2536] hover:text-[#33566D] transition-colors cursor-pointer"
            >
              Scroll Down
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white"
              >
                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              </motion.span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. "What We Do" 3-Column Section (Scroll Stagger + Dynamic Mint Hover) */}
      <section id="what-we-do" className="relative bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 space-y-10 sm:space-y-12">
          <motion.div
            initial={{ opacity: 0.2, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.55, ease: SCROLL_EASE }}
            className="mx-auto max-w-2xl text-center space-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#33566D]">
              What We Do
            </p>
            <h2
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A2536] leading-[0.98]"
              style={{ textWrap: "balance" }}
            >
              Providing Clear Counsel In Difficult Times
            </h2>
            <div className="pt-2">
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#0A2536] hover:text-[#33566D] transition-colors"
              >
                Learn More
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-[#F3FAFF]">
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
            style={{ perspective: "1200px" }}
          >
            <motion.div
              initial={{ opacity: 0.2, y: 32, rotateX: 6 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 0.55, delay: 0, ease: SCROLL_EASE }}
              whileHover={{ y: -6 }}
              onMouseEnter={() => setHoveredCard(0)}
              onFocus={() => setHoveredCard(0)}
              className={`rounded-[24px] border border-border p-7 sm:p-8 flex flex-col justify-between space-y-8 sm:space-y-10 transition-colors duration-300 ${
                hoveredCard === 0 ? "bg-[#DAF6EF]/65 border-[#33566D]/30" : "bg-white"
              }`}
            >
              <div className="space-y-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-border text-[#0A2536]">
                  <Scale className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A2536]">Income Tax &amp; GST Filing</h3>
                <p className="text-sm text-[#33566D] leading-relaxed">
                  ITR &amp; TDS returns, GSTR-1/3B/9 reconciliations, GST show-cause replies, GSTAT Section 112 tribunal appeals, Section 148 reassessments, and High Court tax stays.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium text-[#33566D]">
                  Income Tax · GST · GSTAT · Supreme Court
                </span>
                <Link
                  to="/about"
                  aria-label="Meet Advocate Sanjay Kumar Singh and Counsel"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                    hoveredCard === 0
                      ? "bg-[#0A2536] text-[#F3FAFF] border-[#0A2536] shadow-xs scale-105"
                      : "bg-white text-[#0A2536] border-border"
                  }`}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0.2, y: 32, rotateX: 6 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 0.55, delay: 0.09, ease: SCROLL_EASE }}
              whileHover={{ y: -6 }}
              onMouseEnter={() => setHoveredCard(1)}
              onFocus={() => setHoveredCard(1)}
              className={`rounded-[24px] border border-border p-7 sm:p-8 flex flex-col justify-between space-y-8 sm:space-y-10 transition-colors duration-300 ${
                hoveredCard === 1 ? "bg-[#DAF6EF]/65 border-[#33566D]/30" : "bg-white"
              }`}
            >
              <div className="space-y-4">
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border text-[#0A2536] transition-colors duration-300 ${
                    hoveredCard === 1 ? "bg-white" : "bg-[#F3FAFF]"
                  }`}
                >
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A2536]">GSTAT &amp; Live Court Reports</h3>
                <p className="text-sm text-[#33566D] leading-relaxed">
                  Open live court updates, recent orders, and cause list links for the Supreme Court, GSTAT (Principal Bench), and eleven major High Courts across India—including Delhi, Bombay, Chandigarh, and Patna.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium text-[#33566D]">
                  {COURTS_REGISTRY.length} Courts &amp; GSTAT Updated Live
                </span>
                <Link
                  to="/courts"
                  aria-label="Open All Courts Live Reports"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                    hoveredCard === 1
                      ? "bg-[#0A2536] text-[#F3FAFF] border-[#0A2536] shadow-xs scale-105"
                      : "bg-white text-[#0A2536] border-border"
                  }`}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0.2, y: 32, rotateX: 6 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 0.55, delay: 0.18, ease: SCROLL_EASE }}
              whileHover={{ y: -6 }}
              onMouseEnter={() => setHoveredCard(2)}
              onFocus={() => setHoveredCard(2)}
              className={`rounded-[24px] border border-border p-7 sm:p-8 flex flex-col justify-between space-y-8 sm:space-y-10 transition-colors duration-300 ${
                hoveredCard === 2 ? "bg-[#DAF6EF]/65 border-[#33566D]/30" : "bg-white"
              }`}
            >
              <div className="space-y-4">
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border text-[#0A2536] transition-colors duration-300 ${
                    hoveredCard === 2 ? "bg-white" : "bg-[#F3FAFF]"
                  }`}
                >
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A2536]">Business &amp; Compliance Setup</h3>
                <p className="text-sm text-[#33566D] leading-relaxed">
                  Complete statutory setup—Company &amp; LLP incorporation, Partnership registration, GSTIN, MSME Udyam, IEC/DGFT licensing, Trademarks, accounting, and board advisory.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium text-[#33566D]">
                  Businesses, Founders &amp; Boards
                </span>
                <button
                  type="button"
                  onClick={() => onOpenConsultation()}
                  aria-label="Request a consultation"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                    hoveredCard === 2
                      ? "bg-[#0A2536] text-[#F3FAFF] border-[#0A2536] shadow-xs scale-105"
                      : "bg-white text-[#0A2536] border-border"
                  }`}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Corporate & Taxation Solutions Catalogue (from Firm Catalogue Screenshots) */}
      <CorporateSolutionsSection
        onConsultSolutions={(titles) =>
          onOpenConsultation(`Selected Corporate & Tax Solutions: ${titles.join(", ")}. `)
        }
      />

      {/* Interactive Workflow Process Showcase (from Reference Video another.mp4) */}
      <PracticeWorkflowShowcase onOpenConsultation={() => onOpenConsultation()} />

      {/* 3. Cape Cod (#0A2536) Impact Animated Number Section with Pure Mint (#DAF6EF) Counter & White Arch */}
      <section ref={impactRef} className="relative bg-[#0A2536] text-[#F3FAFF] pt-16 sm:pt-20 pb-28 overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0.25, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.5, ease: SCROLL_EASE }}
            className="space-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#DAF6EF]/80">
              Our Standing
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F3FAFF] leading-[0.98]">
              Together, We Protect Your Legal Rights
            </h2>
          </motion.div>

          <motion.div style={{ y: impactCounterY }} className="py-4 will-change-transform">
            <AnimatePresence mode="wait">
              <motion.div
                key={impactIdx}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.96 }}
                transition={{ duration: 0.38, ease: SCROLL_EASE }}
                className="space-y-2"
              >
                <p
                  className="font-black tracking-tight text-[#DAF6EF] leading-none"
                  style={{ fontSize: "clamp(3.75rem, 9.5vw, 6.75rem)" }}
                >
                  <AnimatedCounter
                    target={currentMilestone.value}
                    suffix={currentMilestone.suffix}
                    active={impactInView}
                  />
                </p>
                <p className="text-sm sm:text-base font-medium text-[#F3FAFF]/85">
                  {currentMilestone.label}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2 relative z-10">
            {IMPACT_MILESTONES.map((m, idx) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setImpactIdx(idx)}
                className={`min-h-[36px] px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  impactIdx === idx
                    ? "bg-[#DAF6EF] text-[#0A2536]"
                    : "bg-[#33566D]/55 text-[#F3FAFF]/85 hover:bg-[#33566D]"
                }`}
              >
                {m.value.toLocaleString("en-IN")}
                {m.suffix}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll-linked curved white arch bottom transition */}
        <motion.div
          aria-hidden="true"
          style={{ scaleY: archScaleY }}
          className="absolute bottom-0 left-0 w-full origin-bottom pointer-events-none will-change-transform"
        >
          <svg
            viewBox="0 0 1440 72"
            preserveAspectRatio="none"
            className="w-full h-14 sm:h-18 fill-white block"
          >
            <path d="M0,72 C480,0 960,0 1440,72 L1440,72 L0,72 Z" />
          </svg>
        </motion.div>
      </section>

      {/* 4. Principal Advocate Leadership Section with Scroll Depth Parallax */}
      <section ref={counselRef} className="relative bg-white py-14 sm:py-20 overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0.25, y: 22, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 0.5, ease: SCROLL_EASE }}
              style={{ y: portraitY }}
              className="lg:col-span-5 will-change-transform"
            >
              <AdvocatePortrait className="mx-auto max-w-[400px] lg:mx-0" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0.25, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 0.5, ease: SCROLL_EASE }}
              style={{ y: counselTextY }}
              className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6 will-change-transform"
            >
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#33566D]">
                  Principal Counsel · {PRINCIPAL_ADVOCATE.firm}
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A2536] leading-[0.98]"
                  style={{ textWrap: "balance" }}
                >
                  {PRINCIPAL_ADVOCATE.name}
                </h2>
                <p className="text-sm font-medium text-[#33566D]">
                  {PRINCIPAL_ADVOCATE.title}
                  <span aria-hidden="true"> · </span>
                  <span>{PRINCIPAL_ADVOCATE.membership}</span>
                </p>
              </div>

              <blockquote className="rounded-2xl bg-[#DAF6EF]/55 border border-[#33566D]/20 p-5 sm:p-6 text-base sm:text-xl font-medium text-[#0A2536] leading-relaxed">
                &ldquo;{PRINCIPAL_ADVOCATE.statement}&rdquo;
              </blockquote>

              <p className="text-sm sm:text-base text-[#33566D] leading-relaxed max-w-2xl">
                Based at the High Court of Delhi in New Delhi and working with corporate desks in Mumbai and Bengaluru, {PRINCIPAL_ADVOCATE.name} focuses exclusively on corporate and taxation law—advising companies, CFOs, and boards on GST, direct tax, customs, NCLT insolvency, and commercial arbitration.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto min-h-[48px] rounded-full px-7 text-xs uppercase tracking-wider"
                >
                  <Link to="/about">
                    About {PRINCIPAL_ADVOCATE.name}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto min-h-[48px] rounded-full px-7 text-xs uppercase tracking-wider"
                >
                  <Link to="/practice">See All Practice Areas</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4b. Honours & Certificates Showcase */}
      <HonoursCertificatesSection />

      {/* 5. Interactive Courts Spotlight Carousel with Scroll-Driven Fan & 3D Depth */}
      <section ref={courtsRef} className="relative bg-[#F3FAFF] py-16 sm:py-20 overflow-hidden border-y border-border">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 space-y-8 sm:space-y-10">
          <motion.div
            initial={{ opacity: 0.25, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.55, ease: SCROLL_EASE }}
            className="mx-auto max-w-2xl text-center space-y-3"
          >
            <h2
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A2536] leading-[0.98]"
              style={{ textWrap: "balance" }}
            >
              Real-Time Reports Across High Courts &amp; Supreme Court
            </h2>
            <div className="pt-1">
              <Link
                to="/courts"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#0A2536] hover:text-[#33566D] transition-colors"
              >
                See All {COURTS_REGISTRY.length} Courts &amp; GSTAT
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white">
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </motion.div>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center"
            style={{ perspective: "1200px" }}
          >
            {visibleCourts.map(({ court, idx, isCenter }, posIdx) => {
              const sideOffset =
                posIdx < 2 ? sideSpreadLeft : posIdx > 2 ? sideSpreadRight : undefined;

              return (
                <motion.div
                  key={court.slug}
                  style={isCenter ? { scale: centerSpotScale } : { x: sideOffset }}
                  className={`will-change-transform ${
                    isCenter ? "sm:col-span-3 lg:col-span-1 z-10" : "hidden lg:block"
                  }`}
                >
                  {isCenter ? (
                    <motion.div
                      key={court.slug}
                      initial={{ opacity: 0.7, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: SCROLL_EASE }}
                      className="rounded-[24px] border border-border bg-white overflow-hidden shadow-md"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#DAF6EF]/40">
                        <ResilientImage
                          src={COURT_IMAGES[court.slug]}
                          alt={`${court.name} architectural exterior`}
                          fallbackLabel={court.shortName}
                        />
                        <div className="absolute inset-x-0 bottom-3 flex justify-center">
                          <Button
                            asChild
                            size="sm"
                            className="rounded-full px-5 shadow-md text-xs uppercase tracking-wider"
                          >
                            <Link to={`/courts/${court.slug}`}>Open Report</Link>
                          </Button>
                        </div>
                      </div>
                      <div className="p-5 space-y-2.5">
                        <div>
                          <h3 className="text-xl font-extrabold text-[#0A2536] leading-snug">
                            {court.shortName}
                          </h3>
                          <p className="text-xs text-[#33566D]">
                            {court.city} · Est. {court.establishedYear}
                          </p>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#DAF6EF] overflow-hidden">
                          <div className="h-full w-4/5 rounded-full bg-[#0A2536]" />
                        </div>
                        <p className="text-xs font-semibold text-[#0A2536]/80 line-clamp-1">
                          {court.stateOrJurisdiction}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveCourtIdx(idx)}
                      className="group w-full text-left rounded-[22px] border border-border bg-white/70 overflow-hidden cursor-pointer hover:border-[#33566D]/50 transition-all"
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        <ResilientImage
                          src={COURT_IMAGES[court.slug]}
                          alt={`${court.name} exterior`}
                          fallbackLabel={court.shortName}
                          imgClassName="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        />
                      </div>
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Previous court"
                onClick={() =>
                  setActiveCourtIdx(
                    (prev) => (prev - 1 + COURTS_REGISTRY.length) % COURTS_REGISTRY.length
                  )
                }
                className="rounded-full bg-white h-11 w-11"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="text-xs font-semibold text-[#33566D] tabular-nums px-2">
                {activeCourtIdx + 1} / {COURTS_REGISTRY.length}
              </span>
              <Button
                type="button"
                size="icon"
                aria-label="Next court"
                onClick={() => setActiveCourtIdx((prev) => (prev + 1) % COURTS_REGISTRY.length)}
                className="rounded-full h-11 w-11"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {/* Mobile horizontal quick court pills */}
            <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {COURTS_REGISTRY.map((c, idx) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setActiveCourtIdx(idx)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                    activeCourtIdx === idx
                      ? "bg-[#0A2536] text-[#F3FAFF] border-[#0A2536]"
                      : "bg-white text-[#33566D] border-border"
                  }`}
                >
                  {c.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Full-Bleed Cape Cod (#0A2536) Translucent Consultation Form with Parallax Backdrop */}
      <section ref={supportRef} className="relative overflow-hidden bg-[#0A2536] text-[#F3FAFF]">
        <motion.div
          style={{ y: supportBgY, scale: 1.16 }}
          className="absolute inset-0 will-change-transform pointer-events-none"
        >
          <ResilientImage
            src={ADVOCATE_CORRIDOR_IMAGE}
            alt="Advocate Sanjay Kumar Singh in High Court robes along the New Delhi court colonnade"
            className="h-full w-full object-cover object-[72%_20%] opacity-65 sm:opacity-80"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0A2536]/95 via-[#0A2536]/75 lg:via-[#0A2536]/60 to-[#0A2536]/30"
          />
        </motion.div>

        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-6 py-16 sm:py-20 space-y-8 sm:space-y-10">
          <motion.div
            initial={{ opacity: 0.25, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.55, ease: SCROLL_EASE }}
            className="mx-auto max-w-2xl text-center space-y-2"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#DAF6EF]/85">
              Get Help
            </p>
            <h2
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F3FAFF] leading-[0.98]"
              style={{ textWrap: "balance" }}
            >
              We&apos;re Here To Support You Every Step Of The Way
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              style={{ y: supportCardY }}
              className="lg:col-span-5 will-change-transform"
            >
              <div className="rounded-[24px] border border-[#DAF6EF]/25 bg-[#0A2536]/75 backdrop-blur-lg p-6 sm:p-7 space-y-4">
                <h3 className="text-2xl font-bold text-[#F3FAFF]">What&apos;s going on?</h3>

                {quickSuccessRef ? (
                  <div className="rounded-xl bg-[#0A2536] border border-[#DAF6EF]/35 p-5 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#DAF6EF] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-[#F3FAFF] text-sm">
                          Thank you — your note has been received.
                        </p>
                        <p className="text-xs text-[#DAF6EF]/85">
                          Ref: <span className="font-mono">{quickSuccessRef}</span>. SJ Associates will contact you shortly.
                          {quickEmailForwarded ? " Delivered to sanjaysingh@legalsja.com." : ""}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickSuccessRef(null)}
                      className="rounded-full border-[#DAF6EF]/40 bg-transparent text-[#F3FAFF] hover:bg-white/15"
                    >
                      Send Another Note
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleQuickSubmit} className="space-y-3" noValidate>
                    {quickError && (
                      <p className="text-xs text-red-100 bg-red-900/60 border border-red-300/40 rounded-lg px-3 py-2">
                        {quickError}
                      </p>
                    )}

                    <div className="space-y-1">
                      <label htmlFor="quick-practice" className="text-[11px] font-medium text-[#DAF6EF]/85">
                        Type of Case
                      </label>
                      <select
                        id="quick-practice"
                        value={quickPractice}
                        onChange={(e) => setQuickPractice(e.target.value)}
                        className="w-full h-11 rounded-full border border-white/25 bg-[#0A2536]/80 px-4 text-xs text-[#F3FAFF] focus:outline-none focus:ring-2 focus:ring-[#DAF6EF]"
                      >
                        {PRACTICE_AREAS.map((area) => (
                          <option key={area.id} value={area.title} className="text-foreground">
                            {area.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="quick-court" className="text-[11px] font-medium text-[#DAF6EF]/85">
                        Court
                      </label>
                      <select
                        id="quick-court"
                        value={quickCourt}
                        onChange={(e) => setQuickCourt(e.target.value)}
                        className="w-full h-11 rounded-full border border-white/25 bg-[#0A2536]/80 px-4 text-xs text-[#F3FAFF] focus:outline-none focus:ring-2 focus:ring-[#DAF6EF]"
                      >
                        {COURTS_REGISTRY.map((c) => (
                          <option key={c.slug} value={c.slug} className="text-foreground">
                            {c.shortName.includes(c.city) ? c.shortName : `${c.shortName} (${c.city})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-[#DAF6EF]/85 block">
                        Matter stage
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {MATTER_STAGES.map((stage) => (
                          <button
                            key={stage}
                            type="button"
                            onClick={() => setQuickStage(stage)}
                            className={`h-10 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                              quickStage === stage
                                ? "bg-[#DAF6EF] text-[#0A2536]"
                                : "bg-[#33566D]/55 text-[#F3FAFF] hover:bg-[#33566D]"
                            }`}
                          >
                            {stage}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Your Name"
                        aria-label="Your Name"
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                        className="h-11 rounded-full border border-white/25 bg-white/10 px-4 text-xs text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-[#DAF6EF]"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        aria-label="Phone Number"
                        value={quickPhone}
                        onChange={(e) => setQuickPhone(e.target.value)}
                        className="h-11 rounded-full border border-white/25 bg-white/10 px-4 text-xs text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-[#DAF6EF]"
                      />
                    </div>

                    <input
                      type="email"
                      placeholder="Corporate Email"
                      aria-label="Corporate Email"
                      value={quickEmail}
                      onChange={(e) => setQuickEmail(e.target.value)}
                      className="w-full h-11 rounded-full border border-white/25 bg-white/10 px-4 text-xs text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-[#DAF6EF]"
                    />

                    <textarea
                      rows={2}
                      placeholder="Brief note on tax notice, GST, or corporate matter..."
                      aria-label="Brief note on tax notice, GST, or corporate matter"
                      value={quickNote}
                      onChange={(e) => setQuickNote(e.target.value)}
                      className="w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-[#DAF6EF]"
                    />

                    <Button
                      type="submit"
                      disabled={quickSending}
                      className="w-full min-h-[46px] rounded-full bg-[#DAF6EF] text-[#0A2536] hover:bg-white uppercase text-xs font-bold tracking-wider"
                    >
                      {quickSending ? "Sending..." : "Request Help"}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            <div className="lg:col-span-7 hidden lg:block" />
          </div>
        </div>
      </section>

      {/* 7. Real-Time Court Updates Carousel */}
      <section className="relative bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 space-y-8 sm:space-y-10">
          <motion.div
            initial={{ opacity: 0.25, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.5, ease: SCROLL_EASE }}
            className="mx-auto max-w-2xl text-center space-y-3"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A2536]">
              Updates From Courts Across India
            </h2>
            <div className="flex items-center justify-center gap-4 pt-1">
              <Link
                to="/courts"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#0A2536] hover:text-[#33566D]"
              >
                See All
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-[#F3FAFF]">
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
              <button
                type="button"
                onClick={() => loadBriefings(true)}
                disabled={briefingsLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#33566D] hover:text-[#0A2536] cursor-pointer"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${briefingsLoading ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                Refresh
              </button>
            </div>
          </motion.div>

          {briefingsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="space-y-3 animate-pulse">
                  <div className="aspect-[4/3] rounded-[20px] bg-[#E6F2F7]" />
                  <div className="h-3 w-24 bg-[#E6F2F7] rounded-sm" />
                  <div className="h-5 w-full bg-[#E6F2F7] rounded-sm" />
                </div>
              ))}
            </div>
          ) : briefingsError ? (
            <div className="rounded-2xl border border-border bg-[#F3FAFF] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#0A2536]">
                    Could not load live court updates
                  </p>
                  <p className="text-xs text-[#33566D]">{briefingsError}</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => loadBriefings(true)}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={updateOffset}
                  initial={{ opacity: 0.4, x: updateDirection * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0.4, x: updateDirection * -28 }}
                  transition={{ duration: 0.3, ease: SCROLL_EASE }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {visibleBriefings.map((item, idx) => (
                    <motion.div
                      key={`${item.courtSlug}-${idx}`}
                      initial={{ opacity: 0.2, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: "some" }}
                      transition={{ duration: 0.45, delay: idx * 0.06, ease: SCROLL_EASE }}
                    >
                      <Link
                        to={`/courts/${item.courtSlug}`}
                        className="group space-y-3 block"
                      >
                        <div className="aspect-[4/3] overflow-hidden rounded-[20px] border border-border bg-[#F3FAFF]">
                          <ResilientImage
                            src={COURT_IMAGES[item.courtSlug] || HERO_IMAGE}
                            alt={`${item.courtName} building`}
                            fallbackLabel={item.courtName}
                            imgClassName="transition-transform duration-300 group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs text-[#33566D] tabular-nums">
                            {item.date} · <span className="text-[#0A2536] font-bold">{item.courtName}</span>
                          </p>
                          <h3 className="text-lg font-extrabold text-[#0A2536] leading-snug group-hover:text-[#33566D] transition-colors line-clamp-3">
                            {item.title}
                          </h3>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between pt-2">
                {fetchedAt ? (
                  <span className="text-xs font-mono tabular-nums text-[#33566D]">
                    Updated{" "}
                    {new Date(fetchedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </span>
                ) : (
                  <span />
                )}

                {briefings.length > 4 && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Previous updates"
                      onClick={() => {
                        setUpdateDirection(-1);
                        setUpdateOffset(
                          (prev) => (prev - 1 + briefings.length) % briefings.length
                        );
                      }}
                      className="rounded-full h-10 w-10"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      aria-label="Next updates"
                      onClick={() => {
                        setUpdateDirection(1);
                        setUpdateOffset((prev) => (prev + 1) % briefings.length);
                      }}
                      className="rounded-full h-10 w-10"
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. Orbital Floating Photo Collage CTA with Mint-Ice Backdrop + Mobile Mini Strip */}
      <section ref={ctaRef} className="relative overflow-hidden bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/65 py-16 sm:py-28 border-t border-border">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 relative">
          {/* Mobile Mini Court Collage Row */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-6">
            {(
              [
                "supreme-court-of-india",
                "delhi-high-court",
                "bombay-high-court",
                "madras-high-court"
              ] as const
            ).map((slug) => (
              <div
                key={slug}
                className="h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0"
              >
                <ResilientImage
                  src={COURT_IMAGES[slug]}
                  alt={slug.replace(/-/g, " ")}
                  fallbackLabel="Court"
                />
              </div>
            ))}
          </div>

          {/* Scroll-driven orbital circular windows on desktop */}
          <motion.div
            style={{ y: orbitLeftTopY }}
            className="hidden lg:block absolute left-8 top-4 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-sm"
            >
              <ResilientImage
                src={COURT_IMAGES["supreme-court-of-india"]}
                alt="Supreme Court of India"
                fallbackLabel="SC"
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: orbitLeftBottomY }}
            className="hidden lg:block absolute left-24 bottom-0 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              className="h-36 w-36 rounded-full overflow-hidden border-4 border-white shadow-sm"
            >
              <ResilientImage
                src={COURT_IMAGES["delhi-high-court"]}
                alt="High Court of Delhi"
                fallbackLabel="Delhi HC"
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: orbitRightTopY }}
            className="hidden lg:block absolute right-12 top-0 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-sm"
            >
              <ResilientImage
                src={COURT_IMAGES["bombay-high-court"]}
                alt="Bombay High Court"
                fallbackLabel="Bombay HC"
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: orbitRightBottomY }}
            className="hidden lg:block absolute right-24 bottom-2 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-sm"
            >
              <ResilientImage
                src={COURT_IMAGES["madras-high-court"]}
                alt="Madras High Court"
                fallbackLabel="Madras HC"
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ scale: ctaHeadingScale }}
            className="mx-auto max-w-xl text-center space-y-5 sm:space-y-6 relative z-10 py-2 sm:py-6 will-change-transform"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#33566D]">
              Speak With Chambers
            </p>
            <h2
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A2536] leading-[0.98]"
              style={{ textWrap: "balance" }}
            >
              Ready To Discuss Your Matter?
            </h2>
            <p className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-[#33566D]">
              <MapPin className="h-4 w-4 text-[#0A2536] shrink-0" aria-hidden="true" />
              <span>{CHAMBERS_OFFICES[0].address}</span>
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 pt-2 max-w-md sm:max-w-none mx-auto">
              <Button
                type="button"
                size="lg"
                onClick={() => onOpenConsultation()}
                className="w-full sm:w-auto min-h-[48px] rounded-full px-8 text-xs uppercase tracking-wider"
              >
                Book Consultation
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-h-[48px] rounded-full bg-white px-6 text-xs uppercase tracking-wider"
              >
                <Link to="/contact">
                  Contact Office
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-[#F3FAFF]">
                    <ArrowRight className="h-3.5 w-3.5 text-[#0A2536]" aria-hidden="true" />
                  </span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
