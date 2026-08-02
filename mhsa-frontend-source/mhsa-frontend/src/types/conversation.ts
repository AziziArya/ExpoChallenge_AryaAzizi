export type RiskLevel =
  | "safe"
  | "mild"
  | "moderate"
  | "high"
  | "critical";



export type ReviewStatus =
  | "pending"
  | "reviewed"
  | "escalated"
  | "awaiting_info";



export interface ConversationSummary {


  id:string;


  label:string;


  participantCount:number;


  messageCount:number;


  riskLevel:RiskLevel;


  confidence:number;


  reviewStatus:ReviewStatus;


  updatedAt:string;


}



export interface DetectedSignal {

 id:string;

 label:string;

}



export interface FusionContribution {


 emotion:number;


 distress:number;


 crisis:number;


 pattern:number;


}