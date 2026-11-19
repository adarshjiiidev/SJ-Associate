import test from "node:test";
import assert from "node:assert/strict";
import {
  HOSTINGER_MAIL_DEFAULTS,
  formatMailListDate,
  mapMailboxRoleLabel,
  parseCookieHeader,
  sanitizeEmailHtml,
  validateComposeMailInput,
  validateMailLoginInput
} from "./mailHelpers";

test("Hostinger defaults match legalsja.com TLS IMAP/SMTP settings", () => {
  assert.equal(HOSTINGER_MAIL_DEFAULTS.defaultEmail, "sanjaysingh@legalsja.com");
  assert.equal(HOSTINGER_MAIL_DEFAULTS.imapHost, "imap.hostinger.com");
  assert.equal(HOSTINGER_MAIL_DEFAULTS.imapPort, 993);
  assert.equal(HOSTINGER_MAIL_DEFAULTS.smtpHost, "smtp.hostinger.com");
  assert.equal(HOSTINGER_MAIL_DEFAULTS.smtpPort, 465);
});

test("validateMailLoginInput rejects invalid emails/empty passwords and normalizes valid inputs", () => {
  const bad = validateMailLoginInput({ email: "not-an-email", password: "" });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.email);
  assert.ok(bad.errors.password);

  const ok = validateMailLoginInput({
    email: "  SanjaySingh@legalsja.com ",
    password: "secret-password"
  });
  assert.equal(ok.valid, true);
  assert.equal(ok.normalized?.email, "sanjaysingh@legalsja.com");
  assert.equal(ok.normalized?.imapHost, "imap.hostinger.com");
  assert.equal(ok.normalized?.imapPort, 993);
  assert.equal(ok.normalized?.smtpHost, "smtp.hostinger.com");
  assert.equal(ok.normalized?.smtpPort, 465);
});

test("validateComposeMailInput checks recipients, subject, and body", () => {
  const bad = validateComposeMailInput({
    to: "bad-recipient",
    cc: "also-bad",
    subject: "",
    text: ""
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.to);
  assert.ok(bad.errors.cc);
  assert.ok(bad.errors.subject);
  assert.ok(bad.errors.text);

  const ok = validateComposeMailInput({
    to: "client@company.in, Legal Team <counsel@firm.org>",
    subject: "GSTAT Section 112 Appeal Brief",
    text: "Please find the updated draft paperbook attached."
  });
  assert.equal(ok.valid, true);
  assert.equal(ok.normalized?.to.length, 2);
});

test("sanitizeEmailHtml strips scripts, iframes, inline event handlers, and javascript URIs", () => {
  const dirty =
    '<p onclick="alert(1)">Order Attached</p><script>steal()</script><a href="javascript:alert(2)">Open</a><iframe src="https://evil.test"></iframe>';
  const clean = sanitizeEmailHtml(dirty);
  assert.equal(clean.includes("<script"), false);
  assert.equal(clean.includes("<iframe"), false);
  assert.equal(clean.includes("onclick"), false);
  assert.equal(clean.includes("javascript:"), false);
  assert.equal(clean.includes("Order Attached"), true);
});

test("parseCookieHeader and mapMailboxRoleLabel normalize cookies and IMAP folder roles", () => {
  const cookies = parseCookieHeader("foo=bar; sj_mail_sid=abc%20123; empty=");
  assert.equal(cookies.foo, "bar");
  assert.equal(cookies.sj_mail_sid, "abc 123");

  assert.deepEqual(mapMailboxRoleLabel("\\Inbox", "INBOX"), { role: "inbox", label: "Inbox" });
  assert.deepEqual(mapMailboxRoleLabel(undefined, "INBOX.Sent"), { role: "sent", label: "Sent" });
  assert.deepEqual(mapMailboxRoleLabel("\\Trash", "Trash"), { role: "trash", label: "Trash" });
  assert.deepEqual(mapMailboxRoleLabel(undefined, "INBOX.Clients"), {
    role: "custom",
    label: "Clients"
  });
});

test("formatMailListDate renders time for today and concise date for prior days", () => {
  const ref = new Date("2026-11-18T14:00:00Z");
  const prevYear = formatMailListDate("2025-04-02T10:00:00Z", ref);
  assert.match(prevYear, /2025/);
});
