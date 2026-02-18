/**
 * Locale detection and message loader for next-intl
 */
export function getLocale(request: Request) {
  const accept = request.headers.get("accept-language") ?? "";
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
