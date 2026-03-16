import type { NextConfig } from "next";

const HOME_REDIRECT_URL =
  "https://ntdr.quotify.us/?oid=3765&affid=3814&source_id=fb%20post&sub1=home";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: HOME_REDIRECT_URL,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
