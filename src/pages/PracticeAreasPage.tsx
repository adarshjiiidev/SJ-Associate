import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PRACTICE_AREAS } from "@/src/data/firmData";
import { CorporateSolutionsSection } from "@/src/components/CorporateSolutionsSection";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

interface PracticeAreasPageProps {
  onOpenConsultation: (briefNote?: string) => void;
}

export function PracticeAreasPage({ onOpenConsultation }: PracticeAreasPageProps) {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/45 border-b border-border py-12 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-primary">
              Corporate &amp; Taxation Focus
            </p>
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight"
              style={{ textWrap: "balance" }}
            >
              Corporate &amp; Tax Practice Areas
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Focused on Income Tax &amp; GST filings, GSTAT appeals, business setup, customs, NCLT insolvency, and corporate litigation—representing companies, founders, CFOs, and boards across Indian courts.
            </p>
          </div>
          <Button type="button" onClick={() => onOpenConsultation()} size="lg" className="shrink-0">
            Book Consultation
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-6 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {PRACTICE_AREAS.map((area) => (
            <Card
              key={area.id}
              id={area.id}
              className="transition-colors hover:bg-[#DAF6EF]/35 hover:border-[#33566D]/45"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                  <span className="font-mono tabular-nums font-bold text-primary">
                    {area.number}
                  </span>
                  <span className="truncate">{area.forums.join(" · ")}</span>
                </div>
                <CardTitle className="text-2xl sm:text-3xl">{area.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {area.shortDesc}
                </p>
                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    How We Help
                  </p>
                  <ul className="space-y-1.5 text-sm text-foreground/85">
                    {area.scope.map((item) => (
                      <li key={item}>— {item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <CorporateSolutionsSection
          compactHeader
          onConsultSolutions={(titles) =>
            onOpenConsultation(`Selected Corporate & Tax Solutions: ${titles.join(", ")}. `)
          }
        />

        <div className="border border-[#0A2536]/15 bg-[#0A2536] text-[#F3FAFF] p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F3FAFF]">
              Follow Recent Orders From High Courts &amp; Supreme Court
            </h2>
            <p className="text-sm text-[#DAF6EF]/85">
              Open our Courts page to read live updates and judgments from thirteen Indian courts and tribunals—including Supreme Court, Delhi HC, GSTAT, Chandigarh, and Patna.
            </p>
          </div>
          <Button asChild className="bg-[#DAF6EF] text-[#0A2536] hover:bg-white shrink-0">
            <Link to="/courts">
              Open Courts Page
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
