"use client";

import * as React from "react";
import { DeclinationsGame } from "@/components/ui/declinations-game";
import { DeclinationParadigmTable } from "@/components/ui/declination-paradigm-table";
import { useTranslations } from "next-intl";
import { ActivityLayout } from "@/components/activity-layout";
import { DECLINATION_DATA } from "@/lib/declination-data";
import { cn } from "@/lib/utils";

export default function DeclinationsPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = React.useState<"game" | "study">("game");

  return (
    <ActivityLayout title={t("pages.declinaciones.title")} description={t("pages.declinaciones.desc")} maxW="max-w-5xl">
      <div className="space-y-8">
        <div className="flex justify-center">
          <div className="glass p-1 rounded-2xl flex gap-1">
            <button
              onClick={() => setActiveTab("game")}
              className={cn(
                "rounded-xl px-8 py-2 text-sm font-bold transition-all",
                activeTab === "game"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "hover:bg-accent/50 text-muted-foreground"
              )}
            >
              {t("common.ui.game")}
            </button>
            <button
              onClick={() => setActiveTab("study")}
              className={cn(
                "rounded-xl px-8 py-2 text-sm font-bold transition-all",
                activeTab === "study"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "hover:bg-accent/50 text-muted-foreground"
              )}
            >
              {t("common.ui.study")}
            </button>
          </div>
        </div>

        {activeTab === "game" ? (
          <DeclinationsGame />
        ) : (
          <div className="space-y-12">
            {DECLINATION_DATA.map(p => (
              <div key={p.lemma} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground capitalize">{p.lemma}</h2>
                  <p className="text-muted-foreground">
                    {t("declinations.labels.noun")} {t(`declinations.genders.${p.gender}`)}
                  </p>
                </div>
                <DeclinationParadigmTable paradigm={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ActivityLayout>
  );
}
