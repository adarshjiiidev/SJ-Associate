/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { ArrowRight, Landmark, Phone, Scale } from "lucide-react";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { BciDisclaimerModal } from "@/src/components/BciDisclaimerModal";
import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";
import { ConsultationForm } from "@/src/components/ConsultationForm";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/src/components/ui/dialog";
import { HomePage } from "@/src/pages/HomePage";
import { CourtsPage } from "@/src/pages/CourtsPage";
import { CourtDetailPage } from "@/src/pages/CourtDetailPage";
import { PracticeAreasPage } from "@/src/pages/PracticeAreasPage";
import { AboutPage } from "@/src/pages/AboutPage";
import { ContactPage } from "@/src/pages/ContactPage";
import { MailPage } from "@/src/pages/MailPage";

interface RouteSeoConfig {
  title: string;
  description: string;
}

const ROUTE_SEO: Record<string, RouteSeoConfig> = {
  "/": {
    title: "SJ Associates | Advocate Sanjay Singh — Delhi, Ghaziabad & Bihar Law & Tax Firm",
    description:
      "SJ Associates — Advocate Sanjay Kumar Singh, Delhi High Court, Ghaziabad NCR & Muzaffarpur (Bihar) Law & Tax Firm for Direct & Indirect Taxation, Corporate Law, Labour Law, Civil & Criminal Litigation."
  },
  "/courts": {
    title: "Live Supreme Court, Delhi High Court & GSTAT Reports | SJ Associates — Adv. Sanjay Singh",
    description:
      "Live judicial bulletins, Goods and Services Tax & Income Tax rulings, and Delhi, Bihar & regional tax office directories across the Supreme Court, GSTAT & 8 High Courts."
  },
  "/practice": {
    title: "Direct & Indirect Tax, Corporate Law & Litigation Services | Advocate Sanjay Singh — SJ Associates",
    description:
      "Legal and tax practice by Adv. Sanjay Kumar Singh: Goods and Services Tax, Commissioner & GSTAT Appeals, TDS Return Filing, Income Tax Consultancy, ITR Filing, Company Registration, DGFT, MSME, Trademark, Labour, Civil & Criminal Litigation."
  },
  "/about": {
    title: "Advocate Sanjay Kumar Singh (Advocate Sanjay Singh) | Delhi High Court & Bihar Lawyer",
    description:
      "Profile of Advocate Sanjay Kumar Singh, Founder of SJ Associates, Delhi High Court Advocate & Distinguished Member of the International Council of Jurists (Cert. No. 2529)."
  },
  "/contact": {
    title: "Contact Advocate Sanjay Singh | SJ Associates — New Delhi & Muzaffarpur (Bihar) Offices",
    description:
      "Consult Advocate Sanjay Kumar Singh (SJ Associates) at our New Delhi (Rani Bagh / Pitampura) and Bihar (Muzaffarpur) offices for Tax, Corporate, Labour, Civil & Criminal matters."
  },
  "/mail": {
    title: "Office Webmail | SJ Associates (services@sjalaw.in)",
    description: "Private office webmail portal for SJ Associates (services@sjalaw.in)."
  }
};

function setMetaContent(selector: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) {
    el.setAttribute("content", content);
  }
}

function RouteMetadataAndScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    let seo = ROUTE_SEO[pathname];
    if (!seo && pathname.startsWith("/courts/")) {
      const courtLabel = pathname
        .replace("/courts/", "")
        .split("-")
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
        .join(" ");
      seo = {
        title: `${courtLabel} Live Goods and Services Tax Rulings | Advocate Sanjay Singh — SJ Associates`,
        description: `Live ${courtLabel} judicial rulings, GST & Income Tax bench updates, and representation by Advocate Sanjay Kumar Singh (SJ Associates, Delhi & Ghaziabad NCR).`
      };
    } else if (!seo) {
      seo = {
        title: "SJ Associates | Advocate Sanjay Singh — Delhi & Ghaziabad Lawyer",
        description: ROUTE_SEO["/"].description
      };
    }

    document.title = seo.title;
    setMetaContent('meta[name="description"]', seo.description);
    setMetaContent('meta[property="og:title"]', seo.title);
    setMetaContent('meta[property="og:description"]', seo.description);
    setMetaContent('meta[name="twitter:title"]', seo.title);
    setMetaContent('meta[name="twitter:description"]', seo.description);

    const canonicalUrl = `${window.location.origin}${pathname}`;
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", canonicalUrl);
    }
  }, [pathname]);

  return null;
}

function NotFoundView() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center space-y-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#33566D]">
        404 · Page Not Found
      </p>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0A2536]">
        This page could not be found
      </h1>
      <p className="text-base text-[#33566D] leading-relaxed">
        The address may have changed or moved. Return to the main overview or browse real-time reports across Indian courts.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-7">
          <Link to="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-7">
          <Link to="/courts">
            Open Live Courts
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function AppShell() {
  const location = useLocation();
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultCourtSlug, setConsultCourtSlug] = useState<string | undefined>(undefined);
  const [consultBriefNote, setConsultBriefNote] = useState<string | undefined>(undefined);

  function openConsultation(courtSlug?: string, briefNote?: string) {
    setConsultCourtSlug(courtSlug);
    setConsultBriefNote(briefNote);
    setConsultOpen(true);
  }

  if (location.pathname === "/mail") {
    return (
      <>
        <RouteMetadataAndScroll />
        <ErrorBoundary>
          <MailPage />
        </ErrorBoundary>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <RouteMetadataAndScroll />
      <BciDisclaimerModal />
      <Header onOpenConsultation={() => openConsultation()} />

      <main className="flex-1">
        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onOpenConsultation={(briefNote) => openConsultation(undefined, briefNote)}
                />
              }
            />
            <Route path="/courts" element={<CourtsPage />} />
            <Route
              path="/courts/:slug"
              element={<CourtDetailPage onConsultForCourt={(slug) => openConsultation(slug)} />}
            />
            <Route
              path="/practice"
              element={
                <PracticeAreasPage
                  onOpenConsultation={(briefNote) => openConsultation(undefined, briefNote)}
                />
              }
            />
            <Route
              path="/about"
              element={<AboutPage onOpenConsultation={() => openConsultation()} />}
            />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundView />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <Footer />

      {/* Mobile Bottom Sticky Quick-Action Bar */}
      <nav
        aria-label="Mobile quick actions"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-[#F3FAFF]/95 backdrop-blur-md px-3 py-2 flex items-center justify-between gap-2 shadow-[0_-4px_18px_rgba(10,37,54,0.08)]"
      >
        <a
          href="tel:+919716318400"
          className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-white text-[11px] font-bold uppercase tracking-wider text-[#0A2536]"
        >
          <Phone className="h-3.5 w-3.5 text-[#33566D]" aria-hidden="true" />
          Call
        </a>
        <Link
          to="/courts"
          className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-white text-[11px] font-bold uppercase tracking-wider text-[#0A2536]"
        >
          <Landmark className="h-3.5 w-3.5 text-[#33566D]" aria-hidden="true" />
          Courts
        </Link>
        <button
          type="button"
          onClick={() => openConsultation()}
          className="flex-[1.35] min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0A2536] text-[11px] font-bold uppercase tracking-wider text-[#F3FAFF] cursor-pointer"
        >
          <Scale className="h-3.5 w-3.5 text-[#DAF6EF]" aria-hidden="true" />
          Consult
        </button>
      </nav>

      <Dialog open={consultOpen} onOpenChange={setConsultOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a Legal &amp; Tax Consultation</DialogTitle>
            <DialogDescription>
              Share a short overview of your Goods and Services Tax, TDS / Income Tax, Company Registration, Corporate Law, Labour Law, Civil, or Criminal Litigation matter to arrange a consultation with Advocate Sanjay Kumar Singh.
            </DialogDescription>
          </DialogHeader>
          <ConsultationForm
            key={`${consultCourtSlug ?? "default"}-${consultBriefNote ?? "empty"}`}
            defaultCourtSlug={consultCourtSlug}
            defaultBriefSummary={consultBriefNote}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </MotionConfig>
  );
}
