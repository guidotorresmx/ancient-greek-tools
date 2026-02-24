"use client";

import * as React from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: Readonly<{
  open: boolean;
  onClose(): void;
  title?: React.ReactNode;
  children?: React.ReactNode;
}>) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 w-[min(640px,95%)] bg-popover text-popover-foreground rounded-md shadow-lg p-6">
        {title && <div className="mb-2 text-lg font-semibold">{title}</div>}
        <div>{children}</div>
        <div className="mt-4 text-right">
          <button
            className="px-3 py-1 rounded-md bg-muted text-muted-foreground"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
