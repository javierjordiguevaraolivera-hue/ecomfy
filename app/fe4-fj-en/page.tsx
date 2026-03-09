import { headers } from "next/headers";
import Fe4Client from "../fe4/pageClient";

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
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-KF64LC38"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-NWSJNQMN"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <script src="//b-js.ringba.com/CAe815cc18555c45ecb7b27ad7dd859c52" async />
      <Fe4Client
        locationLabel={locationLabel}
        landingKey="fe4-fj-en"
        phoneNumber="(844) 536-0401"
        phoneHref="tel:+18445360401"
      />
    </>
  );
}
