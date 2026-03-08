"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type LandingItem = {
  href: string;
  title: string;
  description: string;
  language: "es" | "en";
  metricsKey?: string;
};

type LandingSummary = {
  landing: string;
  title: string;
  language: string;
  totalEvents: number;
  totalVisitors: number;
  lastEventAt?: string;
  biggestDropOff?: {
    from: string;
    to: string;
    retention: number;
  };
  steps: Array<{
    event: string;
    label: string;
    count: number;
    fromPrevious: number;
    fromStart: number;
  }>;
  recentEvents: Array<{
    timestamp: string;
    event: string;
    label?: string;
  }>;
};

const LANDINGS: LandingItem[] = [
  {
    href: "/debt-qualification",
    title: "Debt Qualification",
    description: "Chat de precalificación de deuda en español.",
    language: "es",
    metricsKey: "debt-qualification",
  },
  {
    href: "/debt-relief-usa",
    title: "Debt Relief USA",
    description: "Debt relief con chat corto y CTA de llamada.",
    language: "es",
    metricsKey: "debt-relief-usa",
  },
  {
    href: "/fe1",
    title: "FE1",
    description: "Final expense quiz corto con advisor ready.",
    language: "en",
    metricsKey: "fe1",
  },
  {
    href: "/fe2",
    title: "FE2",
    description: "SecureLife style quiz con loading y call CTA.",
    language: "en",
    metricsKey: "fe2",
  },
  {
    href: "/fe3",
    title: "FE3",
    description: "Advisor search flow con validación en vivo.",
    language: "en",
    metricsKey: "fe3",
  },
  {
    href: "/fe4",
    title: "FE4",
    description: "Long-form con social proof, FAQ y advisor flow.",
    language: "en",
    metricsKey: "fe4",
  },
];

function getFullUrl(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  return `${window.location.origin}${path}`;
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatTime(timestamp?: string) {
  if (!timestamp) {
    return "No data";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function MetricsModal({
  summary,
  loading,
  error,
  onClose,
}: {
  summary: LandingSummary | null;
  loading: boolean;
  error: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalKicker}>Live Funnel</div>
            <h2 className={styles.modalTitle}>
              {summary?.title ?? "Landing Metrics"}
            </h2>
          </div>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close metrics"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className={styles.modalState}>Loading metrics...</div>
        ) : null}

        {!loading && error ? (
          <div className={styles.modalState}>
            <p>{error}</p>
            <Link href="/metrics" target="_blank" className={styles.metricsInlineLink}>
              Open /metrics
            </Link>
          </div>
        ) : null}

        {!loading && !error && summary ? (
          <div className={styles.modalBody}>
            <div className={styles.metricsSummaryRow}>
              <div className={styles.metricsPill}>
                <span>Visitors</span>
                <strong>{summary.totalVisitors}</strong>
              </div>
              <div className={styles.metricsPill}>
                <span>Events</span>
                <strong>{summary.totalEvents}</strong>
              </div>
              <div className={styles.metricsPill}>
                <span>Last event</span>
                <strong>{formatTime(summary.lastEventAt)}</strong>
              </div>
            </div>

            {summary.biggestDropOff ? (
              <div className={styles.insightBox}>
                <span className={styles.insightLabel}>Biggest bottleneck</span>
                <strong>
                  {summary.biggestDropOff.from} → {summary.biggestDropOff.to}
                </strong>
                <span>
                  {formatPercent(summary.biggestDropOff.retention)} retention
                </span>
              </div>
            ) : null}

            <div className={styles.funnelList}>
              {summary.steps.map((step, index) => (
                <div key={step.event} className={styles.funnelItem}>
                  <div className={styles.funnelTop}>
                    <span className={styles.funnelStepLabel}>{step.label}</span>
                    <span className={styles.funnelCount}>{step.count}</span>
                  </div>
                  <div className={styles.funnelTrack}>
                    <div
                      className={styles.funnelFill}
                      style={{ width: `${Math.max(step.fromStart * 100, 6)}%` }}
                    />
                  </div>
                  <div className={styles.funnelMeta}>
                    <span>
                      {index === 0
                        ? "Base step"
                        : `${formatPercent(step.fromPrevious)} from previous`}
                    </span>
                    <span>{formatPercent(step.fromStart)} from start</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.recentEvents}>
              <div className={styles.recentTitle}>Latest Signals</div>
              {summary.recentEvents.length === 0 ? (
                <div className={styles.recentEmpty}>No events yet.</div>
              ) : (
                summary.recentEvents.map((event, index) => (
                  <div key={`${event.timestamp}-${index}`} className={styles.recentRow}>
                    <span>{formatTime(event.timestamp)}</span>
                    <span>{event.event}</span>
                    <span>{event.label ?? "-"}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function LandingCard({
  item,
  onOpenMetrics,
}: {
  item: LandingItem;
  onOpenMetrics: (item: LandingItem) => void;
}) {
  const [copied, setCopied] = useState<"" | "full" | "path">("");

  async function copyText(value: string, type: "full" | "path") {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(""), 1400);
  }

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardLang}>
            {item.language === "es" ? "Español" : "English"}
          </div>
          <div className={styles.cardTitle}>{item.title}</div>
        </div>
        <div className={styles.cardPath}>{item.href}</div>
      </div>

      <p className={styles.cardDescription}>{item.description}</p>

      <div className={styles.actionGrid}>
        <Link
          href={item.href}
          className={styles.primaryAction}
          target="_blank"
          rel="noreferrer"
        >
          Open ↗
        </Link>

        <button
          type="button"
          className={styles.secondaryAction}
          onClick={() => onOpenMetrics(item)}
        >
          View Metrics
        </button>

        <button
          type="button"
          className={styles.ghostAction}
          onClick={() => void copyText(getFullUrl(item.href), "full")}
        >
          {copied === "full" ? "Copied Link" : "Copy Link"}
        </button>

        <button
          type="button"
          className={styles.ghostAction}
          onClick={() => void copyText(item.href, "path")}
        >
          {copied === "path" ? "Copied Path" : "Copy Path"}
        </button>
      </div>
    </article>
  );
}

export default function LandingIndexClientPage() {
  const [filter, setFilter] = useState<"all" | "es" | "en">("all");
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState("");
  const [activeSummary, setActiveSummary] = useState<LandingSummary | null>(null);

  const visibleLandings = useMemo(() => {
    if (filter === "all") {
      return LANDINGS;
    }

    return LANDINGS.filter((item) => item.language === filter);
  }, [filter]);

  async function openMetrics(item: LandingItem) {
    if (!item.metricsKey) {
      return;
    }

    setLoadingMetrics(true);
    setMetricsError("");
    setActiveSummary(null);

    try {
      const response = await fetch(
        `/api/metrics/summary?landing=${encodeURIComponent(item.metricsKey)}`,
      );

      if (response.status === 401) {
        setMetricsError(
          "Metrics are protected. Open /metrics once, log in, and come back here.",
        );
        return;
      }

      if (!response.ok) {
        setMetricsError("Could not load metrics for this landing.");
        return;
      }

      const data = (await response.json()) as { summary: LandingSummary };
      setActiveSummary(data.summary);
    } catch {
      setMetricsError("Could not load metrics for this landing.");
    } finally {
      setLoadingMetrics(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <span className={styles.kicker}>Landing Index</span>
            <h1 className={styles.title}>indice-0728</h1>
            <p className={styles.subtitle}>
              Open landings fast, copy links fast, and inspect the funnel without
              leaving this page.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link
              href="/metrics"
              target="_blank"
              rel="noreferrer"
              className={styles.metricsLink}
            >
              Open /metrics ↗
            </Link>
          </div>
        </header>

        <div className={styles.filterBar}>
          <button
            type="button"
            className={`${styles.filterChip} ${
              filter === "all" ? styles.filterChipActive : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`${styles.filterChip} ${
              filter === "es" ? styles.filterChipActive : ""
            }`}
            onClick={() => setFilter("es")}
          >
            Español
          </button>
          <button
            type="button"
            className={`${styles.filterChip} ${
              filter === "en" ? styles.filterChipActive : ""
            }`}
            onClick={() => setFilter("en")}
          >
            English
          </button>
        </div>

        <section className={styles.grid}>
          {visibleLandings.map((item) => (
            <LandingCard key={item.href} item={item} onOpenMetrics={openMetrics} />
          ))}
        </section>
      </div>

      {(loadingMetrics || metricsError || activeSummary) && (
        <MetricsModal
          summary={activeSummary}
          loading={loadingMetrics}
          error={metricsError}
          onClose={() => {
            setLoadingMetrics(false);
            setMetricsError("");
            setActiveSummary(null);
          }}
        />
      )}
    </main>
  );
}
