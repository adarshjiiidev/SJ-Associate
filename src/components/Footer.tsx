import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { CHAMBERS_OFFICES, PRINCIPAL_ADVOCATE } from "@/src/data/firmData";
import { FirmLogo } from "@/src/components/FirmLogo";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/src/components/ui/dialog";

export function Footer() {
  const [bciOpen, setBciOpen] = useState(false);

  return (
    <footer className="bg-[#0A2536] text-[#F3FAFF] border-t border-[#33566D]/40 pb-20 md:pb-0">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 py-16 space-y-12">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <FirmLogo size={34} />
              <div className="min-w-0">
                <p className="text-xl font-extrabold uppercase tracking-[0.06em] text-[#F3FAFF] whitespace-nowrap">
                  SJ Associates
                </p>
                <p className="text-xs text-[#DAF6EF]/80 truncate">
                  {PRINCIPAL_ADVOCATE.name} · {PRINCIPAL_ADVOCATE.title}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#F3FAFF]/80 leading-relaxed max-w-sm">
              Corporate &amp; Taxation Law Chambers · {PRINCIPAL_ADVOCATE.membership}. Representing businesses and boards before the Delhi High Court, Supreme Court, GSTAT, ITAT, CESTAT, and NCLAT.
            </p>

            <div>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#DAF6EF] text-[#0A2536] hover:bg-white px-7 uppercase text-xs tracking-wider"
              >
                <Link to="/contact">Book Consultation</Link>
              </Button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-semibold text-[#DAF6EF]/75">Quick Links</p>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-[0.07em] text-[#F3FAFF]">
              <li>
                <Link to="/" className="hover:text-[#DAF6EF] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courts" className="hover:text-[#DAF6EF] transition-colors">
                  All Courts
                </Link>
              </li>
              <li>
                <Link to="/practice" className="hover:text-[#DAF6EF] transition-colors">
                  What We Do
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#DAF6EF] transition-colors">
                  About Counsel
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#DAF6EF] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/courts/supreme-court-of-india"
                  className="hover:text-[#DAF6EF] transition-colors"
                >
                  Supreme Court Live
                </Link>
              </li>
              <li>
                <Link
                  to="/courts/delhi-high-court"
                  className="hover:text-[#DAF6EF] transition-colors"
                >
                  Delhi High Court Live
                </Link>
              </li>
              <li>
                <Link
                  to="/courts/gstat"
                  className="hover:text-[#DAF6EF] transition-colors"
                >
                  GSTAT Live Tribunal
                </Link>
              </li>
              <li>
                <Link
                  to="/courts/punjab-haryana-high-court"
                  className="hover:text-[#DAF6EF] transition-colors"
                >
                  Chandigarh HC Live
                </Link>
              </li>
              <li>
                <Link
                  to="/courts/patna-high-court"
                  className="hover:text-[#DAF6EF] transition-colors"
                >
                  Patna High Court Live
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <p className="text-xs font-semibold text-[#DAF6EF]/75">Contact Us</p>
            <div className="space-y-3">
              <a
                href={`mailto:${CHAMBERS_OFFICES[0].email}`}
                className="flex items-center gap-3 group"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#33566D] bg-[#33566D]/40 text-[#DAF6EF] group-hover:bg-[#DAF6EF] group-hover:text-[#0A2536] transition-colors">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#F3FAFF] group-hover:text-[#DAF6EF] transition-colors break-all">
                  {CHAMBERS_OFFICES[0].email}
                </span>
              </a>

              <a
                href={`tel:${CHAMBERS_OFFICES[0].phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 group"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#33566D] bg-[#33566D]/40 text-[#DAF6EF] group-hover:bg-[#DAF6EF] group-hover:text-[#0A2536] transition-colors">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#F3FAFF] tabular-nums group-hover:text-[#DAF6EF] transition-colors">
                  Mobile · {CHAMBERS_OFFICES[0].phone}
                </span>
              </a>

              {CHAMBERS_OFFICES[0].landline && (
                <a
                  href={`tel:${CHAMBERS_OFFICES[0].landline.replace(/\D/g, "")}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#33566D] bg-[#33566D]/40 text-[#DAF6EF] group-hover:bg-[#DAF6EF] group-hover:text-[#0A2536] transition-colors">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#F3FAFF] tabular-nums group-hover:text-[#DAF6EF] transition-colors">
                    Chambers Office · {CHAMBERS_OFFICES[0].landline}
                  </span>
                </a>
              )}
            </div>
            <div className="pt-1 space-y-2">
              <div className="flex items-start gap-2.5 text-xs text-[#F3FAFF]/85 leading-relaxed">
                <MapPin className="h-4 w-4 text-[#DAF6EF] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-[#F3FAFF]">{CHAMBERS_OFFICES[0].address}</p>
                  {CHAMBERS_OFFICES[0].landmark && (
                    <p className="text-[#F3FAFF]/65 mt-0.5">{CHAMBERS_OFFICES[0].landmark}</p>
                  )}
                </div>
              </div>
              {CHAMBERS_OFFICES[0].mapUrl && (
                <a
                  href={CHAMBERS_OFFICES[0].mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#DAF6EF] hover:text-white transition-colors"
                >
                  Open in Google Maps
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Legal & Back to Top Bar */}
        <div className="pt-6 border-t border-[#33566D]/50 flex flex-wrap items-center justify-between gap-4 text-xs text-[#F3FAFF]/75">
          <span>© 2026 SJ Associates — Advocate Sanjay Kumar Singh | All Rights Reserved</span>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => setBciOpen(true)}
              className="hover:text-[#DAF6EF] underline underline-offset-4 cursor-pointer"
            >
              Bar Council of India Notice
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 font-bold uppercase tracking-[0.08em] text-[#F3FAFF] hover:text-[#DAF6EF] cursor-pointer"
            >
              Back to Top
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#33566D] bg-[#33566D]/50 text-[#DAF6EF]">
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <Dialog open={bciOpen} onOpenChange={setBciOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bar Council of India Notice</DialogTitle>
            <DialogDescription>
              Mandatory notice for visitors viewing advocate information in India.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              As per the rules of the Bar Council of India, advocates are not permitted to advertise or solicit work.
            </p>
            <p>
              By visiting this portal, you confirm that you requested information about SJ Associates and Advocate Sanjay Kumar Singh on your own initiative for informational and court-tracking purposes.
            </p>
            <p>
              Nothing on this website counts as legal advice or creates a lawyer-client relationship. For advice on your case, please contact chambers directly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
