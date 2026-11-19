import * as React from "react";
import { Link } from "react-router-dom";
import { FIRM_IDENTITY, PRINCIPAL_ADVOCATE } from "@/src/data/firmData";
import { ADVOCATE_DESK_IMAGE } from "@/src/data/assets";
import { Button } from "@/src/components/ui/button";
import { AdvocatePortrait } from "@/src/components/AdvocatePortrait";
import { ResilientImage } from "@/src/components/ResilientImage";
import { HonoursCertificatesSection } from "@/src/components/HonoursCertificatesSection";
import { Scale, Landmark, ArrowRight, ShieldCheck } from "lucide-react";

interface AboutPageProps {
  onOpenConsultation: () => void;
}

export function AboutPage({ onOpenConsultation }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-[#F3FAFF] text-[#0A2536]">
      <section className="bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/50 border-b border-border py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <AdvocatePortrait className="aspect-[4/5] w-full max-w-md mx-auto rounded-[24px] shadow-lg" />
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#33566D]">
                ABOUT OUR CHAMBERS · NEW DELHI
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#0A2536]">
                {PRINCIPAL_ADVOCATE.name}
              </h1>
              <p className="font-mono text-xs uppercase tracking-widest text-[#33566D]">
                {PRINCIPAL_ADVOCATE.designation} · {FIRM_IDENTITY.name}
              </p>
              <p className="text-[#33566D] text-base leading-relaxed">
                {PRINCIPAL_ADVOCATE.overview[0]}
              </p>
              <p className="text-[#33566D] text-sm leading-relaxed">
                {PRINCIPAL_ADVOCATE.overview[1]}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-full"
                  onClick={() => onOpenConsultation()}
                >
                  Book a Consultation
                </Button>
                <Link to="/courts">
                  <Button variant="outline" size="lg" className="rounded-full">
                    Open Live Court Updates
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Chambers Visual Feature */}
      <section className="py-12 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-[#0A2536]/12 bg-white/90 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 overflow-hidden rounded-[20px] aspect-[16/10] border border-[#0A2536]/10">
              <ResilientImage
                src={ADVOCATE_DESK_IMAGE}
                alt="SJ Associates Chambers Desk"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 space-y-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#33566D]">
                CHAMBERS APPROACH · NEW DELHI
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A2536] leading-tight">
                Thorough Paper Preparation Before Every Hearing
              </h2>
              <p className="text-sm text-[#33566D] leading-relaxed">
                Whether responding to a GST Show Cause Notice, arguing a stay petition before GSTAT
                or the High Court, or resolving an Income Tax assessment, outcomes depend on a well-indexed
                record, clear chronology of dates, and precise statutory grounding. Our chambers work
                closely with clients across New Delhi and regional tax offices nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Honours, Memberships & Certificates of Practice */}
      <HonoursCertificatesSection />

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-[24px] border border-border bg-white/90 p-6 shadow-sm">
              <Scale className="h-6 w-6 text-[#0A2536] mb-3" />
              <h2 className="font-display text-2xl font-bold text-[#0A2536]">
                1. GST &amp; Tax Wing
              </h2>
              <p className="mt-2 text-sm text-[#33566D] leading-relaxed">
                Complete support across GST Registration, GST Return Filing, SCN Replies, GSTAT
                Appeals, Commissioner (Appeals), and High Court Tax Appeals &amp; Writs.
              </p>
            </div>

            <div className="rounded-[24px] border border-border bg-white/90 p-6 shadow-sm">
              <Landmark className="h-6 w-6 text-[#0A2536] mb-3" />
              <h2 className="font-display text-2xl font-bold text-[#0A2536]">
                2. Income Tax Wing
              </h2>
              <p className="mt-2 text-sm text-[#33566D] leading-relaxed">
                Dedicated handling of Income Tax Return Filing, TDS Return Filing (24Q/26Q/27Q),
                Income Tax Consultancy, and assessment or scrutiny notices.
              </p>
            </div>

            <div className="rounded-[24px] border border-border bg-white/90 p-6 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-[#0A2536] mb-3" />
              <h2 className="font-display text-2xl font-bold text-[#0A2536]">
                3. Accounts, DGFT &amp; Registrations
              </h2>
              <p className="mt-2 text-sm text-[#33566D] leading-relaxed">
                Ongoing Accounting &amp; Bookkeeping, DGFT IEC &amp; export-import matters, MSME
                Udyam Registration, Trademark Registration, and Partnership Firm Registration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
