import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAllDictionaryTranslations } from "./src/lib/wordpress";

// Type for available locales
type Locale = string;

/**
 * Fetch available locales from WordPress
 * @returns Promise<{ locales: string[], defaultLocale: string }>
 */
async function getAvailableLocales() {
  try {
    const response = await getAllDictionaryTranslations();
    const locales = Object.values(response.languages).map(
      (lang: any) => lang.code
    );

    // Use the first locale as default (or fallback to "en")
    const defaultLocale = locales[0] || "en";

    return { locales, defaultLocale };
  } catch (error) {
    console.warn(
      "Failed to fetch locales from WordPress, using fallback:",
      error
    );
    return { locales: ["en"], defaultLocale: "en" };
  }
}

/**
 * Detect locale from URL path
 * @param url - The request URL
 * @returns The locale from the URL or null if not found
 */
function detectLocaleFromURL(url: string): Locale | null {
  const pathname = new URL(url).pathname;
  const segments = pathname.split("/").filter(Boolean);

  // If first segment looks like a locale (2-3 character code), return it
  if (segments.length > 0 && /^[a-z]{2,3}$/.test(segments[0])) {
    return segments[0];
  }

  return null;
}

/**
 * Get the locale from the cookies
 * @param request - The request object
 * @returns The locale from the cookies or null if not found
 */
function getLocaleFromCookies(request: NextRequest): Locale | null {
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && /^[a-z]{2,3}$/.test(cookieLocale)) {
    return cookieLocale;
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
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If accessing /api routes, skip the rest of the middleware
  if (pathname.startsWith("/api")) return NextResponse.next();

  // Get available locales from WordPress
  const { locales, defaultLocale } = await getAvailableLocales();

  // Get locale from the URL using the detectLocaleFromURL function
  const urlLocale = detectLocaleFromURL(req.url);

  // If URL has a locale, validate it and use it
  if (urlLocale) {
    // Check if the URL locale is valid
    if (locales.includes(urlLocale)) {
      const response = NextResponse.next();
      setLocaleCookie(response, urlLocale);
      return response;
    } else {
      // Invalid locale in URL, redirect to default
      const response = NextResponse.redirect(
        new URL(`/${defaultLocale}${pathname}`, req.url)
      );
      setLocaleCookie(response, defaultLocale);
      return response;
    }
  }

  // No locale in URL, get from cookies or use default
  let locale = getLocaleFromCookies(req);

  // Validate cookie locale
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  // Redirect to the correct locale
  const response = NextResponse.redirect(
    new URL(`/${locale}${pathname}`, req.url)
  );
  setLocaleCookie(response, locale as string);
  return response;
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
