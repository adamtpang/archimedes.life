"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

import { FulcrumGlyph } from "@/components/lever-mark";
import { SCORES_STORAGE_KEY } from "@/lib/levers";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "What should I do this week to fix my binding constraint?",
  "Give me a 3-step plan for my weakest lever.",
  "How do I move media off zero?",
];

function readScores(): unknown {
  try {
    const raw = localStorage.getItem(SCORES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function ArchimedesChat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    setError(null);
    const history = [...messages, { role: "user", content } as Message];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, scores: readScores() }),
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Archimedes is unavailable right now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      if (!acc.trim()) throw new Error("Archimedes had nothing to say. Try again.");
    } catch (err) {
      setMessages((prev) => {
        const copy = prev.slice();
        const last = copy[copy.length - 1];
        if (last && last.role === "assistant" && !last.content) copy.pop();
        return copy;
      });
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const streaming =
    busy &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content === "";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <FulcrumGlyph className="text-lever" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Archimedes
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex h-80 flex-col gap-4 overflow-y-auto px-5 py-6 sm:px-6"
      >
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center gap-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ask about your binding constraint. Archimedes already knows your
              scores from the diagnostic above.
            </p>
            <div className="flex flex-col gap-2">
              {STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => send(starter)}
                  className="rounded-lg border border-border px-3.5 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-lever/50 hover:text-foreground"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                message.role === "user"
                  ? "self-end bg-lever/15 text-foreground"
                  : "self-start bg-secondary/50 text-foreground"
              )}
            >
              {message.content || (streaming ? "Thinking…" : "")}
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border px-3 py-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Archimedes…"
          aria-label="Message Archimedes"
          className="h-10 flex-1 rounded-md border border-border bg-secondary/40 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lever"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-lever text-background transition-colors hover:bg-lever/90 disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>

      {error && (
        <p className="border-t border-border px-5 py-2.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
