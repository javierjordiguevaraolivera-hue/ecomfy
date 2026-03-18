import { NextResponse } from "next/server";
import { hasMetaCapiConfig, sendMetaCapiEvent } from "@/lib/meta-capi";

export const dynamic = "force-dynamic";

function normalizeValue(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return normalizeValue(forwardedFor.split(",")[0], 120);
  }

  return normalizeValue(
    request.headers.get("x-real-ip") ??
      request.headers.get("x-vercel-forwarded-for") ??
      "",
    120,
  );
}

function getEventSourceUrl(request: Request, rawUrl: string, rawPath: string) {
  const url = normalizeValue(rawUrl, 500);
  if (url) {
    return url;
  }

  const path = normalizeValue(rawPath, 300);
  const host = normalizeValue(
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "",
    160,
  );
  const protocol = normalizeValue(
    request.headers.get("x-forwarded-proto") ??
      (host.includes("localhost") ? "http" : "https"),
    16,
  );

  if (!host || !path) {
    return "";
  }

  return `${protocol}://${host}${path}`;
}

export async function POST(request: Request) {
  if (!hasMetaCapiConfig()) {
    return NextResponse.json({ ok: false, skipped: true }, { status: 202 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const landing = normalizeValue(body.landing, 64);
    const eventName = normalizeValue(body.eventName, 32) as "PageView" | "Contact";
    const eventId = normalizeValue(body.eventId, 120);
    const step = normalizeValue(body.step, 64);
    const label = normalizeValue(body.label, 160);
    const phone = normalizeValue(body.phone, 64);
    const placement = normalizeValue(body.placement, 64);
    const path = normalizeValue(body.path, 160);
    const url = getEventSourceUrl(request, String(body.url ?? ""), path);
    const visitorId = normalizeValue(body.visitorId, 120);
    const fbp = normalizeValue(body.fbp, 256);
    const fbc = normalizeValue(body.fbc, 256);
    const sourceWebsite =
      normalizeValue(body.sourceWebsite, 160) ||
      normalizeValue(
        request.headers.get("origin") ??
          request.headers.get("referer") ??
          request.headers.get("host") ??
          "",
        160,
      );
    const city = normalizeValue(request.headers.get("x-vercel-ip-city"), 80);
    const state = normalizeValue(request.headers.get("x-vercel-ip-country-region"), 80);
    const country = normalizeValue(request.headers.get("x-vercel-ip-country"), 80);
    const clientUserAgent = normalizeValue(request.headers.get("user-agent"), 500);
    const clientIpAddress = getClientIp(request);

    if (!landing || !eventName || !eventId || !url) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await sendMetaCapiEvent({
      eventName,
      eventId,
      eventSourceUrl: url,
      clientIpAddress,
      clientUserAgent,
      fbp,
      fbc,
      customData: {
        landing,
        step,
        label,
        phone,
        placement,
        visitor_id: visitorId,
        city,
        state,
        country,
        source_website: sourceWebsite,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
