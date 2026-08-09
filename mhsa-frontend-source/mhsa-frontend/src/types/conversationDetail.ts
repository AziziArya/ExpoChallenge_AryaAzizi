import type {
  RiskLevel,
  ReviewStatus,
  DetectedSignal,
  FusionContribution,
} from "./conversation";


export type Trend =
  | "improving"
  | "stable"
  | "worsening";



export interface Message {

  id: string;

  speaker:
    | "Participant 1"
    | "Participant 2";

  timestamp: string;

  text: string;

  emotionIntensity: number;

  distressFlag: boolean;

  highRisk: boolean;

  piiDetected: boolean;

}



export interface EmotionPoint {

  index: number;

  sadness: number;

  fear: number;

  anger: number;

  hope: number;

}



export interface RiskTimelinePoint {

  index: number;

  level: RiskLevel;

}



/*
  Explainability
*/

export interface ExplainabilityFactor {

  factor: string;

  impact: string;

  signal: string;

  active: boolean;

}



export interface ExplainabilityData {

  summary: string;

  reasons: string[];

  key_factors: ExplainabilityFactor[];

  recommended_actions: string[];

}



/*
  Safety Response
*/

export interface SafetyResponse {

  response_type: string;

  message: string;

  priority: string;

  actions: string[];

}



/*
  Decision Engine Output
*/

export interface DecisionData {

  final_risk_score: number;

  final_risk_level: string;

  priority: string;

  requires_human_review: boolean;

  escalation: boolean;

  decision_reasons: string[];

}



/*
  Context Fusion Output
*/

export interface ContextFusionData {

  final_context_score: number;

  final_context_level: string;

  crisis_override: boolean;

  crisis_probability: number;

}



/*
  Conversation Pattern Analysis
*/

export interface ConversationPatterns {

  isolation_score: number;

  hopelessness_score: number;

  negative_language_score: number;

  passive_crisis_score: number;

  crisis_language_score: number;

  risk_indicators: string[];

}



/*
  Privacy Guard Output
*/

export interface PrivacySummary {

  active: boolean;

  messagesWithPii: number;

  totalEntitiesRemoved: number;

  categories: Record<string, number>;

}



/*
  Main Conversation Detail Model
*/

export interface ConversationDetail {


  id: string;


  label: string;


  participantCount: number;


  messageCount: number;


  riskLevel: RiskLevel;


  confidence: number;


  reviewStatus: ReviewStatus;


  updatedAt: string;


  trend: Trend;



  signals: DetectedSignal[];



  recommendation: string;



  messages: Message[];



  fusion: FusionContribution;



  emotionTimeline: EmotionPoint[];



  riskTimeline: RiskTimelinePoint[];



  /*
    Optional backend analysis outputs
  */

  explainability?: ExplainabilityData;



  safetyResponse?: SafetyResponse;



  decision?: DecisionData;



  contextFusion?: ContextFusionData;



  conversationPatterns?: ConversationPatterns;


  privacy?: PrivacySummary;

}