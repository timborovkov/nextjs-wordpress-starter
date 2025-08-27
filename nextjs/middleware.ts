import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { Locale } from "@/lib/dict";
import { defaultLocale, detectLocaleFromURL, languages } from "@/lib/dict";

// List of available locales
const locales = languages.map((lang) => lang.code);

/**
 * Get the preferred locale from the Accept-Language header
 * @param request - The request object
 * @returns The users preferred locale
 */
function getLocaleFromHeader(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get("accept-language");

  const preferredLocale: Locale | null = acceptLanguage
    ?.split(",")
    .map((lang) => lang.split(";")[0].trim())
    .find((lang) => locales.includes(lang as Locale)) as Locale;

  return preferredLocale ?? defaultLocale;
}

/**
 * Get the locale from the cookies
 * @param request - The request object
 * @returns The locale from the cookies or null if not found
 */
function getLocaleFromCookies(request: NextRequest): Locale | null {
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }
  return null;
}

/**
 * Set the user's preferred locale in a cookie for 1 year
 * @param response - The response object
 * @param locale - The locale to set in the cookie
 */
function setLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

/**
 * Main application middleware
 *
 * @remarks
 *
 * Middleware handles locale detection and routing.
 *
 * - Redirects to the correct locale if not found in the URL
 * - Sets locale cookies for user preference
 *
 * {@link https://nextjs.org/docs/app/building-your-application/routing/middleware}
 */
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If accessing /api routes, skip the rest of the middleware
  if (pathname.startsWith("/api")) return NextResponse.next();

  // Get locale from the URL using the detectLocaleFromURL function
  const urlLocale = detectLocaleFromURL(req.url);

  // Get the locale from cookies or headers as fallback
  let locale = getLocaleFromCookies(req);
  if (!locale) {
    locale = getLocaleFromHeader(req);
  }

  const response = NextResponse.next();

  // If URL has a locale, use it and update the cookie
  if (urlLocale) {
    setLocaleCookie(response, urlLocale);
    return response;
  }

  // Redirect to the correct locale if not found in the URL
  req.nextUrl.pathname = `/${locale}${pathname}`;
  setLocaleCookie(response, locale);
  return NextResponse.redirect(req.nextUrl);
}

/**
 * Configuration for the middleware
 *
 * Match all request paths except for:
 * - ui-assets (UI assets)
 * - _next/static (static files)
 * - _next/image (image optimisation files)
 * - monitoring (sentry tunnel route)
 * - all .svg, .png, .jpg, .webp, .ico and .jpeg files
 * - sitemap.xml
 * - robots.txt
 *
 * {@link https://nextjs.org/docs/app/building-your-application/routing/middleware}
 */
export const config = {
  matcher: [
    "/((?!ui-assets|_next/static|_next/image|monitoring|favicon.ico|[^/]+\\.svg|[^/]+\\.png|[^/]+\\.ico|[^/]+\\.jpg|[^/]+\\.webp|[^/]+\\.jpeg|sitemap\\.xml|robots\\.txt).*)",
  ],
};
