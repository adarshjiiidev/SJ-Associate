import { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { FirmLogo } from "@/src/components/FirmLogo";

const DISCLAIMER_STORAGE_KEY = "sj_associates_bci_disclaimer_agreed_v1";

export function BciDisclaimerModal() {
  const [agreed, setAgreed] = useState<boolean>(() => {
    try {
      return window.sessionStorage.getItem(DISCLAIMER_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [disagreed, setDisagreed] = useState<boolean>(false);

  useEffect(() => {
    if (!agreed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [agreed]);

  const handleAgree = () => {
    try {
      window.sessionStorage.setItem(DISCLAIMER_STORAGE_KEY, "true");
    } catch {
      // Ignore storage error in restricted environments
    }
    setDisagreed(false);
    setAgreed(true);
  };

  const handleDisagree = () => {
    setDisagreed(true);
  };

  if (agreed) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bci-disclaimer-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2536]/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
    >
      <div className="relative my-auto w-full max-w-3xl rounded-none border-2 border-[#0A2536] bg-[#F3FAFF] text-[#0A2536] shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3 border-b-2 border-[#0A2536] bg-[#DAF6EF] px-6 py-4 sm:px-8 rounded-none">
          <div className="flex items-center gap-3.5">
            <FirmLogo size={48} />
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#33566D]">
                BAR COUNCIL OF INDIA · STATUTORY NOTICE
              </div>
              <h2
                id="bci-disclaimer-title"
                className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2536] leading-none mt-0.5"
              >
                DISCLAIMER &amp; CONFIRMATION
              </h2>
            </div>
          </div>
          <ShieldAlert className="h-6 w-6 text-[#0A2536] shrink-0 hidden sm:block" aria-hidden="true" />
        </div>

        {/* Body Content */}
        {!disagreed ? (
          <div className="px-6 py-6 sm:px-8 sm:py-7 space-y-4 max-h-[70vh] overflow-y-auto text-xs sm:text-sm text-[#0A2536] leading-relaxed rounded-none">
            <p className="font-semibold text-[#0A2536]">
              As per the rules of the Bar Council of India, we are not permitted to solicit work and
              advertise. The user acknowledges the following:
            </p>

            <ul className="list-disc pl-5 space-y-2.5 text-[#33566D]">
              <li>
                There has been no advertisement, personal communication, solicitation, invitation or
                inducement of any sort whatsoever from us or any of our members to solicit any work
                through this website;
              </li>
              <li>
                The user wishes to gain more information about us for his/her own information and
                use;
              </li>
              <li>
                The information about us is provided to the user only on his/her specific request and
                any information obtained or materials downloaded from this website is completely at
                the user’s volition and any transmission, receipt or use of this site would not
                create any lawyer-client relationship.
              </li>
              <li>
                The information provided under this website is solely available at your request for
                information purpose only and should not be interpreted as soliciting or
                advertisement.
              </li>
            </ul>

            <p className="text-[#33566D] pt-3 border-t border-[#0A2536]/20">
              We are not liable for any consequence of any action taken by the user relying on
              material/information provided under this website. In cases where the user has any legal
              issues, he/she in all cases must seek independent legal advice, as the material
              contained in this document does not constitute/substitute professional advice that may
              be required before acting on any matter. Neither this website nor the web pages and the
              information contained herein constitute a contract, or will form the basis of a
              contract. While, every care has been taken in preparing the content of this website and
              web pages to ensure accuracy at the time of publication and creation, however,{" "}
              <strong className="font-bold text-[#0A2536]">S J Associates</strong> assumes no
              responsibility for any errors, which despite all precautions may be found herein. All
              disputes, if any, are subject to the exclusive jurisdiction of courts at New Delhi,
              India only.
            </p>
          </div>
        ) : (
          <div className="px-6 py-10 sm:px-8 text-center space-y-4 rounded-none">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-none border border-[#0A2536] bg-[#0A2536]/10 text-[#0A2536]">
              <XCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0A2536]">
              Confirmation Required to Enter Website
            </h3>
            <p className="max-w-lg mx-auto text-xs sm:text-sm text-[#33566D] leading-relaxed">
              In compliance with the rules of the Bar Council of India, access to the S J Associates
              website is available only upon confirming the Disclaimer &amp; Confirmation notice.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setDisagreed(false)}
                className="inline-flex items-center justify-center rounded-none border border-[#0A2536] bg-[#0A2536] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#F3FAFF] hover:bg-[#33566D] transition-colors cursor-pointer"
              >
                REVIEW DISCLAIMER AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions: I AGREE / I DISAGREE */}
        {!disagreed && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t-2 border-[#0A2536] bg-white px-6 py-4 sm:px-8 rounded-none">
            <button
              type="button"
              onClick={handleDisagree}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-none border-2 border-[#0A2536] bg-[#F3FAFF] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0A2536] hover:bg-[#DAF6EF] transition-colors cursor-pointer"
            >
              I DISAGREE
            </button>
            <button
              type="button"
              onClick={handleAgree}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-none border-2 border-[#0A2536] bg-[#0A2536] px-7 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#F3FAFF] hover:bg-[#33566D] transition-colors cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 text-[#DAF6EF]" aria-hidden="true" />
              I AGREE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
