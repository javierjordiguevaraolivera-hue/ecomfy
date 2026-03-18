import Script from "next/script";

export default function Fe7AnEnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metaPixelId = process.env.META_PIXEL_ID ?? "";

  return (
    <>
      <Script
        id="fe7-ringba"
        src="https://b-js.ringba.com/CAe815cc18555c45ecb7b27ad7dd859c52"
        strategy="beforeInteractive"
      />
      {metaPixelId ? (
        <Script id="fe7-meta-pixel-base" strategy="beforeInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
fbq.disablePushState = true;
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');`}
        </Script>
      ) : null}
      {children}
    </>
  );
}
