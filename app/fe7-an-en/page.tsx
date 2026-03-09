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

export default async function FinalExpenseOfferPage() {
  const requestHeaders = await headers();
  const heroVariant = Number.parseInt(
    requestHeaders.get("x-fe7-hero-variant") ?? "0",
    10,
  );
  const heroImage = HERO_IMAGES[heroVariant] ?? HERO_IMAGES[0];

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
      <Fe7Client heroImage={heroImage} deadlineLabel={formatDeadline()} />
    </>
  );
}
