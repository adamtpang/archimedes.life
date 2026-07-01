"use client";

import * as React from "react";

import {
  bindingConstraint,
  COMPLETED_PLAYS_KEY,
  HISTORY_KEY,
  leverageIndex,
  SCORES_STORAGE_KEY,
  type LeverKey,
  type Scores,
  type Snapshot,
} from "@/lib/levers";

const DEFAULTS: Scores = { code: 50, media: 25, capital: 30, labor: 35 };

function clamp(value: unknown): number {
  const n = Math.round(Number(value));
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

interface LeverageValue {
  loaded: boolean;
  scores: Scores;
  setScore: (key: LeverKey, value: number) => void;
  setScores: (scores: Scores) => void;
  constraint: LeverKey;
  index: number;
  completedPlays: Set<string>;
  togglePlay: (id: string) => void;
  history: Snapshot[];
  logSnapshot: () => void;
  clearHistory: () => void;
}

const LeverageContext = React.createContext<LeverageValue | null>(null);

export function useLeverage(): LeverageValue {
  const ctx = React.useContext(LeverageContext);
  if (!ctx) throw new Error("useLeverage must be used within <LeverageProvider>");
  return ctx;
}

export function LeverageProvider({ children }: { children: React.ReactNode }) {
  const [scores, setScoresState] = React.useState<Scores>(DEFAULTS);
  const [completedPlays, setCompleted] = React.useState<Set<string>>(new Set());
  const [history, setHistory] = React.useState<Snapshot[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const rawScores = localStorage.getItem(SCORES_STORAGE_KEY);
      if (rawScores) {
        const p = JSON.parse(rawScores) as Partial<Scores>;
        setScoresState({
          code: clamp(p.code ?? DEFAULTS.code),
          media: clamp(p.media ?? DEFAULTS.media),
          capital: clamp(p.capital ?? DEFAULTS.capital),
          labor: clamp(p.labor ?? DEFAULTS.labor),
        });
      }
      const rawPlays = localStorage.getItem(COMPLETED_PLAYS_KEY);
      if (rawPlays) {
        const arr = JSON.parse(rawPlays) as unknown;
        if (Array.isArray(arr)) {
          setCompleted(new Set(arr.filter((x): x is string => typeof x === "string")));
        }
      }
      const rawHist = localStorage.getItem(HISTORY_KEY);
      if (rawHist) {
        const arr = JSON.parse(rawHist) as unknown;
        if (Array.isArray(arr)) setHistory(arr as Snapshot[]);
      }
    } catch {
      /* ignore malformed storage */
    }
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(scores));
    } catch {
      /* storage unavailable */
    }
  }, [scores, loaded]);

  React.useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        COMPLETED_PLAYS_KEY,
        JSON.stringify(Array.from(completedPlays))
      );
    } catch {
      /* storage unavailable */
    }
  }, [completedPlays, loaded]);

  React.useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      /* storage unavailable */
    }
  }, [history, loaded]);

  const setScore = React.useCallback((key: LeverKey, value: number) => {
    setScoresState((prev) => ({ ...prev, [key]: clamp(value) }));
  }, []);

  const setScores = React.useCallback((next: Scores) => {
    setScoresState({
      code: clamp(next.code),
      media: clamp(next.media),
      capital: clamp(next.capital),
      labor: clamp(next.labor),
    });
  }, []);

  const togglePlay = React.useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const logSnapshot = React.useCallback(() => {
    setHistory((prev) => {
      const snap: Snapshot = {
        t: Date.now(),
        scores: { ...scores },
        index: leverageIndex(scores),
      };
      const last = prev[prev.length - 1];
      const rows =
        last && startOfDay(last.t) === startOfDay(snap.t)
          ? [...prev.slice(0, -1), snap]
          : [...prev, snap];
      return rows.slice(-60);
    });
  }, [scores]);

  const clearHistory = React.useCallback(() => setHistory([]), []);

  const value: LeverageValue = {
    loaded,
    scores,
    setScore,
    setScores,
    constraint: bindingConstraint(scores),
    index: leverageIndex(scores),
    completedPlays,
    togglePlay,
    history,
    logSnapshot,
    clearHistory,
  };

  return (
    <LeverageContext.Provider value={value}>{children}</LeverageContext.Provider>
  );
}
