"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { DECLINATION_DATA, NounParadigm, Case, Number } from "@/lib/declination-data";
import { useLanguage } from "@/components/language-provider";
import { useGame } from "@/components/game-provider";
import { CheckCircle2, XCircle, Volume2 } from "lucide-react";

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

import { playSuccessSound, playErrorSound } from "@/lib/audio";

export function DeclinationsGame() {
  const { locale } = useLanguage();
  const { setScore: setGlobalScore, setGameName, setActions, setOnReset } = useGame();
  const t = useTranslations("declinations");
  const verbT = useTranslations("verbs"); // For correct_answer key if shared, or add to common

  const [paradigm, setParadigm] = React.useState<NounParadigm | null>(null);
  const [targetIndex, setTargetIndex] = React.useState(0);
  const [options, setOptions] = React.useState<string[]>([]);
  const [feedback, setFeedback] = React.useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    setGameName(t("title"));
    return () => setGameName("");
  }, [setGameName, t]);

  React.useEffect(() => {
    setGlobalScore(score);
  }, [score, setGlobalScore]);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.normalize("NFC"));
      utterance.lang = "el-GR";
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextRound = React.useCallback(() => {
    const p = shuffle(DECLINATION_DATA)[0];
    const targetIdx = Math.floor(Math.random() * p.declination.length);
    const correctForm = p.declination[targetIdx].form;
    
    // Get some wrong forms from the same or other paradigms
    const allForms = DECLINATION_DATA.flatMap(x => x.declination.map(d => d.form));
    const wrongOnes = shuffle(allForms.filter(f => f !== correctForm)).slice(0, 3);
    const roundOptions = shuffle([correctForm, ...wrongOnes]);

    setParadigm(p);
    setTargetIndex(targetIdx);
    setOptions(roundOptions);
    setFeedback(null);
  }, []);

  React.useEffect(() => {
    setOnReset(() => {
      setScore(0);
      nextRound();
    });
    return () => setOnReset(undefined);
  }, [setOnReset, nextRound]);

  React.useEffect(() => {
    nextRound();
  }, [nextRound]);

  const handleChoice = (form: string) => {
    if (feedback || !paradigm) return;

    const correctForm = paradigm.declination[targetIndex].form;
    if (form === correctForm) {
      setFeedback("correct");
      setScore((s) => s + 1);
      playSuccessSound();
      speak(form);
      setTimeout(nextRound, 1500);
    } else {
      setFeedback("incorrect");
      playErrorSound();
      setTimeout(() => {
        setFeedback(null);
        nextRound();
      }, 2500);
    }
  };

  if (!paradigm) return null;

  const target = paradigm.declination[targetIndex];
  const correctValue = target.form;

  return (
    <div className="game-container max-w-2xl mx-auto">
      <div className="game-card min-h-[200px] flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <span className="hud-label text-primary font-bold">
            {paradigm.lemma} ({paradigm.translation[locale as keyof typeof paradigm.translation]})
          </span>
          <h2 className="text-2xl md:text-4xl font-bold mt-2">
            {t(`cases.${target.case}`)} {t(`numbers.${target.number}`)}
          </h2>
        </div>

        {feedback && (
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-300 rounded-2xl",
              feedback === "correct" ? "bg-emerald-500/20" : "bg-destructive/20",
            )}
          >
            {feedback === "correct" ? (
              <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-in zoom-in duration-300" />
            ) : (
              <>
                <XCircle className="w-20 h-20 text-destructive animate-in zoom-in duration-300" />
                <div className="mt-4 text-center animate-in slide-in-from-bottom-2 duration-500">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{verbT("correct_answer")}</span>
                  <div className="text-2xl font-bold text-emerald-500">{correctValue}</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        {options.map((option, idx) => (
          <Button
            key={`${option}-${idx}`}
            onClick={() => handleChoice(option)}
            variant="ghost"
            disabled={!!feedback}
            className={cn(
              "game-option text-xl h-16 transition-all duration-300",
              feedback === "correct" && option === correctValue ? "game-option-correct" : 
              feedback === "incorrect" && option === correctValue ? "border-emerald-500 bg-emerald-500/10 scale-105 shadow-lg z-10" : 
              feedback === "incorrect" && option !== correctValue ? "opacity-30 grayscale" : "",
            )}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
