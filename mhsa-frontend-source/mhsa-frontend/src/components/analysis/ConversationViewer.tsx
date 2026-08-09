import { useState } from "react";
import { Search, Flag, AlertCircle, ShieldCheck } from "lucide-react";
import type { Message } from "../../types/conversationDetail";
import { cn } from "../../lib/cn";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Conversation Viewer
 * - Fixed height container to prevent layout pushing
 * - Internal scrolling for messages
 * - Search toolbar stays visible
 * - High-risk messages highlighted
 */
export function ConversationViewer({ messages }: { messages: Message[] }) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(query.toLowerCase())
      )
    : messages;

  return (
    <div className="flex h-[600px] min-h-0 flex-col rounded-card border border-border-light bg-surface-light">
      {/* Search Header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border-light bg-surface-light px-4 py-3">
        <Search
          size={15}
          className="text-foreground-light-muted"
          aria-hidden="true"
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search this conversation..."
          className="w-full bg-transparent text-sm text-foreground-light outline-none placeholder:text-foreground-light-muted"
          aria-label="Search conversation"
        />
      </div>


      {/* Messages Scroll Area */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={cn(
                "rounded-[10px] border border-transparent p-3 transition-colors",
                m.highRisk &&
                  "border-l-[3px] border-l-danger bg-danger/5"
              )}
              title={
                m.distressFlag
                  ? "Flagged: elevated distress language detected in this message"
                  : undefined
              }
            >
              <div className="flex items-center justify-between text-xs text-foreground-light-muted">
                <span className="font-medium text-foreground-light">
                  {m.speaker}
                </span>

                <span>
                  {formatTime(m.timestamp)}
                </span>
              </div>


              <p className="mt-1 text-sm leading-relaxed text-foreground-light">
                {m.text}
              </p>


              <div className="mt-2 flex items-center gap-2">
                {/* Emotion intensity */}
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: `rgba(217,119,6,${
                      0.25 + m.emotionIntensity * 0.6
                    })`,
                  }}
                  aria-hidden="true"
                  title="Emotion intensity marker"
                />


                {/* Distress */}
                {m.distressFlag && (
                  <AlertCircle
                    size={12}
                    className="text-warning"
                    aria-label="Distress marker"
                  />
                )}


                {/* High Risk */}
                {m.highRisk && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-danger">
                    <Flag size={12} aria-hidden="true" />
                    Flagged
                  </span>
                )}

                {/* Privacy Guard */}
                {m.piiDetected && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium text-foreground-light-muted"
                    title="Personal information detected and anonymized before analysis"
                  >
                    <ShieldCheck size={12} aria-hidden="true" />
                    Anonymized
                  </span>
                )}
              </div>
            </div>
          ))}


          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-foreground-light-muted">
              No messages match "{query}".
            </p>
          )}
        </div>
      </div>
    </div>
  );
}