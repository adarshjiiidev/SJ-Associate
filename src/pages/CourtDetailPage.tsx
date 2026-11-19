import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getCourtBySlug,
  buildArchiveFallbackReport,
  TAX_AND_REGIONAL_OFFICES,
  type CourtProfile,
  type LiveCourtReport,
  type JudicialRuling,
} from "@/src/data/courtsRegistry";
import { COURT_IMAGES } from "@/src/data/assets";
import { Button } from "@/src/components/ui/button";
import { ResilientImage } from "@/src/components/ResilientImage";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Scale,
  MapPin,
  Calendar,
  Building2,
  FileText,
  Landmark,
  CheckCircle2,
  Clock,
} from "lucide-react";

export interface CourtDetailPageProps {
  onConsultForCourt: (slug: string) => void;
}

export function CourtDetailPage({ onConsultForCourt }: CourtDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const court: CourtProfile | undefined = slug ? getCourtBySlug(slug) : undefined;

  const [report, setReport] = useState<LiveCourtReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"holdings" | "registry" | "appearance">("holdings");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const fetchLiveReport = useCallback(async (forceRefresh = false) => {
    if (!court) return;
    setLoading(true);
    try {
      const url = `/api/courts/${court.slug}/live${forceRefresh ? "?refresh=true" : ""}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const reportPayload: LiveCourtReport = data.report || data;
        setReport(reportPayload);
      }
    } catch {
      // Fallback handled via buildArchiveFallbackReport below
    } finally {
      setLoading(false);
    }
  }, [court]);

  useEffect(() => {
    setReport(null);
    setCategoryFilter("All");
    fetchLiveReport(false);
  }, [fetchLiveReport]);

  if (!court) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-[#0A2536]">Court Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The court you are looking for could not be found.
        </p>
        <Link to="/courts" className="mt-6 inline-block">
          <Button className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
            Return to Courts Directory
          </Button>
        </Link>
      </div>
    );
  }

  const fallbackReport = buildArchiveFallbackReport(court, new Date().toISOString());
  const activeReport = report || fallbackReport;
  const holdings: JudicialRuling[] =
    activeReport.rulings && activeReport.rulings.length > 0
      ? activeReport.rulings
      : fallbackReport.rulings;
  const overview = activeReport.overviewSummary || court.summary;

  const nearbyTaxOffices = TAX_AND_REGIONAL_OFFICES.filter(
    (o) =>
      o.nearbyCourtSlug === court.slug ||
      (court.slug === "supreme-court-of-india" &&
        o.group === "Delhi Tax & Regional Offices")
  );

  const categories: string[] = [
    "All",
    ...Array.from(new Set(holdings.map((h) => String(h.category || "GST & Income Tax")))),
  ];

  const filteredHoldings =
    categoryFilter === "All"
      ? holdings
      : holdings.filter((h) => h.category === categoryFilter);

  const courtImg =
    COURT_IMAGES[court.slug] || COURT_IMAGES["supreme-court-of-india"];

  return (
    <div className="min-h-screen bg-[#F3FAFF]">
      {/* Court Header */}
      <section className="border-b border-border bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/45 text-[#0A2536] py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              to="/courts"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#33566D] hover:text-[#0A2536] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to All Courts
            </Link>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLiveReport(true)}
                disabled={loading}
                className="rounded-full"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Refreshing..." : "Refresh Live Report"}
              </Button>
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => onConsultForCourt(court.slug)}
              >
                Consult on {court.shortName} Matter
              </Button>
            </div>
          </div>

          <div className="rounded-[26px] border border-[#0A2536]/12 bg-white/85 p-5 sm:p-7 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
              <div className="lg:col-span-5 relative overflow-hidden rounded-[20px] min-h-[240px] sm:min-h-[280px]">
                <ResilientImage
                  src={courtImg}
                  alt={court.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2536]/80 via-[#0A2536]/20 to-transparent" />
                <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#0A2536]/85 backdrop-blur-sm px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#F3FAFF]">
                    {court.tier}
                  </span>
                  <span className="rounded-full bg-[#DAF6EF]/90 px-3 py-1 font-mono text-[10px] font-semibold text-[#0A2536]">
                    Est. {court.establishedYear}
                  </span>
                </div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-[#F3FAFF]">
                  <div className="flex items-center gap-1.5 text-xs text-[#DAF6EF]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>Principal Seat: {court.city}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#33566D] mb-1">
                    COURT REPORT &amp; CASE UPDATES · ZERO AI CREDITS
                  </div>
                  <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#0A2536] leading-[0.98]">
                    {court.name}
                  </h1>
                  <p className="mt-3 text-[#33566D] text-sm sm:text-base leading-relaxed">
                    {overview}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#33566D] mb-1.5">
                      Jurisdiction &amp; Benches
                    </div>
                    <p className="text-xs text-[#0A2536] font-medium mb-2">
                      {court.stateOrJurisdiction}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {court.benches.map((bench) => (
                        <span
                          key={bench}
                          className="text-[11px] font-mono bg-[#DAF6EF]/70 px-2.5 py-0.5 rounded-full text-[#0A2536]"
                        >
                          {bench}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#33566D] mb-1.5">
                      Official Court Portals
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <a
                        href={court.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded-xl border border-[#0A2536]/15 bg-[#F3FAFF] px-3 py-2 text-xs font-medium text-[#0A2536] hover:bg-[#DAF6EF] transition-colors"
                      >
                        <span>Official Court Website</span>
                        <ExternalLink className="h-3.5 w-3.5 text-[#33566D]" />
                      </a>
                      <a
                        href={court.causeListUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded-xl border border-[#0A2536]/15 bg-[#F3FAFF] px-3 py-2 text-xs font-medium text-[#0A2536] hover:bg-[#DAF6EF] transition-colors"
                      >
                        <span>Cause List &amp; Case Status</span>
                        <ExternalLink className="h-3.5 w-3.5 text-[#33566D]" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Status Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#0A2536]/12 bg-[#DAF6EF]/70 px-4 py-3">
            <div className="flex items-center gap-2.5 text-xs">
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 text-[#0A2536] animate-spin" />
                  <span className="text-[#0A2536] font-medium">
                    Fetching latest public RSS &amp; court statements for {court.shortName}...
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                  <span className="text-[#0A2536] font-medium">
                    {activeReport.sittingStatus}
                  </span>
                </>
              )}
            </div>

            {activeReport.fetchedAt && (
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#33566D]">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Updated{" "}
                  {new Date(activeReport.fetchedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("holdings")}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                  activeTab === "holdings"
                    ? "bg-[#0A2536] text-[#F3FAFF] font-semibold"
                    : "bg-white/80 text-[#33566D] hover:text-[#0A2536] border border-border"
                }`}
              >
                Latest Rulings ({holdings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("registry")}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                  activeTab === "registry"
                    ? "bg-[#0A2536] text-[#F3FAFF] font-semibold"
                    : "bg-white/80 text-[#33566D] hover:text-[#0A2536] border border-border"
                }`}
              >
                Registry &amp; Cause List
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("appearance")}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                  activeTab === "appearance"
                    ? "bg-[#0A2536] text-[#F3FAFF] font-semibold"
                    : "bg-white/80 text-[#33566D] hover:text-[#0A2536] border border-border"
                }`}
              >
                How We Appear Here &amp; Nearby Tax Offices ({nearbyTaxOffices.length || court.nearbyTaxOffices.length})
              </button>
            </div>

            {activeTab === "holdings" && (
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? "bg-[#33566D] text-[#F3FAFF] font-medium"
                        : "bg-white/70 text-[#33566D] hover:text-[#0A2536] border border-border"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tab Content: Holdings */}
          {activeTab === "holdings" && (
            <div className="space-y-4">
              {filteredHoldings.map((holding) => (
                <article
                  key={holding.id}
                  className="rounded-[24px] border border-border bg-white/90 p-6 hover:border-[#0A2536]/35 transition-colors shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#0A2536] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#F3FAFF] font-semibold">
                        {holding.category}
                      </span>
                      {holding.caseNameOrCitation && (
                        <span className="font-mono text-xs text-[#33566D] bg-[#DAF6EF]/60 px-2.5 py-0.5 rounded-full">
                          {holding.caseNameOrCitation}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{holding.date}</span>
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#0A2536] leading-snug">
                    {holding.title}
                  </h3>

                  {holding.bench && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#33566D] font-medium">
                      <Landmark className="h-3.5 w-3.5 text-[#0A2536]" />
                      <span>{holding.bench}</span>
                    </div>
                  )}

                  <p className="mt-3 text-sm text-[#0A2536]/85 leading-relaxed">
                    {holding.holdingSummary}
                  </p>

                  {holding.practicalTakeaway && (
                    <p className="mt-2 text-xs text-[#33566D] bg-[#DAF6EF]/40 rounded-xl px-3.5 py-2">
                      <strong className="text-[#0A2536]">Chambers Note:</strong>{" "}
                      {holding.practicalTakeaway}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                    <a
                      href={holding.sourceUrl || court.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#0A2536] hover:text-[#33566D] font-semibold"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Source Portal</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      onClick={() => onConsultForCourt(court.slug)}
                    >
                      Ask About a Similar Case →
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Tab Content: Registry & Cause List */}
          {activeTab === "registry" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[24px] border border-border bg-white/90 p-6 shadow-sm">
                <div className="font-mono text-xs uppercase tracking-widest text-[#33566D] mb-2">
                  FILING &amp; REGISTRY NOTES
                </div>
                <h3 className="font-display text-2xl font-bold text-[#0A2536] mb-3">
                  Filing &amp; Listing Procedure at {court.shortName}
                </h3>
                <p className="text-sm text-[#33566D] leading-relaxed">
                  {court.chambersPracticeNote}
                </p>

                <div className="mt-6 space-y-2.5 border-t border-border pt-4 text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Principal Registry Seat</span>
                    <span className="font-medium text-[#0A2536]">{court.city}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Active Circuit / Permanent Benches</span>
                    <span className="font-medium text-[#0A2536]">
                      {court.benches.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Territorial Jurisdiction</span>
                    <span className="font-medium text-[#0A2536]">{court.stateOrJurisdiction}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-border bg-white/90 p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#33566D] mb-2">
                    DIRECT OFFICIAL PORTALS
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#0A2536] mb-3">
                    Cause Lists, Orders &amp; Judgments
                  </h3>
                  <p className="text-sm text-[#33566D] leading-relaxed mb-6">
                    Access daily cause lists, certified order copies, and case status trackers
                    directly from the official {court.shortName} portal.
                  </p>
                </div>

                <div className="space-y-3">
                  <a
                    href={court.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border bg-[#F3FAFF] p-3.5 text-sm font-medium text-[#0A2536] hover:border-[#0A2536] transition-colors"
                  >
                    <span>Official Portal ({court.shortName})</span>
                    <ExternalLink className="h-4 w-4 text-[#33566D]" />
                  </a>
                  <a
                    href={court.causeListUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border bg-[#F3FAFF] p-3.5 text-sm font-medium text-[#0A2536] hover:border-[#0A2536] transition-colors"
                  >
                    <span>Daily Cause List &amp; Case Status</span>
                    <ExternalLink className="h-4 w-4 text-[#33566D]" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: How We Appear Here & Nearby Tax Offices */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="rounded-[24px] border border-border bg-white/90 p-6 sm:p-8 shadow-sm">
                <div className="max-w-3xl space-y-4">
                  <div className="font-mono text-xs uppercase tracking-widest text-[#33566D]">
                    SJ ASSOCIATES · APPEARANCES &amp; LOCAL COUNSEL
                  </div>
                  <h3 className="font-display text-3xl font-bold text-[#0A2536]">
                    Representation Before {court.name} &amp; Nearby Tax Offices
                  </h3>
                  <p className="text-sm text-[#33566D] leading-relaxed">
                    {court.chambersPracticeNote}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="rounded-full"
                      onClick={() => onConsultForCourt(court.slug)}
                    >
                      <Scale className="h-4 w-4" />
                      Discuss a Matter at {court.shortName}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyTaxOffices.map((office) => (
                  <div
                    key={office.slug}
                    className="rounded-[22px] border border-border bg-white/90 p-5 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="rounded-full bg-[#DAF6EF] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#0A2536] font-semibold">
                          {office.city}
                        </span>
                        <Building2 className="h-4 w-4 text-[#33566D]" />
                      </div>
                      <h4 className="font-display text-xl font-bold text-[#0A2536]">
                        {office.name}
                      </h4>
                      <p className="mt-1 text-xs text-[#33566D] leading-relaxed">
                        {office.addressNote}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border">
                      <button
                        type="button"
                        onClick={() => onConsultForCourt(office.slug)}
                        className="text-xs font-mono uppercase tracking-wider font-semibold text-[#0A2536] hover:text-[#33566D] cursor-pointer"
                      >
                        Consult for This Tax Office →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
