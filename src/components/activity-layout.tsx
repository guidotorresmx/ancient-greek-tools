"use client";

import React from "react";
import { useGame } from "@/components/game-provider";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface ActivityLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  maxW?: string;
}

export function ActivityLayout({
  children,
  title,
  description,
  maxW = "max-w-2xl",
}: ActivityLayoutProps) {
  const { setGameName, setInstructions } = useGame();

  React.useEffect(() => {
    setGameName(title);
    setInstructions(description);
    return () => {
      setGameName("");
      setInstructions("");
    };
  }, [title, description, setGameName, setInstructions]);

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
      <h1 className="sr-only">{title}</h1>

      {children}
    </div>
  );
}
