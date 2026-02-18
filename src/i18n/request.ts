/**
 * Locale detection and message loader for next-intl
 */
import { headers } from "next/headers";

export async function getLocale(request?: Request | null) {
  // try Request.headers.get if request provided
  let accept = "";
  if (request && typeof (request as any).headers?.get === "function") {
    accept = (request as any).headers.get("accept-language") ?? "";
  } else {
    // fall back to Next.js server headers() helper when running in server components
    try {
      const h = await headers();
      accept = h.get("accept-language") ?? "";
    } catch (e) {
      accept = "";
    }
  }

  const lang = accept.split(",")[0] || "en";
  if (lang.startsWith("es")) return "es";
  return "en";
}

export async function getMessages(locale: string) {
  switch (locale) {
    case "es":
      return (await import("../locales/es.json")).default;
    default:
      return (await import("../locales/en.json")).default;
  }
}

export type Messages = Record<string, any>;

/**
 * Default export used by server code — returns locale and messages
 */
export default async function request(request: Request) {
  const locale = await getLocale(request);
  const messages = await getMessages(locale);
  return { locale, messages };
}
