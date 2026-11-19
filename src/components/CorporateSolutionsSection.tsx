import React, { useState } from "react";
import {
  FileCheck2,
  Scale,
  Receipt,
  Calculator,
  BookOpen,
  Award,
  BadgeCheck,
  Briefcase,
  Gavel,
  Globe,
  ShieldAlert,
  Landmark,
  Users,
  Plus,
  Check,
  ArrowRight,
} from "lucide-react";
import {
  CORPORATE_SOLUTIONS,
  PRACTICE_SECTION_SUMMARY,
  type SolutionCategory,
  type CorporateSolutionItem,
} from "../data/firmData";
import { FirmLogo } from "./FirmLogo";

interface CorporateSolutionsSectionProps {
  onSelectSolution?: (solution: CorporateSolutionItem) => void;
  onRequestSelected?: (briefNote: string) => void;
  compact?: boolean;
}

const CATEGORIES: Array<"All" | SolutionCategory> = [
  "All",
  "GST & Tax",
  "Income Tax",
  "Others",
];

function getSolutionIcon(id: string) {
  switch (id) {
    case "gst-registration":
      return <FileCheck2 className="h-5 w-5" />;
    case "gst-return-filing":
      return <Receipt className="h-5 w-5" />;
    case "scn-reply":
      return <ShieldAlert className="h-5 w-5" />;
    case "gstat-appeal":
      return <Gavel className="h-5 w-5" />;
    case "commissioner-appeal":
      return <Scale className="h-5 w-5" />;
    case "high-court-appeal":
      return <Landmark className="h-5 w-5" />;
    case "itr-return-filing":
    case "tds-return-filing":
      return <Calculator className="h-5 w-5" />;
    case "income-tax-consultancy":
    case "other-income-tax-matters":
      return <Briefcase className="h-5 w-5" />;
    case "accounting-bookkeeping":
      return <BookOpen className="h-5 w-5" />;
    case "dgft-work":
      return <Globe className="h-5 w-5" />;
    case "msme-registration":
      return <BadgeCheck className="h-5 w-5" />;
    case "trademark-registration":
      return <Award className="h-5 w-5" />;
    case "partnership-registration":
      return <Users className="h-5 w-5" />;
    default:
      return <Scale className="h-5 w-5" />;
  }
}

export const CorporateSolutionsSection: React.FC<CorporateSolutionsSectionProps> = ({
  onSelectSolution,
  onRequestSelected,
  compact = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<"All" | SolutionCategory>("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "gst-return-filing",
    "gstat-appeal",
  ]);

  const filteredSolutions =
    activeCategory === "All"
      ? CORPORATE_SOLUTIONS
      : CORPORATE_SOLUTIONS.filter((item) => item.category === activeCategory);

  const selectedItems = CORPORATE_SOLUTIONS.filter((item) =>
    selectedIds.includes(item.id)
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRequestSelected = () => {
    const summaryText = `Selected GST, Income Tax & Registration Services: ${selectedItems
      .map((s) => `${s.title} (${s.category})`)
      .join(", ")}.`;
    if (onRequestSelected) {
      onRequestSelected(summaryText);
    } else if (onSelectSolution && selectedItems[0]) {
      onSelectSolution({
        ...selectedItems[0],
        title: selectedItems.map((s) => s.title).join(", "),
      });
    }
  };

  return (
    <section
      aria-label="GST, Income Tax and Registration Solutions Catalogue"
      className={`bg-white border-t border-border ${
        compact ? "py-12 sm:py-16" : "py-16 sm:py-20"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 space-y-8">
        {/* Header & Category Filter Pills (Exact Original Layout) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <FirmLogo size={22} />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#33566D]">
                3 PRACTICE SECTIONS · GST, INCOME TAX &amp; REGISTRATIONS
              </p>
            </div>
            <h2
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A2536] leading-[0.98]"
              style={{ textWrap: "balance" }}
            >
              GST &amp; Tax, Income Tax &amp; Registration Catalogue
            </h2>
            <p className="text-sm sm:text-base text-[#33566D] leading-relaxed">
              Select any service across our 3 sections (<strong className="text-[#0A2536]">GST &amp; Tax</strong>, <strong className="text-[#0A2536]">Income Tax</strong>, or <strong className="text-[#0A2536]">Others</strong>) with <strong className="text-[#0A2536]">+</strong> to build a single chambers brief for Adv. Sanjay Kumar Singh&apos;s team.
            </p>
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter solutions by practice section"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-[40px] rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0A2536] text-[#F3FAFF] shadow-xs"
                      : "border border-border bg-[#F3FAFF] text-[#33566D] hover:bg-[#DAF6EF]/55 hover:text-[#0A2536]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean 3-Section Work Distribution Graph Bar in Original Mint/Cape-Cod Palette */}
        <div className="rounded-[24px] border border-border bg-[#F3FAFF] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0A2536]">
              Chambers Work Distribution Across 3 Sections (15 Services)
            </p>
            <p className="text-xs text-[#33566D] tabular-nums">
              Click any section bar to filter catalogue
            </p>
          </div>

          <div className="h-3.5 w-full rounded-full bg-white border border-border overflow-hidden flex">
            <button
              type="button"
              onClick={() =>
                setActiveCategory(
                  activeCategory === "GST & Tax" ? "All" : "GST & Tax"
                )
              }
              style={{ width: "40%" }}
              title="1. GST & Tax (6 Services · 40%)"
              className={`h-full transition-opacity cursor-pointer ${
                activeCategory === "All" || activeCategory === "GST & Tax"
                  ? "bg-[#0A2536]"
                  : "bg-[#0A2536]/30"
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setActiveCategory(
                  activeCategory === "Income Tax" ? "All" : "Income Tax"
                )
              }
              style={{ width: "27%" }}
              title="2. Income Tax (4 Services · 27%)"
              className={`h-full border-l border-white transition-opacity cursor-pointer ${
                activeCategory === "All" || activeCategory === "Income Tax"
                  ? "bg-[#33566D]"
                  : "bg-[#33566D]/30"
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setActiveCategory(
                  activeCategory === "Others" ? "All" : "Others"
                )
              }
              style={{ width: "33%" }}
              title="3. Others (5 Services · 33%)"
              className={`h-full border-l border-white transition-opacity cursor-pointer ${
                activeCategory === "All" || activeCategory === "Others"
                  ? "bg-[#15803D]"
                  : "bg-[#15803D]/30"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {PRACTICE_SECTION_SUMMARY.map((sec) => {
              const isSelected = activeCategory === sec.category;
              return (
                <button
                  key={sec.category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(isSelected ? "All" : sec.category)
                  }
                  className={`text-left rounded-2xl border p-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#0A2536] bg-[#DAF6EF]/60"
                      : "border-border bg-white hover:bg-[#DAF6EF]/25"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#0A2536]">
                    <span>{sec.code}</span>
                    <span className="rounded-full bg-[#DAF6EF] px-2.5 py-0.5 text-[11px] text-[#0A2536] tabular-nums">
                      {sec.serviceCount} Services · {sec.weightPercent}%
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#33566D] leading-relaxed">
                    {sec.items.join(" · ")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Solutions Briefing Bar (Exact Original Layout) */}
        {selectedItems.length > 0 && (
          <div className="rounded-2xl bg-[#0A2536] text-[#F3FAFF] px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#DAF6EF]">
                {selectedItems.length} SOLUTION{selectedItems.length > 1 ? "S" : ""} SELECTED FOR BRIEFING
              </p>
              <p className="text-xs sm:text-sm text-[#F3FAFF]/90">
                {selectedItems.map((item) => item.title).join(" · ")}
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="min-h-[38px] rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold text-[#F3FAFF] hover:bg-white/10 transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleRequestSelected}
                className="min-h-[38px] rounded-full bg-[#DAF6EF] px-5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#0A2536] hover:bg-white transition-colors cursor-pointer"
              >
                REQUEST SELECTED
              </button>
            </div>
          </div>
        )}

        {/* Solutions Grid (Exact Original Rounded Card Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((solution) => {
            const isSelected = selectedIds.includes(solution.id);
            return (
              <article
                key={solution.id}
                className={`rounded-[24px] border p-6 flex flex-col justify-between gap-5 transition-all ${
                  isSelected
                    ? "border-[#0A2536] bg-[#DAF6EF]/40 shadow-xs"
                    : "border-border bg-white hover:border-[#33566D]/50 hover:bg-[#F3FAFF]/60"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {solution.featured ? (
                        <FirmLogo size={38} />
                      ) : (
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-[#0A2536]">
                          {getSolutionIcon(solution.id)}
                        </span>
                      )}
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#33566D]">
                          {solution.authorityTag}
                        </p>
                        <h3 className="text-xl font-extrabold text-[#0A2536] leading-snug">
                          {solution.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label={
                        isSelected
                          ? `Remove ${solution.title} from brief`
                          : `Add ${solution.title} to brief`
                      }
                      onClick={() => toggleSelect(solution.id)}
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                        isSelected
                          ? "border-[#0A2536] bg-[#0A2536] text-[#F3FAFF]"
                          : "border-border bg-white text-[#0A2536] hover:bg-[#DAF6EF]"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-[#33566D] leading-relaxed">
                    {solution.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-[11px] font-semibold text-[#0A2536]">
                    {solution.turnaroundTag}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onSelectSolution && onSelectSolution(solution)
                    }
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#0A2536] hover:text-[#33566D] cursor-pointer"
                  >
                    <span>ENQUIRE NOW</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
