"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Modal from "@/components/ui/modal";
import { Settings2, RotateCcw } from "lucide-react";

type CardKind =
  | "name"
  | "upper"
  | "lower"
  | "pronunciation"
  | "transliteration";

type Card = {
  id: string;
  keyId: number;
  kind: CardKind;
  content: string;
  matched?: boolean;
};

const GREEK_ALPHABET = [
  {
    name: "Alpha",
    upper: "Α",
    lower: "α",
    pronunciation: "al-fa",
    transliteration: "a",
  },
  {
    name: "Beta",
    upper: "Β",
    lower: "β",
    pronunciation: "ve-ta",
    transliteration: "b",
  },
  {
    name: "Gamma",
    upper: "Γ",
    lower: "γ",
    pronunciation: "gha-ma",
    transliteration: "g",
  },
  {
    name: "Delta",
    upper: "Δ",
    lower: "δ",
    pronunciation: "thel-ta",
    transliteration: "d",
  },
  {
    name: "Epsilon",
    upper: "Ε",
    lower: "ε",
    pronunciation: "e-psi-lon",
    transliteration: "e",
  },
  {
    name: "Zeta",
    upper: "Ζ",
    lower: "ζ",
    pronunciation: "zi-ta",
    transliteration: "z",
  },
  {
    name: "Eta",
    upper: "Η",
    lower: "η",
    pronunciation: "i-ta",
    transliteration: "i",
  },
  {
    name: "Theta",
    upper: "Θ",
    lower: "θ",
    pronunciation: "thi-ta",
    transliteration: "th",
  },
  {
    name: "Iota",
    upper: "Ι",
    lower: "ι",
    pronunciation: "yo-ta",
    transliteration: "i",
  },
  {
    name: "Kappa",
    upper: "Κ",
    lower: "κ",
    pronunciation: "ka-pa",
    transliteration: "k",
  },
  {
    name: "Lambda",
    upper: "Λ",
    lower: "λ",
    pronunciation: "lam-tha",
    transliteration: "l",
  },
  {
    name: "Mu",
    upper: "Μ",
    lower: "μ",
    pronunciation: "mi",
    transliteration: "m",
  },
  {
    name: "Nu",
    upper: "Ν",
    lower: "ν",
    pronunciation: "ni",
    transliteration: "n",
  },
  {
    name: "Xi",
    upper: "Ξ",
    lower: "ξ",
    pronunciation: "ksi",
    transliteration: "x",
  },
  {
    name: "Omicron",
    upper: "Ο",
    lower: "ο",
    pronunciation: "o-mi-kron",
    transliteration: "o",
  },
  {
    name: "Pi",
    upper: "Π",
    lower: "π",
    pronunciation: "pi",
    transliteration: "p",
  },
  {
    name: "Rho",
    upper: "Ρ",
    lower: "ρ",
    pronunciation: "ro",
    transliteration: "r",
  },
  {
    name: "Sigma",
    upper: "Σ",
    lower: "σ",
    pronunciation: "sigh-ma",
    transliteration: "s",
  },
  {
    name: "Tau",
    upper: "Τ",
    lower: "τ",
    pronunciation: "taf",
    transliteration: "t",
  },
  {
    name: "Upsilon",
    upper: "Υ",
    lower: "υ",
    pronunciation: "e-ps",
    transliteration: "y",
  },
  {
    name: "Phi",
    upper: "Φ",
    lower: "φ",
    pronunciation: "fee",
    transliteration: "ph",
  },
  {
    name: "Chi",
    upper: "Χ",
    lower: "χ",
    pronunciation: "hee",
    transliteration: "ch",
  },
  {
    name: "Psi",
    upper: "Ψ",
    lower: "ψ",
    pronunciation: "psee",
    transliteration: "ps",
  },
  {
    name: "Omega",
    upper: "Ω",
    lower: "ω",
    pronunciation: "o-me-gha",
    transliteration: "o",
  },
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

import { useGame } from "@/components/game-provider";

export function MemoryGame() {
  const { setScore: setGlobalScore, setGameName, setStats, setOnReset, setActions } = useGame();
  const t = useTranslations("memory");
  const [activeKinds, setActiveKinds] = React.useState<CardKind[]>([
    "name",
    "upper",
    "lower",
  ]);

  const [cards, setCards] = React.useState<Card[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [failures, setFailures] = React.useState(0);
  const [showSettings, setShowSettings] = React.useState(false);

  function createList() {
    return GREEK_ALPHABET.flatMap((g, i) =>
      activeKinds.map(
        (kind) =>
          ({
            id: `${i}-${kind}`,
            keyId: i,
            kind: kind,
            content: (g as any)[kind],
          }) as Card,
      ),
    );
  }

  React.useEffect(() => {
    setGameName(t("title") || "Memory Game");
    return () => setGameName("");
  }, [setGameName, t]);

  const matchedCount =
    cards.filter((c) => c.matched).length / activeKinds.length;

  React.useEffect(() => {
    setGlobalScore(matchedCount);
    setStats({ [t("failures")]: failures });
  }, [matchedCount, failures, setGlobalScore, setStats, t]);

  const speak = React.useCallback(
    (text: string, kind: CardKind, keyId: number) => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.normalize("NFC"));

        // If it's a Greek character or pronunciation, use Greek voice
        if (kind === "upper" || kind === "lower" || kind === "pronunciation") {
          utterance.lang = "el-GR";
        } else {
          // For 'name' it could be English or Spanish depending on locale
          // but letter names are similar. Let's stick to el-GR for consistency if it sounds better,
          // or the browser default.
          utterance.lang = "el-GR";
        }

        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    },
    [],
  );

  React.useEffect(() => {
    setCards(shuffle(createList()));
  }, [activeKinds]);

  const cardsRef = React.useRef<Card[]>(cards);
  React.useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  React.useEffect(() => {
    if (selected.length < activeKinds.length) return;

    const selectedCards = selected
      .map((id) => cardsRef.current.find((c) => c.id === id))
      .filter(Boolean) as Card[];
    if (selectedCards.length < activeKinds.length) return;

    const firstKey = selectedCards[0].keyId;
    const sameKey = selectedCards.every((c) => c.keyId === firstKey);
    const allKinds =
      new Set(selectedCards.map((c) => c.kind)).size === activeKinds.length;

    if (sameKey && allKinds) {
      setCards((prev) =>
        prev.map((card) =>
          card.keyId === firstKey ? { ...card, matched: true } : card,
        ),
      );
      const t = setTimeout(() => setSelected([]), 300);
      return () => clearTimeout(t);
    } else {
      setFailures((f) => f + 1);
      const t = setTimeout(() => setSelected([]), 800);
      return () => clearTimeout(t);
    }
  }, [selected, activeKinds.length]);

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
  }

  function handleReset() {
    setCards(shuffle(createList()));
    setSelected([]);
    setFailures(0);
  }

  React.useEffect(() => {
    setOnReset(() => handleReset);
    return () => setOnReset(undefined);
  }, [setOnReset]);

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

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-5xl mx-auto">
      <div className="hidden" />

      {/* Grid */}
      <div
        className={cn(
          "grid gap-3 md:gap-4 font-sans",
          activeKinds.length === 1
            ? "grid-cols-1"
            : activeKinds.length === 2
              ? "grid-cols-2"
              : activeKinds.length === 3
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-2 md:grid-cols-5",
        )}
      >
        {activeKinds.map((kind) => (
          <div key={kind} className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between px-1 md:px-2">
              <span className="hud-label">
                {t(`labels.${kind}`)}
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
                      onClick={() => {
                        handleClick(card);
                      }}
                      disabled={isMatched}
                      className={cn(
                        "game-option h-10 md:h-14 text-sm md:text-lg rounded-lg md:rounded-xl",
                        isSelected
                          ? "border-primary bg-primary/10 scale-105 shadow-lg z-10"
                          : isMatched
                            ? "opacity-30 grayscale scale-95 pointer-events-none border-border/50 bg-background/50"
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
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {t("settings.columns")}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {(
                [
                  "name",
                  "upper",
                  "lower",
                  "pronunciation",
                  "transliteration",
                ] as CardKind[]
              ).map((kind) => (
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
          <p className="text-xs text-muted-foreground italic">
            {t("settings.difficult_note")}
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default MemoryGame;
