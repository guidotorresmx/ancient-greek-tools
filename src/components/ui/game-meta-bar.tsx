"use client";

import * as React from "react";
import { useGame } from "@/components/game-provider";
import { Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GameMetaBar() {
  const { state, reset } = useGame();
  
  if (!state.gameName) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-2 mb-2 animate-in slide-in-from-top-4 duration-500 font-sans">
      <div className="hud-container !justify-between relative">
        {/* Left Area: Custom Actions (Config) */}
        <div className="flex items-center gap-2 z-10">
          {state.actions && (
            <div className="flex items-center gap-1.5 pr-2 md:pr-4">
              {state.actions}
            </div>
          )}
          
          <div className="hidden sm:flex flex-col border-l border-border/40 pl-3 md:pl-4">
            <span className="hud-label tracking-widest opacity-60">Status</span>
          </div>
        </div>

        {/* Center Area: Stats, Score & Info */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-8 min-w-0 px-2 box-border pointer-events-none sm:pointer-events-auto">
          {/* Stats Display */}
          {Object.entries(state.stats).map(([label, value]) => (
            <div key={label} className="hud-stat">
              <span className="hud-label">{label}</span>
              <span className="hud-value">{value}</span>
            </div>
          ))}

          <div className="hud-badge !h-8 md:!h-10">
            <div className="flex flex-col items-center">
              <span className="hud-label text-primary/60">Score</span>
              <span className="hud-value text-primary">{state.score}</span>
            </div>
            <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
          </div>

          {state.info && (
            <div className="hud-stat border-l border-border/40 pl-2 md:pl-4 hidden md:flex">
              <span className="hud-label">Info</span>
              <span className="hud-value !text-xs italic text-muted-foreground truncate max-w-[40px] md:max-w-[80px]">{state.info}</span>
            </div>
          )}
        </div>

        {/* Right Area: Main Controls */}
        <div className="flex items-center gap-1 z-10">
          {state.onReset && (
            <Button
              variant="ghost"
              size="icon"
              onClick={reset}
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
