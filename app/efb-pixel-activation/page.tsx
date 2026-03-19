import Script from "next/script";

const META_PIXEL_INLINE = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '933274949461490');
fbq('track', 'PageView');
fbq('track', 'Lead');`;

export default function EfbPixelActivationPage() {
  return (
    <Script id="efb-meta-pixel-activation" strategy="beforeInteractive">
      {META_PIXEL_INLINE}
    </Script>
  );
}
