"use client";

import { MemoryGame } from "@/components/ui/memory-game";
import { useTranslations } from "next-intl";
import { ActivityLayout } from "@/components/activity-layout";

export default function MemoryPage() {
  const t = useTranslations("pages.memory");

  return (
    <ActivityLayout title={t("title")} description={t("desc")} maxW="max-w-5xl">
      <MemoryGame />
    </ActivityLayout>
  );
}
