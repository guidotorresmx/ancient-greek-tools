"use client";

import { VocabularyGame } from "@/components/ui/vocabulary-game";
import { useTranslations } from "next-intl";
import { ActivityLayout } from "@/components/activity-layout";

export default function VocabularyPage() {
  const t = useTranslations("pages.vocabulario");

  return (
    <ActivityLayout title={t("title")} description={t("desc")}>
      <VocabularyGame />
    </ActivityLayout>
  );
}
