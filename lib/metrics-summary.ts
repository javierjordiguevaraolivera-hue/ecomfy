import "server-only";

import { FUNNEL_CONFIG } from "@/lib/metrics-config";
import type { MetricEvent } from "@/lib/metrics-store";

export type LandingSummary = {
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

export function buildLandingSummary(
  landing: keyof typeof FUNNEL_CONFIG,
  events: MetricEvent[],
): LandingSummary {
  const config = FUNNEL_CONFIG[landing];
  const landingEvents = events.filter((event) => event.landing === landing);
  const totalVisitors = new Set(landingEvents.map((event) => event.visitorId)).size;
  const lastEventAt = landingEvents
    .map((event) => event.timestamp)
    .sort()
    .at(-1);

  const steps = config.steps.map((stepConfig, index) => {
    const visitors = new Set(
      landingEvents
        .filter((event) => event.event === stepConfig.event)
        .map((event) => event.visitorId),
    );
    const count = visitors.size;
    const previousCount =
      index === 0 ? count : new Set(
        landingEvents
          .filter((event) => event.event === config.steps[index - 1].event)
          .map((event) => event.visitorId),
      ).size;
    const startCount =
      index === 0
        ? count
        : new Set(
            landingEvents
              .filter((event) => event.event === config.steps[0].event)
              .map((event) => event.visitorId),
          ).size;

    return {
      event: stepConfig.event,
      label: stepConfig.label,
      count,
      fromPrevious:
        index === 0 || previousCount === 0 ? 1 : count / previousCount,
      fromStart: startCount === 0 ? 0 : count / startCount,
    };
  });

  const dropCandidates = steps
    .map((step, index) => {
      if (index === 0) {
        return null;
      }

      return {
        from: steps[index - 1].label,
        to: step.label,
        retention: step.fromPrevious,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.retention - b.retention);

  return {
    landing,
    title: config.title,
    language: config.language,
    totalEvents: landingEvents.length,
    totalVisitors,
    lastEventAt,
    biggestDropOff: dropCandidates[0],
    steps,
    recentEvents: landingEvents
      .slice()
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 8)
      .map((event) => ({
        timestamp: event.timestamp,
        event: event.event,
        label: event.label,
      })),
  };
}

