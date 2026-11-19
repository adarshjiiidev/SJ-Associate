import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  BookOpen,
  FileText,
  Landmark
} from "lucide-react";
import { COURT_IMAGES } from "@/src/data/assets";
import {
  getCourtBySlug,
  type BulletinCategory,
  type LiveCourtReport
} from "@/src/data/courtsRegistry";
import { ResilientImage } from "@/src/components/ResilientImage";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { parseJsonSafely } from "@/src/utils/http";

interface CourtDetailPageProps {
  onConsultForCourt: (courtSlug: string) => void;
}

const CATEGORIES: Array<"All" | BulletinCategory> = [
  "All",
  "Tax & Corporate",
  "Commercial & Arbitration",
  "Constitutional",
  "Civil & Property",
  "Criminal"
];

export function CourtDetailPage({ onConsultForCourt }: CourtDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const court = getCourtBySlug(slug);

  const [report, setReport] = useState<LiveCourtReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"All" | BulletinCategory>("All");

  const fetchReport = useCallback(
    async (refresh = false) => {
      if (!court) return;
      setLoading(true);
      setError(null);

      try {
        const url = refresh
          ? `/api/courts/${court.slug}/live?refresh=1`
          : `/api/courts/${court.slug}/live`;
        const response = await fetch(url);
        const data = await parseJsonSafely<LiveCourtReport & { error?: string }>(response);
        if (!response.ok || !data) {
          throw new Error(data?.error || `Unable to retrieve live report for ${court.name}.`);
        }
        setReport(data as LiveCourtReport);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Live judicial report fetch failed. Please retry."
        );
      } finally {
        setLoading(false);
      }
    },
    [court]
  );

  useEffect(() => {
    setCategoryFilter("All");
    setReport(null);
    void fetchReport(false);
  }, [fetchReport]);

  const filteredRulings = useMemo(() => {
    if (!report) return [];
    if (categoryFilter === "All") return report.rulings;
    return report.rulings.filter((r) => r.category === categoryFilter);
  }, [report, categoryFilter]);

  if (!court) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-20 text-center space-y-5">
        <h1 className="font-serif text-4xl font-semibold text-foreground">Court Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The requested court dossier does not exist in our registry.
        </p>
        <Button asChild>
          <Link to="/courts">Return to All Courts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 space-y-10">
      {/* Breadcrumb + Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/courts"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to All Courts
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fetchReport(true)}
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh Live Report
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onConsultForCourt(court.slug)}
          >
            Consult on {court.shortName} Matter
          </Button>
        </div>
      </div>

      {/* Court Header Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 border border-border bg-white rounded-2xl overflow-hidden shadow-xs">
        <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto lg:min-h-[320px] bg-secondary">
          <ResilientImage
            src={COURT_IMAGES[court.slug]}
            alt={`${court.name} architectural view`}
            fallbackLabel={court.name}
            imgClassName="lg:h-full"
          />
        </div>

        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground tabular-nums">
              <span className="font-semibold text-primary">
                {court.tier === "supreme"
                  ? "Supreme Court"
                  : court.tier === "tribunal"
                  ? "Appellate Tribunal"
                  : "High Court"}
              </span>
              <span aria-hidden="true">·</span>
              <span>{court.city}</span>
              <span aria-hidden="true">·</span>
              <span>Established {court.establishedYear}</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight"
              style={{ textWrap: "balance" }}
            >
              {court.name}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {report?.overviewSummary || court.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border text-xs">
            <div className="space-y-1">
              <p className="text-muted-foreground">Jurisdiction &amp; Benches</p>
              <p className="font-semibold text-foreground">{court.stateOrJurisdiction}</p>
              <p className="text-muted-foreground">{court.benches.join(" · ")}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Official Court Portals</p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={court.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  Official Website
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
                <a
                  href={court.causeListUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  Daily Cause List
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Status Bar */}
      {report && !loading && (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-[#DAF6EF]/60 px-4 sm:px-5 py-3 rounded-2xl sm:rounded-full text-xs text-[#33566D]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
              {report.sittingStatus}
            </span>
            <span aria-hidden="true">·</span>
            <span>{report.chiefJusticeNote}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#0A2536] tabular-nums">
              {report.rulings.length} Live Dispatches
            </span>
          </div>
          <span className="font-mono tabular-nums">
            Updated: {new Date(report.fetchedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </span>
        </div>
      )}

      {/* Loading / Error / Report Tabs */}
      {loading ? (
        <div className="space-y-4" aria-busy="true" aria-label={`Fetching live report for ${court.name}`}>
          <div className="border border-border bg-card p-6 rounded-2xl space-y-3 animate-pulse">
            <div className="h-4 w-52 bg-secondary rounded-sm" />
            <div className="h-6 w-2/3 bg-secondary rounded-sm" />
            <div className="h-4 w-full bg-muted rounded-sm" />
            <div className="h-4 w-5/6 bg-muted rounded-sm" />
          </div>
          <div className="border border-border bg-card p-6 rounded-2xl space-y-3 animate-pulse">
            <div className="h-4 w-44 bg-secondary rounded-sm" />
            <div className="h-6 w-3/4 bg-secondary rounded-sm" />
            <div className="h-4 w-full bg-muted rounded-sm" />
          </div>
        </div>
      ) : error ? (
        <Card className="border-destructive/40">
          <CardContent className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">
                  Could Not Fetch Live Court Updates
                </h2>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
            <Button type="button" onClick={() => fetchReport(true)}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="rulings" className="w-full">
          <div className="overflow-x-auto no-scrollbar pb-1">
            <TabsList className="w-max min-w-full sm:w-auto">
              <TabsTrigger value="rulings">
                <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                Latest Rulings ({report?.rulings.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="notices">
                <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                Registry &amp; Cause List ({report?.registryNotices.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="chambers">
                <Landmark className="h-4 w-4 mr-2" aria-hidden="true" />
                How We Appear Here
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Rulings Digest */}
          <TabsContent value="rulings" className="space-y-6">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="Filter rulings by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 min-h-[40px] text-xs font-semibold rounded-full border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredRulings.length === 0 ? (
              <div className="border border-border bg-card p-10 rounded-2xl text-center space-y-3">
                <p className="text-xl font-bold text-foreground">
                  No updates under &ldquo;{categoryFilter}&rdquo; right now
                </p>
                <Button type="button" variant="outline" size="sm" onClick={() => setCategoryFilter("All")}>
                  Show All Categories
                </Button>
              </div>
            ) : (
              <div className="space-y-5" data-testid="court-rulings-list">
                {filteredRulings.map((ruling) => (
                  <Card key={ruling.id}>
                    <CardHeader className="space-y-2 pb-4">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">{ruling.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{ruling.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ruling.bench}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-foreground">{ruling.caseNameOrCitation}</span>
                      </div>
                      <CardTitle className="text-xl sm:text-2xl leading-snug">
                        {ruling.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                        {ruling.holdingSummary}
                      </p>

                      <div className="border-t border-border pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        <div className="lg:col-span-8 space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Why It Matters
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {ruling.practicalTakeaway}
                          </p>
                        </div>

                        <div className="lg:col-span-4 space-y-2 lg:text-right">
                          {ruling.statutes.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {ruling.statutes.join(" · ")}
                            </p>
                          )}
                          {ruling.sourceUrl && (
                            <a
                              href={ruling.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                              Read Source Article
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Registry & Cause List Notices */}
          <TabsContent value="notices" className="space-y-4">
            {report && report.registryNotices.length > 0 ? (
              <div className="border border-border bg-card rounded-2xl divide-y divide-border">
                {report.registryNotices.map((notice) => (
                  <div key={notice.id} className="p-6 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">{notice.type}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{notice.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{notice.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{notice.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-border bg-card p-8 rounded-2xl text-sm text-muted-foreground">
                No recent circulars were returned right now. Check the official{" "}
                <a
                  href={court.causeListUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Cause List Portal
                </a>{" "}
                directly.
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Jurisdiction & Chambers Filing Desk */}
          <TabsContent value="chambers">
            <Card>
              <CardHeader>
                <CardTitle>SJ Associates Matters in {court.shortName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {court.chambersPracticeNote}
                </p>
                <Separator />
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Jurisdiction Covered</dt>
                    <dd className="font-semibold text-foreground mt-1">{court.stateOrJurisdiction}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Active Benches</dt>
                    <dd className="font-semibold text-foreground mt-1">{court.benches.join(", ")}</dd>
                  </div>
                </dl>
                <div className="pt-2">
                  <Button type="button" onClick={() => onConsultForCourt(court.slug)}>
                    Discuss a Matter Here
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Grounded Sources Directory */}
      {report && report.sources.length > 0 && (
        <section className="border border-border bg-card p-6 rounded-2xl space-y-3">
          <h2 className="text-xl font-bold text-foreground">Sources &amp; Case Links</h2>
          <p className="text-xs text-muted-foreground">
            Public legal news and court updates retrieved for {court.name}.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {report.sources.map((src) => (
              <li key={src.uri} className="text-xs">
                <a
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline break-all"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>{src.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
