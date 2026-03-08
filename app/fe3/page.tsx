import { headers } from "next/headers";
import Fe3Client from "./pageClient";

function formatLocation(city?: string | null, region?: string | null) {
  const cleanCity = city?.trim();
  const cleanRegion = region?.trim();

  if (cleanCity && cleanRegion) {
    return `${cleanCity}, ${cleanRegion}`;
  }

  if (cleanRegion) {
    return cleanRegion;
  }

  return "your area";
}

export default async function FinalExpenseAdvisorMatchPage() {
  const requestHeaders = await headers();
  const city = requestHeaders.get("x-vercel-ip-city");
  const region = requestHeaders.get("x-vercel-ip-country-region");
  const locationLabel = formatLocation(city, region);

  return <Fe3Client locationLabel={locationLabel} />;
}
