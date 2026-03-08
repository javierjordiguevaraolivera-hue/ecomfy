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

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
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
