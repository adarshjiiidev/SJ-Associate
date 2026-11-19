import { ExternalLink, MapPin } from "lucide-react";
import { ADVOCATE_DESK_IMAGE } from "@/src/data/assets";
import { CHAMBERS_OFFICES, PRINCIPAL_ADVOCATE } from "@/src/data/firmData";
import { ConsultationForm } from "@/src/components/ConsultationForm";
import { ResilientImage } from "@/src/components/ResilientImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export function ContactPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/45 border-b border-border py-12 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 space-y-3">
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#33566D]">
            Reach SJ Associates
          </p>
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-[#0A2536] leading-tight"
            style={{ textWrap: "balance" }}
          >
            Contact Chambers
          </h1>
          <p className="text-base text-[#33566D] leading-relaxed max-w-3xl">
            Visit or write to {PRINCIPAL_ADVOCATE.name} and SJ Associates at our Delhi chambers on Captain Satish Marg, Rishi Nagar, Pitampura (110034), or reach our corporate desks in Mumbai and Bengaluru for a matter briefing.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 py-12 space-y-12">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Send Us a Short Note</CardTitle>
            </CardHeader>
            <CardContent>
              <ConsultationForm />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
            <div className="aspect-[4/3] overflow-hidden bg-[#0A2536]">
              <ResilientImage
                src={ADVOCATE_DESK_IMAGE}
                alt="Advocate Sanjay Kumar Singh at the Pitampura, Delhi chambers conference desk"
                fallbackLabel="SJ Associates Chambers"
                imgClassName="object-cover object-center"
              />
            </div>
            <div className="px-5 py-3.5 border-t border-border flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-[#0A2536]">{PRINCIPAL_ADVOCATE.name}</p>
                <p className="text-xs text-[#33566D]">{PRINCIPAL_ADVOCATE.title}</p>
              </div>
              <span className="rounded-full bg-[#DAF6EF] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#0A2536] shrink-0">
                Pitampura · Delhi 110034
              </span>
            </div>
          </div>

          {CHAMBERS_OFFICES.map((office, index) => (
            <Card
              key={office.city}
              className={`rounded-2xl ${
                index === 0 ? "border-[#0A2536]/30 bg-[#F3FAFF]/80 shadow-xs" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#33566D]">
                    {office.city}
                  </p>
                  {index === 0 && (
                    <span className="rounded-full bg-[#DAF6EF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0A2536]">
                      Main Chambers
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl text-[#0A2536]">{office.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#0A2536] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-0.5">
                    <p className="leading-relaxed font-medium text-[#0A2536]">{office.address}</p>
                    {office.landmark && (
                      <p className="text-xs text-[#33566D]">{office.landmark}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="tabular-nums text-foreground font-medium">
                    <a
                      href={`tel:${office.phone.replace(/\s+/g, "")}`}
                      className="hover:text-primary transition-colors"
                    >
                      Mobile: {office.phone}
                    </a>
                  </p>
                  {office.landline && (
                    <p className="tabular-nums text-foreground font-medium">
                      <a
                        href={`tel:${office.landline.replace(/\D/g, "")}`}
                        className="hover:text-primary transition-colors"
                      >
                        Office: {office.landline}
                      </a>
                    </p>
                  )}
                  <p>
                    <a
                      href={`mailto:${office.email}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {office.email}
                    </a>
                  </p>
                </div>
                <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs">{office.hours}</p>
                  {office.mapUrl && (
                    <a
                      href={office.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0A2536] hover:bg-[#DAF6EF] transition-colors"
                    >
                      Get Directions
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
