import { redirect } from "next/navigation";
import { isMetricsAuthenticated } from "@/lib/metrics-auth";
import LandingIndexClientPage from "./pageClient";
import type { Metadata } from "next";

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

export default async function LandingIndexPage() {
  const authenticated = await isMetricsAuthenticated();

  if (!authenticated) {
    redirect("/metrics");
  }

  return <LandingIndexClientPage />;
}
