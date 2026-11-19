import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, useScroll, useSpring } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { FirmLogo } from "@/src/components/FirmLogo";
import { Button } from "@/src/components/ui/button";

interface HeaderProps {
  onOpenConsultation: () => void;
}

const NAV_ITEMS = [
  { to: "/", label: "HOME" },
  { to: "/courts", label: "COURTS" },
  { to: "/practice", label: "WHAT WE DO" },
  { to: "/about", label: "ABOUT US" },
  { to: "/contact", label: "CONTACT" }
];

export function Header({ onOpenConsultation }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#F3FAFF]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 sm:py-3">
        {/* Zone 1: Official SJ Associates Crest Logo + single-line wordmark */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base font-extrabold tracking-tight text-[#0A2536] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        >
          <FirmLogo size={26} />
          <span className="uppercase tracking-[0.06em] whitespace-nowrap">SJ Associates</span>
        </Link>

        {/* Zone 2: Clean uppercase geometric nav */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `text-xs font-semibold tracking-[0.08em] uppercase whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors duration-150 ${
                  isActive
                    ? "border-[#0A2536] text-[#0A2536]"
                    : "border-transparent text-[#33566D] hover:text-[#0A2536]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Call icon circle + Primary CTA button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:+919716318400"
            aria-label="Call SJ Associates Chambers"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-[#0A2536] hover:bg-[#DAF6EF] transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
          </a>
          <Button
            type="button"
            size="sm"
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex rounded-full px-5 text-xs font-semibold uppercase tracking-[0.06em]"
          >
            Book Consultation
          </Button>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex lg:hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-[#0A2536] hover:bg-[#DAF6EF] cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white px-5 py-4 space-y-3 shadow-lg">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `min-h-[44px] flex items-center px-3.5 rounded-xl text-xs font-bold tracking-[0.08em] uppercase ${
                    isActive
                      ? "bg-[#DAF6EF] text-[#0A2536]"
                      : "text-[#33566D] hover:bg-[#F3FAFF] hover:text-[#0A2536]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-3 border-t border-border grid grid-cols-2 gap-2.5">
            <a
              href="tel:+919716318400"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full border border-border bg-[#F3FAFF] px-4 text-xs font-bold uppercase tracking-wider text-[#0A2536]"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Call Now
            </a>
            <Button
              type="button"
              className="min-h-[44px] rounded-full uppercase tracking-[0.06em]"
              onClick={() => {
                setMobileOpen(false);
                onOpenConsultation();
              }}
            >
              Consult
            </Button>
          </div>
        </div>
      )}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: smoothProgress }}
        className="h-[2.5px] w-full origin-left bg-[#0A2536]"
      />
    </header>
  );
}
