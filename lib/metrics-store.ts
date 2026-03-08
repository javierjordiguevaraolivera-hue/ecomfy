import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  fetchSupabaseMetricEvents,
  hasSupabaseMetricsConfig,
  insertSupabaseMetricEvent,
} from "@/lib/supabase-metrics";

export type MetricEvent = {
  id: string;
  timestamp: string;
  landing: string;
  event: string;
  step?: string;
  label?: string;
  path: string;
  visitorId: string;
};

type MetricStore = {
  events: MetricEvent[];
};

const STORE_PATH = process.env.VERCEL
  ? join("/tmp", "ecomfy-metrics.json")
  : join(process.cwd(), "data", "ecomfy-metrics.json");

const EMPTY_STORE: MetricStore = { events: [] };
const MAX_EVENTS = 20000;

let writeQueue = Promise.resolve();

async function ensureStore() {
  await mkdir(dirname(STORE_PATH), { recursive: true });

  try {
    await readFile(STORE_PATH, "utf8");
  } catch {
    await writeFile(STORE_PATH, JSON.stringify(EMPTY_STORE, null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStore();

  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as MetricStore;

    if (!Array.isArray(parsed.events)) {
      return { ...EMPTY_STORE };
    }

    return parsed;
  } catch {
    return { ...EMPTY_STORE };
  }
}

async function writeStore(store: MetricStore) {
  await ensureStore();
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function appendMetricEvent(
  input: Omit<MetricEvent, "id" | "timestamp">,
) {
  if (hasSupabaseMetricsConfig()) {
    await insertSupabaseMetricEvent(input);
    return;
  }

  writeQueue = writeQueue.then(async () => {
    const store = await readStore();

    store.events.push({
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      ...input,
    });

    if (store.events.length > MAX_EVENTS) {
      store.events = store.events.slice(-MAX_EVENTS);
    }

    await writeStore(store);
  });

  await writeQueue;
}

export async function getMetricEvents() {
  if (hasSupabaseMetricsConfig()) {
    return fetchSupabaseMetricEvents();
  }

  const store = await readStore();
  return store.events;
}
