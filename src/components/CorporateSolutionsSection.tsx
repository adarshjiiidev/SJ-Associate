import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  Briefcase,
  Building2,
  Calculator,
  Check,
  FileCheck2,
  FileSpreadsheet,
  Gavel,
  Globe2,
  Landmark,
  Plus,
  ReceiptText,
  Scale,
  Stamp
} from "lucide-react";
import {
  CORPORATE_SOLUTIONS,
  type CorporateSolutionItem,
  type SolutionCategory
} from "@/src/data/firmData";
import { FirmLogo } from "@/src/components/FirmLogo";
import { Button } from "@/src/components/ui/button";

interface CorporateSolutionsSectionProps {
  onConsultSolutions: (selectedTitles: string[]) => void;
  compactHeader?: boolean;
}

const CATEGORIES: Array<"All" | SolutionCategory> = [
  "All",
  "Taxation & GST",
  "Registrations & Trade",
  "Corporate & IP"
];

function getSolutionIcon(id: string) {
  switch (id) {
    case "iec-dgft":
      return Globe2;
    case "gst-return-filing":
      return ReceiptText;
    case "gstat-tribunal-appeal":
      return Gavel;
    case "income-tax-consultant":
      return Calculator;
    case "trademark-registration":
      return Stamp;
    case "tds-return-filing":
      return FileSpreadsheet;
    case "accounting-bookkeeping":
      return BookOpenCheck;
    case "gst-registration":
      return FileCheck2;
    case "msme-registration":
      return Briefcase;
    case "partnership-registration":
      return Landmark;
    case "company-incorporation":
      return Building2;
    default:
      return Scale;
  }
}

export function CorporateSolutionsSection({
  onConsultSolutions,
  compactHeader = false
}: CorporateSolutionsSectionProps) {
  const [category, setCategory] = useState<"All" | SolutionCategory>("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const visibleSolutions = useMemo(() => {
    if (category === "All") return CORPORATE_SOLUTIONS;
    return CORPORATE_SOLUTIONS.filter((item) => item.category === category);
  }, [category]);

  const selectedItems = useMemo(
    () => CORPORATE_SOLUTIONS.filter((item) => selectedIds.includes(item.id)),
    [selectedIds]
  );

  function toggleSelect(item: CorporateSolutionItem) {
    setSelectedIds((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  }

  return (
    <section className="relative bg-white py-16 sm:py-22 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 space-y-8 sm:space-y-10">
        {!compactHeader ? (
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2.5">
                <FirmLogo size={22} showFrame={false} />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#33566D]">
                  Taxation &amp; Corporate Solutions
                </p>
              </div>
              <h2
                className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A2536] leading-[0.98]"
                style={{ textWrap: "balance" }}
              >
                Corporate Filings, Tax &amp; Compliance Catalogue
              </h2>
              <p className="text-sm sm:text-base text-[#33566D] leading-relaxed">
                Select any taxation, registration, or corporate service with{" "}
                <strong className="text-[#0A2536]">+</strong> to build a single chambers brief for Advocate Sanjay Kumar Singh&apos;s team.
              </p>
            </div>

            <div
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0"
              role="tablist"
              aria-label="Filter corporate and tax solutions"
            >
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(cat)}
                    className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? "bg-[#0A2536] text-[#F3FAFF]"
                        : "bg-[#F3FAFF] text-[#33566D] border border-border hover:bg-[#DAF6EF]/70"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#33566D]">
                Corporate &amp; Tax Solutions Catalogue
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2536]">
                Filings, Registrations &amp; Tax Advisory
              </h2>
            </div>

            <div
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0"
              role="tablist"
              aria-label="Filter corporate and tax solutions"
            >
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(cat)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? "bg-[#0A2536] text-[#F3FAFF]"
                        : "bg-[#F3FAFF] text-[#33566D] border border-border hover:bg-[#DAF6EF]/70"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Inquiry Bar (Catalogue Cart equivalent) */}
        {selectedItems.length > 0 && (
          <div className="rounded-2xl border border-[#0A2536]/20 bg-[#0A2536] text-[#F3FAFF] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-[#DAF6EF]">
                {selectedItems.length} Solution{selectedItems.length > 1 ? "s" : ""} Selected for Briefing
              </p>
              <p className="text-xs sm:text-sm text-[#F3FAFF]/85 truncate">
                {selectedItems.map((i) => i.title).join(" · ")}
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="min-h-[40px] px-3.5 rounded-full border border-white/25 text-xs font-semibold text-[#F3FAFF]/85 hover:bg-white/10 cursor-pointer"
              >
                Clear
              </button>
              <Button
                type="button"
                onClick={() => onConsultSolutions(selectedItems.map((i) => i.title))}
                className="min-h-[40px] rounded-full bg-[#DAF6EF] text-[#0A2536] hover:bg-white px-5 text-xs font-bold uppercase tracking-wider"
              >
                Request Selected
              </Button>
            </div>
          </div>
        )}

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {visibleSolutions.map((item) => {
            const Icon = getSolutionIcon(item.id);
            const isSelected = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`group rounded-[22px] border p-5 flex flex-col justify-between gap-4 transition-all ${
                  isSelected
                    ? "border-[#0A2536] bg-[#DAF6EF]/55 shadow-xs"
                    : "border-border bg-[#F3FAFF]/60 hover:bg-[#DAF6EF]/35 hover:border-[#33566D]/45"
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.isFeaturedBrand ? (
                        <FirmLogo size={34} />
                      ) : (
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-[#0A2536] shadow-2xs">
                          <Icon className="h-5 w-5 text-[#33566D]" aria-hidden="true" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#33566D] truncate">
                          {item.authority}
                        </p>
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#0A2536] leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label={
                        isSelected
                          ? `Remove ${item.title} from brief`
                          : `Add ${item.title} to brief`
                      }
                      aria-pressed={isSelected}
                      onClick={() => toggleSelect(item)}
                      className={`h-10 w-10 shrink-0 rounded-full border inline-flex items-center justify-center transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#0A2536] border-[#0A2536] text-[#DAF6EF]"
                          : "bg-white border-border text-[#0A2536] hover:bg-[#0A2536] hover:text-[#F3FAFF]"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#33566D] leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-2 text-[11px]">
                  <span className="rounded-full bg-white border border-border px-2.5 py-0.5 font-semibold text-[#0A2536]">
                    {item.turnaround}
                  </span>
                  <button
                    type="button"
                    onClick={() => onConsultSolutions([item.title])}
                    className="font-bold uppercase tracking-wider text-[#0A2536] hover:text-[#33566D] cursor-pointer"
                  >
                    Enquire Now →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
