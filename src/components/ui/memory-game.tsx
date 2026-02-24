"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Modal from "@/components/ui/modal";
import { Settings2, RotateCcw } from "lucide-react";

type CardKind = "name" | "upper" | "lower" | "pronunciation" | "transliteration";

type Card = {
  id: string;
  keyId: number;
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
  { name: "Zeta", upper: "Ζ", founders: "ζ", pronunciation: "zi-ta", transliteration: "z" },
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
];

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MemoryGame() {
  const t = useTranslations("memory");
  const [activeKinds, setActiveKinds] = React.useState<CardKind[]>(["name", "upper", "lower"]);
  
  function createList() {
    return GREEK_ALPHABET.flatMap((g, i) => 
      activeKinds.map(kind => ({
        id: `${i}-${kind}`,
        keyId: i,
        kind: kind,
        content: (g as any)[kind]
      } as Card))
    );
  }

  const [cards, setCards] = React.useState<Card[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [failures, setFailures] = React.useState(0);
  const [showSettings, setShowSettings] = React.useState(false);

  React.useEffect(() => {
    setCards(shuffle(createList()));
  }, [activeKinds]);

  const cardsRef = React.useRef<Card[]>(cards);
  React.useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  React.useEffect(() => {
    if (selected.length < activeKinds.length) return;
    
    const selectedCards = selected.map(id => cardsRef.current.find(c => c.id === id)).filter(Boolean) as Card[];
    if (selectedCards.length < activeKinds.length) return;

    const firstKey = selectedCards[0].keyId;
    const sameKey = selectedCards.every(c => c.keyId === firstKey);
    const allKinds = new Set(selectedCards.map(c => c.kind)).size === activeKinds.length;

    if (sameKey && allKinds) {
      setCards(prev => prev.map(card => card.keyId === firstKey ? { ...card, matched: true } : card));
      const t = setTimeout(() => setSelected([]), 300);
      return () => clearTimeout(t);
    } else {
      setFailures(f => f + 1);
      const t = setTimeout(() => setSelected([]), 800);
      return () => clearTimeout(t);
    }
  }, [selected, activeKinds.length]);

  function handleClick(card: Card) {
    if (card.matched) return;
    if (selected.includes(card.id)) {
      setSelected(s => s.filter(id => id !== card.id));
      return;
    }

    setSelected(s => {
      const idx = s.findIndex(id => cards.find(x => x.id === id)?.kind === card.kind);
      if (idx >= 0) {
        const copy = s.slice();
        copy[idx] = card.id;
        return copy;
      }
      return [...s, card.id];
    });
  }

  function reset() {
    setCards(shuffle(createList()));
    setSelected([]);
    setFailures(0);
  }

  const matchedCount = cards.filter(c => c.matched).length / activeKinds.length;

  return (
    <div className="space-y-8">
      {/* Stats & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass p-6 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Progress</span>
            <span className="text-xl font-bold">{matchedCount} / {GREEK_ALPHABET.length}</span>
          </div>
          <div className="h-8 w-[1px] bg-border/50" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Failures</span>
            <span className="text-xl font-bold text-destructive/80">{failures}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setShowSettings(true)} variant="ghost" size="icon" className="rounded-xl">
            <Settings2 className="w-5 h-5" />
          </Button>
          <Button onClick={reset} variant="secondary" className="rounded-xl font-bold gap-2">
            <RotateCcw className="w-4 h-4" />
            {t("restart")}
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className={cn(
        "grid gap-6",
        activeKinds.length <= 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2 md:grid-cols-5"
      )}>
        {activeKinds.map(kind => (
          <div key={kind} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                {t(`labels.${kind}`)}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {cards
                .filter(c => c.kind === kind)
                .map(card => {
                  const isSelected = selected.includes(card.id);
                  const isMatched = !!card.matched;
                  return (
                    <Button
                      key={card.id}
                      onClick={() => handleClick(card)}
                      disabled={isMatched}
                      className={cn(
                        "h-14 w-full rounded-2xl border-2 transition-all duration-300 font-bold text-lg shadow-sm glass",
                        isSelected ? "border-primary bg-primary/10 scale-105 shadow-lg z-10" : 
                        isMatched ? "opacity-20 grayscale scale-95 pointer-events-none border-transparent" : "hover:border-primary/50 hover:-translate-y-1"
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
        title="Game Settings"
      >
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Columns to match</label>
            <div className="grid grid-cols-1 gap-2">
              {(["name", "upper", "lower", "pronunciation", "transliteration"] as CardKind[]).map(kind => (
                <Button
                  key={kind}
                  variant={activeKinds.includes(kind) ? "default" : "ghost"}
                  onClick={() => {
                    if (activeKinds.includes(kind)) {
                      if (activeKinds.length > 2) setActiveKinds(s => s.filter(k => k !== kind));
                    } else {
                      setActiveKinds(s => [...s, kind]);
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
            Note: Selecting more columns makes the game significantly harder!
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default MemoryGame;
