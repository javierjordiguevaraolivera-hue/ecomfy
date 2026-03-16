import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TARGET_URL =
  "https://ntdr.quotify.us/?oid=3765&affid=3814&source_id=fb%20post&sub1=descripcion";

function buildRedirectUrl(request: NextRequest) {
  const target = new URL(TARGET_URL);

  request.nextUrl.searchParams.forEach((value, key) => {
    if (!target.searchParams.has(key)) {
      target.searchParams.append(key, value);
    }
  });

  return target;
}

export function GET(request: NextRequest) {
  return NextResponse.redirect(buildRedirectUrl(request), 307);
}

export function HEAD(request: NextRequest) {
  return NextResponse.redirect(buildRedirectUrl(request), 307);
}
