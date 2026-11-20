import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUp, Mail, Phone } from "lucide-react";
import { COURT_IMAGES } from "../data/assets";
import { FIRM_IDENTITY } from "../data/firmData";
import { FirmLogo } from "./FirmLogo";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      {/* Top Pre-Footer Banner with 4 Floating Circular Court Photos (Exact Original UI from r11-footer.png) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F3FAFF] to-[#DAF6EF]/65 border-t border-border py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 relative">
          {/* Left Floating Circular Court Photos (Desktop) */}
          <div
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute left-6 top-1/2 -translate-y-1/2"
          >
            <div className="relative h-56 w-64">
              <div className="absolute left-0 top-0 h-32 w-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img
                  src={COURT_IMAGES["supreme-court-of-india"]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute left-16 top-16 h-40 w-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img
                  src={COURT_IMAGES["delhi-high-court"]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Floating Circular Court Photos (Desktop) */}
          <div
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute right-6 top-1/2 -translate-y-1/2"
          >
            <div className="relative h-56 w-64">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img
                  src={COURT_IMAGES["bombay-high-court"]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute right-20 top-20 h-28 w-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img
                  src={COURT_IMAGES["patna-high-court"]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Centered CTA Content */}
          <div className="mx-auto max-w-xl text-center space-y-5 relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#33566D]">
              ETHICS · HUMAN VALUES · EXCELLENCE
            </p>
            <h2
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A2536] leading-[0.98]"
              style={{ textWrap: "balance" }}
            >
              Ready To Discuss Your Matter?
            </h2>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/contact"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#0A2536] px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#F3FAFF] hover:bg-[#33566D] transition-colors"
              >
                BOOK CONSULTATION
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-border bg-white px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#0A2536] hover:bg-[#DAF6EF]/50 transition-colors"
              >
                <span>CONTACT OFFICE</span>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F3FAFF] text-[#0A2536]">
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dark Cape-Cod Footer (#0A2536) */}
      <div className="bg-[#0A2536] text-[#F3FAFF] py-14 sm:py-16">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Column 1: Brand & Counsel (5 cols) */}
            <div className="md:col-span-5 space-y-5">
              <div className="flex items-center gap-3.5">
                <FirmLogo size={54} variant="light" />
                <div>
                  <p className="text-lg font-light tracking-[0.22em] uppercase text-white leading-none">
                    SJ <strong className="font-semibold">ASSOCIATES</strong>
                  </p>
                  <p className="text-xs text-[#F3FAFF]/75 mt-1">
                    Adv. Sanjay Kumar Singh · Advocate, Delhi High Court
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#F3FAFF]/80 leading-relaxed max-w-sm">
                A multi-skilled, knowledge-based law and tax firm rendering
                advisory, compliance, and litigation services across Direct and
                Indirect Taxation, Corporate Law Practice, Labour Law
                Litigation, Civil Litigation, and Criminal Litigation before the
                Supreme Court, High Courts, Tribunals, and authorities across
                Delhi, Bihar, and India.
              </p>

              <div>
                <Link
                  to="/contact"
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#DAF6EF] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#0A2536] hover:bg-white transition-colors"
                >
                  BOOK CONSULTATION
                </Link>
              </div>
            </div>

            {/* Column 2: Quick Links (3 cols) */}
            <div className="md:col-span-3 space-y-3.5">
              <p className="text-xs text-[#F3FAFF]/70">Quick Links</p>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-[0.08em]">
                <li>
                  <Link to="/" className="hover:text-[#DAF6EF] transition-colors">
                    HOME
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courts"
                    className="hover:text-[#DAF6EF] transition-colors"
                  >
                    ALL COURTS
                  </Link>
                </li>
                <li>
                  <Link
                    to="/practice"
                    className="hover:text-[#DAF6EF] transition-colors"
                  >
                    WHAT WE DO (3 SECTIONS)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-[#DAF6EF] transition-colors"
                  >
                    ABOUT COUNSEL
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#DAF6EF] transition-colors"
                  >
                    CONTACT &amp; TAX OFFICES
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courts/supreme-court-of-india"
                    className="hover:text-[#DAF6EF] transition-colors"
                  >
                    SUPREME COURT LIVE
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courts/delhi-high-court"
                    className="hover:text-[#DAF6EF] transition-colors"
                  >
                    DELHI HIGH COURT LIVE
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mail"
                    className="text-[#DAF6EF] hover:underline transition-colors"
                  >
                    OFFICE WEBMAIL (/MAIL)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Us (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <p className="text-xs text-[#F3FAFF]/70">Contact Us</p>

              <div className="space-y-3">
                <a
                  href={`mailto:${FIRM_IDENTITY.chambersEmail}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#DAF6EF] group-hover:bg-[#DAF6EF] group-hover:text-[#0A2536] transition-colors">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.06em] text-white group-hover:text-[#DAF6EF] transition-colors">
                    SEND EMAIL · {FIRM_IDENTITY.chambersEmail.toUpperCase()}
                  </span>
                </a>

                <a
                  href="tel:+919716318400"
                  className="flex items-center gap-3 group"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#DAF6EF] group-hover:bg-[#DAF6EF] group-hover:text-[#0A2536] transition-colors">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.06em] text-white group-hover:text-[#DAF6EF] transition-colors">
                    MAKE A CALL · +91 97163 18400
                  </span>
                </a>
              </div>

              <p className="text-xs text-[#F3FAFF]/70 leading-relaxed pt-1">
                New Delhi: A-40, Rishi Nagar, Captain Satish Marg, Rani Bagh
                North West, Delhi – 110034 · Bihar: Krishna Shanti Sadan,
                Baikuntpuri, Bariya, Ward No. 1, Muzaffarpur, Bihar – 842003
              </p>
            </div>
          </div>

          {/* Bottom Copyright & Back to Top */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F3FAFF]/70">
            <p>
              © {new Date().getFullYear()} SJ Associates — Adv. Sanjay Kumar
              Singh | All Rights Reserved
            </p>
            <div className="flex items-center gap-6">
              <span className="underline underline-offset-4">
                Bar Council of India Notice
              </span>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-white hover:text-[#DAF6EF] cursor-pointer"
              >
                <span>BACK TO TOP</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5">
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
