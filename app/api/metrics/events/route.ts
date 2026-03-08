import { NextResponse } from "next/server";
import { appendMetricEvent } from "@/lib/metrics-store";

export const dynamic = "force-dynamic";

function normalizeValue(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const landing = normalizeValue(body.landing, 64);
    const event = normalizeValue(body.event, 64);
    const step = normalizeValue(body.step, 64);
    const label = normalizeValue(body.label, 160);
    const path = normalizeValue(body.path, 160);
    const visitorId = normalizeValue(body.visitorId, 120);

    if (!landing || !event || !path || !visitorId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await appendMetricEvent({
      landing,
      event,
      step: step || undefined,
      label: label || undefined,
      path,
      visitorId,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

