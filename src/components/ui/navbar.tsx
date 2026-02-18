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
    <header>
      <nav>
        <div className="flex items-center justify-between">
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
            <div className="text-sm font-medium">Greek Tools</div>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/letras"
                aria-current={isActive("/letras") ? "page" : undefined}
                className={
                  isActive("/letras")
                    ? navigationMenuTriggerStyle("font-semibold")
                    : undefined
                }
              >
                Letras
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/editor"
                aria-current={isActive("/editor") ? "page" : undefined}
                className={
                  isActive("/editor")
                    ? navigationMenuTriggerStyle("font-semibold")
                    : undefined
                }
              >
                Editor
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/flashcards"
                aria-current={isActive("/flashcards") ? "page" : undefined}
                className={
                  isActive("/flashcards")
                    ? navigationMenuTriggerStyle("font-semibold")
                    : undefined
                }
              >
                Flashcards
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/lectura"
                aria-current={isActive("/lectura") ? "page" : undefined}
                className={
                  isActive("/lectura")
                    ? navigationMenuTriggerStyle("font-semibold")
                    : undefined
                }
              >
                Lectura
              </NavigationMenuLink>
            </NavigationMenuItem>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
