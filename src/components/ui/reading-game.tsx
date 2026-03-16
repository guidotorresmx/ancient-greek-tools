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

import { useGame } from "@/components/game-provider";

export function ReadingGame() {
  const t = useTranslations("pages.lectura");
  const { setGameName, setInfo, setOnReset } = useGame();
  const [currentSentenceIdx, setCurrentSentenceIdx] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [activeWordIdx, setActiveWordIdx] = React.useState<number | null>(null);
  const sentences = React.useMemo(() => {
    const raw = t.raw("sentences") as any[];
    return raw.map((s: any) => ({
      ...s,
      translation: s.translation.normalize("NFC"),
      words: s.words.map((w: any) => ({
        ...w,
        greek: w.greek.normalize("NFC"),
        trans: w.trans.normalize("NFC"),
      })),
    }));
  }, [t]);

  React.useEffect(() => {
    setGameName(t("title") || "Reading");
    return () => setGameName("");
  }, [setGameName, t]);

  React.useEffect(() => {
    setInfo(`${currentSentenceIdx + 1} / ${sentences.length}`);
  }, [currentSentenceIdx, sentences.length, setInfo]);

  const handleReset = React.useCallback(() => {
    setCurrentSentenceIdx(0);
    setActiveWordIdx(null);
    setIsPlaying(false);
    window.speechSynthesis.cancel();
  }, []);

  React.useEffect(() => {
    setOnReset(() => handleReset);
    return () => setOnReset(undefined);
  }, [handleReset, setOnReset]);

  const sentence = sentences[currentSentenceIdx];

  const playSentence = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    for (let i = 0; i < sentence.words.length; i++) {
      setActiveWordIdx(i);

      // Speak the word
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(
          sentence.words[i].greek.normalize("NFC"),
        );
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

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.normalize("NFC"));
      utterance.lang = "el-GR";
      utterance.rate = 0.6;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-1000 font-sans">
      {/* Main Display */}
      <div className="game-card min-h-[260px] md:min-h-[340px]">
        <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-6 md:gap-y-8 mb-12">
          {sentence.words.map((word: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => speak(word.greek)}
            >
              <span
                className={cn(
                  "text-3xl md:text-6xl font-bold transition-all duration-300 select-none",
                  activeWordIdx === idx
                    ? "text-primary scale-110 md:scale-125 translate-y-[-5px] md:translate-y-[-10px]"
                    : "text-foreground group-hover:text-primary/70",
                )}
              >
                {word.greek}
              </span>
              <div
                className={cn(
                  "mt-1 md:mt-2 px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-medium transition-all duration-500",
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
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 px-4 md:px-8 text-center animate-in slide-in-from-bottom-4 duration-700">
          <p className="text-base md:text-lg italic text-foreground font-semibold">
            "{sentence.translation}"
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        <Button
          onClick={() => {
            setActiveWordIdx(null);
            setIsPlaying(false);
            window.speechSynthesis.cancel();
          }}
          variant="ghost"
          size="icon"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border"
        >
          <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
        </Button>

        <Button
          onClick={playSentence}
          disabled={isPlaying}
          size="lg"
          className="h-14 w-14 md:h-16 md:w-16 rounded-full shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all text-white"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
          )}
        </Button>

        <Button
          onClick={nextSentence}
          variant="ghost"
          size="lg"
          className="h-12 md:h-14 px-4 md:px-8 rounded-xl md:rounded-2xl font-bold border-2 border-primary/20 hover:border-primary/50 text-sm md:text-base"
        >
          {t("ui.next")}
        </Button>
      </div>
    </div>
  );
}
