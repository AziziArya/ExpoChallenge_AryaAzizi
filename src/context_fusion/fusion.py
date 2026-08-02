class ContextFusionEngine:
    """
    Context Fusion Engine

    Combines:
    - Emotion evolution
    - Conversation patterns
    - Memory
    - Base risk

    Produces contextual risk.
    """

    def __init__(self):

        self.weights = {
            "base_risk": 0.35,
            "emotion": 0.25,
            "pattern": 0.30,
            "memory": 0.10,
        }

    # ==========================================
    # Utilities
    # ==========================================

    def _normalize(self, value):

        try:
            return max(0.0, min(float(value), 1.0))
        except Exception:
            return 0.0

    # ==========================================
    # Emotion
    # ==========================================

    def _emotion_score(self, emotion):

        if not emotion:
            return 0

        score = emotion.get(
            "current_negative_emotion_score",
            emotion.get(
                "safety_emotion_score",
                0,
            ),
        )

        score = self._normalize(score)

        if emotion.get("escalation_detected", False):
            score += 0.15

        return min(score, 1)

    # ==========================================
    # Pattern
    # ==========================================

    def _pattern_score(self, patterns):

        if not patterns:
            return 0

        score = 0

        isolation = self._normalize(patterns.get("isolation_score", 0))

        hopelessness = self._normalize(patterns.get("hopelessness_score", 0))

        passive = self._normalize(patterns.get("passive_crisis_score", 0))

        negative = self._normalize(patterns.get("negative_language_score", 0))

        score += isolation * 0.20
        score += hopelessness * 0.35
        score += passive * 0.35
        score += negative * 0.10

        escalation = patterns.get(
            "conversation_escalation",
            {},
        )

        if escalation.get(
            "escalation_detected",
            False,
        ):
            score += 0.10

        return min(score, 1)

    # ==========================================
    # Memory
    # ==========================================

    def _memory_score(self, memory):

        if not memory:
            return 0

        return self._normalize(
            memory.get(
                "risk_change",
                0,
            )
        )

    # ==========================================
    # Main Fusion
    # ==========================================

    def fuse(
        self,
        base_risk,
        emotion_evolution=None,
        conversation_patterns=None,
        memory_context=None,
    ):

        base_score = self._normalize(base_risk.get("score", 0))

        emotion_score = self._emotion_score(emotion_evolution)

        pattern_score = self._pattern_score(conversation_patterns)

        memory_score = self._memory_score(memory_context)

        final_score = (
            base_score * self.weights["base_risk"]
            + emotion_score * self.weights["emotion"]
            + pattern_score * self.weights["pattern"]
            + memory_score * self.weights["memory"]
        )

        reasons = []

        if emotion_score >= 0.6:
            reasons.append("Negative emotional escalation detected")

        if pattern_score >= 0.4:
            reasons.append("Conversation deterioration detected")

        crisis_override = False

        passive = (
            conversation_patterns.get(
                "passive_crisis_score",
                0,
            )
            if conversation_patterns
            else 0
        )

        hopelessness = (
            conversation_patterns.get(
                "hopelessness_score",
                0,
            )
            if conversation_patterns
            else 0
        )

        # -------------------------
        # Passive SI + Hopelessness
        # -------------------------

        if passive >= 0.30 and hopelessness >= 0.50:

            crisis_override = True

            final_score = max(final_score, 0.65)

            reasons.append("Passive crisis combined with hopelessness")

        # -------------------------
        # Strong passive crisis
        # -------------------------

        if passive >= 0.60:

            crisis_override = True

            final_score = max(final_score, 0.75)

            reasons.append("Strong passive suicidal indicators")

        # -------------------------
        # Emergency
        # -------------------------

        if passive >= 0.80 and hopelessness >= 0.70:

            crisis_override = True

            final_score = 0.90

            reasons.append("Critical crisis override")

        final_score = round(min(final_score, 1), 4)

        if final_score >= 0.85:
            level = "Critical Emergency"

        elif final_score >= 0.55:
            level = "High Risk"

        elif final_score >= 0.35:
            level = "Moderate Risk"

        elif final_score >= 0.15:
            level = "Mild Concern"

        else:
            level = "Safe"

        return {
            "contextual_risk_score": final_score,
            "contextual_risk_level": level,
            "final_context_score": final_score,
            "final_context_level": level,
            "emotion_context_score": round(
                emotion_score,
                4,
            ),
            "pattern_context_score": round(
                pattern_score,
                4,
            ),
            "memory_context_score": round(
                memory_score,
                4,
            ),
            "crisis_override": crisis_override,
            "crisis_probability": max(
                passive,
                hopelessness,
            ),
            "context_reasons": reasons,
        }

    # ==========================================
    # Compatibility
    # ==========================================

    def analyze(
        self,
        emotion_evolution=None,
        conversation_patterns=None,
        memory_context=None,
        base_risk=None,
    ):

        return self.fuse(
            base_risk or {"score": 0},
            emotion_evolution,
            conversation_patterns,
            memory_context,
        )
