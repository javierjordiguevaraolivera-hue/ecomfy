import IulEs600kClient from "./pageClient";

const GTM_CONTAINERS = ["GTM-KF64LC38", "GTM-NWSJNQMN"] as const;

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

function LandingGtmScripts600k() {
  return (
    <>
      {GTM_CONTAINERS.map((containerId) => (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');`,
          }}
          key={containerId}
        />
      ))}
    </>
  );
}

function LandingGtmNoscript600k() {
  return (
    <>
      {GTM_CONTAINERS.map((containerId) => (
        <noscript key={containerId}>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      ))}
    </>
  );
}

export default async function IulEs600kPage() {
  const requestHeaders = await import("next/headers").then((mod) => mod.headers());
  const city = decodeHeaderValue(requestHeaders.get("x-vercel-ip-city"));
  const state = decodeHeaderValue(requestHeaders.get("x-vercel-ip-country-region"));

  return (
    <>
      <LandingGtmScripts600k />
      <LandingGtmNoscript600k />
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
      <IulEs600kClient
        heroImage="/familia-600k.png"
        deadlineLabel={formatDeadline()}
        city={city}
        state={state}
      />
    </>
  );
}
