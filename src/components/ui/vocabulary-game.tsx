"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Volume2,
} from "lucide-react";
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
].map((w) => ({ ...w, greek: w.greek.normalize("NFC") }));

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

import { useLanguage } from "@/components/language-provider";
import { useGame } from "@/components/game-provider";

export function VocabularyGame() {
  const { locale } = useLanguage();
  const { setScore: setGlobalScore, setGameName, setActions, setOnReset } = useGame();
  const t = useTranslations("vocabulary");

  const [level, setLevel] = React.useState(10);
  const [target, setTarget] = React.useState<Word | null>(null);
  const [options, setOptions] = React.useState<Word[]>([]);
  const [feedback, setFeedback] = React.useState<
    "correct" | "incorrect" | null
  >(null);
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

  const handleReset = React.useCallback(() => {
    setScore(0);
    nextRound();
  }, [nextRound]);

  React.useEffect(() => {
    setOnReset(() => handleReset);
    return () => setOnReset(undefined);
  }, [handleReset, setOnReset]);

  React.useEffect(() => {
    setActions(
      <div className="flex items-center gap-1.5">
        {[10, 20, 30].map((l) => (
          <Button
            key={l}
            onClick={() => setLevel(l)}
            variant={level === l ? "secondary" : "ghost"}
            size="sm"
            className="h-7 md:h-8 rounded-lg font-bold text-[9px] md:text-[10px] px-1.5 md:px-2"
          >
            <span className="hidden sm:inline-block mr-0.5">Top</span>
            {l}
          </Button>
        ))}
      </div>
    );
    return () => setActions(null);
  }, [level, setActions, t]);

  function handleChoice(greek: string) {
    if (feedback || !target) return;

    if (greek === target.greek) {
      setFeedback("correct");
      setScore((s) => s + 1);
      speak(target.greek);
      setTimeout(nextRound, 1500);
    } else {
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 800);
    }
  }

  if (!target) return null;

  return (
    <div className="game-container">
      <div className="hidden" />

      {/* Target Word */}
      <div className="game-card min-h-[140px] md:min-h-[180px]">
        <div className="text-center space-y-1">
          <span className="hud-label leading-none">
            {t("translate")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
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
              <CheckCircle2 className="w-16 h-16 md:w-24 md:h-24 text-emerald-500 animate-in zoom-in duration-300" />
            ) : (
              <XCircle className="w-16 h-16 md:w-24 md:h-24 text-destructive animate-in zoom-in duration-300" />
            )}
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
        {options.map((option) => (
          <div key={option.greek} className="group relative">
            <Button
              onClick={() => handleChoice(option.greek)}
              variant="ghost"
              disabled={feedback === "correct"}
              className={cn(
                "game-option",
                feedback === "correct" && option.greek === target.greek
                  ? "game-option-correct"
                  : "",
              )}
            >
              {option.greek}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                speak(option.greek);
              }}
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 md:top-2 md:right-2 w-6 h-6 md:w-8 md:h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Volume2 className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
