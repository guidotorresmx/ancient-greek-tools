"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname() || "/";

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="w-full border-b bg-background/50 backdrop-blur-sm">
      <nav className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-semibold">
              Ancient Greek
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              tools
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-current={isActive("/") ? "page" : undefined}
              className={cn(
                "text-sm hover:underline",
                isActive("/") && "font-semibold underline",
              )}
            >
              Home
            </Link>

            <Link
              href="/tools"
              aria-current={isActive("/tools") ? "page" : undefined}
              className={cn(
                "text-sm hover:underline",
                isActive("/tools") && "font-semibold underline",
              )}
            >
              Tools
            </Link>

            <Link
              href="/memory"
              aria-current={isActive("/memory") ? "page" : undefined}
              className={cn(
                "text-sm hover:underline",
                isActive("/memory") && "font-semibold underline",
              )}
            >
              Memory
            </Link>

            <Link
              href="/about"
              aria-current={isActive("/about") ? "page" : undefined}
              className={cn(
                "text-sm hover:underline",
                isActive("/about") && "font-semibold underline",
              )}
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
