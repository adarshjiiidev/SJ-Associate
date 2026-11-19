export interface PracticeAreaItem {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  statutes: string;
  summary: string;
  representationScope: string[];
  typicalForums: string[];
  landmarkContext: string;
}

export interface CounselMember {
  id: string;
  name: string;
  designation: string;
  enrollmentNote: string;
  primaryForums: string;
  practiceFocus: string[];
  bio: string;
}

export interface ChambersMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ChambersOffice {
  id: string;
  title: string;
  city: string;
  addressLines: string[];
  phone: string;
  email: string;
  courtProximity: string;
  consultationHours: string;
}

export interface HonourCertificateItem {
  id: string;
  slotNumber: string;
  year: string;
  code: string;
  title: string;
  recipient: string;
  issuingBody: string;
  issuingAuthority: string;
  seat: string;
  citation: string;
  category: string;
  verificationNote: string;
  defaultImage?: string;
  pdfUrl?: string;
}

export const FIRM_IDENTITY = {
  name: "SJ Associates",
  monogram: "SJA",
  tagline: "Advocates & Tax Consultants · GST, Income Tax & Registrations",
  barComplianceLine:
    "Published in compliance with the Bar Council of India Rules. Factual information on GST, Income Tax, appellate practice, registrations, and court forums.",
  establishedYear: "2009",
  headquarters: "Rani Bagh / Pitampura, New Delhi",
  directPhone: "+91 97163 18400",
  secondaryPhone: "+91 98182 98983",
  chambersEmail: "services@sjalaw.in",
  websiteUrl: "https://sjalaw.in",
  heroPortraitUrl: "/advocate-sanjay-singh.png",
  principalAdvocate: {
    name: "Adv. Sanjay Kumar Singh",
    salutation: "Principal Counsel & Founder",
    experienceYears: "15+ Years Standing at the Bar",
    credentials:
      "Advocate, Delhi High Court · Distinguished Member, International Council of Jurists (London)",
    primarySeats:
      "Supreme Court of India · GSTAT Principal Bench · Delhi High Court · Commissioner (Appeals) & Tax Authorities",
    chamberLocation:
      "A-40, Rishi Nagar, Captain Satish Marg, Rani Bagh North West, Delhi – 110034",
  },
};

export const PRINCIPAL_ADVOCATE = {
  name: "Adv. Sanjay Kumar Singh",
  title: "Advocate, Delhi High Court",
  designation: "Founder & Principal Counsel, SJ Associates",
  firm: "SJ Associates",
  membership: "Member of International Council Of Jurists",
  standing: "15+ Years of Active Tax, Appellate & Registration Practice",
  education:
    "Certificate No. 2529 · ICJ Membership No. 471-A/2009 · Bar Council of Delhi",
  barEnrollment:
    "Delhi High Court · GSTAT Principal Bench · Supreme Court of India · International Council of Jurists (2026–2030)",
  portraitUrl: "/advocate-sanjay-singh.png",
  quote:
    "Effective tax and legal representation demands precision at every stage—from the first registration or Show Cause Notice reply to appellate arguments before the Commissioner, GSTAT, and the High Courts.",
  overview: [
    "SJ Associates is a New Delhi tax, appellate, and legal chambers led by Adv. Sanjay Kumar Singh, practicing at the High Court of Delhi and registered as a Distinguished Member of the International Council of Jurists (London).",
    "Our chambers work is organized across three focused sections: 1. GST & Tax (GST Registration, GST Return Filing, SCN Reply, GSTAT Appeal, Commissioner Appeal, and High Court Appeal), 2. Income Tax (Income Tax Return Filing, TDS Return Filing, Income Tax Consultancy, and Other Direct Tax Matters), and 3. Others (Accounting & Bookkeeping, DGFT Work, MSME Registration, Trademark Registration, and Partnership Firm Registration).",
  ],
  keyHighlights: [
    "Section 01 — GST & Tax: Registration, Return Filing, SCN Reply, GSTAT Appeal, Commissioner Appeal & High Court Appeal",
    "Section 02 — Income Tax: Return Filing (ITR), TDS Return Filing, Income Tax Consultancy & Other Matters",
    "Section 03 — Others: Accounting & Bookkeeping, DGFT Work, MSME Registration, Trademark Registration & Partnership Firm Registration",
    "Distinguished Member of the International Council of Jurists (Cert. No. 2529 · Membership No. 471-A/2009)",
  ],
};

export const CHAMBERS_METRICS: ChambersMetric[] = [
  {
    label: "Courts & Tribunals With Live Reports",
    value: "13",
    detail: "Supreme Court, GSTAT & 11 High Courts with direct RSS updates",
  },
  {
    label: "Specialized Services Across 3 Sections",
    value: "15",
    detail: "6 GST & Tax · 4 Income Tax · 5 Accounting, DGFT & Registrations",
  },
  {
    label: "Delhi & Regional Tax Offices Covered",
    value: "17+",
    detail: "Delhi GST/ITO/DGFT/TM Offices & Regional Tax Offices near High Courts",
  },
  {
    label: "Core Practice Sections",
    value: "3",
    detail: "1. GST & Tax · 2. Income Tax · 3. Others (Accounts, DGFT & Registrations)",
  },
];

export const PRACTICE_AREAS: PracticeAreaItem[] = [
  {
    id: "gst-and-tax-practice",
    number: "01",
    title: "GST & Tax — Registration, Return Filing & SCN Reply",
    shortTitle: "GST Registration, Returns & SCN Reply",
    statutes:
      "Delhi High Court (Tax Bench) · GSTAT · Vyapar Bhawan GST & CGST Offices",
    summary:
      "Complete Goods and Services Tax compliance and departmental defence: fresh & multi-state GST Registration, monthly and annual GST Return Filing (GSTR-1, GSTR-3B, GSTR-9/9C), and comprehensive replies to Show Cause Notices (SCN / DRC-01 / ASMT-10).",
    representationScope: [
      "GST Registration, amendment of core/non-core fields & revocation of cancelled GSTIN (REG-21)",
      "Monthly, quarterly & annual GST Return Filing with GSTR-2B Input Tax Credit (ITC) reconciliation",
      "Show Cause Notice (SCN) replies in Form DRC-06 under Section 73/74, ASMT-10 scrutiny & personal hearings",
    ],
    typicalForums: [
      "Vyapar Bhawan Delhi GST & Central CGST Commissionerates",
      "Regional GST Offices near High Courts across India",
    ],
    landmarkContext:
      "A structured Show Cause Notice reply supported by reconciled GSTR-2B ledgers and judicial precedents protects taxpayers at adjudication and builds the record for appeal.",
  },
  {
    id: "gst-appellate-litigation",
    number: "02",
    title: "GST & Tax — GSTAT Appeal, Commissioner Appeal & High Court Appeal",
    shortTitle: "GSTAT, Commissioner & High Court Appeals",
    statutes:
      "GSTAT Principal Bench · Commissioner (Appeals) · Delhi High Court & Supreme Court",
    summary:
      "Three-tier appellate advocacy contesting wrongful GST demands, ITC blocks, refund rejections, and detention penalties before the Commissioner (Appeals), the GST Appellate Tribunal (GSTAT), and the High Courts.",
    representationScope: [
      "Commissioner (Appeals): Section 107 First Appeals (Form GST APL-01), stay of demand & hearings",
      "GSTAT Appeal: Section 112 Second Appeals (Form GST APL-05) before GST Appellate Tribunal benches",
      "High Court Appeal & Article 226 Writ Petitions challenging jurisdictional errors & bank attachments",
    ],
    typicalForums: [
      "Commissioner (Appeals) Delhi & Regional Benches",
      "GSTAT Principal Bench New Delhi · High Court of Delhi & Supreme Court",
    ],
    landmarkContext:
      "Seamless appellate representation from First Appeal before the Commissioner (Appeals) to GSTAT Second Appeals and High Court tax writs.",
  },
  {
    id: "income-tax-filings-and-tds",
    number: "03",
    title: "Income Tax — Return Filing (ITR) & TDS Return Filing",
    shortTitle: "Income Tax & TDS Return Filing",
    statutes:
      "Income Tax Department · Pratyaksh Kar Bhawan (ITO / Civic Centre) · TRACES",
    summary:
      "Accurate Income Tax Return (ITR-1 to ITR-7) filing and quarterly TDS Return filing (24Q, 26Q, 27Q, 27EQ) for businesses, firms, professionals, and individuals with complete AIS/TIS and Form 26AS reconciliation.",
    representationScope: [
      "Income Tax Return Filing (ITR-1 to ITR-7), tax audit reports & financial statement schedules",
      "Quarterly TDS Return Filing (Forms 24Q, 26Q, 27Q, 27EQ), Form 16/16A & TRACES default resolution",
      "AIS/TIS, Form 26AS & annual GST turnover reconciliation, updated returns (ITR-U) & lower TDS certificates",
    ],
    typicalForums: [
      "Pratyaksh Kar Bhawan (Civic Centre / ITO New Delhi) & CPC / TRACES",
      "Regional Income Tax Offices (Aayakar Bhawan) across India",
    ],
    landmarkContext:
      "Synchronizing ITR schedules, TDS statements, Form 26AS/AIS, and GST returns eliminates automated demand intimations.",
  },
  {
    id: "income-tax-consultancy-and-matters",
    number: "04",
    title: "Income Tax — Consultancy, Assessments & Other Matters",
    shortTitle: "Income Tax Consultancy & Other Matters",
    statutes:
      "NFAC · CIT (Appeals) · ITAT Delhi Benches · High Court Tax Benches",
    summary:
      "Year-round Income Tax Consultancy, direct tax planning, and representation in faceless scrutiny assessments (Section 143(3)), Section 148/148A reassessment notices, CIT(Appeals), and other direct tax matters.",
    representationScope: [
      "Income Tax Consultancy: Tax planning, capital gains exemptions (Sec. 54/54F) & partnership structuring",
      "Scrutiny assessment replies (Sec. 142(1) / 143(2)) & Section 148A/148 reassessment defense",
      "CIT(Appeals) Form 35 appeals, Section 154 rectifications, penalty defense & stay of demand petitions",
    ],
    typicalForums: [
      "National Faceless Assessment / Appeal Centre (NFAC) & Jurisdictional ITOs",
      "ITAT Benches & High Court Tax Division Benches",
    ],
    landmarkContext:
      "Evidence-backed written submissions in faceless assessments and reassessment proceedings safeguard assessees against arbitrary additions.",
  },
  {
    id: "accounting-bookkeeping-and-dgft",
    number: "05",
    title: "Others — Accounting & Bookkeeping and DGFT Work",
    shortTitle: "Accounting, Bookkeeping & DGFT Work",
    statutes:
      "DGFT CLA (ITO New Delhi) · Vanijya Bhawan · Regional DGFT & Customs Offices",
    summary:
      "Systematic Accounting & Bookkeeping kept ready for GST and Income Tax audits, paired with complete Directorate General of Foreign Trade (DGFT) representation for importers and exporters.",
    representationScope: [
      "Accounting & Bookkeeping: Monthly ledgers, bank reconciliation, trial balance & P&L / Balance Sheet preparation",
      "DGFT Work: Import Export Code (IEC) issuance & modification, Advance Authorization & EPCG licenses",
      "RoDTEP / RoSCTL scrips, EODC redemption, RCMC registration & DGFT Show Cause Notice replies",
    ],
    typicalForums: [
      "DGFT CLA Office (ITO, New Delhi) & Vanijya Bhawan",
      "Zonal & Regional DGFT Offices (Mumbai, Kolkata, Chennai, Ahmedabad, Jaipur, Ludhiana)",
    ],
    landmarkContext:
      "Audit-ready accounting books combined with compliant DGFT authorizations ensure smooth export refunds and customs clearances.",
  },
  {
    id: "msme-trademark-partnership-registrations",
    number: "06",
    title: "Others — MSME, Trademark & Partnership Firm Registration",
    shortTitle: "MSME, Trademark & Partnership Registration",
    statutes:
      "Trade Marks Registry (Dwarka, New Delhi) · Registrar of Firms · Ministry of MSME",
    summary:
      "End-to-end statutory registration desk handling MSME (Udyam) Registration, Trademark Registration & examination replies, and Partnership Firm Registration & deed drafting.",
    representationScope: [
      "MSME Registration: Udyam Registration certificate, NIC classification & MSME Samadhaan delayed-payment filings",
      "Trademark Registration: Brand search, TM-A filing (Classes 1–45), Section 9/11 objection replies & hearings",
      "Partnership Firm Registration: Partnership Deed drafting, Registrar of Firms (ROF) registration & reconstitution deeds",
    ],
    typicalForums: [
      "Trade Marks Registry (Dwarka, New Delhi & Regional Offices)",
      "Registrar of Firms (Delhi & State Registrars) & MSME Facilitation Councils",
    ],
    landmarkContext:
      "Registered Partnership Deeds, MSME Udyam certificates, and registered Trademarks secure statutory priority and enforceable brand rights.",
  },
];

export type SolutionCategory = "GST & Tax" | "Income Tax" | "Others";

export interface CorporateSolutionItem {
  id: string;
  category: SolutionCategory;
  title: string;
  subtitle: string;
  authorityTag: string;
  turnaroundTag: string;
  timelineOrStatute: string;
  description: string;
  deliverables: string[];
  practiceAreaId: string;
  featured?: boolean;
}

export const PRACTICE_SECTION_SUMMARY: Array<{
  category: SolutionCategory;
  code: string;
  title: string;
  serviceCount: number;
  weightPercent: number;
  tagline: string;
  items: string[];
}> = [
  {
    category: "GST & Tax",
    code: "01 · GST & TAX",
    title: "GST & Tax (6 Services)",
    serviceCount: 6,
    weightPercent: 40,
    tagline:
      "Registration, Return Filing, SCN Reply, GSTAT Appeal, Commissioner Appeal & High Court Appeal",
    items: [
      "GST Registration",
      "GST Return Filing",
      "SCN Reply",
      "GSTAT Appeal",
      "Commissioner Appeal",
      "High Court Appeal",
    ],
  },
  {
    category: "Income Tax",
    code: "02 · INCOME TAX",
    title: "Income Tax (4 Services)",
    serviceCount: 4,
    weightPercent: 27,
    tagline:
      "Income Tax Return Filing, TDS Return Filing, Income Tax Consultancy & Other Matters",
    items: [
      "Return Filing (ITR)",
      "TDS Return Filing",
      "Income Tax Consultancy",
      "Other Matters",
    ],
  },
  {
    category: "Others",
    code: "03 · OTHERS",
    title: "Others (5 Services)",
    serviceCount: 5,
    weightPercent: 33,
    tagline:
      "Accounting & Bookkeeping, DGFT Work, MSME Registration, Trademark Registration & Partnership Firm Registration",
    items: [
      "Accounting & Bookkeeping",
      "DGFT Work",
      "MSME Registration",
      "Trademark Registration",
      "Partnership Firm Registration",
    ],
  },
];

export const CORPORATE_SOLUTIONS: CorporateSolutionItem[] = [
  // ============================================================================
  // SECTION 1: GST & Tax (6 items)
  // ============================================================================
  {
    id: "gst-registration",
    category: "GST & Tax",
    title: "GST Registration",
    subtitle: "Fresh GSTIN, Multi-State Setup & Revocation",
    authorityTag: "GSTN · DELHI & STATE GST",
    turnaroundTag: "REG-01 & REG-21 Revocation",
    timelineOrStatute: "Sec. 22–30 CGST Act",
    description:
      "Fresh GST Registration (REG-01), core/non-core amendments, additional place of business setup, LUT filing for exports, and revocation of cancelled GST registration (REG-21).",
    deliverables: [
      "Fresh GST Registration & Principal/Additional Place Verification",
      "Core & Non-Core GSTIN Amendments & Revocation (REG-21)",
    ],
    practiceAreaId: "gst-and-tax-practice",
    featured: true,
  },
  {
    id: "gst-return-filing",
    category: "GST & Tax",
    title: "GST Return Filing",
    subtitle: "GSTR-1, GSTR-3B, ITC Matching & GSTR-9/9C",
    authorityTag: "GSTN · CBIC",
    turnaroundTag: "Monthly, QRMP & Annual",
    timelineOrStatute: "Sec. 37–44 CGST Act",
    description:
      "GSTR-1, GSTR-3B, GSTR-9/9C annual reconciliation, GSTR-2B Input Tax Credit (ITC) audit matching, and refund filings.",
    deliverables: [
      "Monthly & Quarterly GSTR-1, IFF, and GSTR-3B Return Filing",
      "GSTR-2B ITC Reconciliation & Annual GSTR-9 / GSTR-9C Filing",
    ],
    practiceAreaId: "gst-and-tax-practice",
  },
  {
    id: "scn-reply",
    category: "GST & Tax",
    title: "SCN Reply (Show Cause Notice)",
    subtitle: "DRC-01, ASMT-10 Scrutiny & Sec. 73/74 Replies",
    authorityTag: "CGST · SGST ADJUDICATION",
    turnaroundTag: "Sec. 73 / 74 & DRC-06",
    timelineOrStatute: "Sec. 61, 73 & 74 CGST Act",
    description:
      "Drafting comprehensive legal replies and appearing in personal hearings for GST Show Cause Notices (DRC-01), ASMT-10 return scrutiny, ITC mismatch demands, and Rule 86A credit blocks.",
    deliverables: [
      "Detailed Legal Reply in Form DRC-06 to Section 73/74 SCNs",
      "ASMT-10 Scrutiny Replies & Personal Hearing Representation",
    ],
    practiceAreaId: "gst-and-tax-practice",
  },
  {
    id: "gstat-appeal",
    category: "GST & Tax",
    title: "GSTAT Appeal",
    subtitle: "GST Appellate Tribunal Second Appeals",
    authorityTag: "GSTAT · CGST SEC. 112",
    turnaroundTag: "Sec. 112 / APL-05 Appeals",
    timelineOrStatute: "Sec. 112 CGST Act",
    description:
      "Second-level appellate representation under Section 112 of the CGST Act against orders of First Appellate (Sec. 107) and Revisional Authorities (Sec. 108)—including GSTAT e-Filing Portal submissions and hearing arguments.",
    deliverables: [
      "Form GST APL-05 Appeal Memorandum & Paperbook Filing",
      "Pre-Deposit Compliance, Stay Petitions & GSTAT Bench Hearings",
    ],
    practiceAreaId: "gst-appellate-litigation",
  },
  {
    id: "commissioner-appeal",
    category: "GST & Tax",
    title: "Commissioner (Appeals)",
    subtitle: "First Appellate Authority Representation",
    authorityTag: "COMMISSIONER (APPEALS) · SEC. 107",
    turnaroundTag: "Form GST APL-01 First Appeal",
    timelineOrStatute: "Sec. 107 CGST Act",
    description:
      "First appeals under Section 107 of the CGST Act before the Commissioner (Appeals) challenging adjudication demands, penalty orders, refund rejections, and registration cancellations.",
    deliverables: [
      "Statement of Facts, Grounds of Appeal & Form GST APL-01 Filing",
      "Written Submissions & Personal Hearing Arguments",
    ],
    practiceAreaId: "gst-appellate-litigation",
  },
  {
    id: "high-court-appeal",
    category: "GST & Tax",
    title: "High Court Appeal & Writ",
    subtitle: "Article 226 Tax Writs & High Court Appeals",
    authorityTag: "DELHI HC · HIGH COURTS",
    turnaroundTag: "Art. 226 Writ & Sec. 117 Appeal",
    timelineOrStatute: "Art. 226 Constitution · Sec. 117 CGST",
    description:
      "Constitutional Writ Petitions under Article 226 and High Court Tax Appeals challenging jurisdictional defects, natural justice violations, retrospective GST cancellations, and provisional bank attachments.",
    deliverables: [
      "Article 226 Writ Petitions against Arbitrary / Unsigned Tax Orders",
      "Urgent Stay Applications & High Court Tax Bench Arguments",
    ],
    practiceAreaId: "gst-appellate-litigation",
  },

  // ============================================================================
  // SECTION 2: Income Tax (4 items)
  // ============================================================================
  {
    id: "itr-return-filing",
    category: "Income Tax",
    title: "Income Tax Return Filing",
    subtitle: "ITR-1 to ITR-7 & Tax Audit Filings",
    authorityTag: "INCOME TAX · CBDT",
    turnaroundTag: "Annual ITR & Tax Audit",
    timelineOrStatute: "Sec. 139 & 44AB Income-tax Act",
    description:
      "Complete Income Tax Return (ITR-1 to ITR-7) computation and filing for proprietors, professionals, partnership firms, LLPs, companies, and salaried individuals with Form 26AS and AIS/TIS reconciliation.",
    deliverables: [
      "ITR-1 to ITR-7 Filing with AIS/TIS & 26AS Reconciliation",
      "Capital Gains Computation, Balance Sheet Schedules & ITR-U",
    ],
    practiceAreaId: "income-tax-filings-and-tds",
  },
  {
    id: "tds-return-filing",
    category: "Income Tax",
    title: "TDS Return Filing",
    subtitle: "Quarterly 24Q, 26Q, 27Q, 27EQ & TRACES",
    authorityTag: "TRACES · NSDL",
    turnaroundTag: "Quarterly TDS & Form 16/16A",
    timelineOrStatute: "Sec. 192–206C Income-tax Act",
    description:
      "Quarterly TDS and TCS return filing (Forms 24Q, 26Q, 27Q, 27EQ), challan verification, Form 16/16A issuance, correction statements, and TRACES default resolution.",
    deliverables: [
      "Quarterly 24Q, 26Q, 27Q & 27EQ Returns & Challan Matching",
      "Form 16 / 16A Generation & TRACES Demand Rectification",
    ],
    practiceAreaId: "income-tax-filings-and-tds",
  },
  {
    id: "income-tax-consultancy",
    category: "Income Tax",
    title: "Income Tax Consultancy",
    subtitle: "Direct Tax Planning, Structuring & Advisory",
    authorityTag: "DIRECT TAX · ADVISORY DESK",
    turnaroundTag: "Year-Round Tax Advisory",
    timelineOrStatute: "Income-tax Act, 1961",
    description:
      "Year-round Income Tax Consultancy on business deductions, tax regime evaluation, capital gains exemptions (Sec. 54/54EC/54F), partnership remuneration structuring, and withholding compliance.",
    deliverables: [
      "Direct Tax Planning, Advance Tax & Capital Gains Advisory",
      "Written Legal Opinions on Deductions & Withholding Tax",
    ],
    practiceAreaId: "income-tax-consultancy-and-matters",
  },
  {
    id: "other-income-tax-matters",
    category: "Income Tax",
    title: "Other Income Tax Matters",
    subtitle: "Scrutiny Assessments, Sec. 148 Notices & CIT(A)",
    authorityTag: "NFAC · CIT(A) · ITAT",
    turnaroundTag: "Sec. 143(3) / 148 & Appeals",
    timelineOrStatute: "Sec. 143(3), 148, 154 & 246A",
    description:
      "Representation in faceless scrutiny assessments (Sec. 143(2)/143(3)), Section 148A/148 reassessment notices, CIT(Appeals) Form 35 filings, Section 154 rectifications, and stay of demand petitions.",
    deliverables: [
      "Faceless Scrutiny & Section 148A/148 Reassessment Replies",
      "CIT(Appeals) Form 35 Filings, Rectifications & Penalty Defense",
    ],
    practiceAreaId: "income-tax-consultancy-and-matters",
  },

  // ============================================================================
  // SECTION 3: Others (5 items)
  // ============================================================================
  {
    id: "accounting-bookkeeping",
    category: "Others",
    title: "Accounting & Bookkeeping",
    subtitle: "Audit-Ready Ledgers & Financial Statements",
    authorityTag: "BOOKS · AUDIT COMPLIANCE",
    turnaroundTag: "Monthly & Annual Books",
    timelineOrStatute: "GST & Income Tax Synchronized Books",
    description:
      "End-to-end Accounting & Bookkeeping in Tally Prime, Zoho Books, or Busy—covering sales/purchase registers, bank reconciliation, GST/TDS ledger balancing, Trial Balance, P&L, and Balance Sheet.",
    deliverables: [
      "Monthly Ledger Maintenance & Bank / Vendor Reconciliations",
      "Trial Balance, Profit & Loss & Balance Sheet Preparation",
    ],
    practiceAreaId: "accounting-bookkeeping-and-dgft",
  },
  {
    id: "dgft-work",
    category: "Others",
    title: "DGFT Work (IEC & Export-Import)",
    subtitle: "IEC Code, Advance Auth, EPCG & RoDTEP",
    authorityTag: "DGFT · CUSTOMS",
    turnaroundTag: "IEC, Advance Auth & EPCG",
    timelineOrStatute: "FTDR Act, 1992 · Foreign Trade Policy",
    description:
      "Import Export Code (IEC) issuance, IEC modification, LUT/bond compliance, Advance Authorization, EPCG license redemption (EODC), RoDTEP scrips, and DGFT show-cause representation.",
    deliverables: [
      "IEC Registration/Modification, Advance Authorization & EPCG",
      "EODC Redemption, RoDTEP Scrips & DGFT Notice Replies",
    ],
    practiceAreaId: "accounting-bookkeeping-and-dgft",
  },
  {
    id: "msme-registration",
    category: "Others",
    title: "MSME Registration",
    subtitle: "Udyam Certificate & MSME Benefits",
    authorityTag: "MINISTRY OF MSME · UDYAM",
    turnaroundTag: "Udyam Certificate & Samadhaan",
    timelineOrStatute: "MSMED Act, 2006",
    description:
      "MSME Udyam Registration certificate issuance for manufacturing and service enterprises, NIC activity mapping, turnover/investment updates, and MSME Samadhaan delayed-payment recovery advisory.",
    deliverables: [
      "Fresh MSME Udyam Registration & NIC Classification",
      "Sec. 43B(h) Compliance & MSME Samadhaan Recovery Filings",
    ],
    practiceAreaId: "msme-trademark-partnership-registrations",
  },
  {
    id: "trademark-registration",
    category: "Others",
    title: "Trademark Registration",
    subtitle: "TM Search, TM-A Filing & Objection Replies",
    authorityTag: "IP INDIA · TRADE MARKS REGISTRY",
    turnaroundTag: "Classes 1–45 · TM-A & Hearings",
    timelineOrStatute: "Trade Marks Act, 1999",
    description:
      "Public trademark availability search, Form TM-A filing across Classes 1 to 45, legal replies to Section 9 & 11 Examination Report objections, show-cause hearing appearances, and renewals.",
    deliverables: [
      "Trademark Search & Form TM-A Application Filing",
      "Sec. 9/11 Examination Report Replies & Registry Hearings",
    ],
    practiceAreaId: "msme-trademark-partnership-registrations",
  },
  {
    id: "partnership-registration",
    category: "Others",
    title: "Partnership Firm Registration",
    subtitle: "Partnership Deed Drafting & ROF Registration",
    authorityTag: "REGISTRAR OF FIRMS · ACT 1932",
    turnaroundTag: "Deed Drafting & ROF Certificate",
    timelineOrStatute: "Indian Partnership Act, 1932",
    description:
      "Drafting of Partnership Deeds (capital, profit-sharing, Section 40(b) remuneration clauses), stamp paper execution, Form I registration with the Registrar of Firms (ROF), and PAN/TAN/GST setup.",
    deliverables: [
      "Custom Partnership Deed Drafting & ROF Form I Registration",
      "Reconstitution / Admission-Retirement Deeds & Firm PAN/GST",
    ],
    practiceAreaId: "msme-trademark-partnership-registrations",
  },
];

export const COUNSEL_TEAM: CounselMember[] = [
  {
    id: "adv-sanjay-singh",
    name: "Adv. Sanjay Kumar Singh",
    designation: "Founder & Principal Counsel",
    enrollmentNote:
      "Advocate, Delhi High Court · Distinguished Member, International Council of Jurists (Cert. No. 2529)",
    primaryForums:
      "Supreme Court of India · GSTAT Principal Bench · Delhi High Court · Commissioner (Appeals)",
    practiceFocus: [
      "GST Registration, Returns, SCN Reply & GSTAT/HC Appeals",
      "Income Tax Return, TDS, Consultancy & Assessments",
      "Accounting, DGFT Work, MSME, Trademark & Partnership",
    ],
    bio: "Founder of SJ Associates practicing before the High Court of Delhi, GSTAT, and Tax Authorities across three dedicated wings: GST & Tax, Income Tax, and Accounting/DGFT/Registrations.",
  },
  {
    id: "adv-rajesh-verma",
    name: "Adv. Rajesh Verma",
    designation: "Senior Associate — GST & Appellate Desk",
    enrollmentNote: "Enrolled Bar Council of Delhi · High Court & Tax Bar",
    primaryForums:
      "GSTAT Principal Bench · Commissioner (Appeals) · Delhi & Punjab & Haryana High Courts",
    practiceFocus: [
      "GST Show Cause Notice (DRC-01 / Sec. 73 & 74) Replies",
      "Commissioner (Appeals) APL-01 & GSTAT APL-05 Appeals",
      "High Court Tax Appeals & Article 226 Writs",
    ],
    bio: "Handles GST adjudication replies, First Appeals before the Commissioner (Appeals), Second Appeals before GSTAT, and High Court tax writ litigation.",
  },
  {
    id: "adv-meera-kulkarni",
    name: "Adv. Meera Kulkarni",
    designation: "Associate Counsel — Income Tax & Registrations Desk",
    enrollmentNote: "Enrolled Bar Council of Delhi · Tax & Trademark Bar",
    primaryForums:
      "Income Tax Authorities · CIT(Appeals) · Trade Marks Registry Dwarka · DGFT CLA Delhi",
    practiceFocus: [
      "Income Tax Return (ITR) & Quarterly TDS Return Filing",
      "Income Tax Consultancy & Assessment Matters",
      "Accounting, DGFT, MSME, Trademark & Partnership Registration",
    ],
    bio: "Leads chambers' Income Tax filing and consultancy desk alongside Accounting & Bookkeeping, DGFT export-import work, MSME, Trademark, and Partnership Firm registrations.",
  },
];

export const CHAMBERS_OFFICES: ChambersOffice[] = [
  {
    id: "new-delhi-rani-bagh-hq",
    title: "Principal Chambers — Rani Bagh / Pitampura, Delhi",
    city: "New Delhi",
    addressLines: [
      "A-40, Rishi Nagar, Captain Satish Marg, Rani Bagh North West",
      "301, 3rd Floor, Lala Chhanu Mal Building, Rani Bagh Main Market, Pitampura",
      "Delhi – 110034, India",
    ],
    phone: "+91 97163 18400 / +91 98182 98983",
    email: "services@sjalaw.in",
    courtProximity:
      "Direct corridor to Rohini Courts, Vyapar Bhawan GST HQ, ITO Income Tax Office, GSTAT & Delhi High Court",
    consultationHours: "Monday – Saturday · 10:00 AM to 7:30 PM IST",
  },
  {
    id: "new-delhi-high-court-chambers",
    title: "Delhi High Court & GSTAT Filing Desk",
    city: "Central New Delhi",
    addressLines: [
      "Chambers Block, Delhi High Court Complex",
      "Sher Shah Road / Tilak Marg Judicial Corridor",
      "New Delhi – 110503",
    ],
    phone: "+91 97163 18400",
    email: "services@sjalaw.in",
    courtProximity:
      "Walking access to Delhi High Court, Supreme Court of India, GSTAT Principal Bench, Vyapar Bhawan & Pratyaksh Kar Bhawan",
    consultationHours: "Court Sitting Hours · 9:30 AM to 4:30 PM IST",
  },
  {
    id: "regional-high-court-tax-desk",
    title: "Regional High Courts & Tax Offices Desk",
    city: "Chandigarh · NCR · Jaipur · Prayagraj · Mumbai",
    addressLines: [
      "Coordinated Appearance & Regional Tax Office Network",
      "High Courts, GSTAT Benches & Nearby Regional GST / Income Tax Offices",
      "Pan-India Representation from New Delhi Chambers",
    ],
    phone: "+91 97163 18400",
    email: "services@sjalaw.in",
    courtProximity:
      "Covers all 13 Courts & nearby Regional GST Bhawans, Aayakar Bhawans, DGFT & Trademark Registries",
    consultationHours: "Prior Briefing & Case Conference via Principal Chambers",
  },
];

export const HONOURS_CERTIFICATES: HonourCertificateItem[] = [
  {
    id: "icj-distinguished-membership-2529",
    slotNumber: "01",
    year: "2026 – 2030",
    code: "CERT. NO. 2529 · MEM. NO. 471-A/2009",
    title: "Certificate of 5-Year Distinguished Membership — International Council of Jurists",
    recipient: "Mr. Sanjay Kumar Singh",
    issuingBody: "International Council of Jurists (134, Buckingham Palace Road, London, SW1W9SA)",
    issuingAuthority: "International Council of Jurists (London)",
    seat: "London · New Delhi (Rani Bagh, Delhi – 110034)",
    citation:
      "This is to certify that Mr. Sanjay Kumar Singh (A-40, Rishi Nagar, Captain Satish Marg, Rani Bagh North West, Delhi-110034) has been registered as Distinguished Member of the International Council of Jurists from 2026 to 2030 (Certificate No. 2529 · Membership No. 471-A/2009), signed by Dr. Adish C. Aggarwala (President, ICJ) and Sarah J. Marchington (Director, ICJ).",
    category: "International Jurists Honour",
    verificationNote: "Certificate No. 2529 · Membership No. 471-A/2009 · 2026 to 2030",
    defaultImage: "/assets/aistudio/icj-certificate-2529.jpg",
    pdfUrl: "/assets/aistudio/DocScanner_18_Nov_2026_04-09_pm_c291452f.pdf",
  },
];
