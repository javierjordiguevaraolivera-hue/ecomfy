import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AB_COOKIE_NAME = "fe_an_variant";
const AB_HEADER_NAME = "x-fe-an-variant";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/fe-an-en") {
    return NextResponse.next();
  }

  const existingVariant = request.cookies.get(AB_COOKIE_NAME)?.value;
  const variant =
    existingVariant === "a" || existingVariant === "b"
      ? existingVariant
      : Math.random() < 0.5
        ? "a"
        : "b";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(AB_HEADER_NAME, variant);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (existingVariant !== variant) {
    response.cookies.set(AB_COOKIE_NAME, variant, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/fe-an-en"],
};
