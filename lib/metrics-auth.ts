import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const METRICS_COOKIE_NAME = "ecomfy_metrics_session";
const METRICS_DURATION_MS = 5 * 60 * 60 * 1000;
const METRICS_PASSWORD = process.env.METRICS_PASSWORD ?? "MP14U7HB";
const METRICS_COOKIE_SECRET =
  process.env.METRICS_COOKIE_SECRET ?? "ecomfy-metrics-cookie-secret";

function hashValue(value: string) {
  return createHash("sha256").update(value).digest();
}

function createToken(expiresAt: number) {
  const payload = `metrics:${expiresAt}`;
  const signature = createHmac("sha256", METRICS_COOKIE_SECRET)
    .update(payload)
    .digest("hex");

  return `${expiresAt}.${signature}`;
}

function verifyToken(token?: string) {
  if (!token) {
    return false;
  }

  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!expiresAt || !signature || Number.isNaN(expiresAt)) {
    return false;
  }

  if (expiresAt < Date.now()) {
    return false;
  }

  const expectedSignature = createHmac("sha256", METRICS_COOKIE_SECRET)
    .update(`metrics:${expiresAt}`)
    .digest("hex");

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(expectedSignature, "utf8"),
  );
}

export function isValidMetricsPassword(input: string) {
  return timingSafeEqual(hashValue(input), hashValue(METRICS_PASSWORD));
}

export async function createMetricsSession() {
  const expiresAt = Date.now() + METRICS_DURATION_MS;
  const cookieStore = await cookies();

  cookieStore.set(METRICS_COOKIE_NAME, createToken(expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function clearMetricsSession() {
  const cookieStore = await cookies();
  cookieStore.delete(METRICS_COOKIE_NAME);
}

export async function isMetricsAuthenticated() {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(METRICS_COOKIE_NAME)?.value);
}
