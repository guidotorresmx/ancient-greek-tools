"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const pathname = usePathname() || "/";

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="border-b">
      <nav className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M8 12h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 8v8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-semibold">
                guidotorres <span className="text-xs lowercase">mx</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground mr-2">
              Greek Tools
            </div>

            {/* Single-level nav items mapped from an array for consistency */}
            {[
              { href: "/letras", label: "Letras" },
              { href: "/editor", label: "Editor" },
              { href: "/flashcards", label: "Flashcards" },
              { href: "/memory", label: "Memory" },
              { href: "/lectura", label: "Lectura" },
            ].map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={navigationMenuTriggerStyle(
                    isActive(item.href)
                      ? "font-semibold text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
