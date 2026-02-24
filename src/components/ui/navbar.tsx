"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun, Menu, X, Info, Sparkles } from "lucide-react";

export function Navbar() {
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isDark, setIsDark] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Theme initialization
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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
    { href: "/letras", label: "Letras" },
    { href: "/editor", label: "Editor" },
    { href: "/flashcards", label: "Flashcards" },
    { href: "/memory", label: "Memory" },
    { href: "/lectura", label: "Lectura" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3",
        scrolled ? "top-2" : "top-0"
      )}
    >
      <nav 
        className={cn(
          "max-w-6xl mx-auto rounded-2xl transition-all duration-300 border border-transparent",
          scrolled 
            ? "glass shadow-xl py-2 px-4 border-border/40" 
            : "py-4 px-2"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-lg leading-none">
                  Ancient Greek
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
                  Tools & Resources
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-accent/50",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("memory:toggle-instructions"))}
              variant="ghost"
              size="icon"
              className="rounded-xl"
              title="Instructions"
            >
              <Info className="w-5 h-5" />
            </Button>

            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-xl"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              onClick={() => setMobileOpen(!mobileOpen)}
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
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
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
