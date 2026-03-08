import type { Metadata } from "next";
import { FUNNEL_CONFIG } from "@/lib/metrics-config";
import { LANDING_CATALOG } from "@/lib/landing-catalog";
import { isMetricsAuthenticated } from "@/lib/metrics-auth";
import { getMetricEvents } from "@/lib/metrics-store";
import { buildLandingSummary } from "@/lib/metrics-summary";
import { logoutMetricsAction, loginMetricsAction } from "./actions";
import MetricsClientPage from "./pageClient";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

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
      <main className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginKicker}>Private</div>
          <h1 className={styles.loginTitle}>Metrics Access</h1>
          <p className={styles.loginText}>
            Enter the private key to view landing funnels and internal links.
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

          {error ? <div className={styles.loginError}>Invalid key.</div> : null}
        </div>
      </main>
    );
  }

  const events = await getMetricEvents();
  const summaries = Object.keys(FUNNEL_CONFIG).map((key) =>
    buildLandingSummary(key as keyof typeof FUNNEL_CONFIG, events),
  );

  return (
    <MetricsClientPage
      catalog={LANDING_CATALOG}
      summaries={summaries}
      totalEvents={events.length}
      onLogout={logoutMetricsAction}
    />
  );
}
