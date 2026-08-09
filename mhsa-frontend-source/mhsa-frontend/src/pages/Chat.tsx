import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ShieldCheck, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Button } from "../components/ui/Button";
import { RiskBadge } from "../components/ui/Badge";
import { ThinkingIndicator } from "../components/chat/ThinkingOrb";
import { startChat, sendChatMessage, getChatSession } from "../services/chat.service";
import type { ChatMessage } from "../services/chat.service";
import type { RiskLevel } from "../types/conversation";
import { cn } from "../lib/cn";

function mapRiskLevel(level?: string): RiskLevel {
  const value = level?.toLowerCase() ?? "safe";
  if (value.includes("critical")) return "critical";
  if (value.includes("high")) return "high";
  if (value.includes("moderate")) return "moderate";
  if (value.includes("mild")) return "mild";
  return "safe";
}

const TREND_ICON = { Increasing: TrendingUp, Decreasing: TrendingDown, Stable: Minus } as const;

/**
 * Renders all three trend icons always-mounted, toggling visibility
 * with CSS instead of swapping which component is rendered. Dynamically
 * swapping component types (e.g. `const Icon = COND ? A : B; <Icon/>`)
 * makes React unmount/remount the DOM node on every change, which is
 * exactly the kind of DOM churn that collides badly with browser
 * extensions that also touch the DOM (translators, grammar checkers,
 * etc.) -- seen here as an "insertBefore" crash from Edge's built-in
 * translator. A single stable node with CSS toggling is immune to that
 * whole class of interference.
 */
function TrendIcon({ trend, size = 13 }: { trend: string; size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      {(Object.keys(TREND_ICON) as (keyof typeof TREND_ICON)[]).map((name) => {
        const Icon = TREND_ICON[name];
        return (
          <Icon
            key={name}
            size={size}
            aria-hidden="true"
            className="absolute inset-0"
            style={{ display: trend === name ? "block" : "none" }}
          />
        );
      })}
    </span>
  );
}

export default function Chat() {
  const { id: routeId } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatbotMode, setChatbotMode] = useState<"live" | "error" | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [riskLevel, setRiskLevel] = useState("Safe");
  const [riskTrend, setRiskTrend] = useState("Stable");
  const [requiresReview, setRequiresReview] = useState(false);
  const [entitiesRemoved, setEntitiesRemoved] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef<string | null>(null);

  useEffect(() => {
    // Guards against double-init in dev StrictMode *and* against
    // re-running when routeId itself hasn't actually changed.
    if (startedRef.current === (routeId ?? "new")) return;
    startedRef.current = routeId ?? "new";

    setError(null);

    if (routeId) {
      getChatSession(routeId)
        .then((session) => {
          setSessionId(session.session_id);
          setMessages(session.messages);
          setRiskLevel(session.risk_level);
          setRequiresReview(session.requires_review);
        })
        .catch(() => setError("Couldn't load this chat session."));
      return;
    }

    startChat()
      .then((res) => {
        setSessionId(res.session_id);
        setChatbotMode(res.chatbot_mode);
        startedRef.current = res.session_id;
        navigate(`/chat/${res.session_id}`, { replace: true });
      })
      .catch(() => setError("Couldn't start a chat session. Is the backend running?"));
  }, [routeId, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || !sessionId || thinking) return;

    setInput("");
    setError(null);

    const userMsg: ChatMessage = { role: "user", text, message_number: messages.length + 1 };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);

    try {
      const result = await sendChatMessage(sessionId, text);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: result.reply, message_number: prev.length + 1 },
      ]);
      setRiskLevel(result.risk_level);
      setRiskTrend(result.risk_trend);
      setRequiresReview(result.requires_review);
      setEntitiesRemoved(result.privacy_summary?.total_entities_removed ?? 0);
      if (chatbotMode !== result.chatbot_mode) setChatbotMode(result.chatbot_mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send that message.");
    } finally {
      setThinking(false);
    }
  }, [input, sessionId, thinking, messages.length, chatbotMode]);

  return (
    <ShellLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground-light">Chat</h1>
        <p className="mt-1 text-sm text-foreground-light-muted">
          Talk freely — every message is analyzed for safety in the background as the
          conversation goes.
        </p>
      </div>

      <div className="grid gap-6 laptop:grid-cols-[1fr_320px]">
        {/* Chat column */}
        <div className="flex h-[65vh] flex-col rounded-card border border-border-light bg-surface-light">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && !thinking && (
              <p className="text-sm text-foreground-light-muted">
                Say hello to get started — this is a normal conversation, nothing to set up.
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-[14px] px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-white"
                      : "bg-surface-light-muted text-foreground-light"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-[14px] bg-surface-light-muted px-4 py-2.5">
                  <ThinkingIndicator />
                </div>
              </div>
            )}
          </div>

          {error && <p className="px-5 pb-2 text-sm text-danger">{error}</p>}

          <div className="flex items-center gap-2 border-t border-border-light p-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={sessionId ? "Type a message…" : "Connecting…"}
              disabled={!sessionId}
              className="h-11 flex-1 rounded-[10px] border border-border-light bg-surface-light-muted px-4 text-sm text-foreground-light placeholder:text-foreground-light-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleSend}
              disabled={!sessionId || !input.trim() || thinking}
              aria-label="Send message"
            >
              <Send size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Live safety sidebar */}
        <div className="space-y-4">
          <div className="rounded-card border border-border-light bg-surface-light p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
              Live Risk
            </p>
            <div className="mt-3">
              <RiskBadge level={mapRiskLevel(riskLevel)} />
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-foreground-light-muted">
              <TrendIcon trend={riskTrend} size={13} />
              Trend: {riskTrend}
            </div>
            {requiresReview && (
              <div className="mt-3 flex items-center gap-1.5 rounded-[8px] bg-warning/10 px-2.5 py-1.5 text-xs font-medium text-warning">
                <AlertTriangle size={13} aria-hidden="true" />
                Human review recommended
              </div>
            )}
          </div>

          <div className="rounded-card border border-border-light bg-surface-light p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
              Privacy Guard
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-foreground-light">
              <ShieldCheck size={15} className="text-success" aria-hidden="true" />
              {entitiesRemoved > 0
                ? `${entitiesRemoved} item${entitiesRemoved === 1 ? "" : "s"} anonymized`
                : "Active, nothing detected yet"}
            </div>
          </div>

          <p className="text-xs text-foreground-light-muted">
            This conversation is analyzed the same way as any uploaded conversation — you can
            leave anytime; everything up to your last message is already saved.
          </p>
        </div>
      </div>
    </ShellLayout>
  );
}
