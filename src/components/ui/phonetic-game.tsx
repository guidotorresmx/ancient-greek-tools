"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Volume2, RotateCcw, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type Phoneme = {
  id: string;
  char: string;
  name: string;
  audioPath?: string;
};

const GREEK_PHONEMES: Phoneme[] = [
  { id: "alpha", char: "α", name: "Alpha" },
  { id: "beta", char: "β", name: "Beta" },
  { id: "gamma", char: "γ", name: "Gamma" },
  { id: "delta", char: "δ", name: "Delta" },
  { id: "epsilon", char: "ε", name: "Epsilon" },
  { id: "zeta", char: "ζ", name: "Zeta" },
  { id: "eta", char: "η", name: "Eta" },
  { id: "theta", char: "θ", name: "Theta" },
  { id: "iota", char: "ι", name: "Iota" },
  { id: "kappa", char: "κ", name: "Kappa" },
  { id: "lambda", char: "λ", name: "Lambda" },
  { id: "mu", char: "μ", name: "Mu" },
  { id: "nu", char: "ν", name: "Nu" },
  { id: "xi", char: "ξ", name: "Xi" },
  { id: "omicron", char: "ο", name: "Omicron" },
  { id: "pi", char: "π", name: "Pi" },
  { id: "rho", char: "ρ", name: "Rho" },
  { id: "sigma", char: "σ", name: "Sigma" },
  { id: "tau", char: "τ", name: "Tau" },
  { id: "upsilon", char: "υ", name: "Upsilon" },
  { id: "phi", char: "φ", name: "Phi" },
  { id: "chi", char: "χ", name: "Chi" },
  { id: "psi", char: "ψ", name: "Psi" },
  { id: "omega", char: "ω", name: "Omega" },
].map((p) => ({
  ...p,
  char: p.char.normalize("NFC"),
  name: p.name.normalize("NFC"),
}));

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

import { playSuccessSound, playErrorSound } from "@/lib/audio";

export function PhoneticGame() {
  const { locale } = useLanguage();
  const { setScore: setGlobalScore, setGameName, setStats, setOnReset } = useGame();
  const t = useTranslations("phonetic");
  const uiT = useTranslations("common.ui");
  const [target, setTarget] = React.useState<Phoneme | null>(null);
  const [options, setOptions] = React.useState<Phoneme[]>([]);
  const [feedback, setFeedback] = React.useState<
    "correct" | "incorrect" | null
  >(null);
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);

  const nextRound = React.useCallback(() => {
    const shuffled = shuffle(GREEK_PHONEMES);
    const correct = shuffled[0];
    const pool = shuffle(GREEK_PHONEMES.filter((p) => p.id !== correct.id));
    const roundOptions = shuffle([correct, ...pool.slice(0, 3)]);

    setTarget(correct);
    setOptions(roundOptions);
    setFeedback(null);
  }, []);

  const handleReset = React.useCallback(() => {
    setScore(0);
    setStreak(0);
    nextRound();
  }, [nextRound]);

  React.useEffect(() => {
    setOnReset(() => handleReset);
    return () => setOnReset(undefined);
  }, [handleReset, setOnReset]);

  React.useEffect(() => {
    setGameName(t("title") || "Letters Game");
    return () => setGameName("");
  }, [setGameName, t]);

  React.useEffect(() => {
    setStats({ [t("streak")]: streak });
  }, [streak, setStats, t]);

  React.useEffect(() => {
    nextRound();
  }, [nextRound]);

  function speak(char: string) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(char.normalize("NFC"));
      utterance.lang = "el-GR";
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  }

  function handleChoice(id: string) {
    if (feedback || !target) return;

    if (id === target.id) {
      setFeedback("correct");
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      playSuccessSound();
      speak(target.char);
      setTimeout(nextRound, 1500);
    } else {
      setFeedback("incorrect");
      playErrorSound();
      setStreak(0);
      setTimeout(() => {
        setFeedback(null);
        nextRound();
      }, 2500);
    }
  }

  if (!target) return null;

  const correctValue = locale === "es"
    ? ESPANOL_NOMBRES[target.id] || target.name
    : target.name;

  return (
    <div className="game-container">
      <div className="hidden" />

      {/* Target Section */}
      <div className="relative group">
        <div
          className={cn(
            "game-card relative overflow-hidden",
            feedback === "correct"
              ? "border-emerald-500/50 bg-emerald-500/5"
              : feedback === "incorrect"
                ? "border-destructive/50 bg-destructive/5"
                : "",
          )}
        >
          <span className="text-[6rem] md:text-[10rem] font-bold text-primary leading-none select-none group-hover:scale-105 transition-transform duration-500">
            {target.char}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 md:mt-4 rounded-xl md:rounded-2xl gap-2 text-primary font-bold hover:bg-primary/10 px-4 py-2 md:px-6 md:py-4 text-sm md:text-base h-auto"
            onClick={() => speak(target.char)}
          >
            <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
            {t("listen")}
          </Button>

          {feedback && (
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-300",
                feedback === "correct" ? "bg-emerald-500/20" : "bg-destructive/20",
              )}
            >
              {feedback === "correct" ? (
                <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-in zoom-in duration-300" />
              ) : (
                <>
                  <XCircle className="w-20 h-20 text-destructive animate-in zoom-in duration-300" />
                  <div className="mt-4 text-center animate-in slide-in-from-bottom-2 duration-500">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{uiT("correct_answer")}</span>
                    <div className="text-xl font-bold text-emerald-500">{correctValue}</div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-4">
        {options.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleChoice(option.id)}
            variant="ghost"
            disabled={!!feedback}
            className={cn(
              "game-option transition-all duration-300",
              feedback === "correct" && option.id === target.id
                ? "game-option-correct"
                : feedback === "incorrect" && option.id === target.id
                  ? "border-emerald-500 bg-emerald-500/10 scale-105 shadow-md z-10"
                  : feedback === "incorrect" && option.id !== target.id
                    ? "opacity-30 grayscale"
                    : "",
            )}
          >
            {locale === "es"
              ? ESPANOL_NOMBRES[option.id] || option.name
              : option.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

const ESPANOL_NOMBRES: Record<string, string> = {
  alpha: "Alfa",
  beta: "Beta",
  gamma: "Gamma",
  delta: "Delta",
  epsilon: "Épsilon",
  zeta: "Zeta",
  eta: "Eta",
  theta: "Theta",
  iota: "Iota",
  kappa: "Kappa",
  lambda: "Lambda",
  mu: "Mi",
  nu: "Ni",
  xi: "Xi",
  omicron: "Ómicron",
  pi: "Pi",
  rho: "Rho",
  sigma: "Sigma",
  tau: "Tau",
  upsilon: "Ípsilon",
  phi: "Fi",
  chi: "Ji",
  psi: "Psi",
  omega: "Omega",
};
