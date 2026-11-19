import express from "express";
import crypto from "node:crypto";
import { ImapFlow, type ListResponse } from "imapflow";
import nodemailer, { type SendMailOptions } from "nodemailer";
import { simpleParser, type AddressObject, type ParsedMail } from "mailparser";
import {
  HOSTINGER_MAIL_DEFAULTS,
  mapMailboxRoleLabel,
  parseCookieHeader,
  sanitizeEmailHtml,
  validateComposeMailInput,
  validateMailLoginInput
} from "../utils/mailHelpers.js";
import {
  sealMailSessionToken,
  unsealMailSessionToken
} from "../utils/mailSessionToken.js";

export const MAIL_COOKIE_NAME = "sj_mail_sid";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

interface MailSession {
  id: string;
  email: string;
  password: string;
  imapHost: string;
  imapPort: number;
  smtpHost: string;
  smtpPort: number;
  createdAt: number;
  lastUsedAt: number;
}

const mailSessions = new Map<string, MailSession>();

function cleanEnv(val?: string): string {
  if (!val) return "";
  return val.trim().replace(/^["']+|["']+$/g, "").trim();
}

function isLegacyReplacedEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return lower.includes("@legalsja.com") || lower === "sanjaysingh@legalsja.com";
}

function resolveDefaultMailboxEmail(): string {
  const envEmail = cleanEnv(process.env.MAIL_DEFAULT_EMAIL);
  if (envEmail && !isLegacyReplacedEmail(envEmail)) {
    return envEmail;
  }
  return HOSTINGER_MAIL_DEFAULTS.defaultEmail;
}

function resolveDefaultImapHost(): string {
  return cleanEnv(process.env.MAIL_IMAP_HOST) || HOSTINGER_MAIL_DEFAULTS.imapHost;
}

function resolveDefaultImapPort(): number {
  const port = Number(cleanEnv(process.env.MAIL_IMAP_PORT));
  return Number.isInteger(port) && port > 0 ? port : HOSTINGER_MAIL_DEFAULTS.imapPort;
}

function resolveDefaultSmtpHost(): string {
  return cleanEnv(process.env.MAIL_SMTP_HOST) || HOSTINGER_MAIL_DEFAULTS.smtpHost;
}

function resolveDefaultSmtpPort(): number {
  const port = Number(cleanEnv(process.env.MAIL_SMTP_PORT));
  return Number.isInteger(port) && port > 0 ? port : HOSTINGER_MAIL_DEFAULTS.smtpPort;
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [id, session] of mailSessions.entries()) {
    if (now - session.lastUsedAt > SESSION_TTL_MS) {
      mailSessions.delete(id);
    }
  }
}

function extractSessionId(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }
  const cookies = parseCookieHeader(req.headers.cookie);
  return cookies[MAIL_COOKIE_NAME] || null;
}

function getSessionFromRequest(req: express.Request): MailSession | null {
  cleanupExpiredSessions();
  const sid = extractSessionId(req);
  if (!sid) return null;

  const cached = mailSessions.get(sid);
  if (cached) {
    cached.lastUsedAt = Date.now();
    return cached;
  }

  const unsealed = unsealMailSessionToken(sid);
  if (!unsealed) return null;

  const rehydrated: MailSession = {
    id: sid,
    email: unsealed.email,
    password: unsealed.password,
    imapHost: unsealed.imapHost,
    imapPort: unsealed.imapPort,
    smtpHost: unsealed.smtpHost,
    smtpPort: unsealed.smtpPort,
    createdAt: unsealed.createdAt,
    lastUsedAt: Date.now()
  };
  mailSessions.set(sid, rehydrated);
  return rehydrated;
}

function isHttpsRequest(req: express.Request): boolean {
  const proto = String(req.headers["x-forwarded-proto"] || "").toLowerCase();
  return Boolean(req.secure || proto.includes("https"));
}

function setSessionCookie(req: express.Request, res: express.Response, sid: string) {
  const isHttps = isHttpsRequest(req);
  const host = String(req.headers.host || "").toLowerCase();
  const isFirstPartyDomain = host.includes("sjalaw.in") || host.includes("vercel.app");
  const sameSite = isHttps && !isFirstPartyDomain ? "SameSite=None" : "SameSite=Lax";
  const parts = [
    `${MAIL_COOKIE_NAME}=${encodeURIComponent(sid)}`,
    "Path=/",
    "HttpOnly",
    sameSite,
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
  ];
  if (isHttps) {
    parts.push("Secure");
  }
  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearSessionCookie(req: express.Request, res: express.Response) {
  const isHttps = isHttpsRequest(req);
  const host = String(req.headers.host || "").toLowerCase();
  const isFirstPartyDomain = host.includes("sjalaw.in") || host.includes("vercel.app");
  const sameSite = isHttps && !isFirstPartyDomain ? "SameSite=None" : "SameSite=Lax";
  const parts = [
    `${MAIL_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    sameSite,
    "Max-Age=0"
  ];
  if (isHttps) {
    parts.push("Secure");
  }
  res.setHeader("Set-Cookie", parts.join("; "));
}

function createImapClient(session: Pick<MailSession, "email" | "password" | "imapHost" | "imapPort">) {
  return new ImapFlow({
    host: session.imapHost,
    port: session.imapPort,
    secure: session.imapPort === 993,
    auth: {
      user: session.email,
      pass: session.password
    },
    tls: {
      rejectUnauthorized: false,
      servername: session.imapHost
    },
    logger: false,
    connectionTimeout: 15000,
    greetingTimeout: 12000,
    socketTimeout: 25000
  });
}

async function withImapClient<T>(
  session: Pick<MailSession, "email" | "password" | "imapHost" | "imapPort">,
  fn: (client: ImapFlow) => Promise<T>
): Promise<T> {
  const client = createImapClient(session);
  await client.connect();
  try {
    return await fn(client);
  } finally {
    try {
      await client.logout();
    } catch {
      client.close();
    }
  }
}

function formatAddressField(addr?: AddressObject | AddressObject[] | null): string {
  if (!addr) return "";
  const list = Array.isArray(addr) ? addr : [addr];
  return list
    .flatMap((item) => item.value ?? [])
    .map((entry) =>
      entry.name ? `${entry.name} <${entry.address ?? ""}>` : entry.address ?? ""
    )
    .filter(Boolean)
    .join(", ");
}

function formatEnvelopeAddresses(
  list?: Array<{ name?: string; address?: string }>
): string {
  if (!list || list.length === 0) return "";
  return list
    .map((entry) =>
      entry.name && entry.address
        ? `${entry.name} <${entry.address}>`
        : entry.address || entry.name || ""
    )
    .filter(Boolean)
    .join(", ");
}

function hasAttachmentPart(struct: unknown): boolean {
  if (!struct || typeof struct !== "object") return false;
  const node = struct as {
    disposition?: string;
    childNodes?: unknown[];
  };
  if (typeof node.disposition === "string" && node.disposition.toLowerCase() === "attachment") {
    return true;
  }
  if (Array.isArray(node.childNodes)) {
    return node.childNodes.some((child) => hasAttachmentPart(child));
  }
  return false;
}

function findFolderByRole(
  folders: ListResponse[],
  targetRole: "sent" | "trash" | "drafts"
): string | null {
  for (const folder of folders) {
    const mapped = mapMailboxRoleLabel(folder.specialUse, folder.path);
    if (mapped.role === targetRole) {
      return folder.path;
    }
  }
  return null;
}

export async function forwardConsultationEmailIfConfigured(entry: {
  referenceId: string;
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  courtSlug: string;
  practiceArea: string;
  briefSummary: string;
}): Promise<boolean> {
  cleanupExpiredSessions();

  const rawNotify = cleanEnv(process.env.MAIL_NOTIFY_TO);
  const recipient =
    rawNotify && !isLegacyReplacedEmail(rawNotify)
      ? rawNotify
      : HOSTINGER_MAIL_DEFAULTS.defaultEmail;

  const rawSmtpUser = cleanEnv(process.env.MAIL_SMTP_USER);
  let smtpUser =
    rawSmtpUser && !isLegacyReplacedEmail(rawSmtpUser)
      ? rawSmtpUser
      : resolveDefaultMailboxEmail();
  let smtpPass = cleanEnv(process.env.MAIL_SMTP_PASS);
  let smtpHost = resolveDefaultSmtpHost();
  let smtpPort = resolveDefaultSmtpPort();

  // Fallback: if server env SMTP credentials aren't set, reuse an active authenticated Hostinger session
  if (!smtpUser || !smtpPass) {
    const activeSessions = Array.from(mailSessions.values()).sort(
      (a, b) => b.lastUsedAt - a.lastUsedAt
    );
    const preferred =
      activeSessions.find((s) => s.email.toLowerCase() === recipient.toLowerCase()) ||
      activeSessions[0];
    if (!preferred) {
      return false;
    }
    smtpUser = preferred.email;
    smtpPass = preferred.password;
    smtpHost = preferred.smtpHost;
    smtpPort = preferred.smtpPort;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    tls: {
      rejectUnauthorized: false,
      servername: smtpHost
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  await transporter.sendMail({
    from: `SJ Associates Chambers <${smtpUser}>`,
    to: recipient,
    replyTo: entry.email,
    subject: `[${entry.referenceId}] Chambers Briefing: ${entry.practiceArea} (${entry.fullName})`,
    text: [
      `Reference ID: ${entry.referenceId}`,
      `Submitted: ${entry.submittedAt}`,
      `Client Name: ${entry.fullName}`,
      `Client Email: ${entry.email}`,
      `Phone: ${entry.phone}`,
      `Practice Area: ${entry.practiceArea}`,
      `Court / Tax Office: ${entry.courtSlug}`,
      "",
      "Brief Summary:",
      entry.briefSummary
    ].join("\n")
  });

  return true;
}

export function createMailRouter(): express.Router {
  const router = express.Router();

  router.get("/session", (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      return res.json({
        authenticated: false,
        defaults: {
          emailHint: resolveDefaultMailboxEmail(),
          imapHost: resolveDefaultImapHost(),
          imapPort: resolveDefaultImapPort(),
          smtpHost: resolveDefaultSmtpHost(),
          smtpPort: resolveDefaultSmtpPort()
        }
      });
    }

    return res.json({
      authenticated: true,
      user: {
        email: session.email,
        imapHost: session.imapHost,
        imapPort: session.imapPort,
        smtpHost: session.smtpHost,
        smtpPort: session.smtpPort
      }
    });
  });

  router.post("/login", async (req, res) => {
    const body = req.body ?? {};
    const validation = validateMailLoginInput({
      email: cleanEnv(body.email) || resolveDefaultMailboxEmail(),
      password: body.password,
      imapHost: cleanEnv(body.imapHost) || resolveDefaultImapHost(),
      imapPort: body.imapPort ?? resolveDefaultImapPort(),
      smtpHost: cleanEnv(body.smtpHost) || resolveDefaultSmtpHost(),
      smtpPort: body.smtpPort ?? resolveDefaultSmtpPort()
    });
    if (!validation.valid || !validation.normalized) {
      return res.status(400).json({
        error: "Please enter a valid mailbox address, password, and server settings.",
        errors: validation.errors
      });
    }

    const creds = validation.normalized;
    try {
      await withImapClient(creds, async (client) => {
        await client.mailboxOpen("INBOX", { readOnly: true });
      });

      const now = Date.now();
      const sid = sealMailSessionToken({
        id: crypto.randomBytes(16).toString("hex"),
        email: creds.email,
        password: creds.password,
        imapHost: creds.imapHost,
        imapPort: creds.imapPort,
        smtpHost: creds.smtpHost,
        smtpPort: creds.smtpPort,
        createdAt: now,
        expiresAt: now + SESSION_TTL_MS
      });
      const session: MailSession = {
        id: sid,
        email: creds.email,
        password: creds.password,
        imapHost: creds.imapHost,
        imapPort: creds.imapPort,
        smtpHost: creds.smtpHost,
        smtpPort: creds.smtpPort,
        createdAt: now,
        lastUsedAt: now
      };
      mailSessions.set(sid, session);
      setSessionCookie(req, res, sid);

      return res.json({
        authenticated: true,
        sessionToken: sid,
        user: {
          email: session.email,
          imapHost: session.imapHost,
          imapPort: session.imapPort,
          smtpHost: session.smtpHost,
          smtpPort: session.smtpPort
        }
      });
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : "IMAP authentication failed";
      const responseText = typeof err?.responseText === "string" ? err.responseText : "";
      const isAuthFailure =
        /auth|credentials|login|password|invalid|authenticationfailed/i.test(msg) ||
        /auth|credentials|login|password|invalid/i.test(responseText);
      return res.status(isAuthFailure ? 401 : 502).json({
        error: isAuthFailure
          ? `Authentication failed for ${creds.email} on ${creds.imapHost}. Please verify the Hostinger mailbox password for ${creds.email}.`
          : `Could not connect to ${creds.imapHost}:${creds.imapPort} (${msg}).`,
        code: isAuthFailure ? "MAIL_AUTH_FAILED" : "MAIL_SERVER_UNREACHABLE"
      });
    }
  });

  router.post("/logout", (req, res) => {
    const sid = extractSessionId(req);
    if (sid) {
      mailSessions.delete(sid);
    }
    clearSessionCookie(req, res);
    res.json({ ok: true });
  });

  router.get("/folders", async (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Not signed in to mail." });
    }

    try {
      const folders = await withImapClient(session, async (client) => {
        const listed = await client.list({
          statusQuery: { messages: true, unseen: true }
        });

        const orderMap = {
          inbox: 0,
          sent: 1,
          drafts: 2,
          archive: 3,
          junk: 4,
          trash: 5,
          custom: 6
        } as const;

        return listed
          .map((item) => {
            const { role, label } = mapMailboxRoleLabel(item.specialUse, item.path);
            return {
              path: item.path,
              label,
              role,
              messages: item.status?.messages ?? 0,
              unseen: item.status?.unseen ?? 0
            };
          })
          .sort((a, b) => {
            const diff = orderMap[a.role] - orderMap[b.role];
            return diff !== 0 ? diff : a.label.localeCompare(b.label);
          });
      });

      return res.json({ folders });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to list mailbox folders.";
      return res.status(502).json({ error: message });
    }
  });

  router.get("/messages", async (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Not signed in to mail." });
    }

    const folder = String(req.query.folder || "INBOX");
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(5, Number(req.query.limit || 25)));
    const searchQuery = String(req.query.q || "").trim();

    try {
      const result = await withImapClient(session, async (client) => {
        const lock = await client.getMailboxLock(folder);
        try {
          const allUids = await client.search(
            searchQuery
              ? {
                  or: [
                    { subject: searchQuery },
                    { from: searchQuery },
                    { to: searchQuery },
                    { body: searchQuery }
                  ]
                }
              : { all: true },
            { uid: true }
          );

          const sortedDesc = [...(allUids || [])].sort((a, b) => b - a);
          const total = sortedDesc.length;
          const start = (page - 1) * limit;
          const pageUids = sortedDesc.slice(start, start + limit);

          if (pageUids.length === 0) {
            return { folder, total, page, limit, messages: [] };
          }

          const items: Array<{
            uid: number;
            subject: string;
            from: string;
            to: string;
            date: string;
            seen: boolean;
            flagged: boolean;
            hasAttachments: boolean;
          }> = [];

          for await (const msg of client.fetch(
            pageUids,
            {
              uid: true,
              flags: true,
              envelope: true,
              bodyStructure: true,
              internalDate: true
            },
            { uid: true }
          )) {
            const flags = msg.flags ?? new Set<string>();
            items.push({
              uid: msg.uid,
              subject: msg.envelope?.subject?.trim() || "(No subject)",
              from: formatEnvelopeAddresses(msg.envelope?.from) || "Unknown sender",
              to: formatEnvelopeAddresses(msg.envelope?.to),
              date: new Date(
                msg.envelope?.date ?? msg.internalDate ?? Date.now()
              ).toISOString(),
              seen: flags.has("\\Seen"),
              flagged: flags.has("\\Flagged"),
              hasAttachments: hasAttachmentPart(msg.bodyStructure)
            });
          }

          items.sort((a, b) => b.uid - a.uid);
          return { folder, total, page, limit, messages: items };
        } finally {
          lock.release();
        }
      });

      return res.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch messages.";
      return res.status(502).json({ error: message });
    }
  });

  router.get("/messages/:uid", async (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Not signed in to mail." });
    }

    const uid = Number(req.params.uid);
    const folder = String(req.query.folder || "INBOX");
    if (!Number.isInteger(uid) || uid <= 0) {
      return res.status(400).json({ error: "Invalid message UID." });
    }

    try {
      const parsedDetail = await withImapClient(session, async (client) => {
        const lock = await client.getMailboxLock(folder);
        try {
          const message = await client.fetchOne(
            String(uid),
            { uid: true, flags: true, source: true },
            { uid: true }
          );
          if (!message || !message.source) {
            return null;
          }

          if (!message.flags?.has("\\Seen")) {
            await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
          }

          const parsed: ParsedMail = await simpleParser(message.source);
          return {
            uid: message.uid,
            folder,
            subject: parsed.subject?.trim() || "(No subject)",
            from: formatAddressField(parsed.from) || "Unknown sender",
            to: formatAddressField(parsed.to),
            cc: formatAddressField(parsed.cc),
            replyTo: formatAddressField(parsed.replyTo),
            messageId: parsed.messageId || undefined,
            date: (parsed.date ?? new Date()).toISOString(),
            seen: true,
            flagged: message.flags?.has("\\Flagged") ?? false,
            text: parsed.text || "",
            html: typeof parsed.html === "string" ? sanitizeEmailHtml(parsed.html) : "",
            attachments: (parsed.attachments ?? []).map((att, idx) => ({
              index: idx,
              filename: att.filename || `attachment-${idx + 1}`,
              contentType: att.contentType || "application/octet-stream",
              size: att.size || att.content.length
            }))
          };
        } finally {
          lock.release();
        }
      });

      if (!parsedDetail) {
        return res.status(404).json({ error: "Message not found." });
      }
      return res.json(parsedDetail);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load message.";
      return res.status(502).json({ error: message });
    }
  });

  router.get("/messages/:uid/attachment/:index", async (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Not signed in to mail." });
    }

    const uid = Number(req.params.uid);
    const index = Number(req.params.index);
    const folder = String(req.query.folder || "INBOX");
    if (!Number.isInteger(uid) || uid <= 0 || !Number.isInteger(index) || index < 0) {
      return res.status(400).json({ error: "Invalid attachment request." });
    }

    try {
      const att = await withImapClient(session, async (client) => {
        const lock = await client.getMailboxLock(folder);
        try {
          const message = await client.fetchOne(String(uid), { source: true }, { uid: true });
          if (!message || !message.source) return null;
          const parsed = await simpleParser(message.source);
          return parsed.attachments?.[index] ?? null;
        } finally {
          lock.release();
        }
      });

      if (!att) {
        return res.status(404).json({ error: "Attachment not found." });
      }

      const filename = (att.filename || `attachment-${index + 1}`).replace(/["\r\n]/g, "");
      res.setHeader("Content-Type", att.contentType || "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      return res.send(att.content);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to download attachment.";
      return res.status(502).json({ error: message });
    }
  });

  router.post("/send", async (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Not signed in to mail." });
    }

    const validation = validateComposeMailInput(req.body ?? {});
    if (!validation.valid || !validation.normalized) {
      return res.status(400).json({
        error: "Please fix the highlighted fields before sending.",
        errors: validation.errors
      });
    }

    const msg = validation.normalized;
    try {
      const transporter = nodemailer.createTransport({
        host: session.smtpHost,
        port: session.smtpPort,
        secure: session.smtpPort === 465,
        tls: {
          rejectUnauthorized: false,
          servername: session.smtpHost
        },
        auth: {
          user: session.email,
          pass: session.password
        }
      });

      const mailOptions: SendMailOptions = {
        from: session.email,
        to: msg.to,
        cc: msg.cc.length > 0 ? msg.cc : undefined,
        subject: msg.subject,
        text: msg.text,
        inReplyTo: msg.inReplyTo,
        references: msg.references
      };

      const info = await transporter.sendMail(mailOptions);

      // Build RFC822 copy and append to Sent folder via IMAP so Sent stays synchronized
      try {
        const rawInfo = await nodemailer
          .createTransport({ streamTransport: true, newline: "unix", buffer: true })
          .sendMail(mailOptions);
        const rawBuffer = rawInfo.message;
        if (Buffer.isBuffer(rawBuffer)) {
          await withImapClient(session, async (client) => {
            const folders = await client.list();
            const sentPath = findFolderByRole(folders, "sent");
            if (sentPath) {
              await client.append(sentPath, rawBuffer, ["\\Seen"]);
            }
          });
        }
      } catch {
        // Non-fatal if Sent append fails on a custom server
      }

      return res.status(201).json({
        ok: true,
        messageId: info.messageId
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send email via SMTP.";
      return res.status(502).json({ error: message });
    }
  });

  router.patch("/messages/:uid/flags", async (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Not signed in to mail." });
    }

    const uid = Number(req.params.uid);
    const folder = String(req.body?.folder || "INBOX");
    const seen = typeof req.body?.seen === "boolean" ? req.body.seen : undefined;
    const flagged = typeof req.body?.flagged === "boolean" ? req.body.flagged : undefined;

    if (!Number.isInteger(uid) || uid <= 0) {
      return res.status(400).json({ error: "Invalid message UID." });
    }

    try {
      await withImapClient(session, async (client) => {
        const lock = await client.getMailboxLock(folder);
        try {
          if (seen === true) {
            await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
          } else if (seen === false) {
            await client.messageFlagsRemove(String(uid), ["\\Seen"], { uid: true });
          }

          if (flagged === true) {
            await client.messageFlagsAdd(String(uid), ["\\Flagged"], { uid: true });
          } else if (flagged === false) {
            await client.messageFlagsRemove(String(uid), ["\\Flagged"], { uid: true });
          }
        } finally {
          lock.release();
        }
      });

      return res.json({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update message flags.";
      return res.status(502).json({ error: message });
    }
  });

  router.delete("/messages/:uid", async (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Not signed in to mail." });
    }

    const uid = Number(req.params.uid);
    const folder = String(req.query.folder || "INBOX");
    if (!Number.isInteger(uid) || uid <= 0) {
      return res.status(400).json({ error: "Invalid message UID." });
    }

    try {
      await withImapClient(session, async (client) => {
        const folders = await client.list();
        const trashPath = findFolderByRole(folders, "trash");
        const lock = await client.getMailboxLock(folder);
        try {
          if (trashPath && trashPath !== folder) {
            await client.messageMove(String(uid), trashPath, { uid: true });
          } else {
            await client.messageDelete(String(uid), { uid: true });
          }
        } finally {
          lock.release();
        }
      });

      return res.json({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete message.";
      return res.status(502).json({ error: message });
    }
  });

  return router;
}
