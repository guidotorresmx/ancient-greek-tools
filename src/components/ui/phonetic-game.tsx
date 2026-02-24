"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Volume2, RotateCcw, Sparkles } from "lucide-react";
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
  { id: "rho", char: "rho", name: "ρ" },
  { id: "sigma", char: "σ", name: "Sigma" },
  { id: "tau", char: "τ", name: "Tau" },
  { id: "upsilon", char: "υ", name: "Upsilon" },
  { id: "phi", char: "φ", name: "Phi" },
  { id: "chi", char: "χ", name: "Chi" },
  { id: "psi", char: "ψ", name: "Psi" },
  { id: "omega", char: "ω", name: "Omega" },
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

export function PhoneticGame() {
  const { locale } = useLanguage();
  const t = useTranslations("phonetic");
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

  React.useEffect(() => {
    nextRound();
  }, [nextRound]);

  function speak(char: string) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(char);
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
      speak(target.char);
      setTimeout(nextRound, 1500);
    } else {
      setFeedback("incorrect");
      setStreak(0);
      setTimeout(() => setFeedback(null), 1000);
    }
  }

  if (!target) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* HUD */}
      <div className="flex items-center justify-between glass p-4 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              {t("score")}
            </span>
            <span className="text-2xl font-bold text-primary">{score}</span>
          </div>
          <div className="h-8 w-[1px] bg-border/50" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              {t("streak")}
            </span>
            <span className="text-2xl font-bold flex items-center gap-1">
              {streak}{" "}
              {streak > 4 && <Sparkles className="w-4 h-4 text-amber-500" />}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setScore(0);
              setStreak(0);
              nextRound();
            }}
            variant="ghost"
            size="icon"
            className="rounded-xl"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Target Section */}
      <div className="relative group">
        <div
          className={cn(
            "glass p-16 rounded-[3rem] flex flex-col items-center justify-center transition-all duration-500 border-2",
            feedback === "correct"
              ? "border-emerald-500/50 bg-emerald-500/5"
              : feedback === "incorrect"
                ? "border-destructive/50 bg-destructive/5 animate-bounce"
                : "border-primary/20",
          )}
        >
          <span className="text-[12rem] font-bold text-primary leading-none select-none group-hover:scale-110 transition-transform duration-500">
            {target.char}
          </span>
          <Button
            variant="ghost"
            size="lg"
            className="mt-8 rounded-2xl gap-2 text-primary font-bold hover:bg-primary/10 px-8 py-6 text-lg"
            onClick={() => speak(target.char)}
          >
            <Volume2 className="w-6 h-6" />
            {t("listen")}
          </Button>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleChoice(option.id)}
            variant="ghost"
            disabled={feedback === "correct"}
            className={cn(
              "h-24 glass rounded-[2rem] text-2xl font-bold border-2 transition-all duration-300 text-foreground",
              feedback === "correct" && option.id === target.id
                ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : feedback === "incorrect" && option.id !== target.id
                  ? "opacity-50"
                  : "hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1",
            )}
          >
            {locale === "es"
              ? ESPANOL_NOMBRES[option.id] || option.name
              : option.name}
          </Button>
        ))}
      </div>

      <p className="text-center text-muted-foreground text-sm font-medium">
        {t("instruction")}
      </p>
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
