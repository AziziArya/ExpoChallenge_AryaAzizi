from typing import Any, Dict, List


class XAIEngine:
    """
    Explainability engine.

    Converts internal safety decisions into
    human-readable explanations.

    Does not diagnose.
    """

    def __init__(self):
        pass

    # =====================================
    # Summary
    # =====================================

    def _summary(self, level: str, score: float) -> str:

        if level == "Critical Emergency":
            return (
                "The system detected multiple high-confidence safety "
                "signals suggesting immediate human review."
            )

        if level == "High Risk":
            return (
                "Several clinically relevant safety indicators were "
                "identified that warrant prompt human review."
            )

        if level == "Moderate Risk":
            return (
                "The conversation contains persistent emotional distress "
                "that should continue to be monitored."
            )

        if level == "Mild Concern":
            return "Some emotional distress indicators were detected."

        return "No significant safety indicators were detected."

    # =====================================
    # Signal Mapping
    # =====================================

    def _signal_mapping(self):

        return {
            "critical_crisis": ("Critical crisis detected", "Critical"),
            "crisis_signal": ("Direct crisis language", "High"),
            "passive_crisis_detected": ("Passive suicidal ideation", "High"),
            "hopelessness_detected": ("Hopelessness", "Medium"),
            "isolation_detected": ("Social isolation", "Medium"),
            "negative_language_detected": ("Negative language", "Low"),
            "emotional_escalation": ("Emotional escalation", "Medium"),
            "conversation_deterioration": ("Conversation deterioration", "Medium"),
            "history_increase": ("Historical risk increase", "Low"),
            "context_risk_high": ("High contextual risk", "High"),
        }

    # =====================================
    # Explain Signals
    # =====================================

    def _explain_signals(self, signals: Dict[str, Any]) -> List[Dict[str, Any]]:

        mapping = self._signal_mapping()

        result = []

        for key, value in signals.items():

            if not value:
                continue

            if key not in mapping:
                continue

            factor, impact = mapping[key]

            result.append(
                {"factor": factor, "impact": impact, "signal": key, "active": True}
            )

        return result

    # =====================================
    # Reasoning Chain
    # =====================================

    def _reasoning_chain(self, signals: Dict[str, Any]) -> List[str]:

        chain = []

        if signals.get("critical_crisis"):
            chain.append("Critical crisis indicators were detected.")

        if signals.get("crisis_signal"):
            chain.append("Direct crisis language increased safety priority.")

        if signals.get("passive_crisis_detected"):
            chain.append("Passive suicidal ideation was detected.")

        if signals.get("hopelessness_detected"):
            chain.append("Hopelessness indicators strengthened overall concern.")

        if signals.get("isolation_detected"):
            chain.append("Social isolation indicators were detected.")

        if signals.get("negative_language_detected"):
            chain.append("Negative language contributed to risk estimation.")

        if signals.get("emotional_escalation"):
            chain.append("Negative emotional escalation was detected.")

        if signals.get("conversation_deterioration"):
            chain.append("Conversation deterioration pattern was detected.")

        if signals.get("history_increase"):
            chain.append("Historical risk trend increased concern.")

        if signals.get("context_risk_high"):
            chain.append("Contextual safety assessment was elevated.")

        return chain

    # =====================================
    # Generate
    # =====================================

    def generate(
        self, decision: Dict[str, Any], memory_context: Dict[str, Any] = None
    ) -> Dict[str, Any]:

        memory_context = memory_context or {}

        signals = decision.get("signals", {})

        signal_analysis = self._explain_signals(signals)

        reasoning = self._reasoning_chain(signals)

        reasons = list(decision.get("decision_reasons", []))

        for item in reasoning:

            if item not in reasons:
                reasons.append(item)

        return {
            "risk_level": decision.get("final_risk_level", "Unknown"),
            "risk_score": decision.get("final_risk_score", 0),
            "summary": self._summary(
                decision.get("final_risk_level", "Unknown"),
                decision.get("final_risk_score", 0),
            ),
            "key_factors": signal_analysis,
            "reasons": reasons,
            "recommended_actions": decision.get("recommended_actions", []),
            "signal_analysis": signal_analysis,
            "model_reasoning": {
                "decision_score": decision.get("final_risk_score", 0),
                "active_signals": [key for key, value in signals.items() if value],
                "reasoning_chain": reasoning,
            },
            "memory_influence": {
                "risk_change": memory_context.get("risk_change", 0),
                "trend": memory_context.get("trend", "Unknown"),
                "previous_risk": memory_context.get("previous_risk", "Unknown"),
            },
        }


# =====================================
# Backward Compatibility
# =====================================


class ExplainabilityEngine(XAIEngine):

    def explain(self, decision, memory_context=None):

        return self.generate(decision, memory_context)
