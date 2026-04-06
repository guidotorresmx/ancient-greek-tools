"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Modal from "@/components/ui/modal";
import { Settings2, RotateCcw, Save, Trash2 } from "lucide-react";
import { VOCAB_DATA, Word } from "@/lib/vocab-data";
import { useGame } from "@/components/game-provider";
import { useLanguage } from "@/components/language-provider";
import { playSuccessSound } from "@/lib/audio";

type CardKind =
  | "greek"
  | "translation"
  | "name"
  | "upper"
  | "lower"
  | "pronunciation"
  | "transliteration";

type Card = {
  id: string;
  keyId: string | number;
  kind: CardKind;
  content: string;
  matched?: boolean;
};

const GREEK_ALPHABET = [
  { name: "Alpha", upper: "Α", lower: "α", pronunciation: "al-fa", transliteration: "a" },
  { name: "Beta", upper: "Β", lower: "β", pronunciation: "ve-ta", transliteration: "b" },
  { name: "Gamma", upper: "Γ", lower: "γ", pronunciation: "gha-ma", transliteration: "g" },
  { name: "Delta", upper: "Δ", lower: "δ", pronunciation: "thel-ta", transliteration: "d" },
  { name: "Epsilon", upper: "Ε", lower: "ε", pronunciation: "e-psi-lon", transliteration: "e" },
  { name: "Zeta", upper: "Ζ", lower: "ζ", pronunciation: "zi-ta", transliteration: "z" },
  { name: "Eta", upper: "Η", lower: "η", pronunciation: "i-ta", transliteration: "i" },
  { name: "Theta", upper: "Θ", lower: "θ", pronunciation: "thi-ta", transliteration: "th" },
  { name: "Iota", upper: "Ι", lower: "ι", pronunciation: "yo-ta", transliteration: "i" },
  { name: "Kappa", upper: "Κ", lower: "κ", pronunciation: "ka-pa", transliteration: "k" },
  { name: "Lambda", upper: "Λ", lower: "λ", pronunciation: "lam-tha", transliteration: "l" },
  { name: "Mu", upper: "Μ", lower: "μ", pronunciation: "mi", transliteration: "m" },
  { name: "Nu", upper: "Ν", lower: "ν", pronunciation: "ni", transliteration: "n" },
  { name: "Xi", upper: "Ξ", lower: "ξ", pronunciation: "ksi", transliteration: "x" },
  { name: "Omicron", upper: "Ο", lower: "ο", pronunciation: "o-mi-kron", transliteration: "o" },
  { name: "Pi", upper: "Π", lower: "π", pronunciation: "pi", transliteration: "p" },
  { name: "Rho", upper: "Ρ", lower: "ρ", pronunciation: "ro", transliteration: "r" },
  { name: "Sigma", upper: "Σ", lower: "σ", pronunciation: "sigh-ma", transliteration: "s" },
  { name: "Tau", upper: "Τ", lower: "τ", pronunciation: "taf", transliteration: "t" },
  { name: "Upsilon", upper: "Υ", lower: "υ", pronunciation: "e-ps", transliteration: "y" },
  { name: "Phi", upper: "Φ", lower: "φ", pronunciation: "fee", transliteration: "ph" },
  { name: "Chi", upper: "Χ", lower: "χ", pronunciation: "hee", transliteration: "ch" },
  { name: "Psi", upper: "Ψ", lower: "ψ", pronunciation: "psee", transliteration: "ps" },
  { name: "Omega", upper: "Ω", lower: "ω", pronunciation: "o-me-gha", transliteration: "o" },
].map((g) => ({
  name: g.name.normalize("NFC"),
  upper: g.upper.normalize("NFC"),
  lower: g.lower.normalize("NFC"),
  pronunciation: g.pronunciation.normalize("NFC"),
  transliteration: g.transliteration.normalize("NFC"),
}));

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Mode = "alphabet" | "vocab" | "custom";
type VocabRange = 100 | 200 | 500;

export function MemoryGame() {
  const { locale } = useLanguage();
  const { setScore: setGlobalScore, setGameName, setStats, setOnReset, setActions } = useGame();
  const t = useTranslations("memory");

  const [mode, setMode] = React.useState<Mode>("vocab");
  const [vocabRange, setVocabRange] = React.useState<VocabRange>(100);
  const [customInput, setCustomInput] = React.useState("");
  const [activeKinds, setActiveKinds] = React.useState<CardKind[]>(["greek", "translation"]);
  
  const [cards, setCards] = React.useState<Card[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [failures, setFailures] = React.useState(0);
  const [showSettings, setShowSettings] = React.useState(false);
  const [wordStats, setWordStats] = React.useState<Record<string, { c: number; i: number }>>({});

  // Loading word stats from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("ancient-greek-memory-stats");
    if (saved) {
      try {
        setWordStats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse word stats", e);
      }
    }
  }, []);

  const saveStats = (newStats: Record<string, { c: number; i: number }>) => {
    setWordStats(newStats);
    localStorage.setItem("ancient-greek-memory-stats", JSON.stringify(newStats));
  };

  const getWeightedWords = React.useCallback((pool: Word[], count: number) => {
    if (pool.length === 0) return [];
    
    // Calculate weights
    const weightedPool = pool.map(w => {
      const stats = wordStats[w.greek] || { c: 0, i: 0 };
      // Weight formula: (1 + incorrect) / (1 + correct)
      // Higher weight = more likely to appear
      const weight = (1 + stats.i) / (1 + stats.c);
      return { word: w, weight };
    });

    const result: Word[] = [];
    const poolCopy = [...weightedPool];

    for (let i = 0; i < count && poolCopy.length > 0; i++) {
      const totalWeight = poolCopy.reduce((sum, item) => sum + item.weight, 0);
      let r = Math.random() * totalWeight;
      
      for (let j = 0; j < poolCopy.length; j++) {
        r -= poolCopy[j].weight;
        if (r <= 0) {
          result.push(poolCopy[j].word);
          poolCopy.splice(j, 1);
          break;
        }
      }
    }
    return result;
  }, [wordStats]);

  function createList() {
    if (mode === "alphabet") {
      // Alphabet logic (limited to some letters for manageable game size)
      const alphabetPool = shuffle(GREEK_ALPHABET).slice(0, 8);
      return alphabetPool.flatMap((g, i) =>
        activeKinds.filter(k => ["name", "upper", "lower", "pronunciation", "transliteration"].includes(k)).map(
          (kind) =>
            ({
              id: `${i}-${kind}`,
              keyId: i,
              kind: kind,
              content: (g as any)[kind],
            }) as Card,
        ),
      );
    } else if (mode === "vocab") {
      const pool = VOCAB_DATA.slice(0, vocabRange);
      const selectedWords = getWeightedWords(pool, 8);
      return selectedWords.flatMap((w) => [
        {
          id: `${w.greek}-greek`,
          keyId: w.greek,
          kind: "greek",
          content: w.greek,
        } as Card,
        {
          id: `${w.greek}-translation`,
          keyId: w.greek,
          kind: "translation",
          content: locale === "es" ? w.es : w.en,
        } as Card,
      ]);
    } else {
      // Custom mode
      const lines = customInput.split("\n").map(l => l.trim()).filter(l => l.includes("="));
      const customPool = lines.map(line => {
        const [greek, trans] = line.split("=").map(s => s.trim());
        return { greek, trans };
      }).slice(0, 8);
      
      return customPool.flatMap((w) => [
        {
          id: `${w.greek}-greek`,
          keyId: w.greek,
          kind: "greek",
          content: w.greek,
        } as Card,
        {
          id: `${w.greek}-translation`,
          keyId: w.greek,
          kind: "translation",
          content: w.trans,
        } as Card,
      ]);
    }
  }

  React.useEffect(() => {
    setGameName(t("title") || "Memory Game");
    return () => setGameName("");
  }, [setGameName, t]);

  const matchedCount = cards.filter((c) => c.matched).length / (mode === "alphabet" ? activeKinds.length : 2);

  React.useEffect(() => {
    setGlobalScore(matchedCount);
    setStats({ [t("failures")]: failures });
  }, [matchedCount, failures, setGlobalScore, setStats, t]);

  const speak = React.useCallback(
    (text: string, kind: CardKind) => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.normalize("NFC"));
        if (kind === "greek" || kind === "upper" || kind === "lower" || kind === "pronunciation") {
          utterance.lang = "el-GR";
        } else {
          utterance.lang = locale === "es" ? "es-ES" : "en-US";
        }
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    },
    [locale],
  );

  React.useEffect(() => {
    setCards(shuffle(createList()));
  }, [mode, vocabRange, activeKinds]);

  const cardsRef = React.useRef<Card[]>(cards);
  React.useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  React.useEffect(() => {
    const requiredMatches = mode === "alphabet" ? activeKinds.length : 2;
    if (selected.length < requiredMatches) return;

    const selectedCards = selected
      .map((id) => cardsRef.current.find((c) => c.id === id))
      .filter(Boolean) as Card[];
    if (selectedCards.length < requiredMatches) return;

    const firstKey = selectedCards[0].keyId;
    const sameKey = selectedCards.every((c) => c.keyId === firstKey);
    const allKinds = new Set(selectedCards.map((c) => c.kind)).size === requiredMatches;

    if (sameKey && allKinds) {
      playSuccessSound();
      setCards((prev) =>
        prev.map((card) =>
          card.keyId === firstKey ? { ...card, matched: true } : card,
        ),
      );
      
      // Update stats for correct match
      if (mode === "vocab") {
        const key = String(firstKey);
        const newStats = { ...wordStats };
        if (!newStats[key]) newStats[key] = { c: 0, i: 0 };
        newStats[key].c += 1;
        saveStats(newStats);
      }
      
      const t = setTimeout(() => setSelected([]), 300);
      return () => clearTimeout(t);
    } else {
      setFailures((f) => f + 1);
      
      // Update stats for incorrect match
      if (mode === "vocab") {
        selectedCards.forEach(c => {
          const key = String(c.keyId);
          const newStats = { ...wordStats };
          if (!newStats[key]) newStats[key] = { c: 0, i: 0 };
          newStats[key].i += 1;
          saveStats(newStats);
        });
      }
      
      const t = setTimeout(() => setSelected([]), 800);
      return () => clearTimeout(t);
    }
  }, [selected, mode, activeKinds.length]);

  function handleClick(card: Card) {
    if (card.matched) return;
    if (selected.includes(card.id)) {
      setSelected((s) => s.filter((id) => id !== card.id));
      return;
    }

    setSelected((s) => {
      const idx = s.findIndex(
        (id) => cards.find((x) => x.id === id)?.kind === card.kind,
      );
      if (idx >= 0) {
        const copy = s.slice();
        copy[idx] = card.id;
        return copy;
      }
      return [...s, card.id];
    });
    
    speak(card.content, card.kind);
  }

  function handleReset() {
    setCards(shuffle(createList()));
    setSelected([]);
    setFailures(0);
  }

  React.useEffect(() => {
    setOnReset(() => handleReset);
    return () => setOnReset(undefined);
  }, [setOnReset, mode, vocabRange, customInput]);

  React.useEffect(() => {
    setActions(
      <Button
        onClick={() => setShowSettings(true)}
        variant="ghost"
        size="sm"
        className="h-8 rounded-lg gap-2 font-bold px-2 md:px-3 text-[10px] md:text-xs"
      >
        <Settings2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
        <span className="hidden sm:inline">{t("settings.title")}</span>
      </Button>
    );
    return () => setActions(null);
  }, [setActions, t]);

  const uniqueKinds = Array.from(new Set(cards.map(c => c.kind)));

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-5xl mx-auto">
      <div className="hidden" />

      {/* Grid */}
      <div
        className={cn(
          "grid gap-3 md:gap-4 font-sans",
          uniqueKinds.length === 1
            ? "grid-cols-1"
            : uniqueKinds.length === 2
              ? "grid-cols-2"
              : uniqueKinds.length === 3
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-2 md:grid-cols-5",
        )}
      >
        {uniqueKinds.map((kind) => (
          <div key={kind} className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between px-1 md:px-2">
              <span className="hud-label">
                {t(`labels.${kind}`) || kind}
              </span>
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              {cards
                .filter((c) => c.kind === kind)
                .map((card) => {
                  const isSelected = selected.includes(card.id);
                  const isMatched = !!card.matched;
                  return (
                    <Button
                      key={card.id}
                      onClick={() => handleClick(card)}
                      disabled={isMatched}
                      className={cn(
                        "game-option h-10 md:h-14 text-sm md:text-lg rounded-lg md:rounded-xl",
                        isSelected
                          ? "border-primary bg-primary/10 scale-105 shadow-lg z-10"
                          : isMatched
                            ? "opacity-0 scale-90 pointer-events-none transition-all duration-500"
                            : "",
                      )}
                    >
                      {card.content}
                    </Button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        title={t("settings.title")}
      >
        <div className="space-y-6 py-4">
          {/* Game Mode */}
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Game Mode
            </label>
            <div className="flex flex-wrap gap-2">
              {(["vocab", "alphabet", "custom"] as Mode[]).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? "default" : "outline"}
                  onClick={() => setMode(m)}
                  className="rounded-xl font-bold capitalize"
                >
                  {m}
                </Button>
               ))}
            </div>
          </div>

          {mode === "vocab" && (
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Vocabulary Range
              </label>
              <div className="flex gap-2">
                {([100, 200, 500] as VocabRange[]).map((r) => (
                  <Button
                    key={r}
                    variant={vocabRange === r ? "default" : "outline"}
                    onClick={() => setVocabRange(r)}
                    className="rounded-xl font-bold flex-1"
                  >
                    Top {r}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                Performance weighting is active. Words you miss will appear more frequently.
              </p>
            </div>
          )}

          {mode === "alphabet" && (
             <div className="space-y-4">
               <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                 {t("settings.columns")}
               </label>
               <div className="grid grid-cols-1 gap-2">
                 {(["name", "upper", "lower", "pronunciation", "transliteration"] as CardKind[]).map((kind) => (
                   <Button
                     key={kind}
                     variant={activeKinds.includes(kind) ? "default" : "ghost"}
                     onClick={() => {
                       if (activeKinds.includes(kind)) {
                         if (activeKinds.length > 1)
                           setActiveKinds((s) => s.filter((k) => k !== kind));
                       } else {
                         setActiveKinds((s) => [...s, kind]);
                       }
                     }}
                     className="justify-start rounded-xl font-bold"
                   >
                     {t(`labels.${kind}`)}
                   </Button>
                 ))}
               </div>
             </div>
          )}

          {mode === "custom" && (
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Custom Words
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="λóγος = word&#10;θεός = god&#10;ἀνήρ = man"
                className="w-full h-32 p-3 text-sm font-mono bg-background border rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
              <p className="text-[10px] text-muted-foreground">
                Enter one word per line: Greek = Translation.
              </p>
            </div>
          )}
          
          <Button 
            className="w-full rounded-xl font-bold h-12 mt-4" 
            onClick={() => setShowSettings(false)}
          >
            Start Game
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default MemoryGame;
