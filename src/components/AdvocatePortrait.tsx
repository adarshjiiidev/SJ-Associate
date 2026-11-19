import { useState } from "react";
import { Scale } from "lucide-react";
import { ADVOCATE_PORTRAIT_IMAGE } from "@/src/data/assets";
import { PRINCIPAL_ADVOCATE } from "@/src/data/firmData";
import { FirmLogo } from "@/src/components/FirmLogo";
import { cn } from "@/src/lib/utils";

interface AdvocatePortraitProps {
  className?: string;
  showPlaque?: boolean;
}

/**
 * Displays Advocate Sanjay Kumar Singh's portrait directly from the uploaded chambers image,
 * cleanly framed to isolate the courtroom-gown portrait without left-side festival graphics.
 */
export function AdvocatePortrait({ className, showPlaque = true }: AdvocatePortraitProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[24px] border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0A2536]">
        {failed ? (
          <div
            role="img"
            aria-label={`${PRINCIPAL_ADVOCATE.name} — ${PRINCIPAL_ADVOCATE.title}`}
            className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#DAF6EF] p-6 text-center text-[#0A2536]"
          >
            <Scale className="h-9 w-9 text-[#33566D]" aria-hidden="true" />
            <span className="text-2xl font-bold text-[#0A2536]">
              {PRINCIPAL_ADVOCATE.name}
            </span>
            <span className="text-xs text-[#33566D]">{PRINCIPAL_ADVOCATE.title}</span>
          </div>
        ) : (
          <img
            src={ADVOCATE_PORTRAIT_IMAGE}
            alt={`Portrait of ${PRINCIPAL_ADVOCATE.name}, ${PRINCIPAL_ADVOCATE.title}, ${PRINCIPAL_ADVOCATE.firm}`}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover object-top"
          />
        )}
      </div>

      {showPlaque && (
        <figcaption className="border-t border-border bg-white px-6 py-4 space-y-1">
          <p className="text-xl font-extrabold text-[#0A2536] leading-snug">
            {PRINCIPAL_ADVOCATE.name}
          </p>
          <p className="text-xs text-[#33566D] leading-relaxed">
            <span>{PRINCIPAL_ADVOCATE.title}</span>
            <span aria-hidden="true"> · </span>
            <span>{PRINCIPAL_ADVOCATE.membership}</span>
          </p>
          <div className="pt-1.5 flex items-center gap-2">
            <FirmLogo size={20} />
            <span className="inline-flex items-center rounded-full bg-[#DAF6EF] px-2.5 py-0.5 text-[11px] font-bold tracking-[0.1em] uppercase text-[#0A2536] whitespace-nowrap">
              {PRINCIPAL_ADVOCATE.firm}
            </span>
          </div>
        </figcaption>
      )}
    </figure>
  );
}
