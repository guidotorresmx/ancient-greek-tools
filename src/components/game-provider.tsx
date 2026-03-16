"use client";

import * as React from "react";

interface GameState {
  score: number;
  info: string;
  gameName: string;
  instructions: string;
  actions: React.ReactNode | null;
  stats: Record<string, string | number>;
  onReset?: () => void;
}

interface GameContextType {
  state: GameState;
  setScore: (score: number) => void;
  setInfo: (info: string) => void;
  setGameName: (name: string) => void;
  setInstructions: (text: string) => void;
  setActions: (actions: React.ReactNode | null) => void;
  setStats: (stats: Record<string, string | number>) => void;
  setOnReset: (fn: (() => void) | undefined) => void;
  reset: () => void;
}

const GameContext = React.createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<GameState>({
    score: 0,
    info: "",
    gameName: "",
    instructions: "",
    actions: null,
    stats: {},
  });

  const setScore = React.useCallback((score: number) => {
    setState((prev) => ({ ...prev, score }));
  }, []);

  const setInfo = React.useCallback((info: string) => {
    setState((prev) => ({ ...prev, info }));
  }, []);

  const setGameName = React.useCallback((gameName: string) => {
    setState((prev) => ({ ...prev, gameName }));
  }, []);

  const setInstructions = React.useCallback((instructions: string) => {
    setState((prev) => ({ ...prev, instructions }));
  }, []);

  const setActions = React.useCallback((actions: React.ReactNode | null) => {
    setState((prev) => ({ ...prev, actions }));
  }, []);

  const setStats = React.useCallback((stats: Record<string, string | number>) => {
    setState((prev) => ({ ...prev, stats }));
  }, []);

  const setOnReset = React.useCallback((onReset: (() => void) | undefined) => {
    setState((prev) => ({ ...prev, onReset }));
  }, []);

  const reset = React.useCallback(() => {
    if (state.onReset) {
      state.onReset();
    }
    setState({
      score: 0,
      info: "",
      gameName: "",
      instructions: "",
      actions: null,
      stats: {},
      onReset: undefined,
    });
  }, [state.onReset]);

  return (
    <GameContext.Provider
      value={{
        state,
        setScore,
        setInfo,
        setGameName,
        setInstructions,
        setActions,
        setStats,
        setOnReset,
        reset,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = React.useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
