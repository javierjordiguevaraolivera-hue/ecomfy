"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LandingCatalogItem } from "@/lib/landing-catalog";
import type { LandingSummary } from "@/lib/metrics-summary";
import styles from "./page.module.css";

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

function formatBiggestDrop(summary?: LandingSummary) {
  if (!summary?.biggestDropOff) {
    return "No funnel data yet";
  }

  return `${summary.biggestDropOff.from} → ${summary.biggestDropOff.to}`;
}

function FunnelModal({
  summary,
  onClose,
}: {
  summary: LandingSummary | null;
  onClose: () => void;
}) {
  if (!summary) {
    return null;
  }

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
            <h2 className={styles.modalTitle}>{summary.title}</h2>
          </div>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close funnel"
          >
            ×
          </button>
        </div>

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
        </div>
      </div>
    </div>
  );
}

function LandingCard({
  item,
  summary,
  onOpenFunnel,
}: {
  item: LandingCatalogItem;
  summary?: LandingSummary;
  onOpenFunnel: () => void;
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

      <div className={styles.cardMetrics}>
        <div className={styles.metricStat}>
          <span>Visitors</span>
          <strong>{summary?.totalVisitors ?? 0}</strong>
        </div>
        <div className={styles.metricStat}>
          <span>Call clicks</span>
          <strong>
            {summary?.steps.find((step) => step.event === "call_click")?.count ?? 0}
          </strong>
        </div>
        <div className={styles.metricStatWide}>
          <span>Bottleneck</span>
          <strong>{formatBiggestDrop(summary)}</strong>
        </div>
      </div>

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
          onClick={onOpenFunnel}
        >
          View Funnel
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

export default function MetricsClientPage({
  catalog,
  summaries,
  totalEvents,
  onLogout,
}: {
  catalog: LandingCatalogItem[];
  summaries: LandingSummary[];
  totalEvents: number;
  onLogout: (formData: FormData) => Promise<void>;
}) {
  const [filter, setFilter] = useState<"all" | "es" | "en">("all");
  const [activeSummary, setActiveSummary] = useState<LandingSummary | null>(null);

  const visibleLandings = useMemo(() => {
    if (filter === "all") {
      return catalog;
    }

    return catalog.filter((item) => item.language === filter);
  }, [catalog, filter]);

  const summaryMap = useMemo(
    () => new Map(summaries.map((summary) => [summary.landing, summary])),
    [summaries],
  );

  const totalVisitors = useMemo(() => {
    return summaries.reduce((sum, summary) => sum + summary.totalVisitors, 0);
  }, [summaries]);

  const totalCallClicks = useMemo(
    () =>
      summaries.reduce(
        (sum, summary) =>
          sum +
          (summary.steps.find((step) => step.event === "call_click")?.count ?? 0),
        0,
      ),
    [summaries],
  );

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <span className={styles.kicker}>Private Dashboard</span>
            <h1 className={styles.title}>Metrics</h1>
            <p className={styles.subtitle}>
              One internal hub for landing access, links, paths and funnel drop-off.
            </p>
          </div>

          <form action={onLogout}>
            <button type="submit" className={styles.logoutButton}>
              Log Out
            </button>
          </form>
        </header>

        <section className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Landings</span>
            <strong className={styles.summaryValue}>{catalog.length}</strong>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Visitors</span>
            <strong className={styles.summaryValue}>{totalVisitors}</strong>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Call Clicks</span>
            <strong className={styles.summaryValue}>{totalCallClicks}</strong>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Tracked Events</span>
            <strong className={styles.summaryValue}>{totalEvents}</strong>
          </div>
        </section>

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
            <LandingCard
              key={item.href}
              item={item}
              summary={item.metricsKey ? summaryMap.get(item.metricsKey) : undefined}
              onOpenFunnel={() => {
                if (item.metricsKey) {
                  setActiveSummary(summaryMap.get(item.metricsKey) ?? null);
                }
              }}
            />
          ))}
        </section>
      </div>

      <FunnelModal summary={activeSummary} onClose={() => setActiveSummary(null)} />
    </main>
  );
}
