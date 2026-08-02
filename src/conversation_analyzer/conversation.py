import uuid
from datetime import datetime


class ConversationAnalyzer:
    """
    Full conversation safety pipeline.

    Messages
        |
        v
    MentalHealthAnalyzer
        |
        v
    Emotion Evolution
        |
        v
    Conversation Pattern Analysis
        |
        v
    Fusion Engine
        |
        v
    Decision Engine
        |
        v
    Explainability
        |
        v
    Safety Response
    """

    def __init__(
        self,
        analyzer,
        emotion_evolution,
        pattern_analyzer,
        memory,
        context_fusion,
        decision_engine,
        xai_engine,
        response_generator,
    ):

        self.analyzer = analyzer
        self.emotion_evolution = emotion_evolution
        self.pattern_analyzer = pattern_analyzer
        self.memory = memory
        self.context_fusion = context_fusion
        self.decision_engine = decision_engine
        self.xai_engine = xai_engine
        self.response_generator = response_generator


    def _timestamp(self):

        return datetime.utcnow().isoformat()



    def _safe_dict(self,value):

        if isinstance(value,dict):
            return value

        return {}



    def _normalize_emotion(self,emotion):

        if isinstance(emotion,dict):
            return emotion


        if isinstance(emotion,list):

            result={}

            for item in emotion:

                if isinstance(item,dict):

                    name=item.get("emotion")

                    score=item.get("score",0)

                    if name:
                        result[name]=score


            return result


        return {}




    def _analyze_single_messages(self,messages):

        timeline=[]


        for index,message in enumerate(messages):

            result=self.analyzer.analyze(message)


            risk=result.get(
                "risk_assessment",
                {}
            )


            timeline.append({

                "message_number":
                    index+1,

                "timestamp":
                    self._timestamp(),

                "message":
                    message,

                "risk_level":
                    risk.get(
                        "level",
                        "Unknown"
                    ),

                "risk_score":
                    risk.get(
                        "score",
                        0
                    )

            })


        return timeline




    def analyze_conversation(self,messages):

        conversation_id=str(
            uuid.uuid4()
        )


        timeline=self._analyze_single_messages(
            messages
        )



        analyses=[]


        for message in messages:

            analyses.append(
                self.analyzer.analyze(message)
            )



        emotion_history=[]

        crisis_history=[]



        for item in analyses:


            emotion_history.append(
                self._normalize_emotion(
                    item.get(
                        "emotion",
                        {}
                    )
                )
            )


            crisis_history.append(
                self._safe_dict(
                    item.get(
                        "crisis",
                        {}
                    )
                )
            )



        emotion_result = (
            self.emotion_evolution.analyze(
                emotion_history,
                crisis_history
            )
            or {}
        )



        pattern_result = (
            self.pattern_analyzer.analyze(
                messages
            )
            or {}
        )



        latest=analyses[-1]



        base_risk=self._safe_dict(
            latest.get(
                "risk_assessment",
                {}
            )
        )



        memory_context={

            "conversation_length":
                len(messages),

            "previous_risk":
                "Unknown",

            "current_risk_score":
                0,

            "risk_change":
                0,

            "trend":
                "Stable"

        }



        # ==========================
        # Context Fusion (FIXED)
        # ==========================


        fusion_result = (
            self.context_fusion.analyze(

                emotion_evolution=
                    emotion_result,

                conversation_patterns=
                    pattern_result,

                memory_context=
                    memory_context,

                base_risk=
                    base_risk

            )
            or {}
        )



        # ==========================
        # Decision
        # ==========================


        decision = self.decision_engine.decide(

            base_risk,

            fusion_result,

            emotion_result,

            pattern_result,

            memory_context

        )



        # ==========================
        # Add pattern explanations
        # ==========================


        pattern_indicators = (
            pattern_result.get(
                "risk_indicators",
                []
            )
        )


        decision_reasons = (
            decision.get(
                "decision_reasons",
                []
            )
        )


        decision["decision_reasons"] = list(
            dict.fromkeys(
                decision_reasons +
                pattern_indicators
            )
        )



        # ==========================
        # XAI
        # ==========================


        explanation = (
            self.xai_engine.generate(
                decision,
                memory_context
            )
            or {}
        )



        # ==========================
        # Safety response
        # ==========================


        safety_response = (
            self.response_generator.generate(
                decision,
                messages[-1]
            )
        )



        scores=[

            x.get(
                "risk_score",
                0
            )

            for x in timeline

        ]



        if len(scores)>1 and scores[-1]>scores[0]:

            risk_trend="Increasing"


        elif len(scores)>1 and scores[-1]<scores[0]:

            risk_trend="Decreasing"


        else:

            risk_trend="Stable"





        return {

            "conversation_id":
                conversation_id,


            "message_count":
                len(messages),


            "timeline":
                timeline,


            "overall_risk":{

                "level":
                    decision.get(
                        "final_risk_level",
                        "Unknown"
                    ),

                "score":
                    decision.get(
                        "final_risk_score",
                        0
                    )

            },


            "risk_trend":
                risk_trend,


            "emotion_evolution":
                emotion_result,


            "conversation_patterns":
                pattern_result,


            "memory_context":
                memory_context,


            "context_fusion":
                fusion_result,


            "decision":
                decision,


            "explainability":
                explanation,


            "safety_response":
                safety_response

        }