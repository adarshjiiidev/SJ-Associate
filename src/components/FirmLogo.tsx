import { cn } from "@/src/lib/utils";

export const FIRM_LOGO_SRC = "/assets/aistudio/IMG-20261120-WA0005_7e8ebefe.jpg";

interface FirmLogoProps {
  size?: number;
  className?: string;
  showFrame?: boolean;
  variant?: "default" | "dark" | "light";
}

/**
 * S J Associates official uploaded emblem (SJA · Justice • Advise • Solution).
 * Maintains natural horizontal aspect ratio (~1.48:1) on a clean crisp white plaque
 * so the golden scales and SJA lettering stay razor-sharp on both light and dark surfaces.
 */
export function FirmLogo({
  size = 68,
  className,
  showFrame = true,
  variant = "default",
}: FirmLogoProps) {
  const isLightSurface = variant === "light";
  const width = Math.round(size * 1.48);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0 select-none overflow-hidden rounded-md bg-white",
        showFrame &&
          (isLightSurface
            ? "border border-white/30 shadow-sm"
            : "border border-[#0A2536]/18 shadow-xs"),
        className
      )}
      style={{
        width,
        height: size,
      }}
    >
      <img
        src={FIRM_LOGO_SRC}
        alt="SJA — S J Associates | Justice • Advise • Solution"
        className="h-full w-full object-contain scale-[1.09] contrast-[1.08] saturate-[1.08]"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

