const GTM_CONTAINERS = ["GTM-KF64LC38", "GTM-NWSJNQMN"] as const;

const LANDING_GTM_INLINE = GTM_CONTAINERS.map(
  (containerId) => `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');`,
).join("\n");

export default function Head() {
  return <script dangerouslySetInnerHTML={{ __html: LANDING_GTM_INLINE }} />;
}
