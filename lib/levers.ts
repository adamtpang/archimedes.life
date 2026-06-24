export type LeverKey = "code" | "media" | "capital" | "labor";

export interface Lever {
  key: LeverKey;
  id: string;
  name: string;
  /** What the lever is, in one line. */
  what: string;
  /** Under-leveraged when... */
  symptom: string;
  /** Cured by... */
  cure: string;
  /** The strategic read when this lever is the binding constraint. */
  constraintRx: string;
  /** Concrete next actions, most actionable first. */
  moves: string[];
}

export const LEVERS: Lever[] = [
  {
    key: "code",
    id: "01",
    name: "Code",
    what: "Output that runs without you. AI fluency folds in here.",
    symptom:
      "You still do by hand what a script would do ten thousand times, for free, while you sleep.",
    cure: "Software that keeps working the day you stop showing up.",
    constraintRx:
      "You are leaving the cheapest leverage on the table. One built tool can replace a thousand manual hours. Make code the next thing you ship.",
    moves: [
      "Ship one automation that does a recurring task without you.",
      "Turn your most-repeated workflow into a tool other people can run.",
      "Use AI to build in a weekend what used to take a quarter.",
    ],
  },
  {
    key: "media",
    id: "02",
    name: "Media",
    what: "Content that keeps being consumed after you publish.",
    symptom: "Your best thinking reaches the same room it reached last year.",
    cure: "Publish once, be heard at the scale of the whole internet.",
    constraintRx:
      "Nothing compounds until people can find you. Media gates your brand, your distribution, and every warm inbound. Put your output in public.",
    moves: [
      "Publish in public on a schedule you can actually keep.",
      "Start the owned email list. It is media infrastructure you control.",
      "Ship the thing you have been gating and move media off zero.",
    ],
  },
  {
    key: "capital",
    id: "03",
    name: "Capital",
    what: "Money that buys output. Equity, MRR, investment.",
    symptom: "Every dollar dies the moment you stop trading hours to earn it.",
    cure: "Money that compounds while you sleep, not only while you work.",
    constraintRx:
      "You are converting effort into cash and stopping there. Route some of it into ownership so money starts buying output for you.",
    moves: [
      "Trade for equity or ownership, not only for hours.",
      "Stand up one source of recurring revenue.",
      "Put earnings to work so they buy output on your behalf.",
    ],
  },
  {
    key: "labor",
    id: "04",
    name: "Labor",
    what: "Other people's effort. The oldest, weakest, least scalable lever.",
    symptom: "You are the bottleneck on every task only you know how to do.",
    cure: "A team that turns one pair of hands into many.",
    constraintRx:
      "You are the entire org chart. Hand off the work only you do so your own hours stop being the ceiling.",
    moves: [
      "Delegate the task that only you currently do.",
      "Document one process so someone else can run it.",
      "Hire or partner for the lever you are weakest in.",
    ],
  },
];

export const LEVER_BY_KEY: Record<LeverKey, Lever> = LEVERS.reduce(
  (acc, lever) => {
    acc[lever.key] = lever;
    return acc;
  },
  {} as Record<LeverKey, Lever>
);

export type Scores = Record<LeverKey, number>;

// Tie-break priority when levers are equally low: media unlocks the most
// (brand, distribution, inbound); labor the least. So among equal-lowest
// levers, attack the one nearer the front of this list first.
const PRIORITY: LeverKey[] = ["media", "code", "capital", "labor"];

/** The slowest lever gates the whole system. Lowest score wins; ties break by PRIORITY. */
export function bindingConstraint(scores: Scores): LeverKey {
  let best: LeverKey = PRIORITY[0];
  let bestScore = Infinity;
  for (const key of PRIORITY) {
    if (scores[key] < bestScore) {
      bestScore = scores[key];
      best = key;
    }
  }
  return best;
}

/**
 * Geometric mean of the four levers. Rewards maxing multiple levers at once;
 * one dead lever drags the whole system down. Most leveraged is not the same
 * as highest single stat.
 */
export function leverageIndex(scores: Scores): number {
  const product = PRIORITY.reduce((p, key) => p * Math.max(1, scores[key]), 1);
  return Math.round(Math.pow(product, 1 / 4));
}

export function profile(scores: Scores): { label: string; blurb: string } {
  const vals = [scores.code, scores.media, scores.capital, scores.labor];
  const max = Math.max(...vals);
  const high = vals.filter((v) => v >= 60).length;
  const low = vals.filter((v) => v <= 20).length;

  if (high === 4) {
    return {
      label: "Compounding machine",
      blurb:
        "Rare air. All four levers turning at once. Protect it and keep every one of them spinning.",
    };
  }
  if (max >= 65 && high === 1 && low >= 2) {
    return {
      label: "Glass cannon",
      blurb:
        "High single-target output, almost no compounding surface. One stat carries you while the rest sit dead.",
    };
  }
  if (max <= 30) {
    return {
      label: "Trading time",
      blurb:
        "Every output still costs you hours. Nothing compounds yet. Pick one lever and pull it hard.",
    };
  }
  if (scores.code >= 60 && scores.media >= 60) {
    return {
      label: "Permissionless operator",
      blurb:
        "Code and media are both live. You can produce and be heard without anyone's permission. Now add ownership.",
    };
  }
  if (scores.capital >= 65) {
    return {
      label: "Owner",
      blurb: "Capital is doing real work. Make sure code and media keep feeding it.",
    };
  }
  return {
    label: "Generalist",
    blurb:
      "No lever maxed, none dead. Your job is to find the one gating the rest and attack it.",
  };
}
