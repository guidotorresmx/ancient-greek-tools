"use client";

import { PhoneticGame } from "@/components/ui/phonetic-game";
import { useTranslations } from "next-intl";
import { ActivityLayout } from "@/components/activity-layout";

export default function LetrasPage() {
  const t = useTranslations("pages.letras");

  return (
    <ActivityLayout title={t("title")} description={t("desc")}>
      <PhoneticGame />
    </ActivityLayout>
  );
}
