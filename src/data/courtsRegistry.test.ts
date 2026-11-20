import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  COURTS_REGISTRY,
  TAX_AND_REGIONAL_OFFICES,
  getCourtBySlug,
  filterCourts,
  parseCourtReportResponse,
  buildArchiveFallbackReport,
  validateConsultationInput,
  parseRssItemsFromXml,
  buildLiveReportFromRss,
} from "./courtsRegistry";

describe("courtsRegistry pure logic", () => {
  it("contains Supreme Court on top, GSTAT, and High Courts ordered by distance from Delhi (excluding South Indian courts)", () => {
    assert.equal(COURTS_REGISTRY.length, 10);
    assert.equal(COURTS_REGISTRY[0].slug, "supreme-court-of-india");
    assert.equal(COURTS_REGISTRY[0].tier, "supreme");
    assert.ok(!COURTS_REGISTRY.some((c) => ["madras-high-court", "karnataka-high-court", "telangana-high-court"].includes(c.slug)));

    const gstat = getCourtBySlug("gstat");
    assert.ok(gstat);
    assert.equal(gstat.tier, "tribunal");
    assert.equal(gstat.city, "New Delhi");

    for (const court of COURTS_REGISTRY) {
      assert.ok(Array.isArray(court.nearbyTaxOffices));
      assert.ok(court.nearbyTaxOffices.length >= 2);
    }
  });

  it("includes Delhi Tax Offices and Regional Tax Offices nearby High Courts", () => {
    assert.ok(TAX_AND_REGIONAL_OFFICES.length >= 14);
    const delhiOffices = TAX_AND_REGIONAL_OFFICES.filter(
      (o) => o.group === "Delhi Tax & Regional Offices"
    );
    const regionalOffices = TAX_AND_REGIONAL_OFFICES.filter(
      (o) => o.group === "Regional Tax Offices (Near High Courts)"
    );
    assert.ok(delhiOffices.length >= 5);
    assert.ok(regionalOffices.length >= 8);
  });

  it("filters courts by tier, region, and search query including nearby tax offices", () => {
    const northCourts = filterCourts(COURTS_REGISTRY, {
      tier: "high",
      region: "North",
    });
    assert.ok(northCourts.length >= 3);
    assert.ok(northCourts.some((c) => c.slug === "delhi-high-court"));

    const mumbaiMatches = filterCourts(COURTS_REGISTRY, { query: "Mumbai" });
    assert.equal(mumbaiMatches.length, 1);
    assert.equal(mumbaiMatches[0].slug, "bombay-high-court");

    const vyaparMatches = filterCourts(COURTS_REGISTRY, {
      query: "Vyapar Bhawan",
    });
    assert.ok(vyaparMatches.length >= 1);
  });

  it("parses structured court report response with GST & Income Tax category", () => {
    const court = getCourtBySlug("delhi-high-court")!;
    const rawJson = JSON.stringify({
      overviewSummary: "Division Benches hearing GST and Income Tax writs.",
      sittingStatus: "Division Benches Sitting",
      chiefJusticeNote: "Sher Shah Road, New Delhi",
      rulings: [
        {
          title: "GST Show Cause Notice & ITC Reversal Challenge",
          caseNameOrCitation: "W.P.(C) 4120/2025",
          date: "May 2025",
          category: "GST & Income Tax",
          bench: "Division Bench",
          statutes: ["Section 73 CGST Act"],
          holdingSummary:
            "High Court examined Section 73/74 CGST Show Cause Notice adjudication.",
          practicalTakeaway:
            "Assessees can challenge unsigned DRC-01 orders via Article 226 writ.",
        },
      ],
      registryNotices: [],
    });

    const report = parseCourtReportResponse(
      court,
      rawJson,
      [{ title: "Delhi High Court Portal", uri: "https://delhihighcourt.nic.in" }],
      "2025-05-15T10:00:00.000Z"
    );

    assert.equal(report.courtSlug, "delhi-high-court");
    assert.equal(report.rulings.length, 1);
    assert.equal(report.rulings[0].category, "GST & Income Tax");
  });

  it("builds deterministic archive fallback report with 3 statements without AI usage", () => {
    const court = getCourtBySlug("bombay-high-court")!;
    const fallback = buildArchiveFallbackReport(
      court,
      "2025-05-15T10:00:00.000Z"
    );

    assert.equal(fallback.courtSlug, "bombay-high-court");
    assert.equal(fallback.sourceMode, "archive-fallback");
    assert.equal(fallback.rulings.length, 3);
    assert.equal(fallback.rulings[0].category, "GST & Income Tax");
  });

  it("parses RSS XML items and builds a live RSS court report", () => {
    const court = getCourtBySlug("gstat")!;
    const sampleXml = `
      <rss><channel>
        <item>
          <title>GSTAT Bench issues practice notice on Section 112 GST appeals - Legal Desk</title>
          <link>https://example.com/gstat-1</link>
          <pubDate>Thu, 15 May 2025 09:00:00 GMT</pubDate>
          <source>Legal Desk</source>
          <description>GSTAT Principal Bench in New Delhi clarified filing procedure for Form GST APL-05.</description>
        </item>
      </channel></rss>
    `;
    const items = parseRssItemsFromXml(sampleXml, 4, court);
    assert.equal(items.length, 1);
    const liveReport = buildLiveReportFromRss(
      court,
      items,
      "2025-05-15T10:00:00.000Z"
    );
    assert.equal(liveReport.sourceMode, "live-rss");
    assert.equal(liveReport.rulings[0].category, "GST & Income Tax");
  });

  it("strips double-encoded &nbsp; entities, redundant title+source descriptions, and mismatched High Court items", () => {
    const delhiCourt = getCourtBySlug("delhi-high-court")!;
    const googleNewsSampleXml = `
      <rss><channel>
        <item>
          <title>Restitution Decree Holder Cannot Seek Divorce On Desertion Within A Year: MP High Court - LawChakra</title>
          <link>https://example.com/mp-hc-1</link>
          <pubDate>Thu, 15 May 2025 09:00:00 GMT</pubDate>
          <source>LawChakra</source>
          <description>&lt;a href="https://example.com/mp-hc-1"&gt;Restitution Decree Holder Cannot Seek Divorce On Desertion Within A Year: MP High Court&lt;/a&gt;&amp;nbsp;&amp;nbsp;&lt;font color="#6f6f6f"&gt;LawChakra&lt;/font&gt;</description>
        </item>
        <item>
          <title>Delhi High Court Quashes Unsigned Section 73 GST Demand Order - LiveLaw</title>
          <link>https://example.com/delhi-hc-1</link>
          <pubDate>Thu, 15 May 2025 10:30:00 GMT</pubDate>
          <source>LiveLaw</source>
          <description>&lt;a href="https://example.com/delhi-hc-1"&gt;Delhi High Court Quashes Unsigned Section 73 GST Demand Order&lt;/a&gt;&amp;nbsp;&amp;nbsp;&lt;font color="#6f6f6f"&gt;LiveLaw&lt;/font&gt;</description>
        </item>
      </channel></rss>
    `;

    const filteredItems = parseRssItemsFromXml(googleNewsSampleXml, 8, delhiCourt);
    assert.equal(filteredItems.length, 1);
    assert.equal(
      filteredItems[0].title,
      "Delhi High Court Quashes Unsigned Section 73 GST Demand Order"
    );
    assert.equal(filteredItems[0].snippet, "");

    const report = buildLiveReportFromRss(
      delhiCourt,
      filteredItems,
      "2025-05-15T11:00:00.000Z"
    );
    assert.equal(report.rulings.length, 1);
    assert.ok(!report.rulings[0].holdingSummary.includes("&nbsp;"));
    assert.ok(!report.rulings[0].holdingSummary.includes("MP High Court"));
    assert.notEqual(report.rulings[0].holdingSummary, report.rulings[0].title);
  });

  it("validates consultation input accurately", () => {
    const invalid = validateConsultationInput({
      fullName: "A",
      email: "bad",
      phone: "123",
      practiceArea: "",
      briefSummary: "short",
    });
    assert.equal(invalid.valid, false);

    const valid = validateConsultationInput({
      fullName: "Rajesh Sharma",
      email: "rajesh@company.in",
      phone: "+91 97163 18400",
      courtSlug: "delhi-gst-vyapar-bhawan",
      practiceArea: "Goods and Services Tax — SCN Reply",
      briefSummary: "Need reply to GST DRC-01 Show Cause Notice before Delhi GST.",
    });
    assert.equal(valid.valid, true);
  });
});
