import { useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { COURTS_REGISTRY, validateConsultationInput, type ConsultationPayload } from "@/src/data/courtsRegistry";
import { PRACTICE_AREAS } from "@/src/data/firmData";
import { Button } from "@/src/components/ui/button";
import { Input, Label, Select, Textarea } from "@/src/components/ui/fields";
import { parseJsonSafely } from "@/src/utils/http";

interface ConsultationFormProps {
  defaultCourtSlug?: string;
  defaultBriefSummary?: string;
  onSuccess?: () => void;
}

export function ConsultationForm({
  defaultCourtSlug,
  defaultBriefSummary,
  onSuccess
}: ConsultationFormProps) {
  const [form, setForm] = useState<ConsultationPayload>({
    fullName: "",
    email: "",
    phone: "",
    courtSlug: defaultCourtSlug || "delhi-high-court",
    practiceArea: PRACTICE_AREAS[0].title,
    briefSummary: defaultBriefSummary || ""
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ConsultationPayload, string>>>(
    {}
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    referenceId: string;
    submittedAt: string;
    message: string;
    emailForwarded?: boolean;
  } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    const validation = validateConsultationInput(form);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await parseJsonSafely<{
        errors?: Partial<Record<keyof ConsultationPayload, string>>;
        error?: string;
        referenceId?: string;
        submittedAt?: string;
        message?: string;
        emailForwarded?: boolean;
      }>(response);

      if (!response.ok || !data?.referenceId) {
        if (data?.errors) {
          setFieldErrors(data.errors);
        }
        setServerError(data?.error || "Unable to send your consultation request.");
        return;
      }

      setConfirmation({
        referenceId: data.referenceId,
        submittedAt: data.submittedAt ?? new Date().toISOString(),
        message: data.message ?? "Your briefing request has been logged with the SJ Associates Chambers Desk.",
        emailForwarded: Boolean(data.emailForwarded)
      });
      if (onSuccess) onSuccess();
    } catch {
      setServerError("Network error while reaching SJ Associates. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div
        className="border border-border bg-secondary/50 p-6 rounded-xl space-y-4"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h4 className="font-serif text-xl font-semibold text-foreground">
              Thank You — Note Received
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {confirmation.message}
              {confirmation.emailForwarded
                ? " Delivered directly to services@sjalaw.in."
                : ""}
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>
            Reference ID:{" "}
            <strong className="font-mono tabular-nums text-foreground">
              {confirmation.referenceId}
            </strong>
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => {
              setConfirmation(null);
              setForm({
                fullName: "",
                email: "",
                phone: "",
                courtSlug: defaultCourtSlug || "delhi-high-court",
                practiceArea: PRACTICE_AREAS[0].title,
                briefSummary: ""
              });
            }}
          >
            Send Another Note
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 border border-destructive/40 bg-red-50 px-3.5 py-2.5 text-xs text-destructive rounded-lg"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="consult-full-name">Your Name / Designation</Label>
          <Input
            id="consult-full-name"
            name="fullName"
            placeholder="e.g. Arvind Mehta, CFO"
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            aria-invalid={Boolean(fieldErrors.fullName)}
          />
          {fieldErrors.fullName && (
            <p className="text-xs text-destructive">{fieldErrors.fullName}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="consult-email">Corporate Email</Label>
          <Input
            id="consult-email"
            name="email"
            type="email"
            placeholder="counsel@company.com"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email && (
            <p className="text-xs text-destructive">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="consult-phone">Phone Number</Label>
          <Input
            id="consult-phone"
            name="phone"
            type="tel"
            placeholder="+91 98110 00000"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          {fieldErrors.phone && (
            <p className="text-xs text-destructive">{fieldErrors.phone}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="consult-court">Which Court?</Label>
          <Select
            id="consult-court"
            name="courtSlug"
            value={form.courtSlug}
            onChange={(e) => setForm((prev) => ({ ...prev, courtSlug: e.target.value }))}
          >
            {COURTS_REGISTRY.map((court) => (
              <option key={court.slug} value={court.slug}>
                {court.shortName.includes(court.city)
                  ? court.shortName
                  : `${court.shortName} (${court.city})`}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="consult-practice">Type of Case</Label>
        <Select
          id="consult-practice"
          name="practiceArea"
          value={form.practiceArea}
          onChange={(e) => setForm((prev) => ({ ...prev, practiceArea: e.target.value }))}
          aria-invalid={Boolean(fieldErrors.practiceArea)}
        >
          {PRACTICE_AREAS.map((area) => (
            <option key={area.id} value={area.title}>
              {area.number}. {area.title}
            </option>
          ))}
        </Select>
        {fieldErrors.practiceArea && (
          <p className="text-xs text-destructive">{fieldErrors.practiceArea}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="consult-brief">Brief Overview of Tax or Corporate Matter</Label>
        <Textarea
          id="consult-brief"
          name="briefSummary"
          placeholder="Share the GST/Income Tax notice, NCLT petition, commercial contract issue, or upcoming High Court/tribunal date (skip confidential attachments here)..."
          value={form.briefSummary}
          onChange={(e) => setForm((prev) => ({ ...prev, briefSummary: e.target.value }))}
          aria-invalid={Boolean(fieldErrors.briefSummary)}
        />
        {fieldErrors.briefSummary && (
          <p className="text-xs text-destructive">{fieldErrors.briefSummary}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted-foreground max-w-xs">
          Sending an inquiry does not advertise legal services or create a formal lawyer-client engagement.
        </p>
        <Button type="submit" disabled={submitting} size="lg" className="rounded-full px-7">
          {submitting ? "Sending..." : "Send Note"}
        </Button>
      </div>
    </form>
  );
}
