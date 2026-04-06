"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { NounParadigm, Case, Number as GrammarNumber, DECLINATION_DATA } from "@/lib/declination-data";
import { useGame } from "@/components/game-provider";

interface DeclinationParadigmTableProps {
  paradigm: NounParadigm;
}

export function DeclinationParadigmTable({ paradigm }: DeclinationParadigmTableProps) {
  const t = useTranslations("declinations");
  const { setOnReset } = useGame();
  const [resetKey, setResetKey] = React.useState(0);
  
  const cases: Case[] = ["nominative", "genitive", "dative", "accusative", "vocative"];
  const numbers: GrammarNumber[] = ["singular", "plural"];

  React.useEffect(() => {
    setOnReset(() => {
      setResetKey(prev => prev + 1);
    });
    return () => setOnReset(undefined);
  }, [setOnReset]);

  const getForm = (c: Case, n: GrammarNumber) => {
    return paradigm.declination.find(d => d.case === c && d.number === n);
  };

  return (
    <div key={resetKey} className="overflow-x-auto rounded-2xl border border-border/40 glass p-1 md:p-4 animate-in fade-in duration-500">
      <table className="w-full text-left border-separate border-spacing-2 md:border-spacing-4">
        <thead>
          <tr>
            <th className="p-2 md:p-4 bg-muted/30 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-wider">
              {t("ui.case")}
            </th>
            {numbers.map(n => (
              <th key={n} className="p-2 md:p-4 bg-muted/30 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-wider text-center">
                {t(`numbers.${n}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cases.map(c => (
            <tr key={c}>
              <td className="p-2 md:p-4 font-bold text-xs md:text-sm text-muted-foreground bg-muted/10 rounded-xl">
                {t(`cases.${c}`)}
              </td>
              {numbers.map(n => {
                const entry = getForm(c, n);
                if (!entry) return <td key={n} className="p-2 md:p-4 text-center">-</td>;
                
                return (
                  <td key={n} className="p-0">
                    <FlipCell 
                      form={entry.form} 
                      info={`${t(`cases.${c}`)} ${t(`numbers.${n}`)}`} 
                      hint={t(`hints.${c}`).replace("[word]", paradigm.lemma).replace("[palabra]", paradigm.lemma)}
                      usage={t(`usage.${c}`)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FlipCell({ form, info, hint, usage }: { form: string; info: string; hint: string; usage: string }) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div 
      className="group perspective-1000 w-full h-16 md:h-24 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={cn(
        "relative w-full h-full transition-transform duration-700 transform-style-3d shadow-sm hover:shadow-md rounded-xl transition-all",
        isFlipped ? "rotate-y-180" : ""
      )}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden flex items-center justify-center p-2 rounded-xl bg-background border border-primary/20 group-hover:border-primary/50 transition-colors">
          <span className="font-bold text-primary text-sm md:text-lg lg:text-xl">{form}</span>
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-2 rounded-xl bg-primary text-primary-foreground shadow-inner text-center space-y-1">
          <span className="text-[8px] md:text-[10px] opacity-80 uppercase font-bold tracking-tighter italic">
            {info}
          </span>
          <span className="text-[10px] md:text-sm font-bold leading-tight">
            {hint}
          </span>
          <div className="h-[1px] w-8 bg-primary-foreground/30 my-0.5" />
          <span className="text-[9px] md:text-[11px] font-medium opacity-90 leading-none">
            {usage}
          </span>
        </div>
      </div>
    </div>
  );
}
