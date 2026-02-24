"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

type Word = {
  greek: string;
  en: string;
  es: string;
};

const VOCAB_DATA: Word[] = [
  { greek: "ὁ, ἡ, τό", en: "the", es: "el, la, lo" },
  { greek: "καί", en: "and", es: "y" },
  { greek: "αὐτός", en: "self, he/she/it", es: "mismo, él/ella" },
  { greek: "δέ", en: "but, and", es: "pero, y" },
  { greek: "ἐν", en: "in, at", es: "en" },
  { greek: "γάρ", en: "for", es: "porque, pues" },
  { greek: "εἰμί", en: "to be", es: "ser, estar" },
  { greek: "οὗτος", en: "this", es: "este, esta" },
  { greek: "μή", en: "not", es: "no" },
  { greek: "λέγω", en: "to say, speak", es: "decir, hablar" },
  { greek: "εἰς", en: "into", es: "hacia, en" },
  { greek: "οὐ", en: "not", es: "no" },
  { greek: "ὅς", en: "who, which", es: "quien, el cual" },
  { greek: "πᾶς", en: "all, every", es: "todo, cada" },
  { greek: "σύ", en: "you", es: "tú" },
  { greek: "ἄν", en: "modal particle", es: "partícula modal" },
  { greek: "τίς", en: "who? which?", es: "quién? cuál?" },
  { greek: "ἐγώ", en: "I", es: "yo" },
  { greek: "ἐπί", en: "on, upon", es: "sobre, en" },
  { greek: "ποιέω", en: "to do, make", es: "hacer" },
  { greek: "κατά", en: "down, according to", es: "hacia abajo, según" },
  { greek: "μετά", en: "with, after", es: "con, después de" },
  { greek: "ὁράω", en: "to see", es: "ver" },
  { greek: "ἀκούω", en: "to hear", es: "oír, escuchar" },
  { greek: "πρός", en: "towards", es: "hacia, junto a" },
  { greek: "γίγνομαι", en: "to become", es: "llegar a ser" },
  { greek: "διά", en: "through, because of", es: "a través de, por" },
  { greek: "ἔχω", en: "to have, hold", es: "tener" },
  { greek: "δίδωμι", en: "to give", es: "dar" },
  { greek: "πολύς", en: "much, many", es: "mucho" },
];

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

import { useLanguage } from "@/components/language-provider";

export function VocabularyGame() {
  const { locale } = useLanguage();
  const t = useTranslations("vocabulary");
  const [level, setLevel] = React.useState(10);
  const [target, setTarget] = React.useState<Word | null>(null);
  const [options, setOptions] = React.useState<Word[]>([]);
  const [feedback, setFeedback] = React.useState<
    "correct" | "incorrect" | null
  >(null);
  const [score, setScore] = React.useState(0);

  const nextRound = React.useCallback(() => {
    const pool = VOCAB_DATA.slice(0, level);
    const shuffled = shuffle(pool);
    const correct = shuffled[0];
    const wrongOnes = shuffle(
      pool.filter((w) => w.greek !== correct.greek),
    ).slice(0, 3);
    const roundOptions = shuffle([correct, ...wrongOnes]);

    setTarget(correct);
    setOptions(roundOptions);
    setFeedback(null);
  }, [level]);

  React.useEffect(() => {
    nextRound();
  }, [nextRound]);

  function handleChoice(greek: string) {
    if (feedback || !target) return;

    if (greek === target.greek) {
      setFeedback("correct");
      setScore((s) => s + 1);
      setTimeout(nextRound, 1200);
    } else {
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 800);
    }
  }

  if (!target) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          {[10, 20, 30].map((l) => (
            <Button
              key={l}
              onClick={() => setLevel(l)}
              variant={level === l ? "default" : "ghost"}
              size="sm"
              className="rounded-xl font-bold"
            >
              {t("top", { level: l })}
            </Button>
          ))}
        </div>
      </div>

      {/* Target Word */}
      <div className="relative glass p-16 rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-primary/20 overflow-hidden group">
        <div className="absolute top-4 left-4">
          <Trophy className="w-8 h-8 text-primary shadow-lg" />
        </div>
        <div className="absolute top-4 right-4 text-2xl font-bold text-primary">
          {score}
        </div>

        <div className="text-center space-y-2">
          <span className="text-sm uppercase tracking-widest text-muted-foreground font-bold">
            {t("translate")}
          </span>
          <h2 className="text-6xl font-bold text-foreground">
            {locale === "es" ? target.es : target.en}
          </h2>
        </div>

        {feedback && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center backdrop-blur-md transition-all duration-300",
              feedback === "correct"
                ? "bg-emerald-500/20"
                : "bg-destructive/20",
            )}
          >
            {feedback === "correct" ? (
              <CheckCircle2 className="w-24 h-24 text-emerald-500 animate-in zoom-in duration-300" />
            ) : (
              <XCircle className="w-24 h-24 text-destructive animate-in zoom-in duration-300" />
            )}
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => (
          <Button
            key={option.greek}
            onClick={() => handleChoice(option.greek)}
            variant="ghost"
            disabled={feedback === "correct"}
            className={cn(
              "h-24 glass rounded-[2rem] text-3xl font-bold border-2 transition-all duration-300 text-foreground",
              feedback === "correct" && option.greek === target.greek
                ? "border-emerald-500 bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                : "hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 active:scale-95",
            )}
          >
            {option.greek}
          </Button>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => {
            setScore(0);
            nextRound();
          }}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" />
          {t("reset")}
        </Button>
      </div>

      <p className="text-center text-muted-foreground text-sm font-medium italic">
        {t("instruction")}
      </p>
    </div>
  );
}
