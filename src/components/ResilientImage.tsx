import { useState } from "react";
import { Landmark } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackLabel?: string;
  className?: string;
  imgClassName?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackLabel,
  className,
  imgClassName
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0A2536] via-[#16384E] to-[#33566D] p-6 text-center text-[#F3FAFF]",
          className
        )}
      >
        <Landmark className="h-8 w-8 text-white/75" aria-hidden="true" />
        <span className="font-serif text-lg font-medium tracking-tight text-white/90">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn("block w-full h-full object-cover", imgClassName, className)}
    />
  );
}
