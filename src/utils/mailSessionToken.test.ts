import test from "node:test";
import assert from "node:assert/strict";
import { sealMailSessionToken, unsealMailSessionToken } from "./mailSessionToken";

const SAMPLE_SESSION = {
  id: "sess-abc-123",
  email: "sanjaysingh@legalsja.com",
  password: "example-app-password",
  imapHost: "imap.hostinger.com",
  imapPort: 993,
  smtpHost: "smtp.hostinger.com",
  smtpPort: 465,
  createdAt: 1_700_000_000_000,
  expiresAt: 1_700_043_200_000
};

test("sealMailSessionToken and unsealMailSessionToken round-trip session state", () => {
  const token = sealMailSessionToken(SAMPLE_SESSION, "unit-test-secret");
  assert.ok(token.startsWith("v1."));

  const decoded = unsealMailSessionToken(token, 1_700_010_000_000, "unit-test-secret");
  assert.deepEqual(decoded, SAMPLE_SESSION);
});

test("unsealMailSessionToken rejects tampered ciphertexts", () => {
  const token = sealMailSessionToken(SAMPLE_SESSION, "unit-test-secret");
  const segments = token.split(".");
  const mutatedChar = segments[3][0] === "A" ? "B" : "A";
  segments[3] = mutatedChar + segments[3].slice(1);
  assert.equal(
    unsealMailSessionToken(segments.join("."), 1_700_010_000_000, "unit-test-secret"),
    null
  );
});

test("unsealMailSessionToken rejects wrong secret and expired tokens", () => {
  const token = sealMailSessionToken(SAMPLE_SESSION, "secret-a");
  assert.equal(unsealMailSessionToken(token, 1_700_010_000_000, "secret-b"), null);
  assert.equal(unsealMailSessionToken(token, 1_700_043_200_001, "secret-a"), null);
  assert.equal(unsealMailSessionToken("not-a-valid-token", 1_700_010_000_000, "secret-a"), null);
});
