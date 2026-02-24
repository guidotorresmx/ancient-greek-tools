"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Modal from "@/components/ui/modal";

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
  function createList() {
    return GREEK.flatMap((g, i) => [
      { id: `${i}-name`, keyId: i, kind: "name", content: g[0] } as Card,
      { id: `${i}-upper`, keyId: i, kind: "upper", content: g[1] } as Card,
      { id: `${i}-lower`, keyId: i, kind: "lower", content: g[2] } as Card,
    ]);
  }

  // use a deterministic initial order for server render, then shuffle on mount
  const [cards, setCards] = React.useState<Card[]>(createList);

  React.useEffect(() => {
    setCards((_) => shuffle(createList()));
  }, []);

  const [selected, setSelected] = React.useState<string[]>([]);
  const [failures, setFailures] = React.useState(0);
  const [showInstructionsModal, setShowInstructionsModal] =
    React.useState(false);

  React.useEffect(() => {
    function handler() {
      setShowInstructionsModal(true);
    }
    window.addEventListener("memory:open-instructions", handler);
    return () =>
      window.removeEventListener("memory:open-instructions", handler);
  }, []);

  const t = useTranslations("memory");

  const STATS_CLASS =
    "mb-8 flex items-center gap-4 text-sm font-medium glass p-4 rounded-2xl shadow-sm";
  const CARD_BASE =
    "relative rounded-2xl p-2 flex items-center justify-center text-sm border-2 transition-all duration-300";
  const CARD_DIM = "h-14 w-full sm:w-32";
  const CARD_HOVER =
    "hover:shadow-xl hover:-translate-y-1 glass group hover:border-primary/50";
  const CARD_DISABLED = "opacity-40 pointer-events-none grayscale scale-95";
  const CARD_SELECTED = "ring-4 ring-primary/30 border-primary scale-105 shadow-xl z-10";
  const KIND_STYLES: Record<string, string> = {
    name: "bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20",
    upper: "bg-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20",
    lower: "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  };

  const ABBR: Record<string, string> = {
    name: "N",
    upper: "A",
    lower: "a",
  };

  const BADGE_CLASS: Record<string, string> = {
    name: "bg-blue-600 text-white",
    upper: "bg-amber-500 text-black",
    lower: "bg-emerald-600 text-white",
  };

  function reset() {
    const list = GREEK.flatMap((g, i) => [
      { id: `${i}-name`, keyId: i, kind: "name", content: g[0] } as Card,
      { id: `${i}-upper`, keyId: i, kind: "upper", content: g[1] } as Card,
      { id: `${i}-lower`, keyId: i, kind: "lower", content: g[2] } as Card,
    ]);
    setCards(shuffle(list));
    setSelected([]);
    setFailures(0);
  }

  React.useEffect(() => {
    // (handled below) placeholder
  }, [selected, cards]);

  // Avoid re-running the matching logic when `cards` changes (it causes a loop).
  // Use a ref to always read the latest cards inside an effect that only depends on `selected`.
  const cardsRef = React.useRef<Card[]>(cards);
  React.useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  React.useEffect(() => {
    if (selected.length < 3) return;
    const [aId, bId, cId] = selected;
    const a = cardsRef.current.find((c) => c.id === aId);
    const b = cardsRef.current.find((c) => c.id === bId);
    const c = cardsRef.current.find((c) => c.id === cId);
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
      const t = setTimeout(() => setSelected([]), 300);
      return () => clearTimeout(t);
    } else {
      setFailures((f) => f + 1);
      const t = setTimeout(() => setSelected([]), 800);
      return () => clearTimeout(t);
    }
  }, [selected]);

  function handleClick(card: Card) {
    if (card.matched) return;
    if (selected.includes(card.id)) {
      setSelected((s) => s.filter((id) => id !== card.id));
      return;
    }

    setSelected((s) => {
      // replace existing selection from same kind (column) if present
      const idx = s.findIndex((id) => {
        const c = cards.find((x) => x.id === id);
        return c?.kind === card.kind;
      });
      if (idx >= 0) {
        const copy = s.slice();
        copy[idx] = card.id;
        return copy;
      }
      return [...s, card.id];
    });
  }

  const matchedCount = cards.filter((c) => c.matched).length / 3;

  return (
    <div>
      <div className={`${STATS_CLASS} flex-col gap-2`}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-medium">
              {t("matches", { matched: matchedCount, total: GREEK.length })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-medium">{t("failures", { failures })}</div>
            <Button onClick={reset} variant="default" size="sm">
              {t("restart")}
            </Button>
          </div>
        </div>

        {/* instructions are shown in a modal triggered from the navbar */}
        {/* Modal rendered below */}
      </div>

      <Modal
        open={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        title={"How to play"}
      >
        <p>{t("instructions")}</p>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Column: Names */}
        <div>
          <div className="mb-2 text-sm font-medium">{t("labels.name")}</div>
          <div className="flex flex-wrap gap-2">
            {cards
              .filter((c) => c.kind === "name")
              .map((card) => {
                const isSelected = selected.includes(card.id);
                const isMatched = !!card.matched;
                return (
                  <Button
                    key={card.id}
                    onClick={() => handleClick(card)}
                    aria-pressed={isSelected}
                    disabled={isMatched}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      CARD_BASE,
                      CARD_DIM,
                      KIND_STYLES[card.kind],
                      isMatched ? CARD_DISABLED : CARD_HOVER,
                      isSelected ? CARD_SELECTED : "",
                    )}
                  >
                    <span className="text-sm font-medium">{card.content}</span>
                  </Button>
                );
              })}
          </div>
        </div>

        {/* Column: Upper */}
        <div>
          <div className="mb-2 text-sm font-medium">{t("labels.upper")}</div>
          <div className="flex flex-wrap gap-2">
            {cards
              .filter((c) => c.kind === "upper")
              .map((card) => {
                const isSelected = selected.includes(card.id);
                const isMatched = !!card.matched;
                return (
                  <Button
                    key={card.id}
                    onClick={() => handleClick(card)}
                    aria-pressed={isSelected}
                    disabled={isMatched}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      CARD_BASE,
                      CARD_DIM,
                      KIND_STYLES[card.kind],
                      isMatched ? CARD_DISABLED : CARD_HOVER,
                      isSelected ? CARD_SELECTED : "",
                    )}
                  >
                    <span className="text-lg">{card.content}</span>
                  </Button>
                );
              })}
          </div>
        </div>

        {/* Column: Lower */}
        <div>
          <div className="mb-2 text-sm font-medium">{t("labels.lower")}</div>
          <div className="flex flex-wrap gap-2">
            {cards
              .filter((c) => c.kind === "lower")
              .map((card) => {
                const isSelected = selected.includes(card.id);
                const isMatched = !!card.matched;
                return (
                  <Button
                    key={card.id}
                    onClick={() => handleClick(card)}
                    aria-pressed={isSelected}
                    disabled={isMatched}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      CARD_BASE,
                      CARD_DIM,
                      KIND_STYLES[card.kind],
                      isMatched ? CARD_DISABLED : CARD_HOVER,
                      isSelected ? CARD_SELECTED : "",
                    )}
                  >
                    <span className="text-lg">{card.content}</span>
                  </Button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoryGame;
