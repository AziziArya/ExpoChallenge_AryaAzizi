import type {
  ConversationDetail,
  Message,
  EmotionPoint,
  RiskTimelinePoint,
} from "../types/conversationDetail";

import type {
  RiskLevel,
  ConversationSummary,
} from "../types/conversation";

import { addConversation } from "./conversations.service";


const API_URL = "http://127.0.0.1:8000";



function mapRiskLevel(level?: string): RiskLevel {

  const value =
    level?.toLowerCase() ?? "safe";


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





function buildMessages(data:any):Message[] {


  const timeline =
    data?.timeline ?? [];


  return timeline.map(
    (item:any,index:number)=>{


      const risk =
        mapRiskLevel(
          item.risk_level
        );


      return {

        id:
          `${data.conversation_id}-${index}`,

        speaker:
          index % 2 === 0
            ? "Participant 1"
            : "Participant 2",

        timestamp:
          item.timestamp ??
          new Date().toISOString(),

        text:
          item.message ?? "",


        emotionIntensity:
          Number(item.risk_score ?? 0),


        distressFlag:
          [
            "moderate",
            "high",
            "critical"
          ].includes(risk),


        highRisk:
          [
            "high",
            "critical"
          ].includes(risk)

      };

    }
  );

}





function buildEmotionTimeline(data:any):EmotionPoint[] {


  const scores =
    data?.emotion_evolution
    ?.emotion_scores ?? [];



  return scores.map(
    (score:number,index:number)=>({

      index,

      sadness:
        score,

      fear:
        Math.min(score * 0.7,1),

      anger:
        Math.min(score * 0.3,1),

      hope:
        Math.max(1-score,0)

    })
  );

}





function buildRiskTimeline(data:any):RiskTimelinePoint[] {


  const timeline =
    data?.timeline ?? [];


  return timeline.map(
    (item:any,index:number)=>({

      index,

      level:
        mapRiskLevel(
          item.risk_level
        )

    })
  );

}





function buildFusion(data:any){


  const patterns =
    data?.conversation_patterns ?? {};


  const emotionScores =
    data?.emotion_evolution
    ?.emotion_scores ?? [];



  const lastEmotion =
    emotionScores.length
      ? emotionScores[emotionScores.length-1]
      : 0;



  return {

    emotion:
      Math.round(
        lastEmotion * 100
      ),


    distress:
      Math.round(
        (patterns.negative_language_score ?? 0)
        *100
      ),


    crisis:
    Math.round(
    (
      Math.max(
        patterns.crisis_language_score ?? 0,
        patterns.passive_crisis_score ?? 0
      )
    )
    *100
    ),

    pattern:
      Math.round(
        (
          patterns.isolation_score ??
          patterns.hopelessness_score ??
          0
        )
        *100
      )

  };

}





function buildSignals(data:any){


  const reasons =
    data?.explainability
    ?.reasons ??
    data?.decision
    ?.decision_reasons ??
    [];



  return reasons.map(
    (item:string,index:number)=>({

      id:
        `signal-${index}`,

      label:
        item

    })
  );

}





function buildTrend(data:any){


  const trend =
    data?.risk_trend
    ?.toLowerCase();



  if(trend?.includes("increase"))
    return "worsening";


  if(trend?.includes("decrease"))
    return "improving";


  return "stable";

}





function mapApiToDetail(
  data:any
):ConversationDetail {


  const riskLevel =
    mapRiskLevel(
      data?.overall_risk?.level
    );



  const summary:ConversationSummary = {


    id:
      data.conversation_id,


    label:
      `Conversation #${String(data.conversation_id).slice(0,8)}`,


    participantCount:2,


    messageCount:
      data.message_count ?? 0,


    riskLevel,


    confidence:
      Number(
        data?.decision
        ?.final_risk_score ??
        data?.overall_risk
        ?.score ??
        0
      ),


    reviewStatus:
      data?.decision
      ?.requires_human_review
        ? "pending"
        : "reviewed",


    updatedAt:
      data.created_at ??
      new Date().toISOString()

  };



  return {


    ...summary,


    trend:
      buildTrend(data),



    signals:
      buildSignals(data),



    recommendation:
      data?.safety_response
      ?.message ??
      "No recommendation",



    messages:
      buildMessages(data),



    fusion:
      buildFusion(data),



    emotionTimeline:
      buildEmotionTimeline(data),



    riskTimeline:
      buildRiskTimeline(data),



    explainability:
      data?.explainability,


    safetyResponse:
      data?.safety_response,


    decision:
      data?.decision,


    contextFusion:
      data?.context_fusion,


    conversationPatterns:
      data?.conversation_patterns

  };

}





export async function analyzeConversationText(
  text:string
):Promise<ConversationDetail>{


  const messages =
    text
    .split(/\r?\n/)
    .map(x=>x.trim())
    .filter(Boolean);



  const response =
    await fetch(
      `${API_URL}/analyze-conversation`,
      {

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },


        body:
          JSON.stringify({
            messages
          })

      }
    );



  if(!response.ok)
    throw new Error(
      "Backend analyze failed"
    );



  const data =
    await response.json();



  const detail =
    mapApiToDetail(data);



  addConversation(detail);



  return detail;

}





export async function getConversationDetail(
  id:string
):Promise<ConversationDetail|null>{


  const response =
    await fetch(
      `${API_URL}/conversations/${id}`
    );



  if(!response.ok)
    return null;



  const data =
    await response.json();



  const merged = {


    ...(data.analysis ?? {}),



    conversation_id:
      data.id,



    message_count:
      data.message_count,



    created_at:
      data.created_at,



    overall_risk:
    {

      level:
        data.risk_level,


      score:
        data.risk_score

    },



    safety_response:
    {

      message:
        data.recommendation

    },



    decision:
    {

      final_risk_score:
        data.confidence,


      requires_human_review:
        data.requires_review

    }


  };



  return mapApiToDetail(
    merged
  );

}