const API_URL = "http://127.0.0.1:8000";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  text: string;
  message_number: number;
  risk_level?: string;
  risk_score?: number;
}

export interface ChatTurnResult {
  session_id: string;
  reply: string;
  chatbot_mode: "live" | "error";
  message_count: number;
  risk_level: string;
  risk_score: number;
  risk_trend: string;
  requires_review: boolean;
  privacy_summary?: {
    total_entities_removed: number;
    messages_with_pii: number;
    categories: Record<string, number>;
  };
}

export interface ChatSessionState {
  session_id: string;
  message_count: number;
  risk_level: string;
  risk_score: number;
  requires_review: boolean;
  review_status: string;
  messages: ChatMessage[];
}

async function handle<T>(response: Response, fallbackError: string): Promise<T> {
  if (!response.ok) {
    let detail = fallbackError;
    try {
      const body = await response.json();
      detail = body?.detail ?? detail;
    } catch {
      // response wasn't JSON -- keep the fallback message
    }
    throw new Error(detail);
  }
  return response.json();
}

export async function startChat(): Promise<{ session_id: string; chatbot_mode: "live" | "error" }> {
  const response = await fetch(`${API_URL}/chat/start`, { method: "POST" });
  return handle(response, "Couldn't start a new chat session.");
}

export async function sendChatMessage(sessionId: string, text: string): Promise<ChatTurnResult> {
  const response = await fetch(`${API_URL}/chat/${sessionId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return handle(response, "Couldn't send that message. Please try again.");
}

export async function getChatSession(sessionId: string): Promise<ChatSessionState> {
  const response = await fetch(`${API_URL}/chat/${sessionId}`);
  return handle(response, "Couldn't load this chat session.");
}
