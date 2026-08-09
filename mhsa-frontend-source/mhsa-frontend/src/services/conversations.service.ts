import type { ConversationSummary } from "../types/conversation";

const API_URL = "http://127.0.0.1:8000";



const runtimeConversations: ConversationSummary[] = [];





function mapRiskLevel(
  level: string
): ConversationSummary["riskLevel"] {

  const value =
    level?.toLowerCase() ?? "";


  if (value.includes("critical"))
    return "critical";


  if (value.includes("high"))
    return "high";


  if (value.includes("moderate"))
    return "moderate";


  if (value.includes("mild"))
    return "mild";


  return "safe";
}





export function addConversation(
  summary: ConversationSummary
) {

  runtimeConversations.unshift(
    summary
  );

}






export async function getConversations(): Promise<ConversationSummary[]> {


  const res =
    await fetch(
      `${API_URL}/conversations`
    );



  if (!res.ok) {

    throw new Error(
      "Failed to load conversations"
    );

  }



  const data =
    await res.json();




  const apiData: ConversationSummary[] =
    data.map(
      (item:any)=>({

        id:
          item.id,


        label:
          `Conversation #${item.id.slice(0,8)}`,


        participantCount:
          2,


        messageCount:
          item.message_count ?? 0,


        riskLevel:
          mapRiskLevel(
            item.risk_level
          ),


        confidence:
          item.confidence ??
          item.risk_score ??
          0,


        reviewStatus:
          item.review_status === "reviewed"
          ? "reviewed"
          :
          "pending",


        updatedAt:
          item.created_at,


        kind:
          "analysis"

      })
    );


  let chatData: ConversationSummary[] = [];

  try {
    const chatRes = await fetch(`${API_URL}/chat/sessions`);

    if (chatRes.ok) {
      const chatSessions = await chatRes.json();

      chatData = chatSessions.map((item: any) => ({
        id: item.id,
        label: `Chat #${item.id.slice(0, 8)}`,
        participantCount: 2,
        messageCount: item.message_count ?? 0,
        riskLevel: mapRiskLevel(item.risk_level),
        confidence: item.risk_score ?? 0,
        reviewStatus: item.review_status === "reviewed" ? "reviewed" : "pending",
        updatedAt: item.updated_at ?? item.created_at,
        kind: "chat",
      }));
    }
  } catch {
    // Chat sessions are supplementary -- if this fails, conversations
    // still load normally rather than breaking the whole History page.
  }


  return [
    ...runtimeConversations,
    ...apiData,
    ...chatData
  ];

}







export async function getPendingReviewCount(): Promise<number> {


  const data =
    await getConversations();



  return data.filter(
    c =>
      c.reviewStatus === "pending"
  ).length;

}







export async function getCriticalPendingCount(): Promise<number> {


  const data =
    await getConversations();



  return data.filter(
    c =>
      c.riskLevel === "critical" &&
      c.reviewStatus !== "reviewed"
  ).length;

}