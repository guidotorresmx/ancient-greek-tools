"use client";

import { ReadingGame } from "@/components/ui/reading-game";
import { useTranslations } from "next-intl";
import { ActivityLayout } from "@/components/activity-layout";

export default function LecturaPage() {
  const t = useTranslations("pages.lectura");

  return (
    <ActivityLayout title={t("title")} description={t("desc")} maxW="max-w-3xl">
      <ReadingGame />
    </ActivityLayout>
  );
}
