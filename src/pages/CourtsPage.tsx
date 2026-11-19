import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { COURT_IMAGES } from "@/src/data/assets";
import { COURTS_REGISTRY, filterCourts, type CourtTier } from "@/src/data/courtsRegistry";
import { ResilientImage } from "@/src/components/ResilientImage";
import { Button } from "@/src/components/ui/button";
import { Input, Select } from "@/src/components/ui/fields";

const REGIONS = ["All", "National", "North", "West", "South", "East"] as const;

export function CourtsPage() {
  const [tier, setTier] = useState<"all" | CourtTier>("all");
  const [region, setRegion] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filteredCourts = useMemo(
    () => filterCourts(COURTS_REGISTRY, { tier, region, query }),
    [tier, region, query]
  );

  const supremeCount = COURTS_REGISTRY.filter((c) => c.tier === "supreme").length;
  const tribunalCount = COURTS_REGISTRY.filter((c) => c.tier === "tribunal").length;
  const highCount = COURTS_REGISTRY.filter((c) => c.tier === "high").length;

  return (
    <div>
      {/* Editorial Header */}
      <section className="bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/45 border-b border-border py-12 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-6 space-y-4">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-primary">
              Courts &amp; Live Updates
            </p>
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight"
              style={{ textWrap: "balance" }}
            >
              Supreme Court, GSTAT &amp; High Courts of India
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Click any court or tribunal below to read its latest orders, judgments, cause list notes, and official registry links in real time.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-6 py-12 space-y-10">
        {/* Filter & Search Toolbar */}
        <div className="border border-border bg-card p-4 sm:p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            className="flex items-center gap-1 p-1 bg-[#E6F2F7] rounded-full overflow-x-auto no-scrollbar"
            role="group"
            aria-label="Filter by court tier"
          >
            <button
              type="button"
              onClick={() => setTier("all")}
              className={`px-4 py-2 min-h-[40px] text-xs font-semibold rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                tier === "all"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Courts ({COURTS_REGISTRY.length})
            </button>
            <button
              type="button"
              onClick={() => setTier("supreme")}
              className={`px-4 py-2 min-h-[40px] text-xs font-semibold rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                tier === "supreme"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Supreme Court ({supremeCount})
            </button>
            <button
              type="button"
              onClick={() => setTier("tribunal")}
              className={`px-4 py-2 min-h-[40px] text-xs font-semibold rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                tier === "tribunal"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              GSTAT &amp; Tribunals ({tribunalCount})
            </button>
            <button
              type="button"
              onClick={() => setTier("high")}
              className={`px-4 py-2 min-h-[40px] text-xs font-semibold rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                tier === "high"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              High Courts ({highCount})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:min-w-[460px]">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                aria-label="Search courts by name, city, or jurisdiction"
                placeholder="Search court or city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>
            <Select
              aria-label="Filter by region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="sm:w-40 rounded-full"
            >
              {REGIONS.map((reg) => (
                <option key={reg} value={reg}>
                  {reg === "All" ? "All Regions" : `${reg} Region`}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="tabular-nums">
            Showing {filteredCourts.length} of {COURTS_REGISTRY.length} constitutional courts &amp; tribunals · Supreme Court on top, ordered by distance from New Delhi
          </span>
          {(tier !== "all" || region !== "All" || query.trim() !== "") && (
            <button
              type="button"
              onClick={() => {
                setTier("all");
                setRegion("All");
                setQuery("");
              }}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Courts Image Grid */}
        {filteredCourts.length === 0 ? (
          <div className="border border-border bg-card p-12 rounded-2xl text-center space-y-4">
            <p className="text-2xl font-bold text-foreground">No matching courts found</p>
            <p className="text-sm text-muted-foreground">
              Try clearing your search or region filter to view all courts.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTier("all");
                setRegion("All");
                setQuery("");
              }}
            >
              Show All Courts
            </Button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
            data-testid="courts-grid"
          >
            {filteredCourts.map((court) => {
              const isSupremeFeatured = court.tier === "supreme" && filteredCourts.length > 1;
              return (
                <Link
                  key={court.slug}
                  to={`/courts/${court.slug}`}
                  className={`group border border-border bg-card rounded-2xl overflow-hidden hover:bg-[#DAF6EF]/35 hover:border-[#33566D]/50 transition-all ${
                    isSupremeFeatured
                      ? "md:col-span-2 lg:col-span-3 grid grid-cols-1 lg:grid-cols-12"
                      : "flex flex-col"
                  }`}
                >
                  <div
                    className={`overflow-hidden bg-secondary ${
                      isSupremeFeatured
                        ? "lg:col-span-5 aspect-[4/3] lg:aspect-auto lg:min-h-[300px]"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <ResilientImage
                      src={COURT_IMAGES[court.slug]}
                      alt={`${court.name} building exterior in ${court.city}`}
                      fallbackLabel={court.name}
                      imgClassName="transition-transform duration-300 group-hover:scale-[1.03] lg:h-full"
                    />
                  </div>

                  <div
                    className={`flex flex-1 flex-col justify-between p-6 space-y-4 ${
                      isSupremeFeatured ? "lg:col-span-7 lg:p-8" : ""
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground tabular-nums">
                        <span className="font-semibold text-primary">
                          {court.tier === "supreme"
                            ? "Apex Court"
                            : court.tier === "tribunal"
                            ? "Appellate Tribunal"
                            : "High Court"}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{court.city}</span>
                        {court.tier === "high" && court.distanceFromDelhiKm > 10 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{court.distanceFromDelhiKm} km from Delhi</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>Est. {court.establishedYear}</span>
                      </div>
                      <h2
                        className={`font-bold text-foreground group-hover:text-primary transition-colors ${
                          isSupremeFeatured ? "text-3xl sm:text-4xl" : "text-2xl"
                        }`}
                      >
                        {court.name}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {court.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
                      <span className="text-xs text-muted-foreground truncate">
                        {court.stateOrJurisdiction}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary whitespace-nowrap shrink-0">
                        Open Live Report
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
