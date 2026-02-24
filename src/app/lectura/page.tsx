"use client";

import { ReadingGame } from "@/components/ui/reading-game";
import { useTranslations } from "next-intl";

export default function LecturaPage() {
  const t = useTranslations("pages.lectura");

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          {t("desc")}
        </p>
      </div>
      <ReadingGame />
    </div>
  );
}
