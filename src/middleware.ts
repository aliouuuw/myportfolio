import { defineMiddleware } from "astro:middleware";
import {
  LOCALE_DETECTED_COOKIE,
  hasDetectedLocale,
  isFrenchPath,
  prefersFrench,
  shouldSkipLocaleDetect,
  toFrenchPath,
} from "@/lib/locale-detect";

export const onRequest = defineMiddleware((context, next) => {
  // Prerender has no request headers. Live requests (Vercel edge / `astro dev`) do.
  if (context.isPrerendered) {
    return next();
  }

  const { pathname, search } = context.url;

  if (shouldSkipLocaleDetect(pathname)) {
    return next();
  }

  const cookieHeader = context.request.headers.get("cookie");
  if (hasDetectedLocale(cookieHeader)) {
    return next();
  }

  context.cookies.set(LOCALE_DETECTED_COOKIE, "1", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const wantFrench = prefersFrench(context.request.headers.get("accept-language"));
  if (wantFrench && !isFrenchPath(pathname)) {
    return context.redirect(`${toFrenchPath(pathname)}${search}`);
  }

  return next();
});
