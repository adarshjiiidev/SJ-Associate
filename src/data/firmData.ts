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
  name: "S J Associates",
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
  designation: "Founder & Advocate, Delhi High Court",
  firm: "S J Associates",
  membership: "Member of International Council of Jurists",
  standing: "15+ Years of Active Tax, Appellate & Registration Practice",
  education:
    "Certificate No. 2529 · ICJ Membership No. 471-A/2009 · Bar Council of Delhi",
  barEnrollment:
    "Delhi High Court · GSTAT Principal Bench · Supreme Court of India · International Council of Jurists (2026–2030)",
  portraitUrl: "/advocate-sanjay-singh.png",
  quote:
    "S J Associates strives to be a multi-skilled knowledge based law and tax firm, driven by ethics and human values, delivering excellence and value in the field of legal and taxation services.",
  overview: [
    "Set up in 2009, the growth of S J Associates (“Firm”) is a glowing tribute to its founder, Advocate Sanjay Kumar Singh. His visionary leadership, mentoring and hard work has helped the Firm to emerge as one of the well-known law and taxation firms in the country. Since its inception, it continues to serve a diverse clientele, including domestic and overseas businesses, industrial enterprises, partnership firms and individuals.",
    "Presently, the Firm has operations in New Delhi, Delhi NCR (including Ghaziabad, Noida, Gurugram and Faridabad) and Muzaffarpur (Bihar), alongside associates across major cities and High Court centres in India. With increasing complexity in the modern professional and business environment, the Firm is committed to providing high quality, flexible, client focused legal, taxation and business advisory services. Every passing year is memorable to us for its challenges, and the multitude of creative solutions that we provide to our clients.",
    "S J Associates is a dedicated law and taxation firm advising domestic and commercial clients for over fifteen years and providing a broad range of legal, taxation, regulatory and advisory services to the commercial, industrial and financial communities. S J Associates serves the need of both small and large businesses, ranging from basic start-up registration work to complex legal issues, tax litigation and regulatory matters.",
    "S J Associates draws its expertise from advocates and tax professionals who have gained experience nationally, having worked on varied taxation, appellate and regulatory assignments across India. The broad practice areas of S J Associates are Direct and Indirect Taxation (Goods and Services Tax ‘GST’, Customs, Income Tax, Corporate Tax, Wealth Tax & TDS), Corporate Law Practice, Labour Law Litigation, Civil Litigation, Criminal Litigation, Arbitration, GSTAT Appeals, High Court Litigation & Writs, Bookkeeping & Accounting, Foreign Trade Policy (DGFT Compliances), MSME Registration, Trademark Registration, Partnership Firm Registration and Company Registration. Our Firm brings together legal advocacy and specialized tax practice, providing an edge which is most critical for the success of commercial transactions.",
    "Client satisfaction is a cornerstone of our practice. We are proud of the recognition we have received from our clients for our commitment to service, and we value their satisfaction as the best measure of our success. S J Associates strives to be a multi-skilled knowledge based law and tax firm, driven by ethics and human values, delivering excellence and value in the field of legal and taxation services.",
    "Our mission is to be the most preferred law and tax firm within the Indian market, providing clients with qualitative and innovative professional advice in a time bound and cost effective manner, and providing advocates and tax professionals with a conducive environment for all round growth and development.",
  ],
  keyHighlights: [
    "Section 01 — Goods and Services Tax: Registration, Return Filing, SCN Reply, Commissioner Appeal, GSTAT Appeal & High Court Appeal",
    "Section 02 — Income Tax: Income Tax Consultancy, Income Tax Return Filing, TDS Return Filing, Corporate Tax, Wealth Tax & Assessment Matters",
    "Section 03 — Others: Bookkeeping & Accounting, DGFT Compliances, MSME, Trademark, Partnership Firm, Company Registration & Criminal & Civil Litigation",
    "Distinguished Member of the International Council of Jurists (Cert. No. 2529 · Membership No. 471-A/2009)",
  ],
};

export const CHAMBERS_METRICS: ChambersMetric[] = [
  {
    label: "Courts & Tribunals With Live Reports",
    value: "10",
    detail: "Supreme Court, GSTAT & 8 High Courts across North, West & East India",
  },
  {
    label: "Specialized Services Across 3 Sections",
    value: "17",
    detail: "6 Goods and Services Tax · 4 Income Tax · 7 Others (Registrations & Litigation)",
  },
  {
    label: "Delhi, Bihar & Regional Tax Offices Covered",
    value: "15+",
    detail: "Delhi GST/ITO/DGFT/TM Offices, Muzaffarpur/Patna Bihar & Regional Tax Offices",
  },
  {
    label: "Core Practice Sections",
    value: "3",
    detail: "1. Goods and Services Tax · 2. Income Tax · 3. Others (Accounts, Registrations & Litigation)",
  },
];

export const PRACTICE_AREAS: PracticeAreaItem[] = [
  {
    id: "gst-and-tax-practice",
    number: "01",
    title: "Goods and Services Tax — Registration, Return Filing & SCN Reply",
    shortTitle: "Goods and Services Tax Compliance & SCN",
    statutes:
      "Delhi High Court (Tax Bench) · GSTAT · Vyapar Bhawan GST & CGST Offices",
    summary:
      "The Firm’s Indirect Tax team is well-equipped and dedicated to render advice and litigate across the entire spectrum of indirect tax laws. The team aims at suggesting practical and innovative solutions to its clients and has expertise in Goods and Services Tax (‘GST’), Customs, Service Tax, Central Sales Tax/Value Added Tax (‘VAT’), and Central Excise.",
    representationScope: [
      "Managed Services in Compliance and Regulatory matters on an all-India basis including Goods and Services Tax Registration (REG-01), amendments & revocation (REG-21)",
      "Filing of periodic and annual GST returns (GSTR-1, GSTR-3B, GSTR-9/9C), bookkeeping, GSTR-2B reconciliation & refunds under Foreign Trade Policy Schemes",
      "Drafting of detailed replies to Show Cause Notices (DRC-01 / Section 73 & 74), ASMT-10 scrutiny notices & representation in adjudication hearings",
    ],
    typicalForums: [
      "Vyapar Bhawan Delhi GST & Central CGST Commissionerates",
      "Regional GST Offices near High Courts across India",
    ],
    landmarkContext:
      "The Firm has a dedicated team of experts engaged in providing managed services, compliance advisory, and adjudication defence across Goods and Services Tax and Customs laws.",
  },
  {
    id: "gst-appellate-litigation",
    number: "02",
    title: "Goods and Services Tax — Commissioner Appeal, GSTAT Appeal & High Court Appeal",
    shortTitle: "Commissioner, GSTAT & High Court Appeals",
    statutes:
      "Commissioner (Appeals) · GSTAT Principal Bench · Delhi High Court & Supreme Court",
    summary:
      "The Firm’s Indirect Tax litigation team represents clients before all forums—Commissioner (Appeals), Tax Tribunals including GSTAT, High Courts, the Supreme Court, and tax authorities—handling disputes involving GST demands, Input Tax Credit disallowances, refund rejections, Customs classification, and detention orders.",
    representationScope: [
      "Litigation before Commissioner (Appeals): Section 107 First Appeals (Form GST APL-01), stay petitions & appellate arguments",
      "Representation before GST Appellate Tribunal (‘GSTAT’): Section 112 Second Appeals (Form GST APL-05), paperbook compilation & tribunal hearings",
      "High Court Tax Appeals & Article 226 Writ Petitions before the High Courts and Supreme Court challenging jurisdictional errors & provisional attachments",
    ],
    typicalForums: [
      "Commissioner (Appeals) Delhi & Regional Benches",
      "GSTAT Principal Bench New Delhi · High Court of Delhi & Supreme Court",
    ],
    landmarkContext:
      "Competent handling of Goods and Services Tax and Customs litigation across all appellate forums, delivering practical and time-bound solutions.",
  },
  {
    id: "income-tax-filings-and-tds",
    number: "03",
    title: "Income Tax — Consultancy, ITR & TDS Return Filing",
    shortTitle: "Consultancy, ITR & TDS Return Filing",
    statutes:
      "Income Tax Department · Pratyaksh Kar Bhawan (ITO / Civic Centre) · TRACES",
    summary:
      "The Direct Tax team, comprising lawyers and tax professionals, offers a comprehensive array of direct tax consultancy, Income Tax Return (ITR) filing, and quarterly TDS compliance services for businesses, partnership firms, professionals, and organisations across sectors. We understand the business, accounting, and legal intricacies affecting direct taxation.",
    representationScope: [
      "Income Tax Consultancy relating to domestic and cross-border tax issues, strategic tax planning & capital gains structuring",
      "Compilation of financial data and Income Tax Return (ITR) Filing (ITR-1 to ITR-7), bookkeeping, AIS/TIS & Form 26AS reconciliation",
      "Quarterly TDS and TCS Return Filing (Forms 24Q, 26Q, 27Q, 27EQ), Form 16/16A issuance & TRACES default rectification",
    ],
    typicalForums: [
      "Pratyaksh Kar Bhawan (Civic Centre / ITO New Delhi) & CPC / TRACES",
      "Regional Income Tax Offices (Aayakar Bhawan) across Delhi, Bihar & India",
    ],
    landmarkContext:
      "We endeavor to deliver efficient and cost-effective direct tax consultancy and compliance services appreciating the specific needs of clients, so as to provide maximum value.",
  },
  {
    id: "income-tax-consultancy-and-matters",
    number: "04",
    title: "Income Tax — Corporate Tax, Wealth Tax, Assessments & Other Matters",
    shortTitle: "Income Tax Assessments & Appeals",
    statutes:
      "NFAC · CIT (Appeals) · High Court Tax Benches",
    summary:
      "The Direct Tax team is acclaimed for its ability to find practical solutions to meet clients’ needs while addressing the complexities of constantly changing tax regimes across Income Tax, Corporate Tax, and Wealth Tax. Over the years, the team has gained the respect of tax administrators, businesses, and the judiciary alike for its competent handling of litigation before the Supreme Court, High Courts, CIT(Appeals), and assessing authorities.",
    representationScope: [
      "Representation in faceless scrutiny assessments (Sec. 142(1) / 143(2) / 143(3)) & Section 148A/148 reassessment proceedings",
      "Appellate litigation before CIT(Appeals) in Form 35, Corporate Tax & Wealth Tax matters, Section 154 rectifications & stay petitions",
      "Penalty defence under Section 270A/271, revision petitions under Section 263/264 & High Court direct tax appeals",
    ],
    typicalForums: [
      "National Faceless Assessment / Appeal Centre (NFAC) & Jurisdictional ITOs",
      "CIT (Appeals) & High Court Tax Division Benches",
    ],
    landmarkContext:
      "Quality advice and representation across the entire spectrum of direct tax laws, right from compilation of assessment records to appellate arguments before CIT(Appeals) and the High Courts.",
  },
  {
    id: "accounting-bookkeeping-and-dgft",
    number: "05",
    title: "Others — Bookkeeping & Accounting, DGFT Compliances & Company Registration",
    shortTitle: "Bookkeeping, DGFT Compliances & Company Registration",
    statutes:
      "DGFT CLA (ITO New Delhi) · MCA / ROC Delhi & Bihar · Vanijya Bhawan",
    summary:
      "The Firm provides managed services in Bookkeeping & Accounting, Foreign Trade Policy (DGFT Compliances), Customs, and Corporate Law / Company Registration across Delhi, Bihar, and India. Our team works closely to incorporate companies and LLPs, maintain accurate bookkeeping records, and secure export-import authorizations and Customs clearances in a time-bound manner.",
    representationScope: [
      "Bookkeeping & Accounting: Compilation of ledgers, bank reconciliation, systematic bookkeeping & preparation of Trial Balance, P&L, and Balance Sheet",
      "Foreign Trade Policy & DGFT Compliances: Import Export Code (IEC) issuance & modification, Advance Authorization, EPCG & RoDTEP refunds",
      "Company Registration & Corporate Law Practice: Private Limited, LLP, OPC & Section 8 incorporation (SPICe+), MOA/AOA drafting & ROC compliance",
    ],
    typicalForums: [
      "DGFT CLA Office (ITO, New Delhi) & Registrar of Companies (MCA / ROC)",
      "Zonal & Regional DGFT & Corporate Filing Offices across India",
    ],
    landmarkContext:
      "Understanding the accounting, corporate, and foreign trade intricacies affecting businesses allows the Firm to deliver holistic, tax-compliant solutions.",
  },
  {
    id: "msme-trademark-partnership-registrations",
    number: "06",
    title: "Others — MSME, Trademark, Partnership & Criminal / Civil Litigation",
    shortTitle: "Registrations, Labour, Civil & Criminal Litigation",
    statutes:
      "Trade Marks Registry · Registrar of Firms · District Courts, Labour Courts & High Courts",
    summary:
      "The Firm offers comprehensive representation spanning MSME Udyam, Trademark, and Partnership Firm Registration alongside dedicated Criminal Litigation, Civil Litigation, and Labour Law Litigation before District Courts, Labour Tribunals, High Courts, and the Supreme Court.",
    representationScope: [
      "MSME Udyam Registration, Trademark Registration (Form TM-A, Sec. 9/11 replies & hearings) & Partnership Firm Registration before ROF",
      "Criminal Litigation: Anticipatory & regular bail, FIR quashing, Section 138 NI Act cheque bounce, economic offences & trial defence",
      "Civil & Labour Law Litigation: Recovery suits, injunctions, property & contractual disputes, industrial disputes & employment litigation",
    ],
    typicalForums: [
      "Trade Marks Registry (Dwarka, New Delhi) & Registrar of Firms",
      "District Courts (Delhi, NCR & Muzaffarpur), Labour Courts, High Courts & Supreme Court",
    ],
    landmarkContext:
      "From start-up registrations and intellectual property protection to determined trial and appellate advocacy in Criminal, Civil, and Labour disputes.",
  },
];

export type SolutionCategory = "Goods and Services Tax" | "Income Tax" | "Others";

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
    category: "Goods and Services Tax",
    code: "01 · GOODS AND SERVICES TAX",
    title: "Goods and Services Tax (6 Services)",
    serviceCount: 6,
    weightPercent: 35,
    tagline:
      "Indirect Tax Advisory, Compliance & Litigation Across GST Authorities, Customs, GSTAT & High Courts",
    items: [
      "GST Registration",
      "GST Return Filing",
      "SCN Reply",
      "Commissioner Appeal",
      "GSTAT Appeal",
      "High Court Appeal",
    ],
  },
  {
    category: "Income Tax",
    code: "02 · INCOME TAX",
    title: "Income Tax (4 Services)",
    serviceCount: 4,
    weightPercent: 24,
    tagline:
      "Income Tax Consultancy, ITR & TDS Return Filing, Corporate Tax, Wealth Tax & Assessments",
    items: [
      "Income Tax Consultancy",
      "Income Tax Return Filing",
      "TDS Return Filing",
      "Other Matters",
    ],
  },
  {
    category: "Others",
    code: "03 · OTHERS",
    title: "Others (7 Services)",
    serviceCount: 7,
    weightPercent: 41,
    tagline:
      "Bookkeeping & Accounting, DGFT Compliances, MSME, Trademark, Partnership, Company Registration & Criminal, Civil & Labour Litigation",
    items: [
      "Bookkeeping & Accounting",
      "DGFT Compliances",
      "MSME Registration",
      "Trademark Registration",
      "Partnership Firm Registration",
      "Company Registration",
      "Criminal & Civil Litigation",
    ],
  },
];

export const CORPORATE_SOLUTIONS: CorporateSolutionItem[] = [
  // ============================================================================
  // SECTION 1: Goods and Services Tax (6 items)
  // ============================================================================
  {
    id: "gst-registration",
    category: "Goods and Services Tax",
    title: "GST Registration",
    subtitle: "Fresh GSTIN, Multi-State Setup & Revocation",
    authorityTag: "GSTN · DELHI & STATE GST",
    turnaroundTag: "REG-01 & REG-21 Revocation",
    timelineOrStatute: "Sec. 22–30 CGST Act",
    description:
      "Managed regulatory compliance for fresh Goods and Services Tax Registration (REG-01), multi-state business expansion, core/non-core amendments, LUT filings for exporters, and representation for revocation of cancelled GST registrations (REG-21).",
    deliverables: [
      "Fresh GST Registration & Principal/Additional Place Verification",
      "Core & Non-Core GSTIN Amendments & Revocation (REG-21)",
    ],
    practiceAreaId: "gst-and-tax-practice",
    featured: true,
  },
  {
    id: "gst-return-filing",
    category: "Goods and Services Tax",
    title: "GST Return Filing",
    subtitle: "GSTR-1, GSTR-3B, ITC Matching & GSTR-9/9C",
    authorityTag: "GSTN · CBIC",
    turnaroundTag: "Monthly, QRMP & Annual",
    timelineOrStatute: "Sec. 37–44 CGST Act",
    description:
      "All-India managed compliance encompassing periodic and annual Goods and Services Tax Return Filing (GSTR-1, GSTR-3B, GSTR-9/9C), GSTR-2B Input Tax Credit (ITC) reconciliation, GST bookkeeping, and export/inverted-duty refund claims.",
    deliverables: [
      "Monthly & Quarterly GSTR-1, IFF, and GSTR-3B Return Filing",
      "GSTR-2B ITC Reconciliation & Annual GSTR-9 / GSTR-9C Filing",
    ],
    practiceAreaId: "gst-and-tax-practice",
  },
  {
    id: "scn-reply",
    category: "Goods and Services Tax",
    title: "SCN Reply (Show Cause Notice)",
    subtitle: "DRC-01, ASMT-10 Scrutiny & Sec. 73/74 Replies",
    authorityTag: "CGST · SGST ADJUDICATION",
    turnaroundTag: "Sec. 73 / 74 & DRC-06",
    timelineOrStatute: "Sec. 61, 73 & 74 CGST Act",
    description:
      "Dedicated indirect tax representation right from compilation of reconciliation data and drafting of replies to Show Cause Notices (DRC-01 under Section 73/74), ASMT-10 scrutiny notices, and Rule 86A credit blocks to personal hearings before adjudicating authorities.",
    deliverables: [
      "Detailed Legal Reply in Form DRC-06 to Section 73/74 SCNs",
      "ASMT-10 Scrutiny Replies & Personal Hearing Representation",
    ],
    practiceAreaId: "gst-and-tax-practice",
  },
  {
    id: "commissioner-appeal",
    category: "Goods and Services Tax",
    title: "Commissioner (Appeals)",
    subtitle: "First Appellate Authority Representation",
    authorityTag: "COMMISSIONER (APPEALS) · SEC. 107",
    turnaroundTag: "Form GST APL-01 First Appeal",
    timelineOrStatute: "Sec. 107 CGST Act",
    description:
      "Competent handling of First Appeals under Section 107 of the CGST Act before the Commissioner (Appeals) challenging adjudication demands, Input Tax Credit disallowances, detention penalties, refund rejections, and registration cancellations.",
    deliverables: [
      "Statement of Facts, Grounds of Appeal & Form GST APL-01 Filing",
      "Written Submissions & Personal Hearing Arguments",
    ],
    practiceAreaId: "gst-appellate-litigation",
  },
  {
    id: "gstat-appeal",
    category: "Goods and Services Tax",
    title: "GSTAT Appeal",
    subtitle: "GST Appellate Tribunal Second Appeals",
    authorityTag: "GSTAT · CGST SEC. 112",
    turnaroundTag: "Sec. 112 / APL-05 Appeals",
    timelineOrStatute: "Sec. 112 CGST Act",
    description:
      "Appellate litigation before the GST Appellate Tribunal (‘GSTAT’) under Section 112 of the CGST Act contesting orders of First Appellate (Sec. 107) and Revisional Authorities (Sec. 108)—from compilation of appeal paperbooks (Form GST APL-05) to stay applications and tribunal arguments.",
    deliverables: [
      "Form GST APL-05 Appeal Memorandum & Paperbook Filing",
      "Pre-Deposit Compliance, Stay Petitions & GSTAT Bench Hearings",
    ],
    practiceAreaId: "gst-appellate-litigation",
  },
  {
    id: "high-court-appeal",
    category: "Goods and Services Tax",
    title: "High Court Appeal & Writ",
    subtitle: "Article 226 Tax Writs & High Court Appeals",
    authorityTag: "DELHI HC · HIGH COURTS",
    turnaroundTag: "Art. 226 Writ & Sec. 117 Appeal",
    timelineOrStatute: "Art. 226 Constitution · Sec. 117 CGST",
    description:
      "High-profile indirect and direct tax litigation before the High Courts and Supreme Court via Article 226 Writ Petitions and statutory Tax Appeals challenging jurisdictional overreach, breach of natural justice, coercive recovery, and provisional bank attachments.",
    deliverables: [
      "Article 226 Writ Petitions against Arbitrary / Unsigned Tax Orders",
      "Urgent Stay Applications & High Court Tax Bench Arguments",
    ],
    practiceAreaId: "gst-appellate-litigation",
  },

  // ============================================================================
  // SECTION 2: Income Tax (4 items — Consultancy & ITR Filing above TDS Return Filing)
  // ============================================================================
  {
    id: "income-tax-consultancy",
    category: "Income Tax",
    title: "Income Tax Consultancy",
    subtitle: "Income Tax, Corporate Tax & Wealth Tax Advisory",
    authorityTag: "INCOME TAX · ADVISORY DESK",
    turnaroundTag: "Year-Round Tax Advisory",
    timelineOrStatute: "Income-tax Act, 1961",
    description:
      "Quality advice and consultancy across the entire spectrum of income tax, corporate tax, and wealth tax laws—finding practical, risk-averse solutions for business deductions, capital gains structuring (Sec. 54/54EC/54F), partnership remuneration, and domestic and cross-border tax issues.",
    deliverables: [
      "Income Tax, Corporate Tax & Capital Gains Advisory",
      "Written Legal Opinions on Deductions & Withholding Tax",
    ],
    practiceAreaId: "income-tax-filings-and-tds",
  },
  {
    id: "itr-return-filing",
    category: "Income Tax",
    title: "Income Tax Return Filing",
    subtitle: "ITR-1 to ITR-7 & Bookkeeping Compliance",
    authorityTag: "INCOME TAX · CBDT",
    turnaroundTag: "Annual ITR & Bookkeeping",
    timelineOrStatute: "Sec. 139 Income-tax Act",
    description:
      "Comprehensive Income Tax Return compliance (ITR-1 to ITR-7) and bookkeeping coordination for businesses, industrial houses, partnership firms, professionals, and individuals, addressing accounting and legal intricacies with full Form 26AS and AIS/TIS reconciliation.",
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
      "End-to-end withholding tax management covering quarterly TDS and TCS return filings (Forms 24Q, 26Q, 27Q, 27EQ), challan verification, Form 16/16A certification, correction statements, and resolution of TRACES defaults and demand intimations.",
    deliverables: [
      "Quarterly 24Q, 26Q, 27Q & 27EQ Returns & Challan Matching",
      "Form 16 / 16A Generation & TRACES Demand Rectification",
    ],
    practiceAreaId: "income-tax-filings-and-tds",
  },
  {
    id: "other-income-tax-matters",
    category: "Income Tax",
    title: "Other Income Tax Matters",
    subtitle: "Scrutiny Assessments, Sec. 148 Notices & Appeals",
    authorityTag: "NFAC · CIT(A) · INCOME TAX",
    turnaroundTag: "Sec. 143(3) / 148 & Appeals",
    timelineOrStatute: "Sec. 143(3), 148, 154 & 246A",
    description:
      "Competent handling of income tax, corporate tax, and assessment proceedings before Assessing Authorities (NFAC) and CIT(Appeals)—covering Section 143(3) scrutiny, Section 148A/148 reassessments, rectifications, and stay of demand petitions.",
    deliverables: [
      "Faceless Scrutiny & Section 148A/148 Reassessment Replies",
      "CIT(Appeals) Form 35 Filings, Rectifications & Penalty Defense",
    ],
    practiceAreaId: "income-tax-consultancy-and-matters",
  },

  // ============================================================================
  // SECTION 3: Others (7 items)
  // ============================================================================
  {
    id: "accounting-bookkeeping",
    category: "Others",
    title: "Bookkeeping & Accounting",
    subtitle: "Bookkeeping Ledgers & Financial Statements",
    authorityTag: "BOOKKEEPING · ACCOUNTING",
    turnaroundTag: "Monthly & Annual Bookkeeping",
    timelineOrStatute: "GST & Income Tax Synchronized Books",
    description:
      "Managed bookkeeping and accounting services appreciating the specific business and statutory needs of clients—covering compilation of sales/purchase registers, bank reconciliation, GST/TDS ledger balancing, systematic bookkeeping, Trial Balance, P&L, and Balance Sheet.",
    deliverables: [
      "Monthly Ledger Maintenance & Bank / Vendor Reconciliations",
      "Trial Balance, Profit & Loss & Balance Sheet Preparation",
    ],
    practiceAreaId: "accounting-bookkeeping-and-dgft",
  },
  {
    id: "dgft-work",
    category: "Others",
    title: "DGFT Compliances (IEC & Export-Import)",
    subtitle: "IEC Code, Advance Auth, EPCG & RoDTEP",
    authorityTag: "DGFT · CUSTOMS",
    turnaroundTag: "IEC, Advance Auth & EPCG",
    timelineOrStatute: "FTDR Act, 1992 · Foreign Trade Policy",
    description:
      "Advisory, DGFT compliances, and representation under Foreign Trade Policy and Customs schemes—including Import Export Code (IEC) issuance and modification, Advance Authorization, EPCG license redemption (EODC), export incentive refunds (RoDTEP/RoSCTL), and DGFT show-cause replies.",
    deliverables: [
      "IEC Registration/Modification, Advance Authorization & EPCG",
      "EODC Redemption, RoDTEP Scrips & DGFT Compliance Replies",
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
      "Holistic advisory and registration under the MSMED Act, 2006—covering Udyam Registration certificate issuance for manufacturing and service enterprises, NIC activity classification, Section 43B(h) tax compliance, and MSME Samadhaan delayed-payment recovery proceedings.",
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
      "End-to-end Intellectual Property Rights (Trademark) protection right from conducting prior-art availability searches and filing Form TM-A applications across Classes 1 to 45 to drafting replies to Section 9 & 11 Examination Reports and appearing at Registry hearings.",
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
      "Structuring and execution of partnership formation from inception—covering drafting of Partnership and Reconstitution Deeds (capital, profit-sharing, Section 40(b) tax clauses), stamp duty execution, Form I registration before the Registrar of Firms, and PAN/TAN/GST setup.",
    deliverables: [
      "Custom Partnership Deed Drafting & ROF Form I Registration",
      "Reconstitution / Admission-Retirement Deeds & Firm PAN/GST",
    ],
    practiceAreaId: "msme-trademark-partnership-registrations",
  },
  {
    id: "company-registration",
    category: "Others",
    title: "Company Registration",
    subtitle: "Private Limited, LLP, OPC & Section 8 Incorporation",
    authorityTag: "MCA · ROC DELHI & BIHAR",
    turnaroundTag: "SPICe+ · COI, MOA & AOA",
    timelineOrStatute: "Companies Act, 2013 · LLP Act, 2008",
    description:
      "End-to-end Corporate Law Practice and entity formation covering setting up of Private Limited Companies, Limited Liability Partnerships (LLP), One Person Companies (OPC), and Section 8 entities—including name reservation, DIN/DSC, MOA & AOA drafting, Certificate of Incorporation, and annual ROC compliance.",
    deliverables: [
      "SPICe+ Incorporation, Certificate of Incorporation, PAN & TAN",
      "MOA/AOA Drafting, DIN/DSC & Annual ROC / MCA Compliance",
    ],
    practiceAreaId: "accounting-bookkeeping-and-dgft",
  },
  {
    id: "criminal-civil-litigation",
    category: "Others",
    title: "Criminal & Civil Litigation",
    subtitle: "Bail, Quashing, Recovery, Injunctions & Labour Disputes",
    authorityTag: "DISTRICT COURTS · HIGH COURTS · SC",
    turnaroundTag: "Trial, Writ & Appellate Defence",
    timelineOrStatute: "BNS / BNSS · CPC · NI Act Sec. 138",
    description:
      "Dedicated litigation representation across Criminal, Civil, and Labour Law matters before District Courts, Labour Tribunals, High Courts, and the Supreme Court—covering anticipatory & regular bail, FIR quashing, Section 138 cheque bounce, economic offences, civil recovery suits, injunctions, property disputes, and employment litigation.",
    deliverables: [
      "Anticipatory / Regular Bail, FIR Quashing & Sec. 138 NI Act Trials",
      "Civil Recovery Suits, Injunctions, Property & Labour Law Litigation",
    ],
    practiceAreaId: "msme-trademark-partnership-registrations",
  },
];

export const COUNSEL_TEAM: CounselMember[] = [
  {
    id: "adv-sanjay-singh",
    name: "Adv. Sanjay Kumar Singh",
    designation: "Founder & Advocate, Delhi High Court",
    enrollmentNote:
      "Advocate, Delhi High Court · Distinguished Member, International Council of Jurists (Cert. No. 2529)",
    primaryForums:
      "Supreme Court of India · GSTAT Principal Bench · Delhi High Court · Commissioner (Appeals)",
    practiceFocus: [
      "Direct & Indirect Taxation (GST, Customs, Income Tax, Corporate Tax, Wealth Tax & TDS)",
      "Corporate Law Practice, Company Registration & Regulatory Advisory",
      "Labour Law Litigation, Civil Litigation, Criminal Litigation & Arbitration",
    ],
    bio: "Founder of S J Associates practicing before the High Court of Delhi, GSTAT, and Courts across Delhi NCR and Bihar across Goods and Services Tax, Income Tax, Corporate Tax, Wealth Tax, Customs, Corporate Law, Labour Law, Civil, and Criminal Litigation.",
  },
  {
    id: "adv-rajesh-verma",
    name: "Adv. Rajesh Verma",
    designation: "Senior Associate — GST & Appellate Desk",
    enrollmentNote: "Enrolled Bar Council of Delhi · High Court & Tax Bar",
    primaryForums:
      "Commissioner (Appeals) · GSTAT Principal Bench · Delhi & Punjab & Haryana High Courts",
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
    designation: "Associate Counsel — Income Tax & Corporate Desk",
    enrollmentNote: "Enrolled Bar Council of Delhi · Tax & Corporate Bar",
    primaryForums:
      "Income Tax Authorities · CIT(Appeals) · MCA / ROC · Trade Marks Registry Dwarka · DGFT CLA Delhi",
    practiceFocus: [
      "Income Tax Consultancy, Income Tax Return (ITR) Filing & Quarterly TDS Return Filing",
      "Company Registration, Bookkeeping & Accounting, DGFT Compliances, MSME, Trademark & Partnership",
      "Civil, Labour Law & Commercial Documentation",
    ],
    bio: "Leads the Firm's Income Tax Consultancy, Income Tax Return (ITR) Filing, and TDS Return Filing desk alongside Company Registration, Bookkeeping & Accounting, DGFT Compliances, MSME, Trademark, and Partnership Firm registrations.",
  },
];

export const CHAMBERS_OFFICES: ChambersOffice[] = [
  {
    id: "new-delhi-rani-bagh-hq",
    title: "New Delhi Office — Rani Bagh / Pitampura",
    city: "New Delhi",
    addressLines: [
      "A-40, Rishi Nagar, Captain Satish Marg, Rani Bagh North West",
      "Pitampura, Delhi – 110034, India",
    ],
    phone: "+91 97163 18400 / +91 98182 98983",
    email: "services@sjalaw.in",
    courtProximity:
      "Direct connectivity to Rohini Courts, Vyapar Bhawan GST HQ, ITO Income Tax Office, GSTAT & Delhi High Court",
    consultationHours: "Monday – Saturday · 10:00 AM to 7:30 PM IST",
  },
  {
    id: "bihar-muzaffarpur-office",
    title: "Bihar Office — Muzaffarpur",
    city: "Muzaffarpur, Bihar",
    addressLines: [
      "Krishna Shanti Sadan, Baikuntpuri, Bariya",
      "Ward No. 1, Muzaffarpur",
      "Bihar – 842003, India",
    ],
    phone: "+91 97163 18400 / +91 98182 98983",
    email: "services@sjalaw.in",
    courtProximity:
      "Serving Muzaffarpur District Courts, North Bihar GST & Income Tax Circles, and Patna High Court matters",
    consultationHours: "Monday – Saturday · 10:00 AM to 7:30 PM IST",
  },
  {
    id: "regional-high-court-tax-desk",
    title: "Regional High Courts & Tax Offices Network",
    city: "Delhi NCR · Patna · Prayagraj · Chandigarh · Jaipur · Mumbai",
    addressLines: [
      "Coordinated Appearance & Regional Tax Office Network",
      "High Courts, GSTAT Benches, and Regional GST / Income Tax Offices",
      "Representation across North, West & East India",
    ],
    phone: "+91 97163 18400",
    email: "services@sjalaw.in",
    courtProximity:
      "Covers 10 Courts & Tribunals plus Regional GST Bhawans, Aayakar Bhawans, MCA/ROC, DGFT & Trademark Registries",
    consultationHours: "Prior Appointment & Case Conference via New Delhi or Bihar Office",
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
      "This is to certify that Mr. Sanjay Kumar Singh (A-40, Rishi Nagar, Captain Satish Marg, Rani Bagh North West, Delhi-110034) is a Distinguished Member of the International Council of Jurists from 2026 to 2030 (Certificate No. 2529 · Membership No. 471-A/2009), signed by Dr. Adish C. Aggarwala (President, ICJ) and Sarah J. Marchington (Director, ICJ).",
    category: "International Jurists Honour",
    verificationNote: "Certificate No. 2529 · Membership No. 471-A/2009 · 2026 to 2030",
    defaultImage: "/assets/aistudio/icj-certificate-2529.jpg",
    pdfUrl: "/assets/aistudio/DocScanner_18_Nov_2026_04-09_pm_c291452f.pdf",
  },
];
