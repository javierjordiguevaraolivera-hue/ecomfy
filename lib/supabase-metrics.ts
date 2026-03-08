import "server-only";

import type { MetricEvent } from "@/lib/metrics-store";

type SupabaseMetricRow = {
  id: string;
  created_at: string;
  landing: string;
  event: string;
  step: string | null;
  label: string | null;
  path: string;
  visitor_id: string;
};

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function getHeaders() {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };
}

function mapRowToEvent(row: SupabaseMetricRow): MetricEvent {
  return {
    id: row.id,
    timestamp: row.created_at,
    landing: row.landing,
    event: row.event,
    step: row.step ?? undefined,
    label: row.label ?? undefined,
    path: row.path,
    visitorId: row.visitor_id,
  };
}

export function hasSupabaseMetricsConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

export async function insertSupabaseMetricEvent(
  event: Omit<MetricEvent, "id" | "timestamp">,
) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/metrics_events`, {
    method: "POST",
    headers: {
      ...getHeaders(),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      landing: event.landing,
      event: event.event,
      step: event.step ?? null,
      label: event.label ?? null,
      path: event.path,
      visitor_id: event.visitorId,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to insert metric event into Supabase.");
  }
}

export async function fetchSupabaseMetricEvents() {
  const params = new URLSearchParams({
    select: "id,created_at,landing,event,step,label,path,visitor_id",
    order: "created_at.desc",
    limit: "20000",
  });

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/metrics_events?${params.toString()}`,
    {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch metric events from Supabase.");
  }

  const rows = (await response.json()) as SupabaseMetricRow[];
  return rows.map(mapRowToEvent);
}
