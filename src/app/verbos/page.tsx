"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { VerbsGame } from "@/components/ui/verbs-game";
import { VerbParadigmTable } from "@/components/ui/verb-paradigm-table";
import { useTranslations } from "next-intl";
import { ActivityLayout } from "@/components/activity-layout";
import { VERB_DATA } from "@/lib/verb-data";

export default function VerbosPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = React.useState<"game" | "study">("game");

  return (
    <ActivityLayout title={t("pages.verbos.title")} description={t("pages.verbos.desc")} maxW="max-w-5xl">
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
          <VerbsGame />
        ) : (
          <div className="space-y-12">
            {VERB_DATA.map(v => (
              <div key={v.lemma} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground capitalize">{v.lemma}</h2>
                  <p className="text-muted-foreground">
                    {t("verbs.labels.verb")} {t(`verbs.types.${v.type}`)}
                  </p>
                </div>
                <VerbParadigmTable paradigm={v} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ActivityLayout>
  );
}
