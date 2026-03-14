const GTM_CONTAINERS = ["GTM-KF64LC38", "GTM-NWSJNQMN"] as const;

const LANDING_GTM_INLINE = GTM_CONTAINERS.map(
  (containerId) => `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');`,
).join("\n");

const META_PIXEL_INLINE = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '980723860687387');
fbq('track', 'PageView');`;

export default function Head() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: LANDING_GTM_INLINE }} />
      <script dangerouslySetInnerHTML={{ __html: META_PIXEL_INLINE }} />
    </>
  );
}