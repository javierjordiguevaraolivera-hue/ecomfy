import { cookies, headers } from "next/headers";
import Fe3Client from "../fe3/pageClient";
import Fe4Client from "../fe4/pageClient";
import LandingGtm from "../components/antony-gtm";

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

export default async function FinalExpenseAbPage() {
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const city = requestHeaders.get("x-vercel-ip-city");
  const region = requestHeaders.get("x-vercel-ip-country-region");
  const locationLabel = formatLocation(city, region);
  const headerVariant = requestHeaders.get("x-fe-an-variant");
  const cookieVariant = cookieStore.get("fe_an_variant")?.value;
  const variant =
    headerVariant === "a" || headerVariant === "b"
      ? headerVariant
      : cookieVariant === "a" || cookieVariant === "b"
        ? cookieVariant
        : "a";

  return (
    <>
      <LandingGtm />
      <script src="//b-js.ringba.com/CAe815cc18555c45ecb7b27ad7dd859c52" async />
      {variant === "a" ? (
        <Fe3Client locationLabel={locationLabel} landingKey="fe3-an-en" />
      ) : (
        <Fe4Client locationLabel={locationLabel} landingKey="fe4-an-en" />
      )}
    </>
  );
}
