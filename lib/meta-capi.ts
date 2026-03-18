import "server-only";

type MetaCapiEventInput = {
  eventName: "PageView" | "Contact";
  eventId: string;
  eventSourceUrl: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
  customData?: Record<string, string>;
};

const META_PIXEL_ID = process.env.META_PIXEL_ID ?? "";
const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN ?? "";
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE?.trim() ?? "";
const META_GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION ?? "v23.0";

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined || entry === null) {
        return false;
      }

      if (typeof entry === "string") {
        return entry.trim().length > 0;
      }

      if (typeof entry === "object") {
        return Object.keys(entry).length > 0;
      }

      return true;
    }),
  );
}

export function hasMetaCapiConfig() {
  return Boolean(META_PIXEL_ID && META_CAPI_ACCESS_TOKEN);
}

export async function sendMetaCapiEvent(input: MetaCapiEventInput) {
  if (!hasMetaCapiConfig()) {
    return { ok: false, skipped: true as const };
  }

  const endpoint = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(
    META_CAPI_ACCESS_TOKEN,
  )}`;

  const body = compactObject({
    data: [
      compactObject({
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: compactObject({
          client_ip_address: input.clientIpAddress,
          client_user_agent: input.clientUserAgent,
          fbp: input.fbp,
          fbc: input.fbc,
        }),
        custom_data: compactObject(input.customData ?? {}),
      }),
    ],
    test_event_code: META_TEST_EVENT_CODE || undefined,
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Meta CAPI request failed: ${details}`);
  }

  return response.json();
}
