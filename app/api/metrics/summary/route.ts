import { NextRequest, NextResponse } from "next/server";
import { isMetricsAuthenticated } from "@/lib/metrics-auth";
import { FUNNEL_CONFIG } from "@/lib/metrics-config";
import { getMetricEvents } from "@/lib/metrics-store";
import { buildLandingSummary } from "@/lib/metrics-summary";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await isMetricsAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const landing = request.nextUrl.searchParams.get("landing");
  const events = await getMetricEvents();

  if (landing) {
    if (!(landing in FUNNEL_CONFIG)) {
      return NextResponse.json({ ok: false, error: "invalid_landing" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      summary: buildLandingSummary(
        landing as keyof typeof FUNNEL_CONFIG,
        events,
      ),
    });
  }

  return NextResponse.json({
    ok: true,
    summaries: Object.keys(FUNNEL_CONFIG).map((key) =>
      buildLandingSummary(key as keyof typeof FUNNEL_CONFIG, events),
    ),
  });
}
