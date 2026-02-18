import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
}

export function Card({ title, className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-md border bg-card p-4", className)} {...props}>
      {title ? <div className="mb-2 text-sm font-medium">{title}</div> : null}
      {children}
    </div>
  );
}

export default Card;
