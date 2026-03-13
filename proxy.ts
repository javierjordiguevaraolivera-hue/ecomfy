import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AB_COOKIE_NAME = "fe_an_variant";
const AB_HEADER_NAME = "x-fe-an-variant";
const FE7_HERO_COOKIE_NAME = "fe7_hero_variant";
const FE7_HERO_HEADER_NAME = "x-fe7-hero-variant";
const IUL_HERO_COOKIE_NAME = "iul_hero_variant";
const IUL_HERO_HEADER_NAME = "x-iul-hero-variant";
const IUL_600K_HERO_COOKIE_NAME = "iul_600k_hero_variant";
const IUL_600K_HERO_HEADER_NAME = "x-iul-600k-hero-variant";
const FE7_HERO_VARIANTS = ["0", "1", "2"] as const;

export function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname !== "/fe-an-en" &&
    request.nextUrl.pathname !== "/fe7-an-en" &&
    request.nextUrl.pathname !== "/iul-es" &&
    request.nextUrl.pathname !== "/iul-es-600k"
  ) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  const responseCookies: Array<{
    name: string;
    value: string;
  }> = [];

  if (request.nextUrl.pathname === "/fe-an-en") {
    const existingVariant = request.cookies.get(AB_COOKIE_NAME)?.value;
    const variant =
      existingVariant === "a" || existingVariant === "b"
        ? existingVariant
        : Math.random() < 0.5
          ? "a"
          : "b";

    requestHeaders.set(AB_HEADER_NAME, variant);

    if (existingVariant !== variant) {
      responseCookies.push({
        name: AB_COOKIE_NAME,
        value: variant,
      });
    }
  }

  if (request.nextUrl.pathname === "/fe7-an-en") {
    const existingHeroVariant = request.cookies.get(FE7_HERO_COOKIE_NAME)?.value;
    const heroVariant: string = FE7_HERO_VARIANTS.includes(
      existingHeroVariant as (typeof FE7_HERO_VARIANTS)[number],
    )
      ? (existingHeroVariant as string)
      : FE7_HERO_VARIANTS[Math.floor(Math.random() * FE7_HERO_VARIANTS.length)] ??
        FE7_HERO_VARIANTS[0];

    requestHeaders.set(FE7_HERO_HEADER_NAME, heroVariant);

    if (existingHeroVariant !== heroVariant) {
      responseCookies.push({
        name: FE7_HERO_COOKIE_NAME,
        value: heroVariant,
      });
    }
  }

  if (request.nextUrl.pathname === "/iul-es") {
    const existingHeroVariant = request.cookies.get(IUL_HERO_COOKIE_NAME)?.value;
    const heroVariant: string = FE7_HERO_VARIANTS.includes(
      existingHeroVariant as (typeof FE7_HERO_VARIANTS)[number],
    )
      ? (existingHeroVariant as string)
      : FE7_HERO_VARIANTS[Math.floor(Math.random() * FE7_HERO_VARIANTS.length)] ??
        FE7_HERO_VARIANTS[0];

    requestHeaders.set(IUL_HERO_HEADER_NAME, heroVariant);

    if (existingHeroVariant !== heroVariant) {
      responseCookies.push({
        name: IUL_HERO_COOKIE_NAME,
        value: heroVariant,
      });
    }
  }

  if (request.nextUrl.pathname === "/iul-es-600k") {
    const existingHeroVariant = request.cookies.get(IUL_600K_HERO_COOKIE_NAME)?.value;
    const heroVariant: string = FE7_HERO_VARIANTS.includes(
      existingHeroVariant as (typeof FE7_HERO_VARIANTS)[number],
    )
      ? (existingHeroVariant as string)
      : FE7_HERO_VARIANTS[Math.floor(Math.random() * FE7_HERO_VARIANTS.length)] ??
        FE7_HERO_VARIANTS[0];

    requestHeaders.set(IUL_600K_HERO_HEADER_NAME, heroVariant);

    if (existingHeroVariant !== heroVariant) {
      responseCookies.push({
        name: IUL_600K_HERO_COOKIE_NAME,
        value: heroVariant,
      });
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  for (const cookie of responseCookies) {
    response.cookies.set(cookie.name, cookie.value, {
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
  matcher: ["/fe-an-en", "/fe7-an-en", "/iul-es", "/iul-es-600k"],
};
