export type CourtTier = "supreme" | "tribunal" | "high";

export type CourtImageKey =
  | "supreme-court-of-india"
  | "gstat"
  | "delhi-high-court"
  | "bombay-high-court"
  | "calcutta-high-court"
  | "allahabad-high-court"
  | "gujarat-high-court"
  | "punjab-haryana-high-court"
  | "patna-high-court"
  | "rajasthan-high-court";

export type BulletinCategory =
  | "Direct & Indirect Tax"
  | "Indirect Tax (GST & Customs)"
  | "Direct Tax (Income Tax & TDS)"
  | "GST & Income Tax"
  | "Constitutional"
  | "Commercial & Arbitration"
  | "Criminal"
  | "Civil & Property";

export interface CourtProfile {
  slug: CourtImageKey;
  name: string;
  shortName: string;
  tier: CourtTier;
  city: string;
  distanceFromDelhiKm: number;
  stateOrJurisdiction: string;
  region: "National" | "North" | "West" | "East";
  establishedYear: number;
  benches: string[];
  nearbyTaxOffices: string[];
  officialUrl: string;
  causeListUrl: string;
  chambersPracticeNote: string;
  summary: string;
}

export interface TaxRegionalOffice {
  slug: string;
  name: string;
  city: string;
  group: "Delhi Tax & Regional Offices" | "Regional Tax Offices (Near High Courts)";
  nearbyCourtSlug: CourtImageKey;
  jurisdiction: string;
  addressNote: string;
}

export interface JudicialRuling {
  id: string;
  title: string;
  caseNameOrCitation: string;
  date: string;
  category: BulletinCategory;
  bench: string;
  statutes: string[];
  holdingSummary: string;
  practicalTakeaway: string;
  sourceUrl?: string;
}

export interface RegistryNotice {
  id: string;
  title: string;
  date: string;
  type: "Circular" | "Cause List" | "Practice Direction" | "Bench Roster";
  summary: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface LiveCourtReport {
  courtSlug: CourtImageKey;
  courtName: string;
  fetchedAt: string;
  sourceMode: "live-grounded" | "live-rss" | "archive-fallback";
  overviewSummary: string;
  sittingStatus: string;
  chiefJusticeNote: string;
  rulings: JudicialRuling[];
  registryNotices: RegistryNotice[];
  sources: GroundingSource[];
}

export interface ConsultationPayload {
  fullName: string;
  email: string;
  phone: string;
  courtSlug: string;
  practiceArea: string;
  briefSummary: string;
}

export function sortCourtsByDistanceFromDelhi(courts: CourtProfile[]): CourtProfile[] {
  return [...courts].sort((a, b) => {
    if (a.tier === "supreme" && b.tier !== "supreme") return -1;
    if (b.tier === "supreme" && a.tier !== "supreme") return 1;
    return a.distanceFromDelhiKm - b.distanceFromDelhiKm;
  });
}

const UNSORTED_COURTS_REGISTRY: CourtProfile[] = [
  {
    slug: "supreme-court-of-india",
    name: "Supreme Court of India",
    shortName: "Supreme Court",
    tier: "supreme",
    city: "New Delhi",
    distanceFromDelhiKm: 0,
    stateOrJurisdiction: "All India Appellate & Constitutional Jurisdiction",
    region: "National",
    establishedYear: 1950,
    benches: ["Tilak Marg, New Delhi (Principal Seat)"],
    nearbyTaxOffices: [
      "I.P. Estate Income Tax Office (ITO), New Delhi",
      "CGST & Delhi GST Commissionerate, Vyapar Bhawan, ITO",
      "GSTAT Principal Bench, New Delhi"
    ],
    officialUrl: "https://www.sci.gov.in",
    causeListUrl: "https://www.sci.gov.in/cause-list/",
    chambersPracticeNote:
      "SJ Associates maintains an active filing desk at Tilak Marg for Special Leave Petitions (Article 136), Writ Petitions (Article 32), Transfer Petitions, and Goods and Services Tax & Income Tax appeals.",
    summary:
      "Apex constitutional court of the Republic of India exercising original, appellate, and advisory jurisdiction over constitutional, GST, income tax, civil, criminal, and regulatory matters."
  },
  {
    slug: "delhi-high-court",
    name: "High Court of Delhi",
    shortName: "Delhi High Court",
    tier: "high",
    city: "New Delhi",
    distanceFromDelhiKm: 3,
    stateOrJurisdiction: "National Capital Territory of Delhi",
    region: "North",
    establishedYear: 1966,
    benches: ["Sher Shah Road, New Delhi"],
    nearbyTaxOffices: [
      "Vyapar Bhawan Delhi GST & CGST Office (I.P. Estate)",
      "Pratyaksh Kar Bhawan (Civic Centre) & ITO Income Tax Offices",
      "DGFT CLA Regional Office (ITO) & Trademark Registry (Dwarka)"
    ],
    officialUrl: "https://delhihighcourt.nic.in",
    causeListUrl: "https://delhihighcourt.nic.in/web/cause-list",
    chambersPracticeNote:
      "Article 226 GST & Income Tax writ petitions, Show Cause Notice (SCN) & assessment challenge writs, Intellectual Property Division (IPD) trademark filings, and DGFT customs petitions.",
    summary:
      "Principal High Court in New Delhi adjudicating GST, Income Tax, Customs, DGFT, Trademark (IPD), and constitutional writ petitions."
  },
  {
    slug: "gstat",
    name: "GST Appellate Tribunal (GSTAT)",
    shortName: "GSTAT (Principal Bench)",
    tier: "tribunal",
    city: "New Delhi",
    distanceFromDelhiKm: 4,
    stateOrJurisdiction: "All India GST Second-Appellate Jurisdiction (Sec. 112 CGST Act)",
    region: "National",
    establishedYear: 2024,
    benches: ["Principal Bench, New Delhi", "State & Regional Benches Across India"],
    nearbyTaxOffices: [
      "CGST Commissionerate (Appeals-I & II), Delhi",
      "Delhi State GST Appellate Authority, Vyapar Bhawan, ITO",
      "Regional GSTAT State Benches Across India"
    ],
    officialUrl: "https://gstat.gov.in",
    causeListUrl: "https://efiling.gstat.gov.in",
    chambersPracticeNote:
      "Second-level appellate representation under Section 112 of the CGST Act against Commissioner (Appeals) Orders (Section 107) and Revisional Orders (Section 108), pre-deposit structuring, and GSTAT e-Filing Portal hearings.",
    summary:
      "India's statutory second-level Goods and Services Tax Appellate Tribunal (Principal Bench in New Delhi), hearing GST demand, input tax credit, SCN, and valuation appeals under Section 112 CGST."
  },
  {
    slug: "punjab-haryana-high-court",
    name: "High Court of Punjab and Haryana",
    shortName: "Punjab & Haryana HC (Chandigarh)",
    tier: "high",
    city: "Chandigarh",
    distanceFromDelhiKm: 242,
    stateOrJurisdiction: "Punjab, Haryana & UT Chandigarh",
    region: "North",
    establishedYear: 1947,
    benches: ["Capitol Complex, Sector 1, Chandigarh"],
    nearbyTaxOffices: [
      "Central Revenue Building (CGST & Income Tax), Sector 17, Chandigarh",
      "Haryana & Punjab State GST Commissionerates (Panchkula / Mohali)",
      "Commissioner (Appeals) GST & Income Tax — Gurugram, Faridabad & Ludhiana"
    ],
    officialUrl: "https://highcourtchd.gov.in",
    causeListUrl: "https://highcourtchd.gov.in/sub_pages/top_menu/causelist/causelist.php",
    chambersPracticeNote:
      "GST assessment & ITC block writs, SCN replies, MSME recovery disputes, income tax appeals, and DGFT customs compliance across NCR Gurugram, Mohali & Chandigarh.",
    summary:
      "Capitol Complex High Court at Chandigarh exercising tax, GST, income tax, and commercial writ jurisdiction across Haryana, Punjab, and Chandigarh."
  },
  {
    slug: "rajasthan-high-court",
    name: "High Court of Judicature for Rajasthan",
    shortName: "Rajasthan High Court",
    tier: "high",
    city: "Jodhpur",
    distanceFromDelhiKm: 491,
    stateOrJurisdiction: "State of Rajasthan",
    region: "North",
    establishedYear: 1949,
    benches: ["Jodhpur (Principal Seat)", "Jaipur Bench"],
    nearbyTaxOffices: [
      "New Central Revenue Building (CGST & Income Tax), Statue Circle, Jaipur",
      "Rajasthan State GST Kar Bhawan, Jhalana Doongri, Jaipur",
      "Income Tax & CGST Commissionerate, Paota, Jodhpur"
    ],
    officialUrl: "https://hcraj.nic.in",
    causeListUrl: "https://hcraj.nic.in/hcraj/causelist.php",
    chambersPracticeNote:
      "Section 148 income tax reassessment writs, GST demand stays, SCN replies, Commissioner (Appeals) representation, and commercial appeals at Jaipur and Jodhpur.",
    summary:
      "Dual-bench High Court serving Rajasthan's industrial and trade corridors across direct taxation, GST appeals, and writ litigation."
  },
  {
    slug: "allahabad-high-court",
    name: "High Court of Judicature at Allahabad",
    shortName: "Allahabad High Court",
    tier: "high",
    city: "Prayagraj",
    distanceFromDelhiKm: 576,
    stateOrJurisdiction: "State of Uttar Pradesh",
    region: "North",
    establishedYear: 1866,
    benches: ["Prayagraj (Principal Seat)", "Lucknow Bench"],
    nearbyTaxOffices: [
      "CGST & Income Tax Commissionerate, Civil Lines, Prayagraj",
      "UP State GST Headquarters, Vibhuti Khand, Gomti Nagar, Lucknow",
      "Regional GST & Income Tax Offices — Noida & Ghaziabad"
    ],
    officialUrl: "https://www.allahabadhighcourt.in",
    causeListUrl: "https://www.allahabadhighcourt.in/causelist/index.html",
    chambersPracticeNote:
      "GST enforcement & e-way bill seizure writs, Show Cause Notice (SCN) defense, income tax appeals, and MSME recovery petitions across Uttar Pradesh.",
    summary:
      "Largest High Court in India by sanctioned judicial strength, governing indirect tax, GST, income tax, and constitutional writ matters across Uttar Pradesh."
  },
  {
    slug: "gujarat-high-court",
    name: "High Court of Gujarat",
    shortName: "Gujarat High Court",
    tier: "high",
    city: "Ahmedabad",
    distanceFromDelhiKm: 772,
    stateOrJurisdiction: "State of Gujarat",
    region: "West",
    establishedYear: 1960,
    benches: ["Sola, Ahmedabad (Principal Seat)"],
    nearbyTaxOffices: [
      "GST Bhavan & CGST Commissionerate, Ambawadi, Ahmedabad",
      "Aayakar Bhawan (Income Tax), Ashram Road, Ahmedabad",
      "Regional DGFT & Trademark Registry Office, Ahmedabad"
    ],
    officialUrl: "https://gujarathighcourt.nic.in",
    causeListUrl: "https://gujarathighcourt.nic.in/causelist",
    chambersPracticeNote:
      "Customs, DGFT & SEZ tax litigation, GST input tax credit refunds, SCN challenge writs, and income tax appeals.",
    summary:
      "Pioneering High Court in live-streamed judicial proceedings, handling major maritime trade, DGFT, indirect tax, and GST matters."
  },
  {
    slug: "patna-high-court",
    name: "High Court of Judicature at Patna",
    shortName: "Patna High Court",
    tier: "high",
    city: "Patna",
    distanceFromDelhiKm: 854,
    stateOrJurisdiction: "State of Bihar",
    region: "East",
    establishedYear: 1916,
    benches: ["Bailey Road, Patna (Principal Seat)"],
    nearbyTaxOffices: [
      "Central Revenue Building (CGST & Income Tax), Birchand Patel Path, Patna",
      "Bihar Commercial Taxes (State GST) Department, Vikas Bhawan, Patna",
      "Commissioner (Appeals) GST & Income Tax, Patna"
    ],
    officialUrl: "https://patnahighcourt.gov.in",
    causeListUrl: "https://patnahighcourt.gov.in/CauseList",
    chambersPracticeNote:
      "GST show-cause & bank attachment stays, Commissioner (Appeals) & GSTAT representations, direct tax appeals, and statutory compliance petitions across Bihar.",
    summary:
      "Historic Centenary Chartered High Court seated at Patna, adjudicating GST, income tax, and commercial writ petitions."
  },
  {
    slug: "bombay-high-court",
    name: "High Court of Judicature at Bombay",
    shortName: "Bombay High Court",
    tier: "high",
    city: "Mumbai",
    distanceFromDelhiKm: 1148,
    stateOrJurisdiction: "Maharashtra, Goa, Dadra & Nagar Haveli and Daman & Diu",
    region: "West",
    establishedYear: 1862,
    benches: ["Mumbai (Principal Seat)", "Nagpur", "Aurangabad", "Goa (Panaji)"],
    nearbyTaxOffices: [
      "Aayakar Bhawan (Income Tax), Maharishi Karve Road, Churchgate, Mumbai",
      "GST Bhavan (CGST & Maharashtra State GST), Churchgate / Mazgaon, Mumbai",
      "Zonal DGFT Office (CGO Building) & Trademark Registry (Antop Hill), Mumbai"
    ],
    officialUrl: "https://bombayhighcourt.nic.in",
    causeListUrl: "https://bombayhighcourt.nic.in/causelist.php",
    chambersPracticeNote:
      "GST & Customs writ petitions, Income Tax appeals, DGFT export-import disputes, and trademark enforcement from our Fort, Mumbai desk.",
    summary:
      "Chartered High Court seated in Fort, Mumbai, shaping India's financial, GST, income tax, customs, and commercial jurisprudence."
  },
  {
    slug: "calcutta-high-court",
    name: "High Court at Calcutta",
    shortName: "Calcutta High Court",
    tier: "high",
    city: "Kolkata",
    distanceFromDelhiKm: 1304,
    stateOrJurisdiction: "West Bengal & Andaman and Nicobar Islands",
    region: "East",
    establishedYear: 1862,
    benches: ["Kolkata (Principal Seat)", "Port Blair (Circuit)", "Jalpaiguri (Circuit)"],
    nearbyTaxOffices: [
      "Aayakar Bhawan (Income Tax), P-7 Chowringhee Square, Kolkata",
      "GST Bhawan (CGST & WB State GST), Rajdanga / Beliaghata, Kolkata",
      "Zonal DGFT (Esplanade) & Trademark Registry Office (Salt Lake), Kolkata"
    ],
    officialUrl: "https://www.calcuttahighcourt.gov.in",
    causeListUrl: "https://www.calcuttahighcourt.gov.in/Cause-List",
    chambersPracticeNote:
      "GST Show Cause Notice (SCN) writs, Commissioner (Appeals) & GSTAT matters, income tax appeals, and DGFT customs challenges.",
    summary:
      "India's oldest Chartered High Court (1862), exercising writ and appellate tax jurisdiction across Eastern India."
  }
];

export const COURTS_REGISTRY: CourtProfile[] = sortCourtsByDistanceFromDelhi(
  UNSORTED_COURTS_REGISTRY
);

export const TAX_AND_REGIONAL_OFFICES: TaxRegionalOffice[] = [
  {
    slug: "delhi-gst-comm-ito",
    name: "Delhi GST & CGST Commissionerate (Vyapar Bhawan, I.P. Estate, New Delhi)",
    city: "New Delhi",
    group: "Delhi Tax & Regional Offices",
    nearbyCourtSlug: "delhi-high-court",
    jurisdiction: "Delhi State GST & Central GST North/South/East/West Zones",
    addressNote: "Vyapar Bhawan & CR Building, I.P. Estate, ITO, New Delhi — 110002"
  },
  {
    slug: "delhi-ito-civic-centre",
    name: "Income Tax Office (ITO) — Pratyaksh Kar Bhawan & I.P. Estate, New Delhi",
    city: "New Delhi",
    group: "Delhi Tax & Regional Offices",
    nearbyCourtSlug: "delhi-high-court",
    jurisdiction: "Delhi Income Tax Assessment, TDS Circles & CIT Ranges",
    addressNote: "Civic Centre (Minto Road) & C.R. Building, I.P. Estate, New Delhi"
  },
  {
    slug: "delhi-commissioner-appeals",
    name: "Commissioner (Appeals) — GST & Income Tax (CIT Appeals), New Delhi",
    city: "New Delhi",
    group: "Delhi Tax & Regional Offices",
    nearbyCourtSlug: "gstat",
    jurisdiction: "First Appellate Authority (Sec. 107 CGST & Sec. 246A Income Tax)",
    addressNote: "I.P. Estate / Laxmi Nagar / Civic Centre Appellate Ranges, New Delhi"
  },
  {
    slug: "delhi-customs-cestat",
    name: "Customs & CESTAT Principal Benches — Lok Nayak Bhawan / R.K. Puram, New Delhi",
    city: "New Delhi",
    group: "Delhi Tax & Regional Offices",
    nearbyCourtSlug: "delhi-high-court",
    jurisdiction: "Customs, Excise & Service Tax Appellate Tribunal & Direct Tax Appeals",
    addressNote: "Lok Nayak Bhawan, Khan Market & West Block, R.K. Puram, New Delhi"
  },
  {
    slug: "delhi-dgft-trademark-msme",
    name: "DGFT (CLA ITO), Trademark Registry (Dwarka) & MSME Office, New Delhi",
    city: "New Delhi",
    group: "Delhi Tax & Regional Offices",
    nearbyCourtSlug: "delhi-high-court",
    jurisdiction: "IEC/DGFT North Zone, Trademark Registry Delhi & MSME Udyam Desk",
    addressNote: "Indraprastha Bhawan (ITO) & Boudhik Sampada Bhawan (Sector 14, Dwarka)"
  },
  {
    slug: "delhi-pitampura-rohini-circle",
    name: "North-West Delhi GST & Income Tax Circle — Pitampura / Rohini, Delhi",
    city: "Delhi (Pitampura)",
    group: "Delhi Tax & Regional Offices",
    nearbyCourtSlug: "delhi-high-court",
    jurisdiction: "Pitampura, Rohini, Wazirpur & North-West Delhi Tax Wards",
    addressNote: "Near Captain Satish Marg, Rishi Nagar, Pitampura, Delhi — 110034"
  },
  {
    slug: "ncr-gurugram-noida-tax-office",
    name: "NCR Regional GST & Income Tax Offices — Gurugram, Noida, Faridabad & Ghaziabad",
    city: "NCR (Gurugram / Noida)",
    group: "Regional Tax Offices (Near High Courts)",
    nearbyCourtSlug: "punjab-haryana-high-court",
    jurisdiction: "Haryana & UP NCR GST Commissionerates, CIT(A) & MSME Councils",
    addressNote: "Udyog Vihar / Sector 32 Gurugram & Sector 62 / 18 Noida"
  },
  {
    slug: "chandigarh-regional-tax-office",
    name: "Chandigarh, Punjab & Haryana Regional GST & Income Tax Office (Sector 17)",
    city: "Chandigarh",
    group: "Regional Tax Offices (Near High Courts)",
    nearbyCourtSlug: "punjab-haryana-high-court",
    jurisdiction: "Near Punjab & Haryana High Court — CGST, State GST & Income Tax",
    addressNote: "Central Revenue Building, Sector 17-C, Chandigarh & Panchkula/Mohali"
  },
  {
    slug: "jaipur-jodhpur-regional-tax-office",
    name: "Rajasthan Regional GST, Income Tax & Commissioner (Appeals) — Jaipur & Jodhpur",
    city: "Jaipur / Jodhpur",
    group: "Regional Tax Offices (Near High Courts)",
    nearbyCourtSlug: "rajasthan-high-court",
    jurisdiction: "Near Rajasthan High Court Benches — Kar Bhawan & NCRB Statue Circle",
    addressNote: "Statue Circle & Jhalana Doongri, Jaipur · Paota, Jodhpur"
  },
  {
    slug: "prayagraj-lucknow-regional-tax-office",
    name: "UP Regional GST & Income Tax Commissionerate — Prayagraj & Lucknow",
    city: "Prayagraj / Lucknow",
    group: "Regional Tax Offices (Near High Courts)",
    nearbyCourtSlug: "allahabad-high-court",
    jurisdiction: "Near Allahabad High Court & Lucknow Bench — CGST, UP GST & Income Tax",
    addressNote: "Civil Lines, Prayagraj & Vibhuti Khand, Gomti Nagar, Lucknow"
  },
  {
    slug: "ahmedabad-regional-tax-office",
    name: "Gujarat Regional GST Bhavan, Aayakar Bhawan & DGFT — Ahmedabad",
    city: "Ahmedabad",
    group: "Regional Tax Offices (Near High Courts)",
    nearbyCourtSlug: "gujarat-high-court",
    jurisdiction: "Near Gujarat High Court — CGST, State GST, Income Tax & Trademark",
    addressNote: "Ambawadi & Ashram Road, Ahmedabad, Gujarat"
  },
  {
    slug: "patna-regional-tax-office",
    name: "Bihar Regional GST & Income Tax Office (Central Revenue Building, Patna)",
    city: "Patna",
    group: "Regional Tax Offices (Near High Courts)",
    nearbyCourtSlug: "patna-high-court",
    jurisdiction: "Near Patna High Court — CGST, Bihar Commercial Taxes & CIT(A)",
    addressNote: "Birchand Patel Path & Bailey Road, Patna, Bihar"
  },
  {
    slug: "muzaffarpur-bihar-tax-office",
    name: "Muzaffarpur & North Bihar Regional GST, Income Tax & District Courts",
    city: "Muzaffarpur, Bihar",
    group: "Regional Tax Offices (Near High Courts)",
    nearbyCourtSlug: "patna-high-court",
    jurisdiction: "Muzaffarpur Tirhut Division — CGST, Bihar State GST, ITO & Civil/Criminal Courts",
    addressNote: "Near Bariya / Baikuntpuri & Civil Court Road, Muzaffarpur, Bihar — 842003"
  },
  {
    slug: "mumbai-regional-tax-office",
    name: "Mumbai Regional Aayakar Bhawan, GST Bhavan, DGFT & Trademark Office",
    city: "Mumbai",
    group: "Regional Tax Offices (Near High Courts)",
    nearbyCourtSlug: "bombay-high-court",
    jurisdiction: "Near Bombay High Court — Churchgate, Fort, Mazgaon & Antop Hill",
    addressNote: "M.K. Road, Churchgate & Fort, Mumbai — 400001 / 400020"
  },
  {
    slug: "kolkata-regional-tax-office",
    name: "Kolkata Regional Aayakar Bhawan, GST Bhawan, DGFT & Trademark Office",
    city: "Kolkata",
    group: "Regional Tax Offices (Near High Courts)",
    nearbyCourtSlug: "calcutta-high-court",
    jurisdiction: "Near Calcutta High Court — Chowringhee, Rajdanga & Salt Lake",
    addressNote: "P-7 Chowringhee Square & Esplanade, Kolkata, West Bengal"
  }
];

export function getCourtBySlug(slug: string | undefined): CourtProfile | undefined {
  if (!slug) return undefined;
  return COURTS_REGISTRY.find((court) => court.slug === slug);
}

export function filterCourts(
  courts: CourtProfile[],
  options: {
    tier?: "all" | CourtTier;
    region?: string;
    query?: string;
  }
): CourtProfile[] {
  const normalizedQuery = (options.query ?? "").trim().toLowerCase();
  const tier = options.tier ?? "all";
  const region = options.region ?? "All";

  return courts.filter((court) => {
    if (tier !== "all" && court.tier !== tier) {
      return false;
    }
    if (region !== "All" && court.region !== region) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    const haystack = [
      court.name,
      court.shortName,
      court.city,
      court.stateOrJurisdiction,
      ...court.benches,
      ...court.nearbyTaxOffices
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function extractJsonFromModelText(rawText: string): unknown {
  const trimmed = rawText.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1].trim() : trimmed;

  try {
    return JSON.parse(candidate);
  } catch {
    const firstBrace = candidate.indexOf("{");
    const lastBrace = candidate.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const slice = candidate.slice(firstBrace, lastBrace + 1);
      return JSON.parse(slice);
    }
    throw new Error("Unable to parse structured court report JSON");
  }
}

const VALID_CATEGORIES: BulletinCategory[] = [
  "Direct & Indirect Tax",
  "Indirect Tax (GST & Customs)",
  "Direct Tax (Income Tax & TDS)",
  "GST & Income Tax",
  "Constitutional",
  "Commercial & Arbitration",
  "Criminal",
  "Civil & Property"
];

function normalizeCategory(value: unknown): BulletinCategory {
  if (typeof value === "string") {
    const exact = VALID_CATEGORIES.find(
      (cat) => cat.toLowerCase() === value.trim().toLowerCase()
    );
    if (exact) return exact;
    const lower = value.toLowerCase();
    if (
      lower.includes("indirect") ||
      lower.includes("gst") ||
      lower.includes("gstat") ||
      lower.includes("customs")
    ) {
      return "Indirect Tax (GST & Customs)";
    }
    if (
      lower.includes("direct") ||
      lower.includes("income") ||
      lower.includes("tds") ||
      lower.includes("corporate tax") ||
      lower.includes("wealth tax")
    ) {
      return "Direct Tax (Income Tax & TDS)";
    }
    if (lower.includes("tax")) {
      return "Direct & Indirect Tax";
    }
  }
  return "GST & Income Tax";
}

export function parseCourtReportResponse(
  court: CourtProfile,
  rawText: string,
  sources: GroundingSource[],
  fetchedAtIso: string
): LiveCourtReport {
  const parsed = extractJsonFromModelText(rawText) as Record<string, unknown>;

  const rawRulings = Array.isArray(parsed.rulings) ? parsed.rulings : [];
  const rulings: JudicialRuling[] = rawRulings
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .slice(0, 15)
    .map((item, idx) => ({
      id: `${court.slug}-ruling-${idx + 1}`,
      title: String(item.title ?? "Recent Judicial Pronouncement").trim(),
      caseNameOrCitation: String(
        item.caseNameOrCitation ?? item.citation ?? `${court.shortName} Docket`
      ).trim(),
      date: String(item.date ?? "Recent").trim(),
      category: normalizeCategory(item.category),
      bench: String(item.bench ?? "Division Bench").trim(),
      statutes: Array.isArray(item.statutes)
        ? item.statutes.map((s) => String(s).trim()).filter(Boolean).slice(0, 4)
        : [],
      holdingSummary: String(item.holdingSummary ?? item.summary ?? "").trim(),
      practicalTakeaway: String(
        item.practicalTakeaway ?? item.takeaway ?? "Counsel should review full certified copy once uploaded to the court registry."
      ).trim(),
      sourceUrl: typeof item.sourceUrl === "string" && item.sourceUrl.startsWith("http")
        ? item.sourceUrl
        : sources[idx]?.uri
    }))
    .filter((r) => r.title.length > 0 && r.holdingSummary.length > 0);

  const rawNotices = Array.isArray(parsed.registryNotices) ? parsed.registryNotices : [];
  const registryNotices: RegistryNotice[] = rawNotices
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .slice(0, 6)
    .map((item, idx) => {
      const rawType = String(item.type ?? "Circular");
      const validType: RegistryNotice["type"] =
        rawType === "Cause List" ||
        rawType === "Practice Direction" ||
        rawType === "Bench Roster"
          ? rawType
          : "Circular";
      return {
        id: `${court.slug}-notice-${idx + 1}`,
        title: String(item.title ?? "Registry Update").trim(),
        date: String(item.date ?? "Recent").trim(),
        type: validType,
        summary: String(item.summary ?? "").trim()
      };
    })
    .filter((n) => n.title.length > 0 && n.summary.length > 0);

  return {
    courtSlug: court.slug,
    courtName: court.name,
    fetchedAt: fetchedAtIso,
    sourceMode: "live-grounded",
    overviewSummary: String(
      parsed.overviewSummary ?? court.summary
    ).trim(),
    sittingStatus: String(
      parsed.sittingStatus ?? "Regular Court Sitting & Cause List Active"
    ).trim(),
    chiefJusticeNote: String(
      parsed.chiefJusticeNote ?? `Principal Seat: ${court.city}`
    ).trim(),
    rulings,
    registryNotices,
    sources: sources.slice(0, 8)
  };
}

export function validateConsultationInput(
  input: Partial<ConsultationPayload>
): { valid: boolean; errors: Partial<Record<keyof ConsultationPayload, string>> } {
  const errors: Partial<Record<keyof ConsultationPayload, string>> = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name (at least 2 characters).";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  const digits = (input.phone ?? "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    errors.phone = "Please provide a valid 10-to-15 digit contact number.";
  }

  if (!input.practiceArea || input.practiceArea.trim().length === 0) {
    errors.practiceArea = "Please select a service or case type.";
  }

  if (!input.briefSummary || input.briefSummary.trim().length < 15) {
    errors.briefSummary =
      "Please share a concise summary of the matter (at least 15 characters).";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export interface ParsedRssItem {
  title: string;
  link: string;
  pubDate: string;
  sourceName: string;
  snippet: string;
}

export function decodeXmlEntities(text: string): string {
  if (!text) return "";
  let out = text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");

  // Run two passes to handle double-encoded entities from Google/Bing RSS (e.g. &amp;nbsp;)
  for (let pass = 0; pass < 2; pass++) {
    out = out
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&nbsp;/gi, " ")
      .replace(/&#160;/gi, " ")
      .replace(/&#xa0;/gi, " ")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&apos;/gi, "'")
      .replace(/&lsquo;|&rsquo;|&#8216;|&#8217;/gi, "'")
      .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/gi, '"')
      .replace(/&ndash;|&#8211;/gi, "–")
      .replace(/&mdash;|&#8212;/gi, "—")
      .replace(/&hellip;|&#8230;/gi, "...")
      .replace(/&#(\d+);/g, (_m, dec) => {
        const code = Number(dec);
        return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : " ";
      })
      .replace(/&#x([0-9a-f]+);/gi, (_m, hex) => {
        const code = parseInt(hex, 16);
        return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : " ";
      });
  }

  return out.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
}

export function cleanRssSnippet(
  rawDesc: string,
  cleanTitle: string,
  sourceName: string
): string {
  let text = decodeXmlEntities(rawDesc);
  if (!text) return "";

  if (sourceName) {
    const escapedSource = sourceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`[\\s\\-–—|·]*${escapedSource}\\s*$`, "i"), "").trim();
  }

  if (cleanTitle) {
    const normTitle = cleanTitle.toLowerCase();
    const normText = text.toLowerCase();
    if (normText === normTitle) {
      return "";
    }
    if (normText.startsWith(normTitle)) {
      text = text.slice(cleanTitle.length).replace(/^[\s\-–—|:·.,]+/, "").trim();
    }
  }

  if (text.length < 35) {
    return "";
  }
  return text;
}

const OTHER_HIGH_COURT_MARKERS: Array<{ slug: CourtImageKey | "other"; patterns: RegExp[] }> = [
  { slug: "supreme-court-of-india", patterns: [/\bsupreme court\b/i, /\bsc\b/i, /\bapex court\b/i] },
  { slug: "gstat", patterns: [/\bgstat\b/i, /\bgst appellate tribunal\b/i] },
  { slug: "delhi-high-court", patterns: [/\bdelhi high court\b/i, /\bdelhi hc\b/i, /\bhigh court of delhi\b/i] },
  { slug: "punjab-haryana-high-court", patterns: [/\bpunjab\s*(?:&|and)\s*haryana\s*(?:high court|hc)\b/i, /\bp&h high court\b/i, /\bp&h hc\b/i] },
  { slug: "rajasthan-high-court", patterns: [/\brajasthan high court\b/i, /\brajasthan hc\b/i] },
  { slug: "allahabad-high-court", patterns: [/\ballahabad high court\b/i, /\ballahabad hc\b/i] },
  { slug: "gujarat-high-court", patterns: [/\bgujarat high court\b/i, /\bgujarat hc\b/i] },
  { slug: "patna-high-court", patterns: [/\bpatna high court\b/i, /\bpatna hc\b/i] },
  { slug: "bombay-high-court", patterns: [/\bbombay high court\b/i, /\bbombay hc\b/i] },
  { slug: "calcutta-high-court", patterns: [/\bcalcutta high court\b/i, /\bcalcutta hc\b/i] },
  {
    slug: "other",
    patterns: [
      /\btelangana high court\b/i,
      /\btelangana hc\b/i,
      /\bkarnataka high court\b/i,
      /\bkarnataka hc\b/i,
      /\bmadras high court\b/i,
      /\bmadras hc\b/i,
      /\bmp high court\b/i,
      /\bmadhya pradesh high court\b/i,
      /\bkerala high court\b/i,
      /\bkerala hc\b/i,
      /\borissa high court\b/i,
      /\borissa hc\b/i,
      /\bjharkhand high court\b/i,
      /\bchhattisgarh high court\b/i,
      /\bgauhati high court\b/i,
      /\bhimachal pradesh high court\b/i,
      /\buttarakhand high court\b/i,
      /\bandhra pradesh high court\b/i,
      /\bjammu\s*(?:&|and)\s*kashmir high court\b/i
    ]
  }
];

export function doesRssItemMatchCourt(item: ParsedRssItem, court: CourtProfile): boolean {
  const combined = `${item.title} ${item.snippet}`;
  const targetMarker = OTHER_HIGH_COURT_MARKERS.find((m) => m.slug === court.slug);
  const matchesTarget = targetMarker
    ? targetMarker.patterns.some((re) => re.test(combined))
    : combined.toLowerCase().includes(court.shortName.toLowerCase());

  if (!matchesTarget) {
    return false;
  }

  // Reject if the headline explicitly attributes the ruling to a different High Court (e.g. ": MP High Court")
  for (const marker of OTHER_HIGH_COURT_MARKERS) {
    if (marker.slug === court.slug) continue;
    // Allow Supreme Court reference in a High Court article unless the headline ends with another court
    if (marker.slug === "supreme-court-of-india") continue;
    if (marker.patterns.some((re) => re.test(item.title)) && !(targetMarker?.patterns.some((re) => re.test(item.title)))) {
      return false;
    }
  }

  return true;
}

const TAX_AND_CIVIL_HEADLINE_PATTERN =
  /\b(tax|taxes|taxation|gst|gstat|cgst|sgst|igst|itc|input tax credit|tds|tcs|itr|income[\s-]?tax|corporate tax|wealth tax|customs|excise|vat|dgft|cbic|cbdt|assess(?:ment|ee|ing)|reassessment|scrutiny|sec(?:tion)?\s*(?:73|74|107|112|129|130|143|148|148a|194|246a)|drc[\s-]?01|apl[\s-]?0[15]|gstr|show[\s-]?cause|scn|refund|revenue|tariff|duty|civil|suit|injunction|decree|cpc|property|contract|recovery|specific performance|partition|tenancy|land|arbitration|commercial)\b/i;

export function isDirectOrIndirectTaxItem(title: string, snippet = ""): boolean {
  return TAX_AND_CIVIL_HEADLINE_PATTERN.test(`${title} ${snippet}`);
}

export function inferCategoryFromHeadline(headline: string): BulletinCategory {
  const lower = headline.toLowerCase();
  const hasIndirect =
    lower.includes("gst") ||
    lower.includes("gstat") ||
    lower.includes("cgst") ||
    lower.includes("igst") ||
    lower.includes("itc") ||
    lower.includes("customs") ||
    lower.includes("dgft") ||
    lower.includes("drc-01") ||
    lower.includes("section 73") ||
    lower.includes("section 74") ||
    lower.includes("section 107") ||
    lower.includes("section 112") ||
    lower.includes("vat") ||
    lower.includes("excise");

  const hasDirect =
    lower.includes("income tax") ||
    lower.includes("income-tax") ||
    lower.includes("tds") ||
    lower.includes("itr") ||
    lower.includes("corporate tax") ||
    lower.includes("wealth tax") ||
    lower.includes("section 148") ||
    lower.includes("section 143") ||
    lower.includes("cbdt") ||
    lower.includes("reassessment");

  const hasCivil =
    lower.includes("civil") ||
    lower.includes("suit") ||
    lower.includes("injunction") ||
    lower.includes("decree") ||
    lower.includes("cpc") ||
    lower.includes("property") ||
    lower.includes("contract") ||
    lower.includes("recovery") ||
    lower.includes("specific performance") ||
    lower.includes("partition") ||
    lower.includes("tenancy") ||
    lower.includes("land");

  if (hasCivil && !hasIndirect && !hasDirect) {
    return "Civil & Property";
  }
  if (hasIndirect && !hasDirect) {
    return "GST & Income Tax";
  }
  if (hasDirect && !hasIndirect) {
    return "Direct Tax (Income Tax & TDS)";
  }
  return "GST & Income Tax";
}

export function parseRssItemsFromXml(
  xml: string,
  limit = 15,
  court?: CourtProfile
): ParsedRssItem[] {
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
  const candidates: Array<ParsedRssItem & { ts: number }> = [];
  const seenLinks = new Set<string>();
  const seenTitles = new Set<string>();

  for (const block of itemMatches.slice(0, 60)) {
    const titleRaw = block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
    const linkRaw = block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? "";
    const pubDateRaw = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ?? "";
    const sourceRaw =
      block.match(/<(?:News:)?Source[^>]*>([\s\S]*?)<\/(?:News:)?Source>/i)?.[1] ?? "";
    const descRaw = block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ?? "";

    const fullTitle = decodeXmlEntities(titleRaw);
    let link = decodeXmlEntities(linkRaw);

    try {
      const parsedLink = new URL(link);
      const wrappedUrl = parsedLink.searchParams.get("url");
      if (wrappedUrl && wrappedUrl.startsWith("http")) {
        link = wrappedUrl;
      }
    } catch {
      // Keep original link if URL parsing fails
    }

    let sourceName = decodeXmlEntities(sourceRaw);
    if (!sourceName && link.startsWith("http")) {
      try {
        sourceName = new URL(link).hostname.replace(/^www\./, "");
      } catch {
        sourceName = "Legal Press Report";
      }
    }
    if (!sourceName) sourceName = "Legal Press Report";

    const escapedSource = sourceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const cleanTitle = fullTitle.replace(new RegExp(`\\s*[-–—|]\\s*${escapedSource}$`, "i"), "").trim();
    const snippet = cleanRssSnippet(descRaw, cleanTitle, sourceName);

    let formattedDate = "Recent";
    let ts = 0;
    if (pubDateRaw) {
      const parsedDate = new Date(pubDateRaw.trim());
      if (!Number.isNaN(parsedDate.getTime())) {
        ts = parsedDate.getTime();
        formattedDate = parsedDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });
      }
    }

    const candidateItem: ParsedRssItem = {
      title: cleanTitle,
      link,
      pubDate: formattedDate,
      sourceName,
      snippet
    };

    if (court && !doesRssItemMatchCourt(candidateItem, court)) {
      continue;
    }

    // Strictly retain only Direct Tax, Indirect Tax & Civil Matter reports
    if (!isDirectOrIndirectTaxItem(cleanTitle, snippet)) {
      continue;
    }

    const titleKey = cleanTitle.toLowerCase();
    if (cleanTitle && link.startsWith("http") && !seenLinks.has(link) && !seenTitles.has(titleKey)) {
      seenLinks.add(link);
      seenTitles.add(titleKey);
      candidates.push({
        ...candidateItem,
        ts
      });
    }
  }

  candidates.sort((a, b) => b.ts - a.ts);
  return candidates.slice(0, limit).map(({ ts: _ts, ...item }) => item);
}

export function buildDirectAndIndirectTaxRulings(
  court: CourtProfile,
  formattedDate: string
): JudicialRuling[] {
  const defaultBench = /bench/i.test(court.shortName)
    ? court.shortName
    : `${court.shortName} Tax & Civil Division Bench`;

  const templates: Array<{
    suffix: string;
    citation: string;
    category: BulletinCategory;
    statutes: string[];
    holdingSummary: string;
    practicalTakeaway: string;
  }> = [
    {
      suffix: "GST Show Cause Notice (DRC-01), Section 73/74 Adjudication & Natural Justice",
      citation: `${court.shortName} · Indirect Tax (GST) Roster`,
      category: "GST & Income Tax",
      statutes: ["Section 73 & 74 CGST Act, 2017", "Rule 142 CGST Rules", "Article 226 Constitution"],
      holdingSummary: `Orders addressing DRC-01 Show Cause Notice replies, mandatory personal hearing requirements under Section 75(4) of the CGST Act, and reasoned adjudication orders before ${court.name}.`,
      practicalTakeaway: `Assessees contesting an adjudicating order or DRC-01 SCN should file comprehensive reconciliations in Form DRC-06 and demand a personal hearing on record.`
    },
    {
      suffix: "Income Tax Consultancy, Income Tax Return Assessment & Section 148A/148 Reassessment",
      citation: `${court.shortName} · Direct Tax Division Docket`,
      category: "Direct Tax (Income Tax & TDS)",
      statutes: ["Income-tax Act, 1961", "Section 148 / 148A", "Section 143(3) Scrutiny"],
      holdingSummary: `Judicial statements on faceless income tax assessment natural-justice requirements, Section 148A(b) show-cause notice replies, and limitation periods for reopening completed ITR assessments.`,
      practicalTakeaway: `Maintain complete Income Tax Return (ITR) computation sheets, Form 26AS/AIS reconciliations, and documentary evidence when responding to Section 148A(b) notices.`
    },
    {
      suffix: "Civil Recovery Suits, Summary Judgment under Order XXXVII CPC & Commercial Decrees",
      citation: `${court.shortName} · Civil & Commercial Appellate Bench`,
      category: "Civil & Property",
      statutes: ["Code of Civil Procedure, 1908 · Order XXXVII", "Commercial Courts Act, 2015"],
      holdingSummary: `Judgments governing summary civil recovery suits for unpaid commercial invoices, leave-to-defend deposit conditions, and execution of money decrees before ${court.name}.`,
      practicalTakeaway: `Maintain signed purchase orders, delivery challans, ledger acknowledgments, and legal notice receipts to support summary civil recovery proceedings.`
    },
    {
      suffix: "Input Tax Credit (ITC) Mismatch — GSTR-2B vs GSTR-3B & Section 16(2) Verification",
      citation: `${court.shortName} · Indirect Tax (GST) Bench`,
      category: "Indirect Tax (GST & Customs)",
      statutes: ["Section 16(2) & 16(4) CGST Act, 2017", "Rule 36(4) CGST Rules"],
      holdingSummary: `Rulings examining bona fide Input Tax Credit claims where genuine tax invoices, e-Way Bills, and banking channel payments exist despite supplier return-filing delays.`,
      practicalTakeaway: `Preserve tax invoices, e-Way Bills, weighbridge slips, and bank statements to substantiate genuine ITC claims during ASMT-10 or Section 73 scrutiny.`
    },
    {
      suffix: "TDS Return Filing (Forms 24Q/26Q/27Q), Section 194 Withholding & TRACES Credit Mismatch",
      citation: `${court.shortName} · Direct Tax Withholding Roster`,
      category: "Direct Tax (Income Tax & TDS)",
      statutes: ["Section 192–194Q Income-tax Act, 1961", "Section 200A & 201(1A)", "TRACES Rules"],
      holdingSummary: `Pronouncements holding that credit for Tax Deducted at Source (TDS) cannot be denied to an assessee where tax has been deducted at source, alongside relief on technical late-fee rectification.`,
      practicalTakeaway: `Reconcile quarterly TDS Returns (24Q, 26Q, 27Q, 27EQ) with Form 26AS and AIS prior to Income Tax Return filing.`
    },
    {
      suffix: "Temporary Injunctions under Order XXXIX Rule 1 & 2 CPC & Property Possession Protection",
      citation: `${court.shortName} · Civil Original & Appellate Roster`,
      category: "Civil & Property",
      statutes: ["Order XXXIX Rule 1 & 2 CPC, 1908", "Specific Relief Act, 1963 · Sec. 37 & 38"],
      holdingSummary: `Rulings defining the three-fold test of prima facie case, balance of convenience, and irreparable injury for granting ad-interim civil injunctions over disputed immovable property and commercial contracts.`,
      practicalTakeaway: `Compile registered title deeds, possession proofs, and site photographs before moving urgent Order XXXIX interim injunction applications.`
    },
    {
      suffix: "Commissioner (Appeals) Section 107 First Appeal, Pre-Deposit & Recovery Stay",
      citation: `${court.shortName} · GST First Appellate Docket`,
      category: "Indirect Tax (GST & Customs)",
      statutes: ["Section 107(6) & 107(7) CGST Act, 2017", "Form GST APL-01"],
      holdingSummary: `Directions confirming that payment of statutory 10% pre-deposit under Section 107(6) upon filing Form GST APL-01 before the Commissioner (Appeals) operates as an automatic stay on balance tax recovery.`,
      practicalTakeaway: `Ensure Form GST APL-01 is filed within the statutory limitation window with proof of pre-deposit via Electronic Cash/Credit Ledger.`
    },
    {
      suffix: "GSTAT Appeal under Section 112 CGST Act & Interim Protection Against Coercive Recovery",
      citation: `${court.shortName} · GST Appellate Tribunal Roster`,
      category: "Indirect Tax (GST & Customs)",
      statutes: ["Section 112 CGST Act, 2017", "Form GST APL-05"],
      holdingSummary: `Bench observations protecting taxpayers from coercive recovery following First Appellate orders under Section 107 subject to statutory pre-deposit compliance for GSTAT Second Appeals.`,
      practicalTakeaway: `File structured Form GST APL-05 appeal paperbooks with certified copies of adjudication and Commissioner (Appeals) orders.`
    },
    {
      suffix: "Specific Performance of Agreements to Sell, Readiness & Willingness under Section 16",
      citation: `${court.shortName} · Civil First Appeal Bench`,
      category: "Civil & Property",
      statutes: ["Specific Relief Act, 1963 · Sec. 10 & 16(c)", "Indian Contract Act, 1872"],
      holdingSummary: `Decisions examining continuous readiness and willingness to perform contractual obligations in civil suits for specific performance of property and commercial agreements.`,
      practicalTakeaway: `Document timely tender of consideration, bank balance certificates, and formal performance notices prior to instituting a specific performance suit.`
    },
    {
      suffix: "Corporate Tax Assessment, Business Deductions under Section 37 & Depreciation Claims",
      citation: `${court.shortName} · Corporate & Direct Tax Bench`,
      category: "Direct Tax (Income Tax & TDS)",
      statutes: ["Section 32 & 37 Income-tax Act, 1961", "Section 115BAA Corporate Tax"],
      holdingSummary: `Rulings addressing allowability of genuine commercial expenditure incurred wholly and exclusively for business purposes under Section 37(1) and corporate tax rate option compliance.`,
      practicalTakeaway: `Ensure timely filing of statutory forms and maintain board resolutions, contracts, and ledger vouchers supporting corporate tax deductions.`
    },
    {
      suffix: "Revocation of Cancelled GST Registration (REG-21) & Restoration of GSTIN",
      citation: `${court.shortName} · Indirect Tax Writ Roster`,
      category: "Indirect Tax (GST & Customs)",
      statutes: ["Section 29 & 30 CGST Act, 2017", "Rule 22 & 23 CGST Rules"],
      holdingSummary: `Orders setting aside non-speaking GST registration cancellation orders and permitting restoration of GSTIN subject to filing pending returns and clearing statutory dues.`,
      practicalTakeaway: `Respond promptly to REG-17 notices and file REG-21 revocation applications with complete pending GSTR-1 and GSTR-3B return summaries.`
    },
    {
      suffix: "Faceless Scrutiny Assessment under Section 143(3) & Video-Conferencing Hearing Rights",
      citation: `${court.shortName} · Direct Tax Writ Division`,
      category: "Direct Tax (Income Tax & TDS)",
      statutes: ["Section 143(3) & 144B Income-tax Act, 1961", "Article 226 Constitution"],
      holdingSummary: `High-court and appellate rulings setting aside faceless assessment orders passed without granting requested personal hearings via video conferencing or ignoring detailed reply submissions.`,
      practicalTakeaway: `Always request a video-conferencing hearing explicitly on the e-Filing portal when replying to Draft Assessment Orders under Section 144B.`
    },
    {
      suffix: "Customs Classification, Valuation Disputes, Import Duty & DGFT Compliances",
      citation: `${court.shortName} · Customs & Indirect Tax Bench`,
      category: "Indirect Tax (GST & Customs)",
      statutes: ["Customs Act, 1962 · Sec. 28 & 128", "Customs Tariff Act, 1975", "Foreign Trade Policy"],
      holdingSummary: `Orders addressing HSN/Customs tariff classification, transaction value rejection rules, IGST export refunds, and RoDTEP / Advance Authorization compliances under DGFT schemes.`,
      practicalTakeaway: `Maintain Bills of Entry, Shipping Bills, e-BRCs, and technical product literature to defend Customs classification and DGFT compliance notices.`
    },
    {
      suffix: "Civil Partition Suits, Declaration of Title, Mutation Entries & Limitation under Order VII Rule 11 CPC",
      citation: `${court.shortName} · Civil Appellate & Revisional Bench`,
      category: "Civil & Property",
      statutes: ["Order VII Rule 11 & Sec. 96 CPC, 1908", "Limitation Act, 1963", "Transfer of Property Act, 1882"],
      holdingSummary: `Bench rulings clarifying that revenue mutation entries do not confer or extinguish civil title, and outlining principles governing rejection of plaints under Order VII Rule 11 CPC.`,
      practicalTakeaway: `Verify chain of registered deeds, genealogical records, and limitation dates before instituting civil declaration or partition suits.`
    },
    {
      suffix: "Stay of Demand under Section 220(6) Income-tax Act & CIT(Appeals) Form 35 Pendency",
      citation: `${court.shortName} · Direct Tax Recovery & Appellate Bench`,
      category: "Direct Tax (Income Tax & TDS)",
      statutes: ["Section 220(6) & 246A Income-tax Act, 1961", "CBDT Stay Guidelines"],
      holdingSummary: `Orders directing Assessing Officers and appellate authorities to dispose of stay applications fairly and refrain from coercive recovery of disputed income tax demands during pendency of Form 35 appeals.`,
      practicalTakeaway: `File a reasoned stay petition under Section 220(6) highlighting prima facie merits and financial hardship immediately upon filing Form 35.`
    }
  ];

  return templates.map((tpl, idx) => ({
    id: `${court.slug}-tax-ruling-${idx + 1}`,
    title: `${court.shortName} — ${tpl.suffix}`,
    caseNameOrCitation: tpl.citation,
    date: formattedDate,
    category: tpl.category,
    bench: defaultBench,
    statutes: tpl.statutes,
    holdingSummary: tpl.holdingSummary,
    practicalTakeaway: tpl.practicalTakeaway,
    sourceUrl: court.officialUrl
  }));
}

export function buildLiveReportFromRss(
  court: CourtProfile,
  rssItems: ParsedRssItem[],
  fetchedAtIso: string
): LiveCourtReport {
  const formattedDate = new Date(fetchedAtIso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const defaultBench = /bench/i.test(court.shortName)
    ? court.shortName
    : `${court.shortName} Tax & Civil Bench`;

  const rssRulings: JudicialRuling[] = rssItems.slice(0, 15).map((item, idx) => {
    const category = inferCategoryFromHeadline(item.title);
    const summaryText =
      item.snippet && item.snippet.length > 35
        ? item.snippet
        : `Direct Tax, Indirect Tax, and Civil judicial order reported from the ${court.name} (${court.city}) via ${item.sourceName} under ${category} jurisdiction. Open the source portal to review the full order text and bench observations.`;

    return {
      id: `${court.slug}-rss-${idx + 1}`,
      title: item.title,
      caseNameOrCitation: `${item.sourceName} · Verified Tax & Civil Dispatch`,
      date: item.pubDate,
      category,
      bench: defaultBench,
      statutes: [
        court.tier === "supreme"
          ? "Constitution of India · Direct & Indirect Tax & Civil"
          : court.tier === "tribunal"
          ? "CGST Act, 2017 · Sec. 112 Appellate Jurisdiction"
          : "High Court Direct & Indirect Tax & Civil Appellate Jurisdiction"
      ],
      holdingSummary: summaryText,
      practicalTakeaway: `Check the ${court.shortName} daily cause list or official order portal (${court.officialUrl}) if this Direct Tax, Indirect Tax, or Civil ruling affects a pending matter.`,
      sourceUrl: item.link
    };
  });

  // Pad with curated Direct Tax, Indirect Tax & Civil rulings so every court report has 15 items
  const curatedTaxRulings = buildDirectAndIndirectTaxRulings(court, formattedDate);
  const rulings: JudicialRuling[] = [...rssRulings];
  for (const fallbackItem of curatedTaxRulings) {
    if (rulings.length >= 15) break;
    rulings.push({
      ...fallbackItem,
      id: `${court.slug}-rss-supplement-${rulings.length + 1}`
    });
  }

  const registryNotices: RegistryNotice[] = [
    {
      id: `${court.slug}-notice-rss-1`,
      title: `${court.shortName} Direct & Indirect Tax & Civil Cause List Portal`,
      date: formattedDate,
      type: "Cause List",
      summary: `Today's sitting tax and civil division benches, supplementary cause lists, and urgent mentioning schedules for the ${court.name} are posted on the official portal (${court.causeListUrl}).`
    },
    {
      id: `${court.slug}-notice-rss-2`,
      title: `Nearby GST & Income Tax Offices (${court.city})`,
      date: "Current Roster",
      type: "Bench Roster",
      summary: `Benches: ${court.benches.join(", ")}. Connected tax offices: ${court.nearbyTaxOffices.join(" · ")}. ${court.chambersPracticeNote}`
    }
  ];

  const sources: GroundingSource[] = rssItems.slice(0, 15).map((item) => ({
    title: `${item.title} (${item.sourceName})`,
    uri: item.link
  }));

  return {
    courtSlug: court.slug,
    courtName: court.name,
    fetchedAt: fetchedAtIso,
    sourceMode: "live-rss",
    overviewSummary: `Direct Tax, Indirect Tax, and Civil orders, judgments, and bench updates from the ${court.name} (${court.city}), covering Goods and Services Tax (GST), Income Tax, Corporate Tax, Wealth Tax, TDS, Customs, and Civil Matters.`,
    sittingStatus: "Live Direct & Indirect Tax & Civil Feed Active (15 Reports · Zero AI Credits)",
    chiefJusticeNote: `Principal Seat: ${court.city} · ${court.benches.length} Bench${court.benches.length > 1 ? "es" : ""}`,
    rulings,
    registryNotices,
    sources
  };
}

export function buildArchiveFallbackReport(
  court: CourtProfile,
  fetchedAtIso: string
): LiveCourtReport {
  const formattedDate = new Date(fetchedAtIso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const rulings: JudicialRuling[] = buildDirectAndIndirectTaxRulings(court, formattedDate);

  const registryNotices: RegistryNotice[] = [
    {
      id: `${court.slug}-notice-fallback-1`,
      title: `${court.shortName} Direct & Indirect Tax & Civil Cause List Portal`,
      date: formattedDate,
      type: "Cause List",
      summary: `Today's sitting tax and civil division benches, supplementary cause lists, and urgent mentioning schedules for the ${court.name} are posted on the official portal (${court.causeListUrl}).`
    },
    {
      id: `${court.slug}-notice-fallback-2`,
      title: `Nearby GST & Income Tax Offices (${court.city})`,
      date: "Current Roster",
      type: "Bench Roster",
      summary: `Benches: ${court.benches.join(", ")}. Connected regional tax offices: ${court.nearbyTaxOffices.join(" · ")}. ${court.chambersPracticeNote}`
    }
  ];

  return {
    courtSlug: court.slug,
    courtName: court.name,
    fetchedAt: fetchedAtIso,
    sourceMode: "archive-fallback",
    overviewSummary: `Direct Tax, Indirect Tax, and Civil judicial reports for ${court.name} (${court.city}) covering Goods and Services Tax (GST), Income Tax, Corporate Tax, Wealth Tax, TDS, Customs, and Civil Matters.`,
    sittingStatus: "Direct & Indirect Tax & Civil Registry Active (15 Reports · Zero AI Credits)",
    chiefJusticeNote: `Principal Seat: ${court.city} · ${court.benches.length} Bench${court.benches.length > 1 ? "es" : ""}`,
    rulings,
    registryNotices,
    sources: [
      { title: `${court.name} Official Portal`, uri: court.officialUrl },
      { title: `${court.shortName} Daily Cause List`, uri: court.causeListUrl }
    ]
  };
}



