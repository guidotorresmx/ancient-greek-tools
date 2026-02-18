"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Card = {
  id: string;
  keyId: number;
  kind: "name" | "upper" | "lower";
  content: string;
  revealed?: boolean;
  matched?: boolean;
};

const GREEK = [
  ["Alpha", "Α", "α"],
  ["Beta", "Β", "β"],
  ["Gamma", "Γ", "γ"],
  ["Delta", "Δ", "δ"],
  ["Epsilon", "Ε", "ε"],
  ["Zeta", "Ζ", "ζ"],
  ["Eta", "Η", "η"],
  ["Theta", "Θ", "θ"],
  ["Iota", "Ι", "ι"],
  ["Kappa", "Κ", "κ"],
  ["Lambda", "Λ", "λ"],
  ["Mu", "Μ", "μ"],
  ["Nu", "Ν", "ν"],
  ["Xi", "Ξ", "ξ"],
  ["Omicron", "Ο", "ο"],
  ["Pi", "Π", "π"],
  ["Rho", "Ρ", "ρ"],
  ["Sigma", "Σ", "σ"],
  ["Tau", "Τ", "τ"],
  ["Upsilon", "Υ", "υ"],
  ["Phi", "Φ", "φ"],
  ["Chi", "Χ", "χ"],
  ["Psi", "Ψ", "ψ"],
  ["Omega", "Ω", "ω"],
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
  const [cards, setCards] = React.useState<Card[]>(() => {
    const list: Card[] = [];
    GREEK.forEach((g, i) => {
      list.push({ id: `${i}-name`, keyId: i, kind: "name", content: g[0] });
      list.push({ id: `${i}-upper`, keyId: i, kind: "upper", content: g[1] });
      list.push({ id: `${i}-lower`, keyId: i, kind: "lower", content: g[2] });
    });
    return shuffle(list);
  });

  const [selected, setSelected] = React.useState<string[]>([]);
  const [score, setScore] = React.useState(0);

  const STATS_CLASS =
    "mb-4 flex items-center gap-4 text-sm text-muted-foreground";
  const GRID_CLASS = "grid grid-cols-3 sm:grid-cols-6 gap-3";
  const CARD_BASE =
    "h-24 w-full rounded-md p-2 flex items-center justify-center";
  const CARD_HOVER = "hover:shadow-md bg-white/80";
  const CARD_DISABLED = "opacity-50 pointer-events-none";
  const CARD_SELECTED = "ring-2 ring-primary animate-pop";

  function reset() {
    const list = GREEK.flatMap((g, i) => [
      { id: `${i}-name`, keyId: i, kind: "name", content: g[0] } as Card,
      { id: `${i}-upper`, keyId: i, kind: "upper", content: g[1] } as Card,
      { id: `${i}-lower`, keyId: i, kind: "lower", content: g[2] } as Card,
    ]);
    setCards(shuffle(list));
    setSelected([]);
    setScore(0);
  }

  React.useEffect(() => {
    if (selected.length < 3) return;
    const [aId, bId, cId] = selected;
    const a = cards.find((c) => c.id === aId);
    const b = cards.find((c) => c.id === bId);
    const c = cards.find((c) => c.id === cId);
    if (!a || !b || !c) return;

    const sameKey = a.keyId === b.keyId && b.keyId === c.keyId;
    const kinds = new Set([a.kind, b.kind, c.kind]);
    const hasAllKinds =
      kinds.has("name") && kinds.has("upper") && kinds.has("lower");

    if (sameKey && hasAllKinds) {
      setCards((prev) =>
        prev.map((card) =>
          card.keyId === a.keyId ? { ...card, matched: true } : card,
        ),
      );
      setScore((s) => s + 1);
      const t = setTimeout(() => setSelected([]), 300);
      return () => clearTimeout(t);
    } else {
      setScore((s) => s - 1);
      const t = setTimeout(() => setSelected([]), 800);
      return () => clearTimeout(t);
    }
  }, [selected, cards]);

  function handleClick(card: Card) {
    if (card.matched) return;
    if (selected.includes(card.id)) {
      setSelected((s) => s.filter((id) => id !== card.id));
      return;
    }
    if (selected.length === 3) return;
    setSelected((s) => [...s, card.id]);
  }

  const matchedCount = cards.filter((c) => c.matched).length / 3;

  return (
    <div>
      <div className={STATS_CLASS}>
        <div>
          Matches: {matchedCount} / {GREEK.length}
        </div>
        <div>Score: {score}</div>
        <Button onClick={reset} variant="default" size="sm">
          Restart
        </Button>
      </div>

      <div className={GRID_CLASS}>
        {cards.map((card) => {
          const isSelected = selected.includes(card.id);
          const isMatched = !!card.matched;
          return (
            <Button
              key={card.id}
              onClick={() => handleClick(card)}
              aria-pressed={isSelected}
              disabled={isMatched}
              variant="ghost"
              size="lg"
              className={cn(
                CARD_BASE,
                isMatched ? CARD_DISABLED : CARD_HOVER,
                isSelected ? CARD_SELECTED : "",
              )}
            >
              {card.kind === "name" ? (
                <span className="text-lg font-medium">{card.content}</span>
              ) : card.kind === "upper" ? (
                <span className="text-2xl">{card.content}</span>
              ) : (
                <span className="text-2xl text-lg">{card.content}</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default MemoryGame;
