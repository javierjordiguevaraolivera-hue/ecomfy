import IulEsClient from "./pageClient";
import LandingGtmNoscript, { LandingGtmScripts } from "../components/antony-gtm";

function formatDeadline() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(tomorrow);
}

function decodeHeaderValue(value: string | null) {
  if (!value) {
    return "";
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function IulEsPage() {
  const requestHeaders = await import("next/headers").then((mod) => mod.headers());
  const city = decodeHeaderValue(requestHeaders.get("x-vercel-ip-city"));
  const state = decodeHeaderValue(requestHeaders.get("x-vercel-ip-country-region"));

  return (
    <>
      <LandingGtmScripts />
      <LandingGtmNoscript />
      <script src="//b-js.ringba.com/CAe815cc18555c45ecb7b27ad7dd859c52" async />
      <IulEsClient
        heroImage="/marta-cheque.png"
        deadlineLabel={formatDeadline()}
        city={city}
        state={state}
      />
    </>
  );
}
