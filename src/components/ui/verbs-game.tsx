"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { VERB_DATA, VerbParadigm, Tense, Mood, Person, VerbForm } from "@/lib/verb-data";
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

export function VerbsGame() {
  const { locale } = useLanguage();
  const { setScore: setGlobalScore, setGameName, setActions, setOnReset } = useGame();
  const t = useTranslations("verbs");

  const [paradigm, setParadigm] = React.useState<VerbParadigm | null>(null);
  const [targetTense, setTargetTense] = React.useState<Tense>("present");
  const [targetMood, setTargetMood] = React.useState<Mood>("indicative");
  const [targetForm, setTargetForm] = React.useState<VerbForm | null>(null);
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
    const p = shuffle(VERB_DATA)[0];
    const tenses = Object.keys(p.conjugations) as Tense[];
    const tense = shuffle(tenses)[0];
    const moods = Object.keys(p.conjugations[tense]!) as Mood[];
    const mood = shuffle(moods)[0];
    const forms = p.conjugations[tense]![mood]!.active || [];
    
    if (forms.length === 0) return nextRound();

    const target = shuffle(forms)[0];
    const correctVal = target.contracted || target.form;

    // pool of other forms for options
    const allParadigmsForms = VERB_DATA.flatMap(v => 
      Object.values(v.conjugations).flatMap(m => 
        Object.values(m as any).flatMap(voices => 
          (voices as any).active?.map((f: VerbForm) => f.contracted || f.form) || []
        )
      )
    );
    const wrongOnes = shuffle(allParadigmsForms.filter(f => f !== correctVal)).slice(0, 3);
    const roundOptions = shuffle([correctVal, ...wrongOnes]);

    setParadigm(p);
    setTargetTense(tense);
    setTargetMood(mood);
    setTargetForm(target);
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

  const handleChoice = (val: string) => {
    if (feedback || !targetForm) return;

    const correctVal = targetForm.contracted || targetForm.form;
    if (val === correctVal) {
      setFeedback("correct");
      setScore((s) => s + 1);
      playSuccessSound();
      speak(val);
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

  if (!paradigm || !targetForm) return null;

  const correctValue = targetForm.contracted || targetForm.form;

  return (
    <div className="game-container max-w-2xl mx-auto">
      <div className="game-card min-h-[220px] flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <span className="hud-label text-primary font-bold">
            {paradigm.lemma} ({paradigm.meaning[locale as keyof typeof paradigm.meaning]})
          </span>
          <h2 className="text-xl md:text-3xl font-bold mt-2">
            {t(`tenses.${targetTense}`)} • {t(`moods.${targetMood}`)}
          </h2>
          <div className="mt-2 text-muted-foreground font-medium">
            {targetForm.person ? t(`persons.${targetForm.person}`) : targetForm.gender ? t(`genders.${targetForm.gender}`) : ""}
          </div>
        </div>

        {feedback && (
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-300 rounded-2xl",
            feedback === "correct" ? "bg-emerald-500/20" : "bg-destructive/20",
          )}>
            {feedback === "correct" ? (
              <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-in zoom-in duration-300" />
            ) : (
              <>
                <XCircle className="w-20 h-20 text-destructive animate-in zoom-in duration-300" />
                <div className="mt-4 text-center animate-in slide-in-from-bottom-2 duration-500">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t("correct_answer")}</span>
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
              "game-option text-lg md:text-xl h-16 transition-all duration-300",
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
