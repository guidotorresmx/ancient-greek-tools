"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Moon,
  Sun,
  Menu,
  X,
  Info,
  Sparkles,
  Languages,
  ChevronDown,
  Check,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useGame } from "@/components/game-provider";
import { useTranslations } from "next-intl";
import { GameMetaBar } from "./game-meta-bar";

export function Navbar() {
  const { locale, setLocale } = useLanguage();
  const { state } = useGame();
  const t = useTranslations("common");
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isDark, setIsDark] = React.useState<boolean>(false);
  const [langOpen, setLangOpen] = React.useState(false);

  // Determine if we are in "game mode" (minimal navbar)
  const isGameMode = !!state.gameName;

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function toggleTheme() {
    const newValue = !isDark;
    setIsDark(newValue);
    document.documentElement.classList.toggle("dark", newValue);
    localStorage.setItem("theme", newValue ? "dark" : "light");
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const NAV_ITEMS = [
    { href: "/letras", label: t("nav.letras") },
    { href: "/vocabulario", label: t("nav.vocabulario") },
    { href: "/declinaciones", label: t("nav.declinaciones") },
    { href: "/verbos", label: t("nav.verbos") },
    { href: "/memory", label: t("nav.memory") },
    { href: "/lectura", label: t("nav.lectura") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4",
        scrolled ? "top-2" : "top-0",
      )}
    >
      <nav
        className={cn(
          "max-w-6xl mx-auto rounded-2xl transition-all duration-300 border",
          scrolled || isGameMode
            ? "glass shadow-xl py-2 px-4 border-border/40"
            : "py-4 px-2 border-transparent",
        )}
      >
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-4 md:gap-8 min-w-0">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
              <div className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 border border-primary/20">
                <span className="text-lg md:text-xl font-bold text-primary select-none group-hover:scale-110 transition-transform">α</span>
              </div>
              <div className={cn(
                "flex flex-col",
                isGameMode ? "hidden lg:flex" : "hidden sm:flex"
              )}>
                <span className="font-bold tracking-tight text-sm md:text-base leading-none">
                  {t("nav.title")}
                </span>
                <span className="text-[9px] uppercase tracking-[0.15em] font-medium text-muted-foreground">
                  {t("nav.home")}
                </span>
              </div>
            </Link>

            {!isGameMode && (
              <div className="hidden md:flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 text-sm md:text-base font-medium transition-colors rounded-lg hover:bg-accent/50",
                      isActive(item.href)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Centered Activity Title */}
          {isGameMode && (
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none w-full max-w-[150px] sm:max-w-none px-2 box-border">
              <div className="flex flex-col items-center">
                <span className="hud-label !tracking-[0.1em] opacity-60">Actividad</span>
                <span className="font-bold text-xs md:text-base tracking-tight text-foreground/90 uppercase truncate w-full text-center">
                  {state.gameName}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {!isGameMode && (
              <div className="hidden md:flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative">
                  <Button
                    onClick={() => setLangOpen(!langOpen)}
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 rounded-xl gap-2 font-bold"
                  >
                    <Languages className="w-4 h-4" />
                    <span className="uppercase">{locale}</span>
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform",
                        langOpen && "rotate-180",
                      )}
                    />
                  </Button>

                  {langOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setLangOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-40 glass border border-border/40 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
                        {[
                          { code: "en", label: "English" },
                          { code: "es", label: "Español" },
                        ].map((l) => (
                          <button
                            key={l.code}
                            onClick={() => {
                              setLocale(l.code as any);
                              setLangOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-xl transition-colors",
                              locale === l.code
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                            )}
                          >
                            {l.label}
                            {locale === l.code && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={toggleTheme}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}

            <Button
              onClick={() => setMobileOpen(!mobileOpen)}
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-xl transition-all",
                isGameMode ? "bg-accent/50" : "md:hidden",
              )}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            mobileOpen ? "max-h-[80vh] opacity-100 mt-4" : "max-h-0 opacity-0",
          )}
        >
          <div className="flex flex-col gap-1 pb-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Compact Mobile Settings Area */}
            <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                {[
                  { code: "en", label: "EN" },
                  { code: "es", label: "ES" },
                ].map((l) => (
                  <Button
                    key={l.code}
                    variant={locale === l.code ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setLocale(l.code as any)}
                    className="h-8 w-10 p-0 text-[10px] font-bold rounded-lg"
                  >
                    {l.label}
                  </Button>
                ))}
              </div>
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg"
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {isGameMode && <GameMetaBar />}
    </header>
  );
}

export default Navbar;
