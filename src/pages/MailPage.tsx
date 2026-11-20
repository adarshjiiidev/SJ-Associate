import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileEdit,
  Forward,
  Inbox,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MailOpen,
  Paperclip,
  PenSquare,
  RefreshCw,
  Reply,
  Search,
  Send,
  ShieldCheck,
  Star,
  Trash2
} from "lucide-react";
import { FirmLogo } from "@/src/components/FirmLogo";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/src/components/ui/dialog";
import {
  HOSTINGER_MAIL_DEFAULTS,
  formatMailListDate,
  validateComposeMailInput,
  validateMailLoginInput
} from "@/src/utils/mailHelpers";
import { parseJsonSafely } from "@/src/utils/http";

interface MailUser {
  email: string;
  imapHost: string;
  imapPort: number;
  smtpHost: string;
  smtpPort: number;
}

interface MailFolder {
  path: string;
  label: string;
  role: "inbox" | "sent" | "drafts" | "junk" | "trash" | "archive" | "custom";
  messages: number;
  unseen: number;
}

interface MailSummary {
  uid: number;
  subject: string;
  from: string;
  to: string;
  date: string;
  seen: boolean;
  flagged: boolean;
  hasAttachments: boolean;
}

interface MailAttachment {
  index: number;
  filename: string;
  contentType: string;
  size: number;
}

interface MailDetail {
  uid: number;
  folder: string;
  subject: string;
  from: string;
  to: string;
  cc: string;
  replyTo: string;
  messageId?: string;
  date: string;
  seen: boolean;
  flagged: boolean;
  text: string;
  html: string;
  attachments: MailAttachment[];
}

function getFolderIcon(role: MailFolder["role"]) {
  switch (role) {
    case "inbox":
      return Inbox;
    case "sent":
      return Send;
    case "drafts":
      return FileEdit;
    case "junk":
      return AlertCircle;
    case "trash":
      return Trash2;
    case "archive":
      return Archive;
    default:
      return Mail;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MailPage() {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [user, setUser] = useState<MailUser | null>(null);

  // Login form state
  const [email, setEmail] = useState<string>(HOSTINGER_MAIL_DEFAULTS.defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [imapHost, setImapHost] = useState<string>(HOSTINGER_MAIL_DEFAULTS.imapHost);
  const [imapPort, setImapPort] = useState<string>(String(HOSTINGER_MAIL_DEFAULTS.imapPort));
  const [smtpHost, setSmtpHost] = useState<string>(HOSTINGER_MAIL_DEFAULTS.smtpHost);
  const [smtpPort, setSmtpPort] = useState<string>(String(HOSTINGER_MAIL_DEFAULTS.smtpPort));
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Mailbox workspace state
  const [folders, setFolders] = useState<MailFolder[]>([]);
  const [activeFolder, setActiveFolder] = useState("INBOX");
  const [messages, setMessages] = useState<MailSummary[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // Selected message detail
  const [selectedUid, setSelectedUid] = useState<number | null>(null);
  const [detail, setDetail] = useState<MailDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Compose modal state
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeCc, setComposeCc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeInReplyTo, setComposeInReplyTo] = useState<string | undefined>(undefined);
  const [composeSending, setComposeSending] = useState(false);
  const [composeError, setComposeError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const MAIL_TOKEN_KEY = "sj_mail_token";

  function getStoredToken(): string | null {
    try {
      return (
        window.sessionStorage.getItem(MAIL_TOKEN_KEY) ||
        window.localStorage.getItem(MAIL_TOKEN_KEY)
      );
    } catch {
      return null;
    }
  }

  function setStoredToken(token: string | null) {
    try {
      if (token) {
        window.sessionStorage.setItem(MAIL_TOKEN_KEY, token);
        window.localStorage.setItem(MAIL_TOKEN_KEY, token);
      } else {
        window.sessionStorage.removeItem(MAIL_TOKEN_KEY);
        window.localStorage.removeItem(MAIL_TOKEN_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }

  const mailFetch = useCallback((url: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    const token = getStoredToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(url, {
      ...init,
      headers,
      credentials: "include"
    });
  }, []);

  const loadFolders = useCallback(async () => {
    const resp = await mailFetch("/api/mail/folders");
    if (resp.status === 401) {
      setStoredToken(null);
      setUser(null);
      return;
    }
    const data = await parseJsonSafely<{ folders?: MailFolder[] }>(resp);
    if (resp.ok && Array.isArray(data?.folders)) {
      setFolders(data.folders);
    }
  }, [mailFetch]);

  const loadMessages = useCallback(
    async (folder: string, targetPage: number, query: string) => {
      setListLoading(true);
      setListError(null);
      try {
        const params = new URLSearchParams({
          folder,
          page: String(targetPage),
          limit: "25"
        });
        if (query) params.set("q", query);

        const resp = await mailFetch(`/api/mail/messages?${params.toString()}`);
        if (resp.status === 401) {
          setStoredToken(null);
          setUser(null);
          return;
        }
        const data = await parseJsonSafely<{
          messages?: MailSummary[];
          total?: number;
          error?: string;
        }>(resp);
        if (!resp.ok || !data) {
          throw new Error(data?.error || "Unable to fetch mailbox messages.");
        }
        setMessages(data.messages ?? []);
        setTotalMessages(Number(data.total ?? 0));
      } catch (err) {
        setListError(err instanceof Error ? err.message : "Failed to load mailbox.");
      } finally {
        setListLoading(false);
      }
    },
    [mailFetch]
  );

  const openMessage = useCallback(async (uid: number, folder: string) => {
    setSelectedUid(uid);
    setDetailLoading(true);
    setDetailError(null);
    try {
      const resp = await mailFetch(
        `/api/mail/messages/${uid}?folder=${encodeURIComponent(folder)}`
      );
      if (resp.status === 401) {
        setStoredToken(null);
        setUser(null);
        return;
      }
      const data = await parseJsonSafely<MailDetail & { error?: string }>(resp);
      if (!resp.ok || !data) {
        throw new Error(data?.error || "Unable to read email.");
      }
      setDetail(data as MailDetail);
      setMessages((prev) =>
        prev.map((m) => (m.uid === uid ? { ...m, seen: true } : m))
      );
      void loadFolders();
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Failed to load message.");
    } finally {
      setDetailLoading(false);
    }
  }, [loadFolders, mailFetch]);

  useEffect(() => {
    let active = true;
    async function checkSession() {
      try {
        const resp = await mailFetch("/api/mail/session");
        const data = await parseJsonSafely<{
          authenticated?: boolean;
          user?: MailUser;
          defaults?: {
            emailHint?: string;
            imapHost?: string;
            imapPort?: number;
            smtpHost?: string;
            smtpPort?: number;
          };
        }>(resp);
        if (!active || !data) return;
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else if (data.defaults) {
          setStoredToken(null);
          setEmail(data.defaults.emailHint || HOSTINGER_MAIL_DEFAULTS.defaultEmail);
          setImapHost(data.defaults.imapHost || HOSTINGER_MAIL_DEFAULTS.imapHost);
          setImapPort(String(data.defaults.imapPort || HOSTINGER_MAIL_DEFAULTS.imapPort));
          setSmtpHost(data.defaults.smtpHost || HOSTINGER_MAIL_DEFAULTS.smtpHost);
          setSmtpPort(String(data.defaults.smtpPort || HOSTINGER_MAIL_DEFAULTS.smtpPort));
        }
      } catch {
        // Stay on login form if session probe fails
      } finally {
        if (active) setSessionLoading(false);
      }
    }
    void checkSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    void loadFolders();
    void loadMessages(activeFolder, page, appliedSearch);
  }, [user, activeFolder, page, appliedSearch, loadFolders, loadMessages]);

  async function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    setLoginError(null);

    const validation = validateMailLoginInput({
      email,
      password,
      imapHost,
      imapPort,
      smtpHost,
      smtpPort
    });
    if (!validation.valid) {
      const firstErr = Object.values(validation.errors)[0];
      setLoginError(firstErr || "Check your mailbox credentials and server settings.");
      return;
    }

    setLoginBusy(true);
    try {
      const resp = await mailFetch("/api/mail/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.normalized)
      });
      const data = await parseJsonSafely<{
        error?: string;
        sessionToken?: string;
        user?: MailUser;
      }>(resp);
      if (!resp.ok || !data?.user) {
        throw new Error(data?.error || "Sign in failed.");
      }
      if (data.sessionToken) {
        setStoredToken(String(data.sessionToken));
      }
      setUser(data.user);
      setPassword("");
      setActiveFolder("INBOX");
      setPage(1);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleLogout() {
    await mailFetch("/api/mail/logout", { method: "POST" });
    setStoredToken(null);
    setUser(null);
    setFolders([]);
    setMessages([]);
    setSelectedUid(null);
    setDetail(null);
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSelectedUid(null);
    setDetail(null);
    setAppliedSearch(searchInput.trim());
  }

  function openNewCompose() {
    setComposeTo("");
    setComposeCc("");
    setShowCc(false);
    setComposeSubject("");
    setComposeBody("");
    setComposeInReplyTo(undefined);
    setComposeError(null);
    setComposeOpen(true);
  }

  function openReply(msg: MailDetail) {
    setComposeTo(msg.replyTo || msg.from);
    setComposeCc("");
    setShowCc(false);
    setComposeSubject(
      msg.subject.toLowerCase().startsWith("re:") ? msg.subject : `Re: ${msg.subject}`
    );
    setComposeBody(
      `\n\n--- On ${formatMailListDate(msg.date)}, ${msg.from} wrote ---\n${msg.text || ""}`
    );
    setComposeInReplyTo(msg.messageId);
    setComposeError(null);
    setComposeOpen(true);
  }

  function openForward(msg: MailDetail) {
    setComposeTo("");
    setComposeCc("");
    setShowCc(false);
    setComposeSubject(
      msg.subject.toLowerCase().startsWith("fwd:") ? msg.subject : `Fwd: ${msg.subject}`
    );
    setComposeBody(
      `\n\n--- Forwarded message ---\nFrom: ${msg.from}\nDate: ${msg.date}\nSubject: ${msg.subject}\n\n${msg.text || ""}`
    );
    setComposeInReplyTo(undefined);
    setComposeError(null);
    setComposeOpen(true);
  }

  async function handleSendMail(e: FormEvent) {
    e.preventDefault();
    setComposeError(null);

    const validation = validateComposeMailInput({
      to: composeTo,
      cc: showCc ? composeCc : "",
      subject: composeSubject,
      text: composeBody,
      inReplyTo: composeInReplyTo,
      references: composeInReplyTo
    });

    if (!validation.valid) {
      setComposeError(Object.values(validation.errors)[0] || "Check email fields.");
      return;
    }

    setComposeSending(true);
    try {
      const resp = await mailFetch("/api/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: composeTo,
          cc: showCc ? composeCc : "",
          subject: composeSubject,
          text: composeBody,
          inReplyTo: composeInReplyTo,
          references: composeInReplyTo
        })
      });
      const data = await parseJsonSafely<{ error?: string }>(resp);
      if (!resp.ok) {
        throw new Error(data?.error || "Failed to send email.");
      }
      setComposeOpen(false);
      setStatusNotice(`Email sent to ${composeTo}`);
      setTimeout(() => setStatusNotice(null), 5000);
      void loadFolders();
      if (activeFolder.toLowerCase().includes("sent")) {
        void loadMessages(activeFolder, page, appliedSearch);
      }
    } catch (err) {
      setComposeError(err instanceof Error ? err.message : "Failed to send email.");
    } finally {
      setComposeSending(false);
    }
  }

  async function toggleFlag(uid: number, update: { seen?: boolean; flagged?: boolean }) {
    const resp = await mailFetch(`/api/mail/messages/${uid}/flags`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: activeFolder, ...update })
    });
    if (!resp.ok) return;

    setMessages((prev) =>
      prev.map((m) => (m.uid === uid ? { ...m, ...update } : m))
    );
    if (detail?.uid === uid) {
      setDetail((prev) => (prev ? { ...prev, ...update } : prev));
    }
    void loadFolders();
  }

  async function handleDeleteMessage(uid: number) {
    const resp = await mailFetch(
      `/api/mail/messages/${uid}?folder=${encodeURIComponent(activeFolder)}`,
      { method: "DELETE" }
    );
    if (!resp.ok) return;

    setMessages((prev) => prev.filter((m) => m.uid !== uid));
    if (selectedUid === uid) {
      setSelectedUid(null);
      setDetail(null);
    }
    setStatusNotice("Message moved to Trash");
    setTimeout(() => setStatusNotice(null), 4000);
    void loadFolders();
  }

  async function handleDownloadAttachment(uid: number, folder: string, att: MailAttachment) {
    const resp = await mailFetch(
      `/api/mail/messages/${uid}/attachment/${att.index}?folder=${encodeURIComponent(folder)}`
    );
    if (!resp.ok) return;
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = att.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const activeFolderLabel = useMemo(() => {
    return folders.find((f) => f.path === activeFolder)?.label || "Inbox";
  }, [folders, activeFolder]);

  const totalPages = Math.max(1, Math.ceil(totalMessages / 25));

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#0A2536] flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-[#DAF6EF] text-sm font-semibold">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Checking Office Webmail Session...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2536] via-[#0E2F44] to-[#173E56] flex flex-col justify-between p-5 sm:p-8">
        <div className="mx-auto w-full max-w-[1120px] flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <FirmLogo size={32} />
            <div className="leading-tight">
              <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#F3FAFF]">
                S J Associates
              </p>
              <p className="text-[11px] text-[#DAF6EF]/75">
                services@sjalaw.in · Office Mail
              </p>
            </div>
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#DAF6EF]/85">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            TLS IMAP / SMTP
          </span>
        </div>

        <main className="mx-auto w-full max-w-[460px] my-8">
          <div className="rounded-[24px] border border-white/15 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#33566D]">
                <ShieldCheck className="h-4 w-4 text-[#0A2536]" aria-hidden="true" />
                Private Office Mailbox
              </div>
              <h1 className="text-3xl font-extrabold text-[#0A2536] leading-tight">
                Sign In to Webmail
              </h1>
              <p className="text-xs sm:text-sm text-[#33566D] leading-relaxed">
                Access your <strong className="text-[#0A2536]">services@sjalaw.in</strong> email via encrypted Hostinger IMAP &amp; SMTP servers.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
              {loginError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-xs font-medium text-red-800 flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="mail-login-email" className="text-xs font-bold text-[#0A2536] block">
                  Email Address
                </label>
                <input
                  id="mail-login-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="services@sjalaw.in"
                  className="w-full h-11 rounded-xl border border-border bg-[#F3FAFF]/60 px-3.5 text-sm text-[#0A2536] placeholder:text-[#33566D]/50 focus:outline-none focus:ring-2 focus:ring-[#0A2536]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="mail-login-password" className="text-xs font-bold text-[#0A2536] block">
                  Mailbox Password
                </label>
                <div className="relative">
                  <input
                    id="mail-login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Hostinger email password"
                    className="w-full h-11 rounded-xl border border-border bg-[#F3FAFF]/60 pl-3.5 pr-11 text-sm text-[#0A2536] placeholder:text-[#33566D]/50 focus:outline-none focus:ring-2 focus:ring-[#0A2536]"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 inline-flex items-center justify-center rounded-lg text-[#33566D] hover:text-[#0A2536] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-[#F3FAFF]/60 overflow-hidden">
                <button
                  type="button"
                  aria-expanded={showServerConfig}
                  onClick={() => setShowServerConfig((prev) => !prev)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-[#33566D] hover:text-[#0A2536] cursor-pointer"
                >
                  <span>Hostinger IMAP / SMTP Settings (TLS)</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showServerConfig ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {showServerConfig && (
                  <div className="px-3.5 pb-3.5 pt-2 border-t border-border space-y-3 text-xs">
                    <div className="rounded-lg bg-white border border-border px-3 py-2 text-[11px] text-[#33566D] flex items-center justify-between gap-2">
                      <span>Account Protocol</span>
                      <span className="font-bold text-[#0A2536]">IMAP + SMTP · TLS/SSL</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="mail-imap-host" className="font-semibold text-[#33566D] block">
                          Incoming IMAP Host
                        </label>
                        <input
                          id="mail-imap-host"
                          type="text"
                          value={imapHost}
                          onChange={(e) => setImapHost(e.target.value)}
                          className="w-full h-9 rounded-lg border border-border bg-white px-2.5 text-xs text-[#0A2536]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="mail-imap-port" className="font-semibold text-[#33566D] block">
                          IMAP Port (TLS)
                        </label>
                        <input
                          id="mail-imap-port"
                          type="number"
                          value={imapPort}
                          onChange={(e) => setImapPort(e.target.value)}
                          className="w-full h-9 rounded-lg border border-border bg-white px-2.5 text-xs text-[#0A2536]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="mail-smtp-host" className="font-semibold text-[#33566D] block">
                          Outgoing SMTP Host
                        </label>
                        <input
                          id="mail-smtp-host"
                          type="text"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          className="w-full h-9 rounded-lg border border-border bg-white px-2.5 text-xs text-[#0A2536]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="mail-smtp-port" className="font-semibold text-[#33566D] block">
                          SMTP Port (TLS)
                        </label>
                        <input
                          id="mail-smtp-port"
                          type="number"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(e.target.value)}
                          className="w-full h-9 rounded-lg border border-border bg-white px-2.5 text-xs text-[#0A2536]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loginBusy}
                className="w-full min-h-[46px] rounded-full text-xs uppercase tracking-wider font-bold"
              >
                {loginBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Connecting to Hostinger Mail...
                  </>
                ) : (
                  "Sign In to Mailbox"
                )}
              </Button>
            </form>

            <p className="text-[11px] text-[#33566D] text-center">
              IMAP: {imapHost}:{imapPort} · SMTP: {smtpHost}:{smtpPort} · Encrypted TLS
            </p>
          </div>
        </main>

        <div className="mx-auto w-full max-w-[1120px] flex items-center justify-between text-xs text-[#DAF6EF]/65">
          <span>S J Associates Private Webmail</span>
          <Link to="/" className="hover:text-[#DAF6EF] transition-colors">
            ← Return to S J Associates Website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3FAFF] flex flex-col">
      {/* Webmail Workspace Topbar */}
      <header className="sticky top-0 z-30 border-b border-border bg-[#0A2536] text-[#F3FAFF]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <FirmLogo size={30} />
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-extrabold uppercase tracking-[0.06em] whitespace-nowrap">
                S J Associates Mail
              </p>
              <p className="text-[11px] text-[#DAF6EF]/80 truncate">
                {user.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <Search
              className="h-4 w-4 text-[#DAF6EF]/70 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search subjects, senders, or body..."
              aria-label="Search mailbox"
              className="w-full h-10 rounded-full border border-white/20 bg-white/10 pl-10 pr-4 text-xs text-[#F3FAFF] placeholder:text-[#F3FAFF]/60 focus:outline-none focus:ring-2 focus:ring-[#DAF6EF]"
            />
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              onClick={openNewCompose}
              className="rounded-full bg-[#DAF6EF] text-[#0A2536] hover:bg-white font-bold text-xs uppercase tracking-wider px-4 h-9"
            >
              <PenSquare className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Compose</span>
            </Button>
            <button
              type="button"
              aria-label="Refresh mailbox"
              onClick={() => {
                void loadFolders();
                void loadMessages(activeFolder, page, appliedSearch);
              }}
              className="h-9 w-9 rounded-full border border-white/20 bg-white/10 inline-flex items-center justify-center text-[#F3FAFF] hover:bg-white/20 cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${listLoading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="h-9 px-3 rounded-full border border-white/20 bg-white/10 inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3FAFF] hover:bg-white/20 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {statusNotice && (
        <div
          role="status"
          className="bg-[#DAF6EF] border-b border-[#0A2536]/15 px-4 py-2 text-xs font-semibold text-[#0A2536] flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Mobile Folder Tabs + Search */}
      <div className="md:hidden border-b border-border bg-white px-4 py-2.5 space-y-2.5">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search
            className="h-4 w-4 text-[#33566D] absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search emails..."
            aria-label="Search mailbox"
            className="w-full h-9 rounded-full border border-border bg-[#F3FAFF] pl-9 pr-3 text-xs text-[#0A2536]"
          />
        </form>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {folders.map((folder) => {
            const active = activeFolder === folder.path;
            return (
              <button
                key={folder.path}
                type="button"
                onClick={() => {
                  setActiveFolder(folder.path);
                  setPage(1);
                  setSelectedUid(null);
                  setDetail(null);
                }}
                className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? "bg-[#0A2536] text-[#F3FAFF]"
                    : "bg-[#F3FAFF] text-[#33566D] border border-border"
                }`}
              >
                {folder.label}
                {folder.unseen > 0 ? ` (${folder.unseen})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Pane Desktop / Responsive Workspace */}
      <div className="flex-1 mx-auto w-full max-w-[1440px] grid grid-cols-1 md:grid-cols-12 min-h-0">
        {/* Left Folder Sidebar (Desktop) */}
        <aside className="hidden md:flex md:col-span-3 lg:col-span-2 border-r border-border bg-white p-3 flex-col justify-between gap-4">
          <nav aria-label="Mailbox folders" className="space-y-1">
            {folders.map((folder) => {
              const Icon = getFolderIcon(folder.role);
              const active = activeFolder === folder.path;
              return (
                <button
                  key={folder.path}
                  type="button"
                  onClick={() => {
                    setActiveFolder(folder.path);
                    setPage(1);
                    setSelectedUid(null);
                    setDetail(null);
                  }}
                  className={`w-full min-h-[40px] px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? "bg-[#0A2536] text-[#F3FAFF]"
                      : "text-[#33566D] hover:bg-[#DAF6EF]/50 hover:text-[#0A2536]"
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{folder.label}</span>
                  </span>
                  {folder.unseen > 0 && (
                    <span
                      className={`text-[11px] tabular-nums ${
                        active ? "text-[#DAF6EF]" : "text-[#0A2536]"
                      }`}
                    >
                      {folder.unseen}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="rounded-xl bg-[#F3FAFF] border border-border p-3 space-y-1 text-[11px] text-[#33566D]">
            <p className="font-bold text-[#0A2536]">Hostinger TLS</p>
            <p className="truncate">IMAP: {user.imapHost}:{user.imapPort}</p>
            <p className="truncate">SMTP: {user.smtpHost}:{user.smtpPort}</p>
          </div>
        </aside>

        {/* Middle Message List Pane */}
        <section
          aria-label="Message list"
          className={`${
            selectedUid ? "hidden lg:flex" : "flex"
          } md:col-span-9 lg:col-span-4 border-r border-border bg-white flex-col min-h-[calc(100vh-4rem)]`}
        >
          <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
            <div>
              <h1 className="text-sm font-extrabold text-[#0A2536]">
                {activeFolderLabel}
              </h1>
              <p className="text-[11px] text-[#33566D]">
                {totalMessages} message{totalMessages === 1 ? "" : "s"}
                {appliedSearch ? ` matching "${appliedSearch}"` : ""}
              </p>
            </div>
            {appliedSearch && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setAppliedSearch("");
                  setPage(1);
                }}
                className="text-xs font-bold text-[#0A2536] hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>

          {listLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="rounded-xl border border-border p-3 space-y-2 animate-pulse">
                  <div className="h-3.5 w-36 bg-[#E6F2F7] rounded" />
                  <div className="h-4 w-full bg-[#E6F2F7] rounded" />
                </div>
              ))}
            </div>
          ) : listError ? (
            <div className="p-6 space-y-3 text-center">
              <AlertCircle className="h-6 w-6 text-destructive mx-auto" aria-hidden="true" />
              <p className="text-sm font-bold text-[#0A2536]">Could not load {activeFolderLabel}</p>
              <p className="text-xs text-[#33566D]">{listError}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loadMessages(activeFolder, page, appliedSearch)}
              >
                Retry
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2">
              <Mail className="h-8 w-8 text-[#33566D]/50" aria-hidden="true" />
              <p className="text-sm font-bold text-[#0A2536]">No messages in {activeFolderLabel}</p>
              <p className="text-xs text-[#33566D]">
                {appliedSearch
                  ? "Try another keyword or clear the search filter."
                  : "New mail received on services@sjalaw.in will appear here."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border flex-1 overflow-y-auto">
              {messages.map((item) => {
                const isSelected = selectedUid === item.uid;
                return (
                  <li key={item.uid}>
                    <div
                      className={`px-4 py-3.5 flex items-start gap-3 transition-colors ${
                        isSelected
                          ? "bg-[#DAF6EF]/55"
                          : !item.seen
                            ? "bg-[#F3FAFF]"
                            : "hover:bg-[#F3FAFF]/60"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={item.flagged ? `Unstar ${item.subject}` : `Star ${item.subject}`}
                        onClick={() => toggleFlag(item.uid, { flagged: !item.flagged })}
                        className="mt-0.5 text-[#33566D] hover:text-[#0A2536] cursor-pointer shrink-0"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            item.flagged ? "fill-[#0A2536] text-[#0A2536]" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => openMessage(item.uid, activeFolder)}
                        className="flex-1 min-w-0 text-left space-y-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs truncate ${
                              !item.seen
                                ? "font-extrabold text-[#0A2536]"
                                : "font-semibold text-[#33566D]"
                            }`}
                          >
                            {item.from}
                          </span>
                          <span className="text-[11px] text-[#33566D] shrink-0 tabular-nums">
                            {formatMailListDate(item.date)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`text-xs truncate ${
                              !item.seen
                                ? "font-bold text-[#0A2536]"
                                : "font-medium text-[#33566D]"
                            }`}
                          >
                            {item.subject}
                          </p>
                          <span className="flex items-center gap-1 shrink-0">
                            {item.hasAttachments && (
                              <Paperclip className="h-3.5 w-3.5 text-[#33566D]" aria-hidden="true" />
                            )}
                            {!item.seen && (
                              <span
                                className="h-2 w-2 rounded-full bg-[#0A2536]"
                                aria-label="Unread"
                              />
                            )}
                          </span>
                        </div>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {totalPages > 1 && (
            <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-xs text-[#33566D]">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-2.5"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 px-2.5"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Right Reader Pane */}
        <section
          aria-label="Message content"
          className={`${
            selectedUid ? "flex" : "hidden lg:flex"
          } md:col-span-9 lg:col-span-6 bg-[#F3FAFF]/40 flex-col min-h-[calc(100vh-4rem)]`}
        >
          {detailLoading ? (
            <div className="flex-1 flex items-center justify-center p-8 text-xs font-semibold text-[#33566D] gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading email body...
            </div>
          ) : detailError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
              <p className="text-sm font-bold text-[#0A2536]">{detailError}</p>
            </div>
          ) : !detail ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl border border-border bg-white flex items-center justify-center text-[#33566D]">
                <MailOpen className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-extrabold text-[#0A2536]">Select an Email to Read</h2>
              <p className="text-xs sm:text-sm text-[#33566D] max-w-sm">
                Choose any message in {activeFolderLabel} to read full headers, HTML formatting, and attachments, or click Compose to send mail from {user.email}.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-white m-0 sm:m-4 sm:rounded-[20px] sm:border sm:border-border overflow-hidden shadow-2xs">
              {/* Reader Action Toolbar */}
              <div className="px-4 sm:px-6 py-3 border-b border-border bg-[#F3FAFF]/60 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUid(null);
                      setDetail(null);
                    }}
                    className="lg:hidden inline-flex items-center gap-1 text-xs font-bold text-[#0A2536] pr-2 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                  </button>
                  <Button type="button" size="sm" variant="outline" onClick={() => openReply(detail)}>
                    <Reply className="h-3.5 w-3.5" aria-hidden="true" />
                    Reply
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => openForward(detail)}>
                    <Forward className="h-3.5 w-3.5" aria-hidden="true" />
                    Forward
                  </Button>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFlag(detail.uid, { seen: false })}
                  >
                    Mark Unread
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    aria-label="Delete message"
                    onClick={() => handleDeleteMessage(detail.uid)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              {/* Message Headers */}
              <div className="px-4 sm:px-6 py-4 border-b border-border space-y-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0A2536] leading-snug">
                  {detail.subject}
                </h2>
                <div className="text-xs text-[#33566D] space-y-0.5">
                  <p>
                    <span className="font-bold text-[#0A2536]">From:</span> {detail.from}
                  </p>
                  {detail.to && (
                    <p>
                      <span className="font-bold text-[#0A2536]">To:</span> {detail.to}
                    </p>
                  )}
                  {detail.cc && (
                    <p>
                      <span className="font-bold text-[#0A2536]">Cc:</span> {detail.cc}
                    </p>
                  )}
                  <p>
                    <span className="font-bold text-[#0A2536]">Date:</span>{" "}
                    {new Date(detail.date).toLocaleString("en-IN")}
                  </p>
                </div>

                {detail.attachments.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {detail.attachments.map((att) => (
                      <button
                        key={att.index}
                        type="button"
                        onClick={() => handleDownloadAttachment(detail.uid, detail.folder, att)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-[#F3FAFF] px-3 py-1.5 text-xs font-semibold text-[#0A2536] hover:bg-[#DAF6EF] transition-colors cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{att.filename}</span>
                        <span className="text-[#33566D]">({formatFileSize(att.size)})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sanitized Email Body */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                {detail.html ? (
                  <iframe
                    title={detail.subject}
                    srcDoc={detail.html}
                    sandbox=""
                    className="w-full min-h-[380px] border-0 bg-white"
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm text-[#0A2536] leading-relaxed">
                    {detail.text || "(Empty message body)"}
                  </pre>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Compose Email Modal */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>New Email</DialogTitle>
            <DialogDescription>
              Sending as {user.email} via {user.smtpHost}:{user.smtpPort} (TLS)
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendMail} className="space-y-3" noValidate>
            {composeError && (
              <div
                role="alert"
                className="rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-800"
              >
                {composeError}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="compose-to" className="text-xs font-bold text-[#0A2536]">
                  To
                </label>
                {!showCc && (
                  <button
                    type="button"
                    onClick={() => setShowCc(true)}
                    className="text-[11px] font-bold text-[#33566D] hover:text-[#0A2536] cursor-pointer"
                  >
                    + Add Cc
                  </button>
                )}
              </div>
              <input
                id="compose-to"
                type="text"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                placeholder="recipient@company.com"
                className="w-full h-10 rounded-xl border border-border bg-[#F3FAFF]/60 px-3 text-xs text-[#0A2536]"
              />
            </div>

            {showCc && (
              <div className="space-y-1">
                <label htmlFor="compose-cc" className="text-xs font-bold text-[#0A2536] block">
                  Cc
                </label>
                <input
                  id="compose-cc"
                  type="text"
                  value={composeCc}
                  onChange={(e) => setComposeCc(e.target.value)}
                  placeholder="services@sjalaw.in"
                  className="w-full h-10 rounded-xl border border-border bg-[#F3FAFF]/60 px-3 text-xs text-[#0A2536]"
                />
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="compose-subject" className="text-xs font-bold text-[#0A2536] block">
                Subject
              </label>
              <input
                id="compose-subject"
                type="text"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Subject line..."
                className="w-full h-10 rounded-xl border border-border bg-[#F3FAFF]/60 px-3 text-xs text-[#0A2536]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="compose-body" className="text-xs font-bold text-[#0A2536] block">
                Message
              </label>
              <textarea
                id="compose-body"
                rows={7}
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Write your message..."
                className="w-full rounded-xl border border-border bg-[#F3FAFF]/60 p-3 text-xs text-[#0A2536] leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setComposeOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={composeSending} className="rounded-full px-6">
                {composeSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
