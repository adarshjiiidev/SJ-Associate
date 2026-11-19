/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { ArrowRight, Landmark, Phone, Scale } from "lucide-react";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
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

const ROUTE_TITLES: Record<string, string> = {
  "/": "SJ Associates | Advocate Sanjay Kumar Singh — Corporate & Tax Law Chambers",
  "/courts": "Live Supreme Court, GSTAT & High Court Reports | SJ Associates",
  "/practice": "Corporate & Tax Practice Areas | SJ Associates — Advocate Sanjay Kumar Singh",
  "/about": "Advocate Sanjay Kumar Singh | Corporate & Tax Counsel — SJ Associates",
  "/contact": "Contact Chambers | SJ Associates — New Delhi, Mumbai & Bengaluru",
  "/mail": "Chambers Webmail | SJ Associates (legalsja.com)"
};

function RouteMetadataAndScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    if (ROUTE_TITLES[pathname]) {
      document.title = ROUTE_TITLES[pathname];
    } else if (pathname.startsWith("/courts/")) {
      const courtLabel = pathname
        .replace("/courts/", "")
        .split("-")
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
        .join(" ");
      document.title = `${courtLabel} Live Report | SJ Associates`;
    } else {
      document.title = "Page Not Found | SJ Associates";
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
        This chambers page could not be found
      </h1>
      <p className="text-base text-[#33566D] leading-relaxed">
        The address may have changed or moved. Return to the main chambers overview or browse real-time reports across Indian courts.
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
            <DialogTitle>Schedule a Corporate &amp; Tax Consultation</DialogTitle>
            <DialogDescription>
              Share a short overview of your GST, income tax, GSTAT, business setup, or corporate matter to arrange a chambers briefing with Advocate Sanjay Kumar Singh.
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
