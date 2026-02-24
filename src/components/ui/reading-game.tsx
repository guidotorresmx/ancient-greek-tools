"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Volume2, BookOpen } from "lucide-react";

type WordEntry = {
  greek: string;
  trans: string;
  duration: number; // mock duration for highlighting
};

type Sentence = {
  id: number;
  greek: WordEntry[];
  translation: string;
};

const SENTENCES: Sentence[] = [
  {
    id: 1,
    greek: [
      { greek: "Ἐν", trans: "In", duration: 400 },
      { greek: "ἀρχῇ", trans: "beginning", duration: 600 },
      { greek: "ἦν", trans: "was", duration: 400 },
      { greek: "ὁ", trans: "the", duration: 300 },
      { greek: "Λόγος", trans: "Word", duration: 700 },
    ],
    translation: "In the beginning was the Word.",
  },
  {
    id: 2,
    greek: [
      { greek: "Χαλεπὰ", trans: "Difficult", duration: 600 },
      { greek: "τὰ", trans: "the [things]", duration: 300 },
      { greek: "καλά", trans: "beautiful", duration: 600 },
    ],
    translation: "Fine things are difficult.",
  },
  {
    id: 3,
    greek: [
      { greek: "Γνῶθι", trans: "Know", duration: 600 },
      { greek: "σεαυτόν", trans: "yourself", duration: 700 },
    ],
    translation: "Know thyself.",
  },
];

import { useTranslations } from "next-intl";

export function ReadingGame() {
  const t = useTranslations("pages.lectura");
  const [currentSentenceIdx, setCurrentSentenceIdx] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [activeWordIdx, setActiveWordIdx] = React.useState<number | null>(null);

  // Get sentences from translations
  // Note: We access them as a raw object/array if next-intl supports it,
  // but usually it's better to type them or use a specific structure.
  // We'll use the JSON structure we just defined.
  const sentences = t.raw("sentences") as any[];
  const sentence = sentences[currentSentenceIdx];

  const playSentence = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    for (let i = 0; i < sentence.words.length; i++) {
      setActiveWordIdx(i);

      // Speak the word
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(sentence.words[i].greek);
        utterance.lang = "el-GR";
        utterance.rate = 0.6;
        window.speechSynthesis.speak(utterance);
      }

      await new Promise((resolve) =>
        setTimeout(resolve, sentence.words[i].duration + 200),
      );
    }

    setActiveWordIdx(null);
    setIsPlaying(false);
  };

  const nextSentence = () => {
    setCurrentSentenceIdx((prev) => (prev + 1) % sentences.length);
    setActiveWordIdx(null);
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12 py-8 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
          <BookOpen className="w-4 h-4" />
          {t("ui.header")}
        </div>
        <h2 className="text-2xl font-bold">{t("ui.subheader")}</h2>
      </div>

      {/* Main Display */}
      <div className="relative glass p-12 md:p-20 rounded-[3rem] border-2 border-primary/20 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-12">
          {sentence.words.map((word: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col items-center group cursor-default"
            >
              <span
                className={cn(
                  "text-5xl md:text-7xl font-bold transition-all duration-300 select-none",
                  activeWordIdx === idx
                    ? "text-primary scale-125 translate-y-[-10px]"
                    : "text-foreground group-hover:text-primary/70",
                )}
              >
                {word.greek}
              </span>
              <div
                className={cn(
                  "mt-4 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-500",
                  activeWordIdx === idx
                    ? "bg-primary text-primary-foreground opacity-100 translate-y-0"
                    : "bg-accent/80 text-foreground opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
                )}
              >
                {word.trans}
              </div>
            </div>
          ))}
        </div>

        {/* Full Translation */}
        <div className="absolute bottom-12 left-0 right-0 px-8 text-center animate-in slide-in-from-bottom-4 duration-700">
          <p className="text-xl italic text-foreground font-semibold">
            "{sentence.translation}"
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <Button
          onClick={() => {
            setActiveWordIdx(null);
            setIsPlaying(false);
            window.speechSynthesis.cancel();
          }}
          variant="ghost"
          size="icon"
          className="w-14 h-14 rounded-full border border-border"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        <Button
          onClick={playSentence}
          disabled={isPlaying}
          size="lg"
          className="h-20 w-20 rounded-full shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all text-white"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 fill-current" />
          )}
        </Button>

        <Button
          onClick={nextSentence}
          variant="ghost"
          size="lg"
          className="h-14 px-8 rounded-2xl font-bold border-2 border-primary/20 hover:border-primary/50"
        >
          {t("ui.next")}
        </Button>
      </div>

      <p className="text-center text-muted-foreground text-sm font-medium italic">
        {t("ui.tip")}
      </p>
    </div>
  );
}
