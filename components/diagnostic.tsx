"use client";

import * as React from "react";

import {
  bindingConstraint,
  LEVERS,
  LEVER_BY_KEY,
  leverageIndex,
  profile,
  type Lever,
  type Scores,
} from "@/lib/levers";
import { FulcrumGlyph } from "@/components/lever-mark";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "archimedes:scores:v1";
const DEFAULTS: Scores = { code: 50, media: 25, capital: 30, labor: 35 };
const SAMPLE: Scores = { code: 85, media: 5, capital: 10, labor: 5 };

function clamp(value: unknown): number {
  const n = Math.round(Number(value));
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export function Diagnostic() {
  const [scores, setScores] = React.useState<Scores>(DEFAULTS);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Scores>;
        setScores({
          code: clamp(parsed.code ?? DEFAULTS.code),
          media: clamp(parsed.media ?? DEFAULTS.media),
          capital: clamp(parsed.capital ?? DEFAULTS.capital),
          labor: clamp(parsed.labor ?? DEFAULTS.labor),
        });
      }
    } catch {
      /* ignore malformed storage */
    }
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch {
      /* storage unavailable */
    }
  }, [scores, loaded]);

  const constraint = bindingConstraint(scores);
  const constraintLever = LEVER_BY_KEY[constraint];
  const index = leverageIndex(scores);
  const prof = profile(scores);

  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-[1.1fr_1fr]">
      {/* ---- the sliders: your character sheet ---- */}
      <div className="flex flex-col gap-7 bg-background p-7 sm:p-9">
        <div className="flex items-center justify-between gap-4">
          <p className="label text-[0.62rem] text-muted-foreground">
            Rate each lever, 0 to 100
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setScores(SAMPLE)}
              className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground transition-colors hover:border-lever/50 hover:text-lever"
            >
              Sample
            </button>
            <button
              type="button"
              onClick={() => setScores(DEFAULTS)}
              className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground transition-colors hover:border-lever/50 hover:text-lever"
            >
              Reset
            </button>
          </div>
        </div>

        {LEVERS.map((lever) => (
          <LeverRow
            key={lever.key}
            lever={lever}
            value={scores[lever.key]}
            isConstraint={constraint === lever.key}
            onChange={(value) =>
              setScores((prev) => ({ ...prev, [lever.key]: value }))
            }
          />
        ))}
      </div>

      {/* ---- the readout: your diagnosis ---- */}
      <div className="flex flex-col gap-6 bg-background p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label text-[0.6rem] text-muted-foreground">Profile</p>
            <p className="mt-1 text-xl font-semibold tracking-tight">
              {prof.label}
            </p>
          </div>
          <div className="text-right">
            <p className="label text-[0.6rem] text-muted-foreground">Index</p>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-lever">
              {index}
              <span className="text-sm text-muted-foreground">/100</span>
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {prof.blurb}
        </p>

        <div className="h-px bg-border" />

        <div>
          <p className="label text-[0.6rem] text-muted-foreground">
            Binding constraint
          </p>
          <div className="mt-1.5 flex items-baseline gap-3">
            <span className="text-2xl font-semibold tracking-tight text-lever">
              {constraintLever.name}
            </span>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              attack this
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground">
            {constraintLever.constraintRx}
          </p>
        </div>

        <div>
          <p className="label mb-3 text-[0.6rem] text-muted-foreground">
            Your next moves
          </p>
          <ul className="space-y-2.5">
            {constraintLever.moves.map((move) => (
              <li key={move} className="flex gap-2.5 text-sm leading-relaxed">
                <FulcrumGlyph className="mt-[0.35rem] text-lever" />
                <span>{move}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-auto pt-2 text-xs leading-relaxed text-muted-foreground/70">
          Index is the geometric mean of all four levers. One dead lever drags
          the whole system down, so balance beats a single maxed stat.
        </p>
      </div>
    </div>
  );
}

function LeverRow({
  lever,
  value,
  isConstraint,
  onChange,
}: {
  lever: Lever;
  value: number;
  isConstraint: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-[0.7rem] text-muted-foreground">
            {lever.id}
          </span>
          <span
            className={cn(
              "text-base font-semibold tracking-tight",
              isConstraint && "text-lever"
            )}
          >
            {lever.name}
          </span>
          {isConstraint && (
            <span className="label rounded bg-lever/15 px-1.5 py-0.5 text-[0.55rem] text-lever">
              binding
            </span>
          )}
        </div>
        <span className="font-mono text-sm tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`${lever.name} leverage, 0 to 100`}
        aria-valuetext={`${value} of 100`}
        className="lever-range mt-3 w-full"
        style={{ "--pct": `${value}%` } as React.CSSProperties}
      />
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
        {lever.what}
      </p>
    </div>
  );
}
