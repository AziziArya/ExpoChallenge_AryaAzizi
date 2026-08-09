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

    def _safe_dict(self, value):

        if isinstance(value, dict):
            return value

        return {}

    def _normalize_emotion(self, emotion):

        if isinstance(emotion, dict):
            return emotion

        if isinstance(emotion, list):

            result = {}

            for item in emotion:

                if isinstance(item, dict):

                    name = item.get("emotion")

                    score = item.get("score", 0)

                    if name:
                        result[name] = score

            return result

        return {}

    def _analyze_all_messages(self, messages, prior_analyses=None):
        """
        Analyzes every message exactly once and builds both the
        per-message timeline and the raw analyses list from that same
        pass. Previously each message was analyzed twice (once for the
        timeline, once for `analyses`), which doubled pipeline latency
        -- noticeable on large uploaded conversations.

        Identical message text (very common in real chat exports --
        "ok", "😂", "yes", short reaction-style messages) is analyzed
        once and the cached result is reused, instead of re-running the
        full emotion/distress/crisis pipeline for every repeat.

        `prior_analyses`, if given, is a list of already-computed
        analyze() results for the first N messages (e.g. from a chat
        session's earlier turns). Only messages beyond that prefix are
        actually run through the pipeline -- this is what keeps a
        growing chat conversation fast: turn 10 doesn't re-analyze
        turns 1-9 again, it only analyzes the newest message.
        """

        prior_analyses = list(prior_analyses) if prior_analyses else []

        analyses = list(prior_analyses)

        cache = {
            msg: result
            for msg, result in zip(messages[: len(prior_analyses)], prior_analyses)
        }

        for message in messages[len(prior_analyses):]:

            if message in cache:
                result = cache[message]
            else:
                result = self.analyzer.analyze(message)
                cache[message] = result

            analyses.append(result)

        timeline = []

        for index, (message, result) in enumerate(zip(messages, analyses)):

            risk = result.get("risk_assessment", {})
            privacy = result.get("privacy", {})

            timeline.append(
                {
                    "message_number": index + 1,
                    "timestamp": self._timestamp(),
                    "message": message,
                    "risk_level": risk.get("level", "Unknown"),
                    "risk_score": risk.get("score", 0),
                    "privacy": {
                        "anonymized_text": privacy.get("anonymized_text", message),
                        "pii_detected": privacy.get("pii_detected", False),
                        "entity_count": privacy.get("entity_count", 0),
                    },
                }
            )

        return timeline, analyses

    def _build_privacy_summary(self, analyses):

        total_entities = 0
        messages_with_pii = 0
        categories = {}

        for item in analyses:

            privacy = self._safe_dict(item.get("privacy", {}))

            entity_count = privacy.get("entity_count", 0)

            if entity_count:
                messages_with_pii += 1

            total_entities += entity_count

            for category, values in privacy.get("detected_entities", {}).items():
                categories[category] = categories.get(category, 0) + len(values)

        return {
            "privacy_guard_active": True,
            "messages_with_pii": messages_with_pii,
            "total_entities_removed": total_entities,
            "categories": categories,
        }

    def analyze_conversation(self, messages):
        result, _analyses = self._analyze_conversation_internal(messages)
        return result

    def analyze_conversation_with_state(self, messages, prior_analyses=None):
        """
        Same output as analyze_conversation, but also returns the raw
        per-message analyses list so a caller can persist it and pass
        it back in as `prior_analyses` next time -- used by the chat
        endpoint so each new turn only analyzes the newest message
        instead of re-analyzing the whole conversation from scratch.
        """
        return self._analyze_conversation_internal(messages, prior_analyses)

    def _analyze_conversation_internal(self, messages, prior_analyses=None):

        conversation_id = str(uuid.uuid4())

        timeline, analyses = self._analyze_all_messages(messages, prior_analyses)

        privacy_summary = self._build_privacy_summary(analyses)

        emotion_history = []

        crisis_history = []

        for item in analyses:

            emotion_history.append(self._normalize_emotion(item.get("emotion", {})))

            crisis_history.append(self._safe_dict(item.get("crisis", {})))

        emotion_result = (
            self.emotion_evolution.analyze(emotion_history, crisis_history) or {}
        )

        pattern_result = self.pattern_analyzer.analyze(messages) or {}

        latest = analyses[-1]

        base_risk = self._safe_dict(latest.get("risk_assessment", {}))

        memory_context = {
            "conversation_length": len(messages),
            "previous_risk": "Unknown",
            "current_risk_score": 0,
            "risk_change": 0,
            "trend": "Stable",
        }

        # ==========================
        # Context Fusion (FIXED)
        # ==========================

        fusion_result = (
            self.context_fusion.analyze(
                emotion_evolution=emotion_result,
                conversation_patterns=pattern_result,
                memory_context=memory_context,
                base_risk=base_risk,
            )
            or {}
        )

        # ==========================
        # Decision
        # ==========================

        decision = self.decision_engine.decide(
            base_risk, fusion_result, emotion_result, pattern_result, memory_context
        )

        # ==========================
        # Add pattern explanations
        # ==========================

        pattern_indicators = pattern_result.get("risk_indicators", [])

        decision_reasons = decision.get("decision_reasons", [])

        decision["decision_reasons"] = list(
            dict.fromkeys(decision_reasons + pattern_indicators)
        )

        # ==========================
        # XAI
        # ==========================

        explanation = self.xai_engine.generate(decision, memory_context) or {}

        # ==========================
        # Safety response
        # ==========================

        safety_response = self.response_generator.generate(decision, messages[-1])

        scores = [x.get("risk_score", 0) for x in timeline]

        if len(scores) > 1 and scores[-1] > scores[0]:

            risk_trend = "Increasing"

        elif len(scores) > 1 and scores[-1] < scores[0]:

            risk_trend = "Decreasing"

        else:

            risk_trend = "Stable"

        return {
            "conversation_id": conversation_id,
            "message_count": len(messages),
            "timeline": timeline,
            "overall_risk": {
                "level": decision.get("final_risk_level", "Unknown"),
                "score": decision.get("final_risk_score", 0),
            },
            "risk_trend": risk_trend,
            "privacy_summary": privacy_summary,
            "emotion_evolution": emotion_result,
            "conversation_patterns": pattern_result,
            "memory_context": memory_context,
            "context_fusion": fusion_result,
            "decision": decision,
            "explainability": explanation,
            "safety_response": safety_response,
        }, analyses
