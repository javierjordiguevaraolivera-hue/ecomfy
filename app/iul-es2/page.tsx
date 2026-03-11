import { headers } from "next/headers";
import IulEs2Client from "./pageClient";
import LandingGtmNoscript, { LandingGtmScripts } from "../components/antony-gtm";

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

  return "tu area";
}

export default async function IulEs2Page() {
  const requestHeaders = await headers();
  const city = requestHeaders.get("x-vercel-ip-city");
  const region = requestHeaders.get("x-vercel-ip-country-region");
  const locationLabel = formatLocation(city, region);

  return (
    <>
      <LandingGtmScripts />
      <LandingGtmNoscript />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=980723860687387&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      <script src="//b-js.ringba.com/CAe815cc18555c45ecb7b27ad7dd859c52" async />
      <IulEs2Client locationLabel={locationLabel} />
    </>
  );
}
