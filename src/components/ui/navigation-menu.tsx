import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function navigationMenuTriggerStyle(extra?: string) {
  return cn("inline-flex items-center rounded-md px-3 py-1 text-sm", extra);
}

export function NavigationMenuItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("inline-block", className)} {...props}>
      {children}
    </div>
  );
}

export function NavigationMenuLink({
  href,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Link> & { className?: string }) {
  return (
    <Link
      href={href}
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export default NavigationMenuItem;
