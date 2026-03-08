"use server";

import { redirect } from "next/navigation";
import {
  clearMetricsSession,
  createMetricsSession,
  isValidMetricsPassword,
} from "@/lib/metrics-auth";

export async function loginMetricsAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!isValidMetricsPassword(password)) {
    redirect("/metrics?error=invalid");
  }

  await createMetricsSession();
  redirect("/metrics");
}

export async function logoutMetricsAction() {
  await clearMetricsSession();
  redirect("/metrics");
}

