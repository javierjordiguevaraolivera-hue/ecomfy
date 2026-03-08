import { logoutMetricsAction, loginMetricsAction } from "./actions";
import { FUNNEL_CONFIG } from "@/lib/metrics-config";
import { isMetricsAuthenticated } from "@/lib/metrics-auth";
import { getMetricEvents } from "@/lib/metrics-store";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatTime(timestamp?: string) {
  if (!timestamp) {
    return "No data yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export default async function MetricsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const authenticated = await isMetricsAuthenticated();

  if (!authenticated) {
    const error = params.error === "invalid";

    return (
      <main className={styles.page}>
        <div className={styles.loginCard}>
          <div className={styles.loginKicker}>Private</div>
          <h1 className={styles.loginTitle}>Metrics Access</h1>
          <p className={styles.loginText}>
            Enter the private key to view landing drop-off and conversion steps.
          </p>

          <form action={loginMetricsAction} className={styles.loginForm}>
            <input
              type="password"
              name="password"
              className={styles.passwordInput}
              placeholder="Access key"
              autoComplete="current-password"
              required
            />
            <button type="submit" className={styles.loginButton}>
              Open Metrics
            </button>
          </form>

          {error ? (
            <div className={styles.loginError}>Invalid key.</div>
          ) : null}
        </div>
      </main>
    );
  }

  const events = await getMetricEvents();
  const orderedEvents = [...events].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp),
  );

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.kicker}>Private Dashboard</div>
            <h1 className={styles.title}>Landing Metrics</h1>
            <p className={styles.subtitle}>
              Funnel view by landing to detect the biggest drop-off points.
            </p>
          </div>

          <form action={logoutMetricsAction}>
            <button type="submit" className={styles.logoutButton}>
              Log Out
            </button>
          </form>
        </header>

        <section className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total events</span>
            <strong className={styles.summaryValue}>{events.length}</strong>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Tracked landings</span>
            <strong className={styles.summaryValue}>
              {Object.keys(FUNNEL_CONFIG).length}
            </strong>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Latest event</span>
            <strong className={styles.summaryValueSmall}>
              {formatTime(orderedEvents[0]?.timestamp)}
            </strong>
          </div>
        </section>

        <section className={styles.grid}>
          {Object.entries(FUNNEL_CONFIG).map(([landing, config]) => {
            const landingEvents = events.filter((event) => event.landing === landing);
            const landingVisitors = new Set(
              landingEvents.map((event) => event.visitorId),
            ).size;
            const lastSeen = landingEvents
              .map((event) => event.timestamp)
              .sort()
              .at(-1);
            const stepCounts = config.steps.map((stepConfig) => {
              const visitors = new Set(
                landingEvents
                  .filter((event) => event.event === stepConfig.event)
                  .map((event) => event.visitorId),
              );

              return {
                ...stepConfig,
                count: visitors.size,
              };
            });

            return (
              <article key={landing} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.cardLanguage}>{config.language}</div>
                    <h2 className={styles.cardTitle}>{config.title}</h2>
                  </div>
                  <div className={styles.visitorCount}>
                    {landingVisitors} visitors
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <span>{landing}</span>
                  <span>Last event: {formatTime(lastSeen)}</span>
                </div>

                <div className={styles.funnelList}>
                  {stepCounts.map((step, index) => {
                    const previousCount =
                      index === 0 ? step.count : stepCounts[index - 1].count;
                    const baseCount = stepCounts[0]?.count || 0;
                    const fromPrevious =
                      index === 0 || previousCount === 0
                        ? 1
                        : step.count / previousCount;
                    const fromStart =
                      baseCount === 0 ? 0 : step.count / baseCount;

                    return (
                      <div key={step.event} className={styles.funnelRow}>
                        <div className={styles.funnelText}>
                          <span className={styles.funnelStep}>{step.label}</span>
                          <span className={styles.funnelEvent}>{step.event}</span>
                        </div>
                        <div className={styles.funnelStats}>
                          <strong>{step.count}</strong>
                          <span>
                            {index === 0
                              ? "Base"
                              : `${formatPercent(fromPrevious)} from prev`}
                          </span>
                          <span>{formatPercent(fromStart)} from start</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>

        <section className={styles.eventsCard}>
          <h2 className={styles.eventsTitle}>Latest Events</h2>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Time</span>
              <span>Landing</span>
              <span>Event</span>
              <span>Label</span>
              <span>Visitor</span>
            </div>
            {orderedEvents.slice(0, 60).map((event) => (
              <div key={event.id} className={styles.tableRow}>
                <span>{formatTime(event.timestamp)}</span>
                <span>{event.landing}</span>
                <span>{event.event}</span>
                <span>{event.label ?? "-"}</span>
                <span className={styles.visitorCell}>{event.visitorId}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.notice}>
          <strong>Deployment note:</strong> this version stores events on the
          server filesystem. It works locally, but on Vercel storage is ephemeral,
          so you will eventually want a persistent store for production analytics.
        </section>
      </div>
    </main>
  );
}

