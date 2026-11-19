export type CourtTier = "supreme" | "tribunal" | "high";

export type CourtImageKey =
  | "supreme-court-of-india"
  | "gstat"
  | "delhi-high-court"
  | "bombay-high-court"
  | "madras-high-court"
  | "calcutta-high-court"
  | "karnataka-high-court"
  | "allahabad-high-court"
  | "gujarat-high-court"
  | "punjab-haryana-high-court"
  | "patna-high-court"
  | "rajasthan-high-court"
  | "telangana-high-court";

export type BulletinCategory =
  | "Constitutional"
  | "Tax & Corporate"
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
  region: "National" | "North" | "West" | "South" | "East";
  establishedYear: number;
  benches: string[];
  officialUrl: string;
  causeListUrl: string;
  chambersPracticeNote: string;
  summary: string;
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
    officialUrl: "https://www.sci.gov.in",
    causeListUrl: "https://www.sci.gov.in/cause-list/",
    chambersPracticeNote:
      "Chambers maintains an active Advocate-on-Record (AoR) filing desk at Tilak Marg for Special Leave Petitions (Article 136), Writ Petitions (Article 32), Transfer Petitions, and Constitutional Bench references.",
    summary:
      "Apex constitutional court of the Republic of India exercising original, appellate, and advisory jurisdiction over constitutional, civil, criminal, tax, and regulatory matters."
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
    officialUrl: "https://delhihighcourt.nic.in",
    causeListUrl: "https://delhihighcourt.nic.in/web/cause-list",
    chambersPracticeNote:
      "Original Side commercial suits, Section 34/37 arbitration challenges, Intellectual Property Division (IPD) filings, and Article 226 writ petitions against central ministries and regulators.",
    summary:
      "Premier commercial and constitutional High Court featuring India's dedicated Intellectual Property Division (IPD) and Original Civil Jurisdiction."
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
    officialUrl: "https://gstat.gov.in",
    causeListUrl: "https://efiling.gstat.gov.in",
    chambersPracticeNote:
      "Second-level appellate representation under Section 112 of the CGST Act against Orders-in-Appeal (Section 107) and Revisional Orders (Section 108), pre-deposit structuring, and GSTAT e-Filing Portal hearings.",
    summary:
      "India's statutory second-level Goods and Services Tax Appellate Tribunal (Principal Bench in New Delhi), hearing GST demand, input tax credit, and valuation appeals under Section 112 CGST."
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
    officialUrl: "https://highcourtchd.gov.in",
    causeListUrl: "https://highcourtchd.gov.in/sub_pages/top_menu/causelist/causelist.php",
    chambersPracticeNote:
      "GST assessment & ITC block writs, industrial/MSME recovery disputes, corporate income tax appeals, DGFT customs compliance, and commercial arbitration across NCR Gurugram, Mohali & Chandigarh.",
    summary:
      "Capitol Complex High Court at Chandigarh exercising corporate, tax, GST, and commercial writ jurisdiction across Haryana, Punjab, and Chandigarh."
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
    officialUrl: "https://hcraj.nic.in",
    causeListUrl: "https://hcraj.nic.in/hcraj/causelist.php",
    chambersPracticeNote:
      "Mining, industrial & renewable-energy corporate contracts, Section 148 income tax reassessment writs, GST demand stays, and commercial appeals at Jaipur and Jodhpur.",
    summary:
      "Dual-bench High Court serving Rajasthan's industrial, energy, and export corridors across direct taxation, GST, and corporate commercial litigation."
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
    officialUrl: "https://www.allahabadhighcourt.in",
    causeListUrl: "https://www.allahabadhighcourt.in/causelist/index.html",
    chambersPracticeNote:
      "GST enforcement & e-way bill seizure writs, state infrastructure & public procurement contracts, corporate income tax appeals, and commercial recovery.",
    summary:
      "Largest High Court in India by sanctioned judicial strength, governing commercial, indirect tax, GST, and corporate constitutional matters across Uttar Pradesh."
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
    officialUrl: "https://gujarathighcourt.nic.in",
    causeListUrl: "https://gujarathighcourt.nic.in/causelist",
    chambersPracticeNote:
      "Customs, SEZ & GIFT City financial regulatory litigation, maritime trade disputes, GST input tax credit refunds, and corporate tax writs.",
    summary:
      "Pioneering High Court in live-streamed judicial proceedings, handling major maritime trade, industrial, indirect tax, and IFSC/GIFT City regulatory matters."
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
    officialUrl: "https://patnahighcourt.gov.in",
    causeListUrl: "https://patnahighcourt.gov.in/CauseList",
    chambersPracticeNote:
      "GST show-cause & bank attachment stays, commercial infrastructure & PSU contract writs, direct tax appeals, and corporate compliance petitions across Bihar.",
    summary:
      "Historic Centenary Chartered High Court seated at Patna, adjudicating GST, commercial contract, tax appellate, and corporate writ petitions."
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
    officialUrl: "https://bombayhighcourt.nic.in",
    causeListUrl: "https://bombayhighcourt.nic.in/causelist.php",
    chambersPracticeNote:
      "Admiralty & maritime actions, SEBI/RBI regulatory writs, NCLT/IBC appellate challenges, corporate tax appeals, and Original Side commercial injunctions at Fort, Mumbai.",
    summary:
      "Chartered High Court seated in Fort, Mumbai, shaping India's financial, corporate, admiralty, insolvency, and tax jurisprudence."
  },
  {
    slug: "telangana-high-court",
    name: "High Court for the State of Telangana",
    shortName: "Telangana High Court",
    tier: "high",
    city: "Hyderabad",
    distanceFromDelhiKm: 1254,
    stateOrJurisdiction: "State of Telangana",
    region: "South",
    establishedYear: 1919,
    benches: ["Madina, Hyderabad (Principal Seat)"],
    officialUrl: "https://tshc.gov.in",
    causeListUrl: "https://tshc.gov.in/getCauseList",
    chambersPracticeNote:
      "Pharmaceutical, IT/SEZ & biotech corporate tax writs, NCLT/IBC connected appeals, GST refunds, and commercial arbitration matters in Hyderabad.",
    summary:
      "Principal appellate forum in Hyderabad governing corporate governance, customs/SEZ taxation, technology companies, and commercial litigation."
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
    officialUrl: "https://www.calcuttahighcourt.gov.in",
    causeListUrl: "https://www.calcuttahighcourt.gov.in/Cause-List",
    chambersPracticeNote:
      "Original Side commercial suits, arbitration enforcement, mining and infrastructure contract disputes, and admiralty proceedings.",
    summary:
      "India's oldest Chartered High Court (1862), exercising Ordinary Original Civil Jurisdiction across Eastern India and admiralty waters."
  },
  {
    slug: "karnataka-high-court",
    name: "High Court of Karnataka",
    shortName: "Karnataka High Court",
    tier: "high",
    city: "Bengaluru",
    distanceFromDelhiKm: 1740,
    stateOrJurisdiction: "State of Karnataka",
    region: "South",
    establishedYear: 1884,
    benches: ["Bengaluru (Principal Seat)", "Dharwad", "Kalaburagi"],
    officialUrl: "https://karnatakajudiciary.kar.nic.in",
    causeListUrl: "https://karnatakajudiciary.kar.nic.in/causelist.php",
    chambersPracticeNote:
      "Startup & corporate litigation, technology & fintech regulation writs, cross-border commercial disputes, and direct/GST tax appeals from our MG Road desk.",
    summary:
      "Seated at Attara Kacheri in Bengaluru, adjudicating pivotal technology law, corporate governance, NCLT commercial challenges, and direct tax disputes."
  },
  {
    slug: "madras-high-court",
    name: "High Court of Judicature at Madras",
    shortName: "Madras High Court",
    tier: "high",
    city: "Chennai",
    distanceFromDelhiKm: 1756,
    stateOrJurisdiction: "Tamil Nadu & Puducherry",
    region: "South",
    establishedYear: 1862,
    benches: ["Chennai (Principal Seat)", "Madurai Bench"],
    officialUrl: "https://www.hcmadras.tn.nic.in",
    causeListUrl: "https://www.hcmadras.tn.nic.in/causelist.php",
    chambersPracticeNote:
      "GST and customs writ litigation, trademark and copyright enforcement, industrial labour disputes, and commercial division appeals.",
    summary:
      "Historic Chartered High Court in Chennai renowned for constitutional protection, indirect tax rulings, and commercial IP jurisprudence."
  }
];

export const COURTS_REGISTRY: CourtProfile[] = sortCourtsByDistanceFromDelhi(
  UNSORTED_COURTS_REGISTRY
);

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
      ...court.benches
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
  "Constitutional",
  "Tax & Corporate",
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
    if (lower.includes("tax") || lower.includes("corp") || lower.includes("gst")) {
      return "Tax & Corporate";
    }
    if (lower.includes("arb") || lower.includes("comm") || lower.includes("ibc")) {
      return "Commercial & Arbitration";
    }
    if (lower.includes("crim") || lower.includes("bail") || lower.includes("pmla")) {
      return "Criminal";
    }
    if (lower.includes("civ") || lower.includes("prop") || lower.includes("rera")) {
      return "Civil & Property";
    }
  }
  return "Constitutional";
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
    .slice(0, 8)
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
    errors.practiceArea = "Please select a practice area.";
  }

  if (!input.briefSummary || input.briefSummary.trim().length < 15) {
    errors.briefSummary =
      "Please share a concise summary of the legal matter (at least 15 characters).";
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

function decodeXmlEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function inferCategoryFromHeadline(headline: string): BulletinCategory {
  const lower = headline.toLowerCase();
  if (
    lower.includes("tax") ||
    lower.includes("gst") ||
    lower.includes("vat") ||
    lower.includes("itc") ||
    lower.includes("refund") ||
    lower.includes("assessment") ||
    lower.includes("income") ||
    lower.includes("customs") ||
    lower.includes("sebi") ||
    lower.includes("company") ||
    lower.includes("corporate") ||
    lower.includes("bank")
  ) {
    return "Tax & Corporate";
  }
  if (
    lower.includes("arbitrat") ||
    lower.includes("ibc") ||
    lower.includes("insolvency") ||
    lower.includes("nclt") ||
    lower.includes("trademark") ||
    lower.includes("patent") ||
    lower.includes("copyright") ||
    lower.includes("contract") ||
    lower.includes("commercial")
  ) {
    return "Commercial & Arbitration";
  }
  if (
    lower.includes("bail") ||
    lower.includes("pmla") ||
    lower.includes("arrest") ||
    lower.includes("murder") ||
    lower.includes("criminal") ||
    lower.includes("fir") ||
    /\bed\b/.test(lower) ||
    lower.includes("enforcement directorate") ||
    lower.includes("cbi") ||
    lower.includes("custody")
  ) {
    return "Criminal";
  }
  if (
    lower.includes("property") ||
    lower.includes("rera") ||
    lower.includes("land") ||
    lower.includes("tenant") ||
    lower.includes("divorce") ||
    lower.includes("suit") ||
    lower.includes("civil")
  ) {
    return "Civil & Property";
  }
  return "Constitutional";
}

export function parseRssItemsFromXml(xml: string, limit = 8): ParsedRssItem[] {
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
  const candidates: Array<ParsedRssItem & { ts: number }> = [];
  const seenLinks = new Set<string>();
  const seenTitles = new Set<string>();

  for (const block of itemMatches.slice(0, 24)) {
    const titleRaw = block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
    const linkRaw = block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? "";
    const pubDateRaw = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ?? "";
    const sourceRaw =
      block.match(/<(?:News:)?Source[^>]*>([\s\S]*?)<\/(?:News:)?Source>/i)?.[1] ?? "";
    const descRaw = block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ?? "";

    const fullTitle = decodeXmlEntities(titleRaw);
    let link = decodeXmlEntities(linkRaw);

    // Unwrap Bing News redirect links to their canonical source URL
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
    const cleanTitle = fullTitle.replace(new RegExp(`\\s*-\\s*${escapedSource}$`), "").trim();
    const snippet = decodeXmlEntities(descRaw);

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

    const titleKey = cleanTitle.toLowerCase();
    if (cleanTitle && link.startsWith("http") && !seenLinks.has(link) && !seenTitles.has(titleKey)) {
      seenLinks.add(link);
      seenTitles.add(titleKey);
      candidates.push({
        title: cleanTitle,
        link,
        pubDate: formattedDate,
        sourceName,
        snippet,
        ts
      });
    }
  }

  candidates.sort((a, b) => b.ts - a.ts);
  return candidates.slice(0, limit).map(({ ts: _ts, ...item }) => item);
}

export function buildLiveReportFromRss(
  court: CourtProfile,
  rssItems: ParsedRssItem[],
  fetchedAtIso: string
): LiveCourtReport {
  const rulings: JudicialRuling[] = rssItems.slice(0, 6).map((item, idx) => ({
    id: `${court.slug}-rss-${idx + 1}`,
    title: item.title,
    caseNameOrCitation: `${item.sourceName} · Verified Press Dispatch`,
    date: item.pubDate,
    category: inferCategoryFromHeadline(item.title),
    bench: /bench/i.test(court.shortName) ? court.shortName : `${court.shortName} Bench`,
    statutes: [court.tier === "supreme" ? "Constitution of India" : "High Court Writ / Appellate Jurisdiction"],
    holdingSummary:
      item.snippet && item.snippet !== item.title && item.snippet.length > 35
        ? item.snippet
        : `Reported from the ${court.name}: ${item.title}. Open the source article to read the full bench observations.`,
    practicalTakeaway: `Check the ${court.shortName} daily cause list or official order portal if this ruling affects a pending matter.`,
    sourceUrl: item.link
  }));

  const registryNotices: RegistryNotice[] = [
    {
      id: `${court.slug}-notice-rss-1`,
      title: `${court.shortName} Daily Cause List & Registry Portal`,
      date: new Date(fetchedAtIso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      type: "Cause List",
      summary: `Today's sitting benches, supplementary cause lists, and urgent mentioning schedules for the ${court.name} are posted on the official portal (${court.causeListUrl}).`
    },
    {
      id: `${court.slug}-notice-rss-2`,
      title: `Active Benches & Filing Desk (${court.city})`,
      date: "Current Roster",
      type: "Bench Roster",
      summary: `Benches covered: ${court.benches.join(", ")}. ${court.chambersPracticeNote}`
    }
  ];

  const sources: GroundingSource[] = rssItems.slice(0, 6).map((item) => ({
    title: `${item.title} (${item.sourceName})`,
    uri: item.link
  }));

  return {
    courtSlug: court.slug,
    courtName: court.name,
    fetchedAt: fetchedAtIso,
    sourceMode: "live-rss",
    overviewSummary: `Latest orders, judgments, and court updates from the ${court.name} (${court.city}), gathered in real time from trusted Indian legal news sources.`,
    sittingStatus: "Live Court Updates Active",
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
  const defaultBench = /bench/i.test(court.shortName)
    ? court.shortName
    : `${court.shortName} Division Bench`;

  const rulings: JudicialRuling[] = [
    {
      id: `${court.slug}-fallback-1`,
      title: `${court.shortName} Appellate & Writ Docket — Tax, GST & Commercial Filings`,
      caseNameOrCitation: `${court.shortName} · Official Registry Docket`,
      date: formattedDate,
      category: "Tax & Corporate",
      bench: defaultBench,
      statutes:
        court.tier === "supreme"
          ? ["Article 136 Constitution of India", "CGST Act, 2017", "Income-tax Act, 1961"]
          : court.tier === "tribunal"
          ? ["Section 112 CGST Act, 2017", "GSTAT Procedure Rules"]
          : ["Article 226 Constitution of India", "CGST Act, 2017", "Commercial Courts Act, 2015"],
      holdingSummary: `${court.summary} ${court.chambersPracticeNote}`,
      practicalTakeaway: `Access the official ${court.shortName} cause list and order portal for today's bench assignments and certified order uploads.`,
      sourceUrl: court.officialUrl
    }
  ];

  const registryNotices: RegistryNotice[] = [
    {
      id: `${court.slug}-notice-fallback-1`,
      title: `${court.shortName} Daily Cause List & Registry Portal`,
      date: formattedDate,
      type: "Cause List",
      summary: `Today's sitting benches, supplementary cause lists, and urgent mentioning schedules for the ${court.name} are posted on the official portal (${court.causeListUrl}).`
    },
    {
      id: `${court.slug}-notice-fallback-2`,
      title: `Active Benches & Filing Desk (${court.city})`,
      date: "Current Roster",
      type: "Bench Roster",
      summary: `Benches covered: ${court.benches.join(", ")}. ${court.chambersPracticeNote}`
    }
  ];

  return {
    courtSlug: court.slug,
    courtName: court.name,
    fetchedAt: fetchedAtIso,
    sourceMode: "archive-fallback",
    overviewSummary: court.summary,
    sittingStatus: "Registry & Cause List Portals Active",
    chiefJusticeNote: `Principal Seat: ${court.city} · ${court.benches.length} Bench${court.benches.length > 1 ? "es" : ""}`,
    rulings,
    registryNotices,
    sources: [
      { title: `${court.name} Official Portal`, uri: court.officialUrl },
      { title: `${court.shortName} Daily Cause List`, uri: court.causeListUrl }
    ]
  };
}


