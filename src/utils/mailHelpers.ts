export const HOSTINGER_MAIL_DEFAULTS = {
  domain: "legalsja.com",
  defaultEmail: "sanjaysingh@legalsja.com",
  imapHost: "imap.hostinger.com",
  imapPort: 993,
  smtpHost: "smtp.hostinger.com",
  smtpPort: 465,
  tlsEnabled: true
} as const;

export interface MailLoginInput {
  email?: string;
  password?: string;
  imapHost?: string;
  imapPort?: number | string;
  smtpHost?: string;
  smtpPort?: number | string;
}

export interface NormalizedMailLogin {
  email: string;
  password: string;
  imapHost: string;
  imapPort: number;
  smtpHost: string;
  smtpPort: number;
}

export function validateMailLoginInput(input: MailLoginInput): {
  valid: boolean;
  errors: Record<string, string>;
  normalized?: NormalizedMailLogin;
} {
  const errors: Record<string, string> = {};
  const email = (input.email ?? "").trim().toLowerCase();
  const password = input.password ?? "";
  const imapHost = (input.imapHost ?? HOSTINGER_MAIL_DEFAULTS.imapHost).trim().toLowerCase();
  const smtpHost = (input.smtpHost ?? HOSTINGER_MAIL_DEFAULTS.smtpHost).trim().toLowerCase();
  const imapPort = Number(input.imapPort ?? HOSTINGER_MAIL_DEFAULTS.imapPort);
  const smtpPort = Number(input.smtpPort ?? HOSTINGER_MAIL_DEFAULTS.smtpPort);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid mailbox address (e.g. sanjaysingh@legalsja.com).";
  }

  if (!password || password.length < 1) {
    errors.password = "Mailbox password is required.";
  }

  if (!imapHost || !/^[a-z0-9.-]+$/i.test(imapHost)) {
    errors.imapHost = "Enter a valid IMAP hostname.";
  }

  if (!Number.isInteger(imapPort) || imapPort < 1 || imapPort > 65535) {
    errors.imapPort = "Enter a valid IMAP port (e.g. 993).";
  }

  if (!smtpHost || !/^[a-z0-9.-]+$/i.test(smtpHost)) {
    errors.smtpHost = "Enter a valid SMTP hostname.";
  }

  if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
    errors.smtpPort = "Enter a valid SMTP port (e.g. 465).";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    normalized: {
      email,
      password,
      imapHost,
      imapPort,
      smtpHost,
      smtpPort
    }
  };
}

export interface ComposeMailInput {
  to?: string;
  cc?: string;
  subject?: string;
  text?: string;
  inReplyTo?: string;
  references?: string;
}

export function parseRecipientList(raw: string): string[] {
  return raw
    .split(/[,;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function isValidEmailRecipient(address: string): boolean {
  const angleMatch = address.match(/<([^<>]+)>/);
  const candidate = (angleMatch ? angleMatch[1] : address).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate);
}

export function validateComposeMailInput(input: ComposeMailInput): {
  valid: boolean;
  errors: Record<string, string>;
  normalized?: {
    to: string[];
    cc: string[];
    subject: string;
    text: string;
    inReplyTo?: string;
    references?: string;
  };
} {
  const errors: Record<string, string> = {};
  const toList = parseRecipientList(input.to ?? "");
  const ccList = parseRecipientList(input.cc ?? "");
  const subject = (input.subject ?? "").trim();
  const text = (input.text ?? "").trim();

  if (toList.length === 0) {
    errors.to = "Add at least one recipient email address.";
  } else if (toList.some((addr) => !isValidEmailRecipient(addr))) {
    errors.to = "One or more 'To' email addresses are invalid.";
  }

  if (ccList.some((addr) => !isValidEmailRecipient(addr))) {
    errors.cc = "One or more 'Cc' email addresses are invalid.";
  }

  if (!subject) {
    errors.subject = "Subject line is required.";
  }

  if (!text) {
    errors.text = "Message body cannot be empty.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    normalized: {
      to: toList,
      cc: ccList,
      subject,
      text,
      inReplyTo: input.inReplyTo?.trim() || undefined,
      references: input.references?.trim() || undefined
    }
  };
}

export function parseCookieHeader(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const eqIndex = part.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = part.slice(0, eqIndex).trim();
    const val = part.slice(eqIndex + 1).trim();
    if (!key) continue;
    try {
      result[key] = decodeURIComponent(val);
    } catch {
      result[key] = val;
    }
  }
  return result;
}

export function mapMailboxRoleLabel(
  specialUse: string | undefined,
  folderPath: string
): { role: "inbox" | "sent" | "drafts" | "junk" | "trash" | "archive" | "custom"; label: string } {
  const upperPath = folderPath.toUpperCase();
  const su = (specialUse ?? "").toLowerCase();

  if (su === "\\inbox" || upperPath === "INBOX") {
    return { role: "inbox", label: "Inbox" };
  }
  if (su === "\\sent" || upperPath === "SENT" || upperPath.endsWith(".SENT") || upperPath.includes("SENT")) {
    return { role: "sent", label: "Sent" };
  }
  if (su === "\\drafts" || upperPath === "DRAFTS" || upperPath.endsWith(".DRAFTS") || upperPath.includes("DRAFT")) {
    return { role: "drafts", label: "Drafts" };
  }
  if (su === "\\junk" || upperPath === "JUNK" || upperPath.includes("SPAM") || upperPath.includes("JUNK")) {
    return { role: "junk", label: "Spam" };
  }
  if (su === "\\trash" || upperPath === "TRASH" || upperPath.endsWith(".TRASH") || upperPath.includes("TRASH")) {
    return { role: "trash", label: "Trash" };
  }
  if (su === "\\archive" || upperPath.includes("ARCHIVE")) {
    return { role: "archive", label: "Archive" };
  }

  const shortName = folderPath.includes(".")
    ? folderPath.split(".").pop() || folderPath
    : folderPath.includes("/")
      ? folderPath.split("/").pop() || folderPath
      : folderPath;

  return { role: "custom", label: shortName };
}

export function sanitizeEmailHtml(rawHtml: string): string {
  if (!rawHtml) return "";
  return rawHtml
    .replace(/<\s*(script|iframe|object|embed|form|meta|link|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|iframe|object|embed|form|meta|link|base)[^>]*\/?>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '$1="#"');
}

export function formatMailListDate(isoDate?: string, referenceNow: Date = new Date()): string {
  if (!isoDate) return "";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;

  const sameDay =
    parsed.getFullYear() === referenceNow.getFullYear() &&
    parsed.getMonth() === referenceNow.getMonth() &&
    parsed.getDate() === referenceNow.getDate();

  if (sameDay) {
    return parsed.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (parsed.getFullYear() === referenceNow.getFullYear()) {
    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short"
    });
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
