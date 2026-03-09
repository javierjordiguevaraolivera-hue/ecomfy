import { headers } from "next/headers";
import LandingGtm from "../components/antony-gtm";
import Fe4McEnClient from "../fe4/pageClient";

function decodeGeoValue(value?: string | null) {
  if (!value) {
    return "";
  }

  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function formatLocation(city?: string | null, region?: string | null) {
  const cleanCity = decodeGeoValue(city);
  const cleanRegion = decodeGeoValue(region);

  if (cleanCity && cleanRegion) {
    return `${cleanCity}, ${cleanRegion}`;
  }

  if (cleanRegion) {
    return cleanRegion;
  }

  return "your area";
}

export default async function FinalExpenseLongFormPage() {
  const requestHeaders = await headers();
  const city = requestHeaders.get("x-vercel-ip-city");
  const region = requestHeaders.get("x-vercel-ip-country-region");
  const locationLabel = formatLocation(city, region);

  return (
    <>
      <LandingGtm />
      <script src="//b-js.ringba.com/CAe815cc18555c45ecb7b27ad7dd859c52" async />
      <Fe4McEnClient
        locationLabel={locationLabel}
        landingKey="fe4-mc-en"
        phoneNumber="(877) 649-0603"
        phoneHref="tel:+18776490603"
      />
    </>
  );
}
