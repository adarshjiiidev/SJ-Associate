import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input, Select, Textarea, Label } from "@/src/components/ui/fields";
import { COURTS_REGISTRY, TAX_AND_REGIONAL_OFFICES } from "@/src/data/courtsRegistry";
import { PRACTICE_AREAS, CORPORATE_SOLUTIONS } from "@/src/data/firmData";
import { CheckCircle2, Send, ShieldCheck } from "lucide-react";

export interface ConsultationFormProps {
  defaultCourtSlug?: string;
  defaultBriefSummary?: string;
  compact?: boolean;
}

export function ConsultationForm({
  defaultCourtSlug = "",
  defaultBriefSummary = "",
  compact = false,
}: ConsultationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deliveryResult, setDeliveryResult] = useState<{
    referenceId: string;
    inboxEmail: string;
  } | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    courtSlug: defaultCourtSlug || "delhi-gst-vyapar-bhawan",
    practiceArea: CORPORATE_SOLUTIONS[0].title,
    briefSummary: defaultBriefSummary || "",
  });

  useEffect(() => {
    if (defaultCourtSlug) {
      setForm((prev) => ({ ...prev, courtSlug: defaultCourtSlug }));
    }
  }, [defaultCourtSlug]);

  useEffect(() => {
    if (defaultBriefSummary) {
      const matchingSolution = CORPORATE_SOLUTIONS.find(
        (s) => s.title.toLowerCase() === defaultBriefSummary.toLowerCase()
      );
      if (matchingSolution) {
        setForm((prev) => ({ ...prev, practiceArea: matchingSolution.title }));
      } else {
        setForm((prev) => ({
          ...prev,
          briefSummary: prev.briefSummary || defaultBriefSummary,
        }));
      }
    }
  }, [defaultBriefSummary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.briefSummary.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email || "client@sjalaw.in",
          phone: form.phone,
          courtSlug: form.courtSlug || "delhi-gst-vyapar-bhawan",
          practiceArea: form.practiceArea,
          briefSummary: form.briefSummary,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data?.ok) {
        const errDetail = Array.isArray(data?.errors)
          ? data.errors.join(" ")
          : data?.error;
        throw new Error(
          errDetail || "Could not submit your note right now. Please try again."
        );
      }

      setDeliveryResult({
        referenceId: data.referenceId || "SJA-REF",
        inboxEmail: "services@sjalaw.in",
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Could not send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const gstSolutions = CORPORATE_SOLUTIONS.filter((s) => s.category === "Goods and Services Tax");
  const incomeTaxSolutions = CORPORATE_SOLUTIONS.filter((s) => s.category === "Income Tax");
  const otherSolutions = CORPORATE_SOLUTIONS.filter((s) => s.category === "Others");
  const delhiOffices = TAX_AND_REGIONAL_OFFICES.filter(
    (o) => o.group === "Delhi Tax & Regional Offices"
  );
  const regionalOffices = TAX_AND_REGIONAL_OFFICES.filter(
    (o) => o.group === "Regional Tax Offices (Near High Courts)"
  );

  if (submitted) {
    return (
      <div className="rounded-[24px] border border-[#0A2536]/15 bg-[#DAF6EF]/55 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 text-[#0A2536] shrink-0 mt-0.5" />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#33566D]">
                Consultation Note Logged
              </span>
              {deliveryResult?.referenceId && (
                <span className="rounded-full bg-[#0A2536] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#F3FAFF]">
                  Ref: {deliveryResult.referenceId}
                </span>
              )}
            </div>
            <h4 className="font-display text-2xl font-bold text-[#0A2536]">
              Thank you, {form.fullName}. Your note has been sent to our office.
            </h4>
            <p className="text-sm text-[#33566D] leading-relaxed">
              Your consultation request regarding{" "}
              <span className="font-semibold text-[#0A2536]">{form.practiceArea}</span>{" "}
              has been routed to{" "}
              <span className="font-mono text-xs font-semibold text-[#0A2536]">
                {deliveryResult?.inboxEmail || "services@sjalaw.in"}
              </span>{" "}
              for Adv. Sanjay Kumar Singh&apos;s office.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setSubmitted(false);
                  setDeliveryResult(null);
                  setForm({
                    fullName: "",
                    email: "",
                    phone: "",
                    courtSlug: defaultCourtSlug || "delhi-gst-vyapar-bhawan",
                    practiceArea: CORPORATE_SOLUTIONS[0].title,
                    briefSummary: "",
                  });
                }}
              >
                Send Another Inquiry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid grid-cols-1 ${compact ? "sm:grid-cols-2" : "md:grid-cols-2"} gap-4`}>
        <div>
          <Label htmlFor="consult-name">Your Name / Designation *</Label>
          <Input
            id="consult-name"
            required
            placeholder="Full Name or Firm Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="consult-email">Email Address *</Label>
          <Input
            id="consult-email"
            required
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? "sm:grid-cols-2" : "md:grid-cols-2"} gap-4`}>
        <div>
          <Label htmlFor="consult-phone">Phone Number *</Label>
          <Input
            id="consult-phone"
            required
            type="tel"
            placeholder="+91 98XXX XXXXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="consult-court">Which Court or Tax Office?</Label>
          <Select
            id="consult-court"
            value={form.courtSlug}
            onChange={(e) => setForm({ ...form, courtSlug: e.target.value })}
          >
            <optgroup label="Delhi Tax & Regional Offices">
              {delhiOffices.map((office) => (
                <option key={office.slug} value={office.slug}>
                  {office.name} — {office.city}
                </option>
              ))}
            </optgroup>
            <optgroup label="Regional Tax Offices (Near High Courts)">
              {regionalOffices.map((office) => (
                <option key={office.slug} value={office.slug}>
                  {office.name} — {office.city}
                </option>
              ))}
            </optgroup>
            <optgroup label="Supreme Court, GSTAT & High Courts">
              {COURTS_REGISTRY.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.city})
                </option>
              ))}
            </optgroup>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="consult-matter">Type of Case</Label>
        <Select
          id="consult-matter"
          value={form.practiceArea}
          onChange={(e) => setForm({ ...form, practiceArea: e.target.value })}
        >
          <optgroup label="1. Goods and Services Tax">
            {gstSolutions.map((sol) => (
              <option key={sol.id} value={sol.title}>
                {sol.title} ({sol.authorityTag})
              </option>
            ))}
          </optgroup>
          <optgroup label="2. Income Tax">
            {incomeTaxSolutions.map((sol) => (
              <option key={sol.id} value={sol.title}>
                {sol.title} ({sol.authorityTag})
              </option>
            ))}
          </optgroup>
          <optgroup label="3. Others (Corporate, Registrations & Litigation)">
            {otherSolutions.map((sol) => (
              <option key={sol.id} value={sol.title}>
                {sol.title} ({sol.authorityTag})
              </option>
            ))}
          </optgroup>
          <optgroup label="Practice Areas">
            {PRACTICE_AREAS.map((area) => (
              <option key={area.id} value={area.title}>
                {area.title}
              </option>
            ))}
          </optgroup>
        </Select>
      </div>

      <div>
        <Label htmlFor="consult-summary">Brief Overview of GST, Income Tax or Legal Matter *</Label>
        <Textarea
          id="consult-summary"
          required
          placeholder="Please share key details: assessment year, SCN/order reference, GST/Income Tax authority or court bench, and any upcoming reply deadline..."
          value={form.briefSummary}
          onChange={(e) => setForm({ ...form, briefSummary: e.target.value })}
        />
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-[#B91C1C]/30 bg-[#B91C1C]/5 px-3.5 py-2.5 text-xs text-[#B91C1C]">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-[#0A2536] shrink-0" />
          <span>Handled in accordance with Bar Council of India standards.</span>
        </div>
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto rounded-full px-6">
          <Send className="h-4 w-4" />
          {submitting ? "Sending..." : "Send Note"}
        </Button>
      </div>
    </form>
  );
}
