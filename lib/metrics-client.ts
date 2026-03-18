type TrackMetricInput = {
  landing: string;
  event: string;
  step?: string;
  label?: string;
};

type CallCtaInput = {
  landing: string;
  phone: string;
  placement: string;
  label?: string;
};

type MetaBrowserEventInput = {
  pixelId: string;
  eventName: "PageView" | "Contact";
  eventId: string;
};

type MetaServerEventInput = {
  landing: string;
  eventName: "PageView" | "Contact";
  eventId: string;
  step?: string;
  label?: string;
  phone?: string;
  placement?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    fbq?: (...args: unknown[]) => void;
  }
}

const VISITOR_KEY = "ecomfy_metrics_visitor";
const VIEW_KEY_PREFIX = "ecomfy_metrics_view";
const ENGAGED_KEY_PREFIX = "ecomfy_engaged";

function getVisitorId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) {
    return existing;
  }

  const nextId =
    window.crypto?.randomUUID?.() ??
    `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(VISITOR_KEY, nextId);
  return nextId;
}

function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

export function createClientEventId(prefix: string) {
  if (typeof window === "undefined") {
    return `${prefix}-server`;
  }

  const suffix =
    window.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}-${suffix}`;
}

export function trackMetric({ landing, event, step, label }: TrackMetricInput) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify({
    landing,
    event,
    step,
    label,
    path: window.location.pathname,
    visitorId: getVisitorId(),
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/metrics/events", blob);
      return;
    }
  } catch {}

  void fetch("/api/metrics/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

export function trackMetaBrowserEvent({
  pixelId,
  eventName,
  eventId,
}: MetaBrowserEventInput) {
  if (typeof window === "undefined" || !pixelId) {
    return;
  }

  window.fbq?.("trackSingle", pixelId, eventName, {}, { eventID: eventId });
}

export function sendMetaServerEvent({
  landing,
  eventName,
  eventId,
  step,
  label,
  phone,
  placement,
}: MetaServerEventInput) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify({
    landing,
    eventName,
    eventId,
    step,
    label,
    phone,
    placement,
    path: window.location.pathname,
    url: window.location.href,
    visitorId: getVisitorId(),
    fbp: getCookieValue("_fbp"),
    fbc: getCookieValue("_fbc"),
    sourceWebsite: window.location.origin,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/meta/events", blob);
      return;
    }
  } catch {}

  void fetch("/api/meta/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

export function trackLandingView(landing: string) {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = `${VIEW_KEY_PREFIX}:${landing}:${window.location.pathname}`;
  if (window.sessionStorage.getItem(storageKey) === "1") {
    return;
  }

  window.sessionStorage.setItem(storageKey, "1");
  trackMetric({
    landing,
    event: "landing_view",
    step: "landing_view",
  });
}

export function trackCallCtaClick({
  landing,
  phone,
  placement,
  label,
}: CallCtaInput) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "call_cta_click",
    landing,
    phone,
    placement,
    label,
    path: window.location.pathname,
  });
}

export function trackEngagedInteraction(landing: string, placement: string) {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = `${ENGAGED_KEY_PREFIX}:${landing}:${window.location.pathname}`;
  if (window.sessionStorage.getItem(storageKey) === "1") {
    return;
  }

  window.sessionStorage.setItem(storageKey, "1");
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "engaged",
    landing,
    placement,
    path: window.location.pathname,
  });
}
