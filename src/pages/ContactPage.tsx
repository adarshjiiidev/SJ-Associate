import * as React from "react";
import { FIRM_IDENTITY, PRINCIPAL_ADVOCATE, CHAMBERS_OFFICES } from "@/src/data/firmData";
import { TAX_AND_REGIONAL_OFFICES } from "@/src/data/courtsRegistry";
import { ConsultationForm } from "@/src/components/ConsultationForm";
import { MapPin, Phone, Mail, Clock, Building2 } from "lucide-react";

export function ContactPage() {
  const delhiOffices = TAX_AND_REGIONAL_OFFICES.filter(
    (o) => o.group === "Delhi Tax & Regional Offices"
  );
  const regionalOffices = TAX_AND_REGIONAL_OFFICES.filter(
    (o) => o.group === "Regional Tax Offices (Near High Courts)"
  );

  return (
    <div className="min-h-screen bg-[#F3FAFF] text-[#0A2536]">
      <section className="bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/45 border-b border-border py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#33566D] mb-2">
            GET IN TOUCH · NEW DELHI &amp; GHAZIABAD (NCR) OFFICES
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#0A2536]">
            Contact {FIRM_IDENTITY.name}
          </h1>
          <p className="mt-2 text-[#33566D] max-w-3xl text-base leading-relaxed">
            Connect with {PRINCIPAL_ADVOCATE.name} and the Firm&apos;s Direct and Indirect Tax teams
            for advisory, compliance, and litigation matters across Goods and Services Tax
            (&lsquo;GST&rsquo;), Customs, Income Tax, GSTAT, ITAT Tribunal, High Courts, DGFT, MSME,
            Trademark, and Partnership Firm Registration.
          </p>
        </div>
      </section>

      <section className="py-12 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-4">
              {CHAMBERS_OFFICES.map((office) => (
                <div
                  key={office.id}
                  className="rounded-[24px] border border-border bg-white/90 p-6 shadow-sm"
                >
                  <div className="font-mono text-xs uppercase tracking-widest text-[#33566D] mb-1">
                    {office.title}
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#0A2536]">
                    {office.city}
                  </h2>

                  <div className="mt-4 space-y-3 text-sm text-[#33566D]">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-4 w-4 text-[#0A2536] shrink-0 mt-0.5" />
                      <span>{office.addressLines.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-[#0A2536] shrink-0" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-[#0A2536] shrink-0" />
                      <span>{office.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-[#0A2536] shrink-0" />
                      <span>{office.consultationHours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-[24px] border border-border bg-white/90 p-6 sm:p-8 shadow-sm">
                <div className="font-mono text-xs uppercase tracking-widest text-[#33566D] mb-1">
                  DIRECT CHAMBERS NOTE
                </div>
                <h2 className="font-display text-3xl font-bold text-[#0A2536] mb-2">
                  Send Us Your Case Or Tax Office Details
                </h2>
                <p className="text-sm text-[#33566D] mb-6">
                  Select the relevant Delhi or regional tax office, GSTAT bench, or High Court and
                  the service required. All submissions are routed directly to{" "}
                  <span className="font-mono text-xs font-semibold text-[#0A2536]">
                    services@sjalaw.in
                  </span>
                  .
                </p>
                <ConsultationForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delhi & Regional Tax Offices Directory */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#33566D] mb-1">
              TAX &amp; REGULATORY FORUMS · NEW DELHI
            </div>
            <h2 className="font-display text-3xl font-bold text-[#0A2536]">
              Delhi Tax Offices, GSTAT &amp; Registration Authorities
            </h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {delhiOffices.map((office) => (
                <div
                  key={office.slug}
                  className="rounded-[22px] border border-border bg-white/90 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded-full bg-[#DAF6EF] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#0A2536] font-semibold">
                      {office.jurisdiction}
                    </span>
                    <Building2 className="h-4 w-4 text-[#33566D]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#0A2536]">
                    {office.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#33566D] leading-relaxed">
                    {office.addressNote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#33566D] mb-1">
              REGIONAL TAX &amp; APPELLATE OFFICES NEARBY HIGH COURTS
            </div>
            <h2 className="font-display text-3xl font-bold text-[#0A2536]">
              Regional GST, Income Tax &amp; GSTAT Benches Across India
            </h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionalOffices.map((office) => (
                <div
                  key={office.slug}
                  className="rounded-[22px] border border-border bg-white/90 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded-full bg-[#0A2536]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#0A2536] font-semibold">
                      {office.city} · {office.jurisdiction}
                    </span>
                    <Building2 className="h-4 w-4 text-[#33566D]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#0A2536]">
                    {office.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#33566D] leading-relaxed">
                    {office.addressNote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
