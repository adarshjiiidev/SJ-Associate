import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { COUNSEL_TEAM, PRINCIPAL_ADVOCATE } from "@/src/data/firmData";
import { ADVOCATE_DESK_IMAGE } from "@/src/data/assets";
import { AdvocatePortrait } from "@/src/components/AdvocatePortrait";
import { HonoursCertificatesSection } from "@/src/components/HonoursCertificatesSection";
import { ResilientImage } from "@/src/components/ResilientImage";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

interface AboutPageProps {
  onOpenConsultation: () => void;
}

export function AboutPage({ onOpenConsultation }: AboutPageProps) {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/45 border-b border-border py-12 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <AdvocatePortrait className="mx-auto max-w-[420px] lg:mx-0" />
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="space-y-2.5">
                <p className="text-xs font-bold tracking-[0.14em] uppercase text-primary">
                  Principal Counsel · {PRINCIPAL_ADVOCATE.firm}
                </p>
                <h1
                  className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight"
                  style={{ textWrap: "balance" }}
                >
                  {PRINCIPAL_ADVOCATE.name}
                </h1>
                <p className="text-sm font-medium text-muted-foreground">
                  {PRINCIPAL_ADVOCATE.title} · {PRINCIPAL_ADVOCATE.membership}
                </p>
              </div>

              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  SJ Associates is a New Delhi corporate and taxation law practice led by Advocate Sanjay Kumar Singh, practicing at the High Court of Delhi and serving as a Member of the International Council Of Jurists.
                </p>
                <p>
                  Whether a company is handling GST &amp; income tax filings, contesting a wrongful GST demand, an Income Tax Section 148 reassessment, a customs valuation order, a GSTAT appeal, or an NCLT dispute, our chambers focus exclusively on taxation, setup, and corporate advocacy before the High Court of Delhi, the Supreme Court of India, GSTAT, ITAT, CESTAT, and NCLAT.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
                <Button type="button" size="lg" onClick={onOpenConsultation} className="w-full sm:w-auto min-h-[48px]">
                  Book a Consultation
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-h-[48px] bg-white">
                  <Link to="/courts">
                    Open Live Court Updates
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-[28px] border border-border bg-white p-6 sm:p-10 shadow-xs">
          <div className="lg:col-span-6 aspect-[4/3] overflow-hidden rounded-[20px] border border-border bg-[#0A2536]">
            <ResilientImage
              src={ADVOCATE_DESK_IMAGE}
              alt="Advocate Sanjay Kumar Singh reviewing appellate briefs inside SJ Associates chambers in New Delhi"
              fallbackLabel="SJ Associates Chambers"
              imgClassName="object-cover object-center"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-[#33566D]">
              Chambers Approach · New Delhi
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2536] leading-tight">
              Thorough Paper Preparation Before Every Hearing
            </h2>
            <p className="text-sm sm:text-base text-[#33566D] leading-relaxed">
              From GST and direct tax computation audits to commercial contract indexing and NCLT paperbooks, every corporate file at SJ Associates is personally reviewed by Advocate Sanjay Kumar Singh before entering court.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-[#F3FAFF] border border-border p-3.5">
                <p className="text-xs font-bold text-[#0A2536]">Tax &amp; Corporate Bench</p>
                <p className="text-xs text-[#33566D] mt-0.5">Delhi HC · ITAT · NCLAT</p>
              </div>
              <div className="rounded-xl bg-[#DAF6EF]/60 border border-[#33566D]/20 p-3.5">
                <p className="text-xs font-bold text-[#0A2536]">International Jurists</p>
                <p className="text-xs text-[#33566D] mt-0.5">Member, ICJ Network</p>
              </div>
            </div>
          </div>
        </div>

        <HonoursCertificatesSection compact />

        <div className="space-y-8">
          <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-bold tracking-[0.14em] uppercase text-primary">
            Our Team
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Counsel at SJ Associates
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COUNSEL_TEAM.map((member) => (
            <Card key={member.name} className="hover:bg-[#DAF6EF]/35 transition-colors">
              <CardHeader className="space-y-1.5">
                <p className="text-xs font-bold text-primary">{member.designation}</p>
                <CardTitle className="text-2xl">{member.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{member.barEnrollment}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs font-semibold text-foreground">{member.practiceFocus}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
