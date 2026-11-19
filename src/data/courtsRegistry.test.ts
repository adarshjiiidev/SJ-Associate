import test from "node:test";
import assert from "node:assert/strict";
import {
  COURTS_REGISTRY,
  filterCourts,
  getCourtBySlug,
  parseCourtReportResponse,
  sortCourtsByDistanceFromDelhi,
  validateConsultationInput
} from "./courtsRegistry";

test("getCourtBySlug finds Supreme Court and High Courts accurately", () => {
  const sc = getCourtBySlug("supreme-court-of-india");
  assert.ok(sc);
  assert.equal(sc.tier, "supreme");
  assert.equal(sc.city, "New Delhi");

  const bombay = getCourtBySlug("bombay-high-court");
  assert.ok(bombay);
  assert.equal(bombay.tier, "high");
  assert.equal(bombay.establishedYear, 1862);

  const chandigarh = getCourtBySlug("punjab-haryana-high-court");
  assert.ok(chandigarh);
  assert.equal(chandigarh.city, "Chandigarh");

  const gstat = getCourtBySlug("gstat");
  assert.ok(gstat);
  assert.equal(gstat.tier, "tribunal");
  assert.equal(gstat.city, "New Delhi");

  const patna = getCourtBySlug("patna-high-court");
  assert.ok(patna);
  assert.equal(patna.city, "Patna");

  assert.equal(getCourtBySlug("non-existent-court"), undefined);
});

test("COURTS_REGISTRY keeps Supreme Court on top and sorts High Courts & Tribunals by distance from Delhi", () => {
  assert.equal(COURTS_REGISTRY[0].slug, "supreme-court-of-india");
  assert.equal(COURTS_REGISTRY[1].slug, "delhi-high-court");
  assert.equal(COURTS_REGISTRY[2].slug, "gstat");
  assert.equal(COURTS_REGISTRY[3].slug, "punjab-haryana-high-court");
  assert.equal(COURTS_REGISTRY[COURTS_REGISTRY.length - 1].slug, "madras-high-court");

  const otherForums = COURTS_REGISTRY.slice(1);
  for (let i = 1; i < otherForums.length; i++) {
    assert.ok(
      otherForums[i].distanceFromDelhiKm >= otherForums[i - 1].distanceFromDelhiKm,
      `Expected ${otherForums[i].slug} (${otherForums[i].distanceFromDelhiKm} km) >= ${otherForums[i - 1].slug} (${otherForums[i - 1].distanceFromDelhiKm} km)`
    );
  }

  const reordered = sortCourtsByDistanceFromDelhi([...COURTS_REGISTRY].reverse());
  assert.equal(reordered[0].slug, "supreme-court-of-india");
  assert.equal(reordered[1].slug, "delhi-high-court");
});

test("filterCourts filters by tier, region, and search query", () => {
  const onlySupreme = filterCourts(COURTS_REGISTRY, { tier: "supreme" });
  assert.equal(onlySupreme.length, 1);
  assert.equal(onlySupreme[0].slug, "supreme-court-of-india");

  const onlyTribunal = filterCourts(COURTS_REGISTRY, { tier: "tribunal" });
  assert.equal(onlyTribunal.length, 1);
  assert.equal(onlyTribunal[0].slug, "gstat");

  const onlyHigh = filterCourts(COURTS_REGISTRY, { tier: "high" });
  assert.equal(onlyHigh.length, 11);

  const westCourts = filterCourts(COURTS_REGISTRY, { region: "West" });
  assert.equal(westCourts.length, 2);

  const queryMatch = filterCourts(COURTS_REGISTRY, { query: "bengaluru" });
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].slug, "karnataka-high-court");

  const chandigarhMatch = filterCourts(COURTS_REGISTRY, { query: "chandigarh" });
  assert.equal(chandigarhMatch.length, 1);
  assert.equal(chandigarhMatch[0].slug, "punjab-haryana-high-court");

  const gstatMatch = filterCourts(COURTS_REGISTRY, { query: "gstat" });
  assert.equal(gstatMatch.length, 1);
  assert.equal(gstatMatch[0].slug, "gstat");
});

test("parseCourtReportResponse extracts fenced JSON and normalizes categories", () => {
  const court = getCourtBySlug("delhi-high-court")!;
  const mockModelOutput = `Here is the structured briefing:
\`\`\`json
{
  "overviewSummary": "Delhi High Court commercial and IP benches issued key orders this week.",
  "sittingStatus": "Regular Sitting",
  "chiefJusticeNote": "Sitting at Sher Shah Road, New Delhi",
  "rulings": [
    {
      "title": "Interim Injunction in Dynamic Website Blocking Suit",
      "caseNameOrCitation": "CS(COMM) 812/2026",
      "date": "November 2026",
      "category": "Intellectual Property & Commercial",
      "bench": "Single Judge (IPD)",
      "statutes": ["Trade Marks Act, 1999", "Copyright Act, 1957"],
      "holdingSummary": "Court granted dynamic+ injunction extending to mirror domains.",
      "practicalTakeaway": "Brand owners can seek consolidated rogue-domain takedowns."
    }
  ],
  "registryNotices": [
    {
      "title": "Updated Hybrid Hearing Protocol for Commercial Division",
      "date": "November 2026",
      "type": "Practice Direction",
      "summary": "Counsel must upload convenience compilations 48 hours prior to final hearing."
    }
  ]
}
\`\`\``;

  const report = parseCourtReportResponse(
    court,
    mockModelOutput,
    [{ title: "Delhi High Court Portal", uri: "https://delhihighcourt.nic.in" }],
    "2026-11-15T12:00:00.000Z"
  );

  assert.equal(report.courtSlug, "delhi-high-court");
  assert.equal(report.sourceMode, "live-grounded");
  assert.equal(report.rulings.length, 1);
  assert.equal(report.rulings[0].category, "Commercial & Arbitration");
  assert.equal(report.rulings[0].sourceUrl, "https://delhihighcourt.nic.in");
  assert.equal(report.registryNotices.length, 1);
  assert.equal(report.registryNotices[0].type, "Practice Direction");
});

test("validateConsultationInput catches invalid inputs and passes valid ones", () => {
  const invalid = validateConsultationInput({
    fullName: "A",
    email: "not-an-email",
    phone: "123",
    practiceArea: "",
    briefSummary: "Too short"
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.practiceArea);
  assert.ok(invalid.errors.briefSummary);

  const valid = validateConsultationInput({
    fullName: "Ananya Deshmukh",
    email: "ananya.deshmukh@example.com",
    phone: "+91 98110 44210",
    courtSlug: "bombay-high-court",
    practiceArea: "Corporate, M&A & Regulatory",
    briefSummary: "Seeking representation in a Section 37 commercial arbitration appeal before Bombay HC."
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

import {
  buildLiveReportFromRss,
  inferCategoryFromHeadline,
  parseRssItemsFromXml
} from "./courtsRegistry";

test("parseRssItemsFromXml and buildLiveReportFromRss parse live court RSS feeds cleanly", () => {
  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0"><channel>
    <item>
      <title>Bombay High Court Upholds Input Tax Credit Refund Under GST Section 54 - LiveLaw</title>
      <link>https://www.livelaw.in/high-court/bombay-high-court/gst-itc-refund-example</link>
      <pubDate>Fri, 14 Nov 2026 10:30:00 GMT</pubDate>
      <source url="https://www.livelaw.in">LiveLaw</source>
      <description><![CDATA[Division Bench held that technical portal glitches cannot defeat substantive refund rights.]]></description>
    </item>
  </channel></rss>`;

  const parsed = parseRssItemsFromXml(sampleXml);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].sourceName, "LiveLaw");
  assert.equal(
    parsed[0].title,
    "Bombay High Court Upholds Input Tax Credit Refund Under GST Section 54"
  );
  assert.equal(inferCategoryFromHeadline(parsed[0].title), "Tax & Corporate");

  const bombay = getCourtBySlug("bombay-high-court")!;
  const report = buildLiveReportFromRss(bombay, parsed, "2026-11-15T12:00:00.000Z");
  assert.equal(report.sourceMode, "live-rss");
  assert.equal(report.rulings.length, 1);
  assert.equal(report.rulings[0].category, "Tax & Corporate");
  assert.equal(report.sources.length, 1);

  const bingXml = `<rss><channel>
    <item>
      <title>Older High Court Order From 2015</title>
      <link>https://www.barandbench.com/news/old-2015</link>
      <pubDate>Tue, 18 Aug 2015 08:00:00 GMT</pubDate>
      <News:Source>Bar and Bench</News:Source>
      <description>Older archive story that should sort after 2026 dispatches.</description>
    </item>
    <item>
      <title>Delhi High Court Grants Interim Stay on Customs Demand</title>
      <link>http://www.bing.com/news/apiclick.aspx?ref=FexRss&amp;url=https%3a%2f%2fwww.barandbench.com%2fnews%2fdelhi-hc-customs&amp;mkt=en-IN</link>
      <pubDate>Sun, 15 Nov 2026 08:00:00 GMT</pubDate>
      <News:Source>Bar and Bench</News:Source>
      <description>Division bench stayed coercive recovery pending adjudication.</description>
    </item>
  </channel></rss>`;
  const bingParsed = parseRssItemsFromXml(bingXml, 2);
  assert.equal(bingParsed.length, 2);
  assert.equal(bingParsed[0].link, "https://www.barandbench.com/news/delhi-hc-customs");
  assert.equal(bingParsed[0].sourceName, "Bar and Bench");
  assert.equal(bingParsed[1].title, "Older High Court Order From 2015");

  assert.equal(
    inferCategoryFromHeadline("VAT ITC Reversed towards Manufacturing/Invisible Loss: Madras HC orders Dept."),
    "Tax & Corporate"
  );
  assert.equal(inferCategoryFromHeadline("ED arrests director in PMLA probe"), "Criminal");

  const gstat = getCourtBySlug("gstat")!;
  const gstatReport = buildLiveReportFromRss(gstat, bingParsed, "2026-11-18T12:00:00.000Z");
  assert.equal(gstatReport.rulings[0].bench, "GSTAT (Principal Bench)");
});
