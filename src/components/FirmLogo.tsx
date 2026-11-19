import { cn } from "@/src/lib/utils";

interface FirmLogoProps {
  size?: number;
  className?: string;
  showFrame?: boolean;
}

const ADVOCATE_EMBLEM_SRC = "/assets/aistudio/Advocate_symbol___logo___image_54ab88f2.jpeg";

/**
 * SJ Associates official Advocate emblem lockup using the uploaded monochrome
 * Advocate band seal image, framed cleanly for light and dark UI surfaces.
 */
export function FirmLogo({ size = 36, className, showFrame = true }: FirmLogoProps) {
  const framePadding = showFrame ? 4 : 0;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0 select-none overflow-hidden",
        showFrame &&
          "rounded-xl border border-[#0A2536]/15 bg-white shadow-2xs p-0.5",
        className
      )}
      style={{
        width: size + framePadding,
        height: size + framePadding
      }}
    >
      <img
        src={ADVOCATE_EMBLEM_SRC}
        alt="Advocate emblem — SJ Associates"
        width={size}
        height={size}
        className="h-full w-full object-contain rounded-lg bg-white"
      />
    </span>
  );
}
