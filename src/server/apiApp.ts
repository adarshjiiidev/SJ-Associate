import express from "express";
import {
  COURTS_REGISTRY,
  getCourtBySlug,
  parseRssItemsFromXml,
  buildLiveReportFromRss,
  buildArchiveFallbackReport,
  validateConsultationInput,
  type CourtProfile,
  type LiveCourtReport,
  type ConsultationPayload,
} from "../data/courtsRegistry.js";
import {
  createMailRouter,
  forwardConsultationEmailIfConfigured,
} from "./mailRoutes.js";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const courtReportCache = new Map<string, CacheEntry<LiveCourtReport>>();
let crossCourtFeedCache: CacheEntry<CrossCourtFeedItem[]> | null = null;
const consultationLog: Array<ConsultationPayload & { id: string; createdAt: string }> = [];

export interface CrossCourtFeedItem {
  id: string;
  courtSlug: string;
  courtId: string;
  courtName: string;
  courtShortName: string;
  title: string;
  date: string;
  dateLabel: string;
  category: string;
  summary: string;
  sourceUrl?: string;
}

async function fetchRssXml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SJALawChambers/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchCourtNewsRssItems(court: CourtProfile, limit = 15) {
  const courtSearchPhrase =
    court.shortName && court.shortName !== court.name
      ? `("${court.shortName}" OR "${court.name}")`
      : `"${court.name}"`;

  const query =
    court.slug === "gstat"
      ? `("GSTAT" OR "GST Appellate Tribunal") (GST OR tax OR appeal OR notice OR ITC OR refund)`
      : `${courtSearchPhrase} (GST OR "Income Tax" OR "Direct Tax" OR "Indirect Tax" OR TDS OR ITC OR Customs OR "Corporate Tax" OR Civil OR suit OR injunction OR property)`;

  const googleUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=en-IN&gl=IN&ceid=IN:en`;
  const googleXml = await fetchRssXml(googleUrl);
  if (googleXml) {
    const parsed = parseRssItemsFromXml(googleXml, limit, court);
    if (parsed.length > 0) return parsed;
  }

  const bingUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(
    query
  )}&format=rss`;
  const bingXml = await fetchRssXml(bingUrl);
  if (bingXml) {
    return parseRssItemsFromXml(bingXml, limit, court);
  }
  return [];
}

async function fetchLiveCourtReport(court: CourtProfile): Promise<LiveCourtReport> {
  const cached = courtReportCache.get(court.slug);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const nowIso = new Date().toISOString();

  // Direct Live RSS filtered exclusively to Direct & Indirect Tax without AI credit usage
  const rssItems = await fetchCourtNewsRssItems(court, 15);
  if (rssItems.length >= 1) {
    const rssReport = buildLiveReportFromRss(court, rssItems, nowIso);
    courtReportCache.set(court.slug, {
      data: rssReport,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
    return rssReport;
  }

  const fallback = buildArchiveFallbackReport(court, nowIso);
  courtReportCache.set(court.slug, {
    data: fallback,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
  return fallback;
}

async function fetchCrossCourtBriefings(): Promise<CrossCourtFeedItem[]> {
  if (crossCourtFeedCache && crossCourtFeedCache.expiresAt > Date.now()) {
    return crossCourtFeedCache.data;
  }

  const targetCourts = COURTS_REGISTRY;
  const reports = await Promise.all(
    targetCourts.map((court) => fetchLiveCourtReport(court))
  );

  const feedItems: CrossCourtFeedItem[] = [];
  // Round-robin pick Direct & Indirect Tax rulings across all 10 courts up to 15 items
  for (let round = 0; round < 2 && feedItems.length < 15; round++) {
    for (let i = 0; i < targetCourts.length && feedItems.length < 15; i++) {
      const court = targetCourts[i];
      const report = reports[i];
      const ruling = report.rulings[round];
      if (ruling) {
        feedItems.push({
          id: `${court.slug}-feed-${round + 1}-${i + 1}`,
          courtSlug: court.slug,
          courtId: court.slug,
          courtName: court.name,
          courtShortName: court.shortName,
          title: ruling.title,
          date: ruling.date,
          dateLabel: ruling.date,
          category: ruling.category,
          summary: ruling.holdingSummary,
          sourceUrl: ruling.sourceUrl || court.officialUrl,
        });
      }
    }
  }

  crossCourtFeedCache = {
    data: feedItems,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
  return feedItems;
}

export function createApiApp(): express.Express {
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json());

  // Normalize Vercel serverless rewrite paths (/api/(.*) -> /api/index)
  app.use((req, _res, next) => {
    if (
      req.url.startsWith("/mail") ||
      req.url.startsWith("/courts") ||
      req.url.startsWith("/consultations") ||
      req.url.startsWith("/health")
    ) {
      req.url = `/api${req.url}`;
    }
    next();
  });

  // Mount Chambers Webmail & IMAP/SMTP routes
  const mailRouter = createMailRouter();
  app.use("/api/mail", mailRouter);
  app.use("/mail", mailRouter);

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      liveRssConfigured: true,
      aiCreditsUsed: 0,
      courtsCount: COURTS_REGISTRY.length,
    });
  });

  app.get("/api/courts", (_req, res) => {
    res.json({
      courts: COURTS_REGISTRY,
    });
  });

  app.get("/api/courts/live-feed", async (_req, res) => {
    try {
      const briefings = await fetchCrossCourtBriefings();
      res.json({ briefings, items: briefings });
    } catch {
      res.status(500).json({ error: "Failed to load cross-court briefings" });
    }
  });

  const handleCourtLiveReport = async (req: express.Request, res: express.Response) => {
    const slug = req.params.slug || req.params.courtId;
    const court = getCourtBySlug(slug);
    if (!court) {
      res.status(404).json({ error: "Court not found in chambers registry" });
      return;
    }

    if (req.query.refresh === "true" || req.query.refresh === "1") {
      courtReportCache.delete(court.slug);
    }

    const report = await fetchLiveCourtReport(court);
    res.json({ court, report, ...report });
  };

  app.get("/api/courts/:slug/report", handleCourtLiveReport);
  app.get("/api/courts/:slug/live", handleCourtLiveReport);
  app.get("/api/courts/:slug/live-updates", handleCourtLiveReport);

  app.post("/api/consultations", async (req, res) => {
    const payload = req.body as Partial<ConsultationPayload>;
    const validation = validateConsultationInput(payload);
    if (!validation.valid) {
      res.status(400).json({ error: "Validation failed", errors: validation.errors });
      return;
    }
    const entry = {
      id: `SJA-${Date.now().toString(36).toUpperCase()}`,
      fullName: payload.fullName!.trim(),
      email: payload.email!.trim(),
      phone: payload.phone!.trim(),
      courtSlug: (payload.courtSlug || "delhi-gst-vyapar-bhawan").trim(),
      practiceArea: payload.practiceArea!.trim(),
      briefSummary: payload.briefSummary!.trim(),
      createdAt: new Date().toISOString(),
    };
    consultationLog.unshift(entry);

    let forwarded = false;
    try {
      forwarded = await forwardConsultationEmailIfConfigured({
        referenceId: entry.id,
        submittedAt: entry.createdAt,
        fullName: entry.fullName,
        email: entry.email,
        phone: entry.phone,
        courtSlug: entry.courtSlug,
        practiceArea: entry.practiceArea,
        briefSummary: entry.briefSummary,
      });
    } catch {
      forwarded = false;
    }

    res.status(201).json({
      ok: true,
      referenceId: entry.id,
      inboxEmail: "services@sjalaw.in",
      delivery: { mode: forwarded ? "smtp-forwarded" : "logged" },
      consultation: entry,
    });
  });

  return app;
}
