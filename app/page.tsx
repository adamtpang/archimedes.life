import { EmailCapture } from "@/components/email-capture";
import { FulcrumGlyph, LeverMark } from "@/components/lever-mark";

type Lever = {
  id: string;
  name: string;
  symptom: string;
  cure: string;
};

const LEVERS: Lever[] = [
  {
    id: "01",
    name: "Code",
    symptom:
      "You still do by hand what a script would do ten thousand times — for free, while you sleep.",
    cure: "Software that keeps working the day you stop showing up.",
  },
  {
    id: "02",
    name: "Media",
    symptom: "Your best thinking reaches the same room it reached last year.",
    cure: "Publish once; be heard at the scale of the whole internet.",
  },
  {
    id: "03",
    name: "Capital",
    symptom: "Every dollar dies the moment you stop trading hours to earn it.",
    cure: "Money that compounds while you sleep, not only while you work.",
  },
  {
    id: "04",
    name: "Labor",
    symptom: "You are the bottleneck on every task only you know how to do.",
    cure: "A team that turns one pair of hands into many.",
  },
];

type Step = {
  id: string;
  name: string;
  body: string;
};

const STEPS: Step[] = [
  {
    id: "01",
    name: "Diagnose",
    body: "We map where your leverage leaks — which levers you pull hard, which you ignore, and what the gap is quietly costing you.",
  },
  {
    id: "02",
    name: "Prescribe",
    body: "One specific move per lever. Not a framework. Not a course. The next concrete action, named — and the order to take them in.",
  },
  {
    id: "03",
    name: "Compound",
    body: "Pull the weak lever. Re-measure. Repeat — until small inputs move loads that used to be out of the question.",
  },
];

function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
      <span className="text-lever">{index}</span>
      <span className="h-px w-8 bg-border" />
      <span>{children}</span>
    </div>
  );
}

export default function Page() {
  return (
    <main className="relative overflow-x-clip">
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="absolute left-1/2 top-[-18rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-lever/[0.08] blur-[140px]" />
      </div>

      {/* ───────────────────────── hero ───────────────────────── */}
      <section className="mx-auto flex min-h-[88svh] max-w-5xl flex-col justify-center px-6 pb-20 pt-28 sm:px-8">
        <p
          className="reveal mb-8 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.26em] text-muted-foreground"
          style={{ animationDelay: "0ms" }}
        >
          <FulcrumGlyph className="text-lever" />
          Leverage diagnosis
        </p>

        <h1
          className="reveal font-sans text-[clamp(2.75rem,14vw,9.5rem)] font-bold leading-[0.82] tracking-[-0.04em]"
          style={{ animationDelay: "80ms" }}
        >
          archimedes
        </h1>

        <p
          className="reveal mt-9 max-w-2xl text-balance text-2xl font-medium leading-[1.15] sm:text-3xl"
          style={{ animationDelay: "170ms" }}
        >
          You don&rsquo;t have an effort problem. You have a{" "}
          <span className="text-lever">leverage</span> problem.
        </p>

        <p
          className="reveal mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          style={{ animationDelay: "250ms" }}
        >
          We find the four levers you&rsquo;re under-using — code, media,
          capital, labor — and prescribe the one move that pulls each.
        </p>

        <div className="reveal mt-10 max-w-md" style={{ animationDelay: "330ms" }}>
          <EmailCapture />
        </div>
      </section>

      {/* ──────────────────── epigraph + the motif ──────────────────── */}
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-12 sm:px-8 sm:py-16">
        <div className="w-full max-w-md">
          <LeverMark />
        </div>
        <blockquote className="max-w-xl text-balance text-center text-lg font-medium leading-snug sm:text-xl">
          &ldquo;Give me a lever long enough and a place to stand, and I will
          move the world.&rdquo;
          <cite className="mt-3 block font-mono text-xs not-italic uppercase tracking-[0.22em] text-muted-foreground">
            — Archimedes
          </cite>
        </blockquote>
      </section>

      {/* ───────────────────── the four levers ───────────────────── */}
      <section id="levers" className="mx-auto max-w-5xl px-6 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-col gap-5">
          <SectionLabel index="I">The four levers</SectionLabel>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Four ways to multiply a life. Most people pull one.
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:mt-16 sm:grid-cols-2">
          {LEVERS.map((lever) => (
            <article
              key={lever.id}
              className="group relative flex flex-col gap-6 bg-background p-7 transition-colors duration-300 hover:bg-secondary/40 sm:p-9"
            >
              <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-lever transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-hover:text-lever">
                  {lever.id}
                </span>
                <FulcrumGlyph className="text-border transition-colors duration-300 group-hover:text-lever" />
              </div>

              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {lever.name}
              </h3>

              <div className="mt-auto space-y-5">
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                  <span className="label mb-1.5 block text-[0.65rem] text-lever/80">
                    Under-leveraged when
                  </span>
                  {lever.symptom}
                </p>
                <p className="text-sm leading-relaxed text-foreground sm:text-[0.95rem]">
                  <span className="label mb-1.5 block text-[0.65rem] text-muted-foreground">
                    Cured by
                  </span>
                  {lever.cure}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───────────────────── how it works ───────────────────── */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-col gap-5">
          <SectionLabel index="II">How it works</SectionLabel>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Diagnose. Prescribe. Compound.
          </h2>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:mt-16 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.id}
              className="flex flex-col gap-5 bg-background p-7 sm:p-9"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-3xl font-semibold text-lever">
                  {step.id}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{step.name}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────────────── footer ───────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5">
            <FulcrumGlyph className="text-lever" />
            <span className="font-mono text-sm tracking-wide">archimedes.life</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Find the lever. Move the world.
          </p>
          <p className="font-mono text-xs text-muted-foreground">© 2026</p>
        </div>
      </footer>
    </main>
  );
}
