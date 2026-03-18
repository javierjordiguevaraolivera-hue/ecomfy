import { headers } from "next/headers";
import Fe7Client from "../fe7/pageClient";

const HERO_IMAGES = [
  "/hero-seniors-jhoner-ataud.png",
  "/hero-seniors-jhoner.jpg",
] as const;

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

export default async function FinalExpenseOfferPage() {
  const requestHeaders = await headers();
  const metaPixelId = process.env.META_PIXEL_ID ?? "";
  const heroVariant = Number.parseInt(
    requestHeaders.get("x-fe7-hero-variant") ?? "0",
    10,
  );
  const heroImage = HERO_IMAGES[heroVariant] ?? HERO_IMAGES[0];
  const city = decodeHeaderValue(requestHeaders.get("x-vercel-ip-city"));
  const state = decodeHeaderValue(requestHeaders.get("x-vercel-ip-country-region"));

  return (
    <>
      {metaPixelId ? (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      ) : null}
      <Fe7Client
        heroImage={heroImage}
        deadlineLabel={formatDeadline()}
        city={city}
        state={state}
        metaPixelId={metaPixelId}
      />
    </>
  );
}
