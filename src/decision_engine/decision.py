from typing import Dict


class DecisionEngine:
    """
    Final safety decision engine.

    Combines:
    - Base risk
    - Context fusion
    - Emotion evolution
    - Conversation patterns
    - Memory history
    - Crisis signals

    Does not diagnose.
    Estimates safety priority.
    """

    def __init__(self):

        self.thresholds = {
            "critical": 0.85,
            "high": 0.55,
            "moderate": 0.35,
            "mild": 0.15,
        }


    # =====================================
    # Risk Level
    # =====================================

    def _risk_level(self, score):

        if score >= self.thresholds["critical"]:
            return "Critical Emergency"

        if score >= self.thresholds["high"]:
            return "High Risk"

        if score >= self.thresholds["moderate"]:
            return "Moderate Risk"

        if score >= self.thresholds["mild"]:
            return "Mild Concern"

        return "Safe"



    # =====================================
    # Priority
    # =====================================

    def _priority(self, score):

        if score >= 0.85:
            return "CRITICAL"

        if score >= 0.55:
            return "HIGH"

        if score >= 0.35:
            return "MEDIUM"

        return "LOW"



    # =====================================
    # Signals
    # =====================================

    def _collect_signals(
        self,
        context,
        emotion,
        patterns,
        memory,
        base
    ):

        context = context or {}
        emotion = emotion or {}
        patterns = patterns or {}
        memory = memory or {}
        base = base or {}


        crisis = base.get(
            "crisis",
            {}
        )


        passive_crisis_score = patterns.get(
            "passive_crisis_score",
            0
        )

        hopelessness_score = patterns.get(
            "hopelessness_score",
            0
        )

        isolation_score = patterns.get(
            "isolation_score",
            0
        )

        negative_score = patterns.get(
            "negative_language_score",
            0
        )


        return {

            "crisis_signal":

                (
                    crisis.get(
                        "crisis_probability",
                        0
                    ) >= 0.5

                    or

                    patterns.get(
                        "crisis_language_score",
                        0
                    ) > 0

                    or

                    passive_crisis_score >= 0.6
                ),


            "critical_crisis":

            (
                crisis.get(
                    "is_emergency",
                    False
                )

                or

                (
                    passive_crisis_score >= 0.6
                    and
                    hopelessness_score >= 0.5
                )

                or

                (
                    hopelessness_score >= 0.7
                    and
                    patterns.get(
                        "conversation_escalation",
                        {}
                    ).get(
                        "escalation_detected",
                        False
                    )
                )
            ),


            "passive_crisis_detected":

                passive_crisis_score > 0,


            "isolation_detected":

                isolation_score > 0,


            "hopelessness_detected":

                hopelessness_score > 0,


            "negative_language_detected":

                negative_score > 0,


            "context_crisis_override":

                context.get(
                    "crisis_override",
                    False
                ),


            "emotional_escalation":

                emotion.get(
                    "escalation_detected",
                    False
                ),


            "conversation_deterioration":

                patterns.get(
                    "conversation_escalation",
                    {}
                ).get(
                    "escalation_detected",
                    False
                ),


            "history_increase":

                memory.get(
                    "risk_change",
                    0
                ) > 0.15,


            "context_risk_high":

                context.get(
                    "contextual_risk_score",
                    0
                ) >= 0.55

        }


    # =====================================
    # Score Calculation
    # =====================================

    def _calculate_score(
        self,
        base,
        context,
        signals
    ):

        base_score = base.get(
            "score",
            0
        )


        context_score = context.get(
            "contextual_risk_score",
            0
        )


        score = (

            base_score * 0.50

            +

            context_score * 0.50

        )


        reasoning = []



        # Preserve strong base risk

        if base_score >= 0.75:

            score = max(
                score,
                0.75
            )

            reasoning.append(
                "High base risk preserved"
            )



        # Preserve contextual risk

        if context_score >= 0.75:

            score = max(
                score,
                0.75
            )

            reasoning.append(
                "High contextual risk preserved"
            )



        # Direct crisis signal

        if signals["crisis_signal"]:

            score = max(
                score,
                0.80
            )

            reasoning.append(
                "Crisis signal increased safety priority"
            )



        # Context fusion emergency

        if signals["context_crisis_override"]:

            score = max(
                score,
                0.85
            )

            reasoning.append(
                "Context crisis override increased safety priority"
            )



        # Critical crisis

        if signals["critical_crisis"]:

            score = 1.0

            reasoning.append(
                "Critical emergency override"
            )



        if signals["emotional_escalation"]:

            score += 0.05

            reasoning.append(
                "Emotion escalation detected"
            )



        if signals["conversation_deterioration"]:

            score += 0.05

            reasoning.append(
                "Conversation deterioration detected"
            )

        # Passive crisis + hopelessness escalation

        if (
            signals["passive_crisis_detected"]
            and
            signals["hopelessness_detected"]
        ):

            score = max(
                score,
                0.85
            )

            reasoning.append(
                "Passive crisis combined with hopelessness increased emergency priority"
            )


        return (

            round(
                min(score, 1),
                4
            ),

            reasoning

        )



    # =====================================
    # Actions
    # =====================================

    def _actions(self, level):

        actions = {

            "Critical Emergency": [

                "Immediate safety assessment recommended",

                "Encourage urgent human intervention",

                "Maintain calm supportive communication",

            ],


            "High Risk": [

                "Human review recommended",

                "Encourage trusted-person support",

                "Monitor conversation closely",

                "Assess immediate safety",

            ],


            "Moderate Risk": [

                "Continue monitoring",

                "Review emotional changes",

                "Encourage support network",

            ],


            "Mild Concern": [

                "Supportive monitoring recommended"

            ],


            "Safe": [

                "No additional action required"

            ]

        }


        return actions.get(
            level,
            []
        )



    # =====================================
    # Main Decision
    # =====================================

    def decide(
        self,
        base_risk: Dict,
        context_fusion: Dict,
        emotion_evolution=None,
        conversation_patterns=None,
        memory_context=None,
    ):


        emotion_evolution = emotion_evolution or {}

        conversation_patterns = conversation_patterns or {}

        memory_context = memory_context or {}



        signals = self._collect_signals(

            context_fusion,

            emotion_evolution,

            conversation_patterns,

            memory_context,

            base_risk

        )



        score, reasoning = self._calculate_score(

            base_risk,

            context_fusion,

            signals

        )



        level = self._risk_level(
            score
        )



        return {

            "final_risk_score": score,

            "final_risk_level": level,

            "priority": self._priority(score),


            "requires_human_review": (

                score >= 0.55

            ),


            "escalation": (

                any(signals.values())

            ),


            "signals": signals,


            "reasoning_chain": reasoning,


            "decision_reasons": reasoning,


            "recommended_actions": self._actions(level)

        }