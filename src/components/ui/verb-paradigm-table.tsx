"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { VerbParadigm, Tense, Mood, Person, VerbForm } from "@/lib/verb-data";
import { useGame } from "@/components/game-provider";

interface VerbParadigmTableProps {
  paradigm: VerbParadigm;
}

export function VerbParadigmTable({ paradigm }: VerbParadigmTableProps) {
  const t = useTranslations("verbs");
  const { setOnReset } = useGame();
  const tenses = Object.keys(paradigm.conjugations) as Tense[];
  const [activeTense, setActiveTense] = React.useState<Tense>(tenses[0]);
  const [resetKey, setResetKey] = React.useState(0);

  React.useEffect(() => {
    setOnReset(() => {
      setActiveTense(tenses[0]);
      setResetKey(prev => prev + 1);
    });
    return () => setOnReset(undefined);
  }, [setOnReset, tenses]);

  const moods: Mood[] = ["indicative", "imperative", "subjunctive", "optative", "infinitive", "participle"];
  const persons: Person[] = ["1s", "2s", "3s", "1p", "2p", "3p"];

  const getForm = (tense: Tense, mood: Mood, person?: Person) => {
    const m = paradigm.conjugations[tense]?.[mood];
    if (!m) return null;
    const forms = m.active || [];
    if (person) {
      return forms.find(f => f.person === person);
    }
    return forms[0]; // For infinitive/participle
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {tenses.map(tense => (
          <button
            key={tense}
            onClick={() => setActiveTense(tense)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              activeTense === tense
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "glass hover:bg-accent text-muted-foreground"
            )}
          >
            {t(`tenses.${tense}`)}
          </button>
        ))}
      </div>

      <div key={resetKey} className="overflow-x-auto rounded-2xl border border-border/40 glass animate-in fade-in duration-500">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40">
              <th className="p-4 bg-muted/30 font-bold text-xs uppercase tracking-wider">{t("ui.mode_person")}</th>
              {moods.map(mood => {
                if (!paradigm.conjugations[activeTense]?.[mood]) return null;
                return (
                  <th key={mood} className="p-4 bg-muted/30 font-bold text-xs uppercase tracking-wider text-center">
                    {t(`moods.${mood}`)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {persons.map(person => (
              <tr key={person} className="border-b border-border/20 last:border-0 hover:bg-accent/5 transition-colors">
                <td className="p-4 font-bold text-sm text-muted-foreground bg-muted/10">
                  {t(`persons.${person}`)}
                </td>
                {moods.map(mood => {
                  if (!paradigm.conjugations[activeTense]?.[mood]) return null;
                  const f = getForm(activeTense, mood, person);
                  if (!f) return <td key={mood} className="p-4 text-center text-muted-foreground/30">-</td>;
                  return (
                    <td key={mood} className="p-4 text-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">{f.contracted || f.form}</span>
                        {f.contracted && (
                          <span className="text-[10px] text-muted-foreground font-medium">[{f.form}]</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Row for Infinitive/Participle if they don't have persons */}
            <tr className="bg-muted/5">
                <td className="p-4 font-bold text-sm text-muted-foreground">{t("ui.others")}</td>
                {moods.map(mood => {
                    if (!paradigm.conjugations[activeTense]?.[mood]) return null;
                    if (mood === "infinitive" || mood === "participle") {
                        const forms = paradigm.conjugations[activeTense]![mood]!.active || [];
                        return (
                            <td key={mood} className="p-4 text-center">
                                <div className="flex flex-col gap-2">
                                    {forms.map((f, i) => (
                                        <div key={i} className="flex flex-col">
                                            <span className="font-bold text-primary">{f.contracted || f.form}</span>
                                            {f.contracted && (
                                                <span className="text-[10px] text-muted-foreground font-medium">[{f.form}]</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </td>
                        );
                    }
                    return <td key={mood} className="p-4"></td>;
                })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
