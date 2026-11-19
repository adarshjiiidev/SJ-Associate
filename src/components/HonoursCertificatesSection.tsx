import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Award,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  ImagePlus,
  ShieldCheck,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion } from "motion/react";
import {
  HONOURS_CERTIFICATES,
  type HonourCertificateItem,
} from "@/src/data/firmData";
import { FirmLogo } from "@/src/components/FirmLogo";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

const STORAGE_KEY = "sj_associates_certificates_v1";
const SCROLL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface HonoursCertificatesSectionProps {
  compact?: boolean;
}

export function HonoursCertificatesSection({
  compact = false,
}: HonoursCertificatesSectionProps) {
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});
  const [activePreview, setActivePreview] = useState<HonourCertificateItem | null>(null);
  const [previewMode, setPreviewMode] = useState<"scan" | "pdf">("scan");
  const [zoomed, setZoomed] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string>;
        if (parsed && typeof parsed === "object") {
          setUploadedImages(parsed);
        }
      }
    } catch {
      // Ignore invalid stored payload
    }
  }, []);

  function persistImages(next: Record<string, string>) {
    setUploadedImages(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota overflow if large scan is uploaded
    }
  }

  function handleFileChange(certId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        persistImages({ ...uploadedImages, [certId]: reader.result });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function removeCertificateImage(certId: string) {
    const next = { ...uploadedImages };
    delete next[certId];
    persistImages(next);
  }

  function openCertificateModal(item: HonourCertificateItem, mode: "scan" | "pdf") {
    setPreviewMode(mode);
    setZoomed(false);
    setActivePreview(item);
  }

  const cert = HONOURS_CERTIFICATES[0];
  const customImage = uploadedImages[cert.id];
  const displayImage = customImage || cert.defaultImage;

  return (
    <section
      id="honours-certificates"
      aria-labelledby="honours-certificates-heading"
      className={
        compact
          ? "py-4 space-y-8"
          : "relative bg-[#DAF6EF]/30 border-t border-border py-16 sm:py-20"
      }
    >
      <div className={compact ? "space-y-8" : "mx-auto max-w-[1280px] px-5 sm:px-6 space-y-10"}>
        <motion.div
          initial={{ opacity: 0.25, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.5, ease: SCROLL_EASE }}
          className={
            compact
              ? "flex flex-col md:flex-row md:items-end justify-between gap-4"
              : "mx-auto max-w-2xl text-center space-y-3"
          }
        >
          <div className={compact ? "space-y-2 max-w-2xl" : "space-y-3"}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#33566D]">
              Honours &amp; Bar Recognition
            </p>
            <h2
              id="honours-certificates-heading"
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A2536] leading-[0.98]"
              style={{ textWrap: "balance" }}
            >
              Honours &amp; Certificate
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#33566D] leading-relaxed">
            Judicial standing and 5-Year Distinguished Membership of the International Council of
            Jurists (London) conferred upon Advocate Sanjay Kumar Singh.
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0.25, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.48, ease: SCROLL_EASE }}
          className="mx-auto max-w-5xl rounded-[28px] border border-[#0A2536]/15 bg-white p-6 sm:p-9 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-9 items-center"
        >
          {/* Left: Museum-Grade Double-Framed Archival Certificate Plate */}
          <div className="lg:col-span-6 space-y-3">
            <div
              onClick={() => openCertificateModal(cert, "scan")}
              className="relative aspect-[2190/1504] w-full overflow-hidden rounded-[20px] border-2 border-[#0A2536]/20 bg-gradient-to-br from-[#FBF6E9] via-[#F7EFE0] to-[#EFE2C8] p-2.5 sm:p-3.5 shadow-md cursor-pointer group"
            >
              {/* Inner gold/navy archival mat */}
              <div className="relative h-full w-full overflow-hidden rounded-[13px] border border-[#8C6D2E]/40 bg-[#FAF3E0] shadow-inner">
                {displayImage ? (
                  <>
                    <img
                      src={displayImage}
                      alt={`${cert.title} official certificate`}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A2536]/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0A2536]/90 px-3 py-1 text-[11px] font-semibold text-[#F3FAFF] shadow-sm">
                        <ZoomIn className="h-3.5 w-3.5 text-[#DAF6EF]" />
                        Click to Enlarge Certificate or View Official PDF
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="h-full w-full p-4 flex flex-col justify-between text-center">
                    <div className="h-full w-full rounded-[12px] border border-dashed border-[#33566D]/35 bg-white/80 px-5 py-5 flex flex-col items-center justify-center gap-3">
                      <div className="flex items-center gap-2.5">
                        <FirmLogo size={30} />
                        <Award className="h-5 w-5 text-[#0A2536]" aria-hidden="true" />
                      </div>
                      <p className="text-base font-extrabold text-[#0A2536] leading-snug">
                        {cert.issuingBody}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Caption strip under framed certificate */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-[#33566D]">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#0A2536]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0A2536]" />
                Original Certificate Scan &amp; PDF Document Attached
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider">
                Membership No. 471-A/2009 · 2026–2030
              </span>
            </div>
          </div>

          {/* Right: Editorial Citation, Verification Badges & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-5">
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DAF6EF] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0A2536]">
                  <Award className="h-3.5 w-3.5" />
                  {cert.category}
                </span>
                <span className="rounded-full border border-[#0A2536]/15 bg-[#F3FAFF] px-3 py-1 font-mono text-[10px] font-semibold text-[#33566D]">
                  {cert.code}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A2536] leading-tight">
                {cert.title}
              </h3>

              <p className="text-xs font-bold uppercase tracking-wider text-[#33566D]">
                {cert.recipient} · {cert.issuingAuthority}
              </p>

              <p className="text-sm text-[#33566D] leading-relaxed">
                {cert.citation}
              </p>

              {/* Structured Verification Metadata Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="rounded-2xl border border-[#0A2536]/10 bg-[#F3FAFF] px-3.5 py-2.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#33566D]">
                    Certificate &amp; Membership
                  </div>
                  <div className="text-xs font-bold text-[#0A2536] mt-0.5">
                    Cert. No. 2529 · Mem. 471-A/2009
                  </div>
                </div>
                <div className="rounded-2xl border border-[#0A2536]/10 bg-[#F3FAFF] px-3.5 py-2.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#33566D]">
                    Distinguished Term
                  </div>
                  <div className="text-xs font-bold text-[#0A2536] mt-0.5">
                    5 Years (2026 to 2030)
                  </div>
                </div>
                <div className="rounded-2xl border border-[#0A2536]/10 bg-[#F3FAFF] px-3.5 py-2.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#33566D]">
                    Registered Office
                  </div>
                  <div className="text-xs font-bold text-[#0A2536] mt-0.5">
                    134 Buckingham Palace Rd, London
                  </div>
                </div>
                <div className="rounded-2xl border border-[#0A2536]/10 bg-[#F3FAFF] px-3.5 py-2.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#33566D]">
                    Signatories
                  </div>
                  <div className="text-xs font-bold text-[#0A2536] mt-0.5">
                    Dr. Adish C. Aggarwala &amp; S. J. Marchington
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2.5">
              <input
                ref={(el) => {
                  fileInputRefs.current[cert.id] = el;
                }}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-label={`Upload image for ${cert.title}`}
                onChange={(e) => handleFileChange(cert.id, e)}
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCertificateModal(cert, "scan")}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-[#0A2536] px-5 py-2 text-xs font-bold text-[#F3FAFF] hover:bg-[#33566D] transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  Inspect Certificate
                </button>

                {cert.pdfUrl && (
                  <>
                    <button
                      type="button"
                      onClick={() => openCertificateModal(cert, "pdf")}
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-[#0A2536]/20 bg-[#DAF6EF]/70 px-4 py-2 text-xs font-bold text-[#0A2536] hover:bg-[#DAF6EF] transition-colors cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      View PDF Document
                    </button>

                    <a
                      href={cert.pdfUrl}
                      download="ICJ-Certificate-2529-Adv-Sanjay-Kumar-Singh.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-[#0A2536] hover:bg-[#F3FAFF] transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      Official PDF
                    </a>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[cert.id]?.click()}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-border bg-[#F3FAFF] px-3.5 py-1.5 text-[11px] font-semibold text-[#33566D] hover:text-[#0A2536] hover:bg-[#DAF6EF]/50 transition-colors cursor-pointer"
                >
                  <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                  Replace Scan
                </button>
                {customImage && (
                  <button
                    type="button"
                    aria-label={`Remove uploaded certificate for ${cert.title}`}
                    onClick={() => removeCertificateImage(cert.id)}
                    className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-full border border-border bg-white text-[#33566D] hover:text-destructive transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.article>
      </div>

      {/* Enlarged Certificate & Embedded PDF Viewer Modal */}
      <Dialog
        open={Boolean(activePreview)}
        onOpenChange={(open) => {
          if (!open) setActivePreview(null);
        }}
      >
        <DialogContent className="max-w-4xl">
          {activePreview && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center justify-between gap-3 pr-6">
                  <div>
                    <DialogTitle>{activePreview.title}</DialogTitle>
                    <DialogDescription>
                      {activePreview.recipient} · {activePreview.verificationNote}
                    </DialogDescription>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[#F3FAFF] p-1">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("scan")}
                      className={`rounded-full px-3.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                        previewMode === "scan"
                          ? "bg-[#0A2536] text-[#F3FAFF]"
                          : "text-[#33566D] hover:text-[#0A2536]"
                      }`}
                    >
                      High-Res Certificate
                    </button>
                    {activePreview.pdfUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewMode("pdf")}
                        className={`rounded-full px-3.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                          previewMode === "pdf"
                            ? "bg-[#0A2536] text-[#F3FAFF]"
                            : "text-[#33566D] hover:text-[#0A2536]"
                        }`}
                      >
                        Embedded PDF
                      </button>
                    )}
                  </div>
                </div>
              </DialogHeader>

              {previewMode === "pdf" && activePreview.pdfUrl ? (
                <div className="overflow-hidden rounded-[16px] border border-border bg-[#0A2536]/5 h-[68vh] min-h-[420px] flex flex-col">
                  <iframe
                    src={activePreview.pdfUrl}
                    title={`${activePreview.title} Official PDF`}
                    className="w-full flex-1 border-0"
                  />
                </div>
              ) : (
                <div className="relative overflow-auto rounded-[16px] border-2 border-[#0A2536]/15 bg-[#FAF3E0] max-h-[70vh] flex items-center justify-center p-3">
                  {uploadedImages[activePreview.id] || activePreview.defaultImage ? (
                    <img
                      src={uploadedImages[activePreview.id] || activePreview.defaultImage}
                      alt={`${activePreview.title} certificate full view`}
                      onClick={() => setZoomed((z) => !z)}
                      className={`transition-all duration-300 cursor-zoom-in rounded-lg shadow-sm ${
                        zoomed ? "w-[1400px] max-w-none cursor-zoom-out" : "w-full h-auto object-contain"
                      }`}
                    />
                  ) : (
                    <div className="p-8 text-center space-y-4 max-w-md">
                      <Button
                        type="button"
                        onClick={() => fileInputRefs.current[activePreview.id]?.click()}
                        className="rounded-full"
                      >
                        <ImagePlus className="h-4 w-4" aria-hidden="true" />
                        Attach Certificate Image
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-xs text-[#33566D]">
                  Certificate No. 2529 · Membership No. 471-A/2009 · Valid 2026–2030
                </div>
                <div className="flex items-center gap-2">
                  {previewMode === "scan" && (
                    <button
                      type="button"
                      onClick={() => setZoomed((z) => !z)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[#F3FAFF] px-3.5 py-1.5 text-xs font-bold text-[#0A2536] hover:bg-[#DAF6EF] transition-colors cursor-pointer"
                    >
                      {zoomed ? (
                        <>
                          <ZoomOut className="h-3.5 w-3.5" />
                          Fit to Window
                        </>
                      ) : (
                        <>
                          <ZoomIn className="h-3.5 w-3.5" />
                          Zoom 150%
                        </>
                      )}
                    </button>
                  )}
                  {activePreview.pdfUrl && (
                    <a
                      href={activePreview.pdfUrl}
                      download="ICJ-Certificate-2529-Adv-Sanjay-Kumar-Singh.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#0A2536] px-4 py-1.5 text-xs font-bold text-[#F3FAFF] hover:bg-[#33566D] transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Official PDF
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
