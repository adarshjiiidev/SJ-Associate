import crypto from "node:crypto";

export interface SealedMailSessionPayload {
  id: string;
  email: string;
  password: string;
  imapHost: string;
  imapPort: number;
  smtpHost: string;
  smtpPort: number;
  createdAt: number;
  expiresAt: number;
}

const TOKEN_PREFIX = "v1";

function cleanSecret(val?: string): string {
  if (!val) return "";
  return val.trim().replace(/^["']+|["']+$/g, "").trim();
}

function deriveAesKey(secretOverride?: string): Buffer {
  const rawSecret =
    cleanSecret(secretOverride) ||
    cleanSecret(process.env.MAIL_SESSION_SECRET) ||
    cleanSecret(process.env.VERCEL_PROJECT_ID) ||
    "sj-associates-sjalaw-hostinger-mail-session-v1";
  return crypto.createHash("sha256").update(rawSecret, "utf8").digest();
}

export function sealMailSessionToken(
  payload: SealedMailSessionPayload,
  secretOverride?: string
): string {
  const key = deriveAesKey(secretOverride);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const json = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [
    TOKEN_PREFIX,
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url")
  ].join(".");
}

export function unsealMailSessionToken(
  token: string,
  nowMs: number = Date.now(),
  secretOverride?: string
): SealedMailSessionPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.trim().split(".");
  if (parts.length !== 4 || parts[0] !== TOKEN_PREFIX) {
    return null;
  }

  try {
    const [, ivB64, tagB64, dataB64] = parts;
    const iv = Buffer.from(ivB64, "base64url");
    const authTag = Buffer.from(tagB64, "base64url");
    const encrypted = Buffer.from(dataB64, "base64url");

    if (iv.length !== 12 || authTag.length !== 16 || encrypted.length === 0) {
      return null;
    }

    const key = deriveAesKey(secretOverride);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
      "utf8"
    );
    const parsed = JSON.parse(decrypted) as Partial<SealedMailSessionPayload>;

    if (
      !parsed ||
      typeof parsed.id !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.password !== "string" ||
      typeof parsed.imapHost !== "string" ||
      typeof parsed.imapPort !== "number" ||
      typeof parsed.smtpHost !== "string" ||
      typeof parsed.smtpPort !== "number" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    if (parsed.expiresAt <= nowMs) {
      return null;
    }

    return parsed as SealedMailSessionPayload;
  } catch {
    return null;
  }
}
