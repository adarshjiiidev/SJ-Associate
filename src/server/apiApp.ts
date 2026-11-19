import express from "express";
import { GoogleGenAI } from "@google/genai";
import {
  COURTS_REGISTRY,
  buildArchiveFallbackReport,
  buildLiveReportFromRss,
  getCourtBySlug,
  inferCategoryFromHeadline,
  parseCourtReportResponse,
  parseRssItemsFromXml,
  validateConsultationInput,
  type CourtProfile,
  type GroundingSource,
  type LiveCourtReport
} from "../data/courtsRegistry";
import {
  createMailRouter,
  forwardConsultationEmailIfConfigured
} from "./mailRoutes";

const CACHE_TTL_MS = 15 * 60 * 1000;
let geminiQuotaCooldownUntil = 0;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const courtReportCache = new Map<string, CacheEntry<LiveCourtReport>>();
let crossCourtFeedCache: CacheEntry<{
  fetchedAt: string;
  items: Array<{
    courtSlug: string;
    courtName: string;
    title: string;
    citation: string;
    date: string;
    category: string;
    summary: string;
    sourceUrl?: string;
  }>;
  sources: GroundingSource[];
}> | null = null;

interface StoredConsultation {
  referenceId: string;
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  courtSlug: string;
  practiceArea: string;
  briefSummary: string;
}

const consultationsLog: StoredConsultation[] = [];

function createAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (Date.now() < geminiQuotaCooldownUntil) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

function markGeminiQuotaCooldownIfNeeded(err: unknown): void {
  const text = err instanceof Error ? `${err.name} ${err.message}` : String(err ?? "");
  if (
    text.includes("429") ||
    text.includes("RESOURCE_EXHAUSTED") ||
    text.toLowerCase().includes("quota") ||
    text.toLowerCase().includes("rate")
  ) {
    geminiQuotaCooldownUntil = Date.now() + CACHE_TTL_MS;
  }
}

function extractGroundingSources(response: unknown): GroundingSource[] {
  const resp = response as {
    candidates?: Array<{
      groundingMetadata?: {
        groundingChunks?: Array<{
          web?: { uri?: string; title?: string };
        }>;
      };
    }>;
  };
  const chunks = resp?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const seen = new Set<string>();
  const sources: GroundingSource[] = [];

  for (const chunk of chunks) {
    const uri = chunk?.web?.uri;
    const title = chunk?.web?.title;
    if (uri && uri.startsWith("http") && !seen.has(uri)) {
      seen.add(uri);
      sources.push({
        uri,
        title: title?.trim() || new URL(uri).hostname
      });
    }
  }
  return sources;
}

function buildCourtSearchQuery(court: CourtProfile): string {
  switch (court.slug) {
    case "supreme-court-of-india":
      return '"Supreme Court of India"';
    case "gstat":
      return '"GST Appellate Tribunal" OR GSTAT';
    case "punjab-haryana-high-court":
      return '"Punjab and Haryana High Court"';
    case "calcutta-high-court":
      return '"Calcutta High Court"';
    case "gujarat-high-court":
      return '"Gujarat High Court"';
    case "karnataka-high-court":
      return '"Karnataka High Court"';
    case "rajasthan-high-court":
      return '"Rajasthan High Court"';
    case "telangana-high-court":
      return '"Telangana High Court"';
    default:
      return `"${court.shortName}"`;
  }
}

async function fetchRssXml(url: string): Promise<string | null> {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
      },
      signal: AbortSignal.timeout(6500)
    });
    if (!resp.ok) return null;
    return await resp.text();
  } catch {
    return null;
  }
}

async function fetchGoogleNewsRss(query: string, limit = 6) {
  const sortedBingUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(
    query
  )}&qft=sortbydate%3d%221%22&format=rss`;
  const googleNewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=en-IN&gl=IN&ceid=IN:en`;
  const fallbackBingUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(
    query
  )}&format=rss`;

  const candidates = [sortedBingUrl, googleNewsUrl, fallbackBingUrl];
  for (const url of candidates) {
    const xml = await fetchRssXml(url);
    if (!xml) continue;
    const parsed = parseRssItemsFromXml(xml, limit);
    if (parsed.length > 0) {
      return parsed;
    }
  }

  return [];
}

async function fetchLiveCourtReport(court: CourtProfile): Promise<LiveCourtReport> {
  const nowIso = new Date().toISOString();
  const queryLabel = buildCourtSearchQuery(court);
  const rssItems = await fetchGoogleNewsRss(queryLabel, 6);
  if (rssItems.length > 0) {
    return buildLiveReportFromRss(court, rssItems, nowIso);
  }

  const ai = createAiClient();
  if (ai) {
    try {
      const today = nowIso.slice(0, 10);
      const prompt = `Today's date is ${today}. Use Google Search to retrieve the latest real-time judicial updates, recent landmark rulings, notable orders, bench rosters, and registry/cause-list notices for the **${court.name}** (${court.city}, India).

Return ONLY a valid JSON object wrapped in \`\`\`json ... \`\`\` matching this exact structure (no markdown commentary outside the JSON fence):
{
  "overviewSummary": "2-sentence editorial summary of recent judicial activity and key matters before ${court.name}.",
  "sittingStatus": "Current sitting status (e.g., Regular Sitting / Bench Roster Active / Cause List Published)",
  "chiefJusticeNote": "Current Chief Justice / Bench leadership & principal seat note for ${court.name}.",
  "rulings": [
    {
      "title": "Concise legal headline summarizing the holding",
      "caseNameOrCitation": "Case title, writ/appeal number, or neutral citation",
      "date": "Month DD, YYYY or Month YYYY",
      "category": "One of: Constitutional | Tax & Corporate | Commercial & Arbitration | Criminal | Civil & Property",
      "bench": "Bench composition (e.g., Division Bench / Constitutional Bench / Single Judge)",
      "statutes": ["Key Act or Constitutional Article 1", "Key Section 2"],
      "holdingSummary": "2-3 sentence legal holding explaining what the court held and why.",
      "practicalTakeaway": "1 concise sentence on practical litigation or compliance impact for counsel and clients.",
      "sourceUrl": "Optional verified source URL if found in search"
    }
  ],
  "registryNotices": [
    {
      "title": "Recent practice direction, cause list update, or registry circular",
      "date": "Month DD, YYYY or Month YYYY",
      "type": "One of: Circular | Cause List | Practice Direction | Bench Roster",
      "summary": "1-2 sentence summary of the registry update or e-filing/cause list notice."
    }
  ]
}

Provide 4 to 6 real, recent rulings from ${court.name} and 2 to 4 registry/cause-list notices grounded in current search results. Ensure every detail reflects actual public court reports.`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction:
            "You are a senior Indian judicial research editor preparing authoritative legal alerts strictly grounded in verified Google Search results. Never fabricate case numbers or dates.",
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text ?? "";
      const sources = extractGroundingSources(response);
      return parseCourtReportResponse(court, text, sources, nowIso);
    } catch (err) {
      markGeminiQuotaCooldownIfNeeded(err);
    }
  }

  return buildArchiveFallbackReport(court, nowIso);
}

async function fetchCrossCourtBriefings() {
  const nowIso = new Date().toISOString();
  const feedSettled = await Promise.allSettled(
    COURTS_REGISTRY.map(async (court) => {
      const entries = await fetchGoogleNewsRss(buildCourtSearchQuery(court), 1);
      return entries.slice(0, 1).map((entry) => ({
        courtSlug: court.slug,
        courtName: court.name,
        title: entry.title,
        citation: `${entry.sourceName} · Verified Dispatch`,
        date: entry.pubDate,
        category: inferCategoryFromHeadline(entry.title),
        summary:
          entry.snippet && entry.snippet !== entry.title && entry.snippet.length > 35
            ? entry.snippet
            : `Reported before ${court.name}: ${entry.title}. Open the dedicated ${court.shortName} report for full live updates and registry portals.`,
        sourceUrl: entry.link
      }));
    })
  );

  const rssItems = feedSettled
    .flatMap((res) => (res.status === "fulfilled" ? res.value : []))
    .slice(0, 13);

  if (rssItems.length > 0) {
    const sources: GroundingSource[] = rssItems
      .filter((i) => i.sourceUrl)
      .map((i) => ({ title: i.title, uri: i.sourceUrl! }));

    return {
      fetchedAt: nowIso,
      items: rssItems,
      sources
    };
  }

  const ai = createAiClient();
  if (ai) {
    try {
      const today = nowIso.slice(0, 10);
      const prompt = `Today's date is ${today}. Search for the latest major judgments, rulings, and notices across the Supreme Court of India, GST Appellate Tribunal (GSTAT), and Indian High Courts (such as Delhi High Court, Punjab and Haryana High Court at Chandigarh, Patna High Court, Bombay High Court, Madras High Court, Calcutta High Court, Karnataka High Court, Allahabad High Court, Gujarat High Court, Rajasthan High Court, Telangana High Court).

Return ONLY a valid JSON object inside \`\`\`json ... \`\`\` with:
{
  "items": [
    {
      "courtSlug": "One of: supreme-court-of-india | gstat | delhi-high-court | bombay-high-court | punjab-haryana-high-court | patna-high-court | madras-high-court | calcutta-high-court | karnataka-high-court | allahabad-high-court | gujarat-high-court | rajasthan-high-court | telangana-high-court",
      "courtName": "Official Court or Tribunal Name",
      "title": "Editorial legal headline of the ruling",
      "citation": "Case title or citation",
      "date": "Month DD, YYYY",
      "category": "Constitutional | Tax & Corporate | Commercial & Arbitration | Criminal | Civil & Property",
      "summary": "2-sentence summary of the holding.",
      "sourceUrl": "Optional URL"
    }
  ]
}
Include 6 recent items spanning the Supreme Court, GSTAT, and High Courts including Delhi, Chandigarh (Punjab and Haryana HC), and Patna High Court when relevant.`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction:
            "You are a senior Indian appellate legal editor. Output strictly grounded, accurate recent rulings in clean JSON.",
          tools: [{ googleSearch: {} }]
        }
      });

      const sources = extractGroundingSources(response);
      const rawText = (response.text ?? "").trim();
      const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
      const jsonText = fenced ? fenced[1].trim() : rawText;
      const parsed = JSON.parse(jsonText) as {
        items?: Array<Record<string, unknown>>;
      };

      const validSlugs = new Set(COURTS_REGISTRY.map((c) => c.slug));
      const items = (parsed.items ?? []).slice(0, 6).map((item, idx) => {
        const rawSlug = String(item.courtSlug ?? "supreme-court-of-india");
        const slug = validSlugs.has(rawSlug as CourtProfile["slug"])
          ? rawSlug
          : "supreme-court-of-india";
        const court = getCourtBySlug(slug)!;
        return {
          courtSlug: slug,
          courtName: String(item.courtName ?? court.name),
          title: String(item.title ?? "Recent Judicial Pronouncement"),
          citation: String(item.citation ?? `${court.shortName} Order`),
          date: String(item.date ?? "Recent"),
          category: String(item.category ?? "Constitutional"),
          summary: String(item.summary ?? ""),
          sourceUrl:
            typeof item.sourceUrl === "string" && item.sourceUrl.startsWith("http")
              ? item.sourceUrl
              : sources[idx]?.uri
        };
      });

      if (items.length > 0) {
        return {
          fetchedAt: nowIso,
          items,
          sources: sources.slice(0, 8)
        };
      }
    } catch (err) {
      markGeminiQuotaCooldownIfNeeded(err);
    }
  }

  const formattedDate = new Date(nowIso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const fallbackItems = COURTS_REGISTRY.slice(0, 6).map((court) => ({
    courtSlug: court.slug,
    courtName: court.name,
    title: `${court.shortName} Appellate & Tax Registry Updates`,
    citation: `${court.shortName} · Official Registry`,
    date: formattedDate,
    category: "Tax & Corporate",
    summary: `${court.summary} ${court.chambersPracticeNote}`,
    sourceUrl: court.officialUrl
  }));

  return {
    fetchedAt: nowIso,
    items: fallbackItems,
    sources: fallbackItems.map((i) => ({ title: i.courtName, uri: i.sourceUrl }))
  };
}

export function createApiApp(): express.Express {
  const app = express();
  app.disable("x-powered-by");

  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  app.use(express.json({ limit: "64kb" }));

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
          error: "Invalid JSON payload.",
          code: "INVALID_JSON"
        });
      }
      return next(err);
    }
  );

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      courtsIndexed: COURTS_REGISTRY.length,
      liveAiConfigured: Boolean(createAiClient())
    });
  });

  app.get("/api/courts", (_req, res) => {
    res.json({ courts: COURTS_REGISTRY });
  });

  app.get("/api/courts/briefings/latest", async (req, res) => {
    const forceRefresh = req.query.refresh === "1";
    const now = Date.now();
    if (!forceRefresh && crossCourtFeedCache && crossCourtFeedCache.expiresAt > now) {
      return res.json(crossCourtFeedCache.data);
    }

    try {
      const data = await fetchCrossCourtBriefings();
      crossCourtFeedCache = {
        data,
        expiresAt: now + CACHE_TTL_MS
      };
      return res.json(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch live cross-court briefings.";
      return res.status(502).json({
        error: message,
        code: "LIVE_BRIEFINGS_UNAVAILABLE"
      });
    }
  });

  app.get("/api/courts/:slug/live", async (req, res) => {
    const { slug } = req.params;
    const court = getCourtBySlug(slug);
    if (!court) {
      return res.status(404).json({
        error: `Court '${slug}' was not found in the constitutional registry.`,
        code: "COURT_NOT_FOUND"
      });
    }

    const forceRefresh = req.query.refresh === "1";
    const now = Date.now();
    const cached = courtReportCache.get(slug);

    if (!forceRefresh && cached && cached.expiresAt > now) {
      return res.json({
        ...cached.data,
        cached: true
      });
    }

    try {
      const report = await fetchLiveCourtReport(court);
      courtReportCache.set(slug, {
        data: report,
        expiresAt: now + CACHE_TTL_MS
      });
      return res.json({
        ...report,
        cached: false
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Unable to retrieve live judicial report for ${court.name}.`;
      return res.status(502).json({
        error: message,
        code: "COURT_LIVE_FETCH_FAILED"
      });
    }
  });

  app.post("/api/consultations", async (req, res) => {
    const payload = req.body ?? {};
    const validation = validateConsultationInput(payload);
    if (!validation.valid) {
      return res.status(400).json({
        error: "Please correct the highlighted fields before submitting.",
        errors: validation.errors
      });
    }

    const referenceId = `SJA-${new Date().getFullYear()}-${String(
      1001 + consultationsLog.length
    ).padStart(4, "0")}`;

    const entry: StoredConsultation = {
      referenceId,
      submittedAt: new Date().toISOString(),
      fullName: String(payload.fullName).trim(),
      email: String(payload.email).trim(),
      phone: String(payload.phone).trim(),
      courtSlug: String(payload.courtSlug || "delhi-high-court"),
      practiceArea: String(payload.practiceArea).trim(),
      briefSummary: String(payload.briefSummary).trim()
    };

    if (consultationsLog.length >= 500) {
      consultationsLog.shift();
    }
    consultationsLog.push(entry);

    let emailForwarded = false;
    try {
      emailForwarded = await forwardConsultationEmailIfConfigured(entry);
    } catch {
      emailForwarded = false;
    }

    return res.status(201).json({
      referenceId: entry.referenceId,
      submittedAt: entry.submittedAt,
      emailForwarded,
      message: "Your briefing request has been logged with the SJ Associates Chambers Desk."
    });
  });

  app.use("/api/mail", createMailRouter());

  app.use("/api/*", (req, res) => {
    res.status(404).json({
      error: `API route '${req.originalUrl}' was not found.`,
      code: "API_NOT_FOUND"
    });
  });

  return app;
}
