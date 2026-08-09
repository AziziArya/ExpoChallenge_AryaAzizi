from src.context_memory.memory import ContextMemory
from src.crisis_detector.crisis import CrisisDetector
from src.distress_detector.distress import DistressDetector
from src.emotion_analyzer.emotion import EmotionAnalyzer
from src.fusion_engine.fusion import FusionEngine
from src.privacy_guard.privacy import PrivacyGuard
from src.report_generator.report import SafetyReportGenerator


class MentalHealthAnalyzer:
    """
    Main mental health analysis pipeline.

    Flow:

    Text
      |
      v
    Privacy Guard
      |
      v
    Emotion Analyzer
      |
      v
    Distress Detector
      |
      v
    Crisis Detector
      |
      v
    Fusion Engine
      |
      v
    Safety Report
    """

    def __init__(self):

        self.privacy = PrivacyGuard()

        self.emotion = EmotionAnalyzer()

        self.distress = DistressDetector()

        self.crisis = CrisisDetector()

        self.fusion = FusionEngine()

        self.report_generator = SafetyReportGenerator()

        self.memory = ContextMemory()

    def _extract_emotion_score(self, emotion_result):

        score = 0.0

        if isinstance(emotion_result, list):

            negative_emotions = {
                "sadness",
                "fear",
                "anger",
                "disappointment",
                "grief",
                "remorse",
                "nervousness",
            }

            for item in emotion_result:

                if item.get("emotion") in negative_emotions:

                    score += item.get("score", 0)

        elif isinstance(emotion_result, dict):

            score = emotion_result.get("score", 0)

        return round(min(score, 1.0), 4)

    def analyze(self, text: str):

        # ==========================
        # Privacy
        # ==========================

        privacy_result = self.privacy.process(text)

        anonymized_text = privacy_result["anonymized_text"]

        # ==========================
        # Emotion
        # ==========================

        emotion_result = self.emotion.analyze(anonymized_text)

        emotion_score = self._extract_emotion_score(emotion_result)

        # ==========================
        # Distress
        # ==========================

        distress_result = self.distress.analyze(anonymized_text)

        # ==========================
        # Crisis
        # ==========================

        crisis_result = self.crisis.analyze(anonymized_text)

        # ==========================
        # Memory
        # ==========================

        self.memory.add_entry(
            text,
            {
                "emotion": emotion_result,
                "distress": distress_result,
                "crisis": crisis_result,
                "detected_factors": {
                    "emotion_score": emotion_score,
                    "distress_score": distress_result.get("distress_score", 0),
                    "crisis_score": crisis_result.get("crisis_probability", 0),
                },
            },
        )

        # ==========================
        # Fusion
        # ==========================

        fusion_result = self.fusion.analyze(
            emotion_result, distress_result, crisis_result
        )

        # ==========================
        # Report
        # ==========================

        report = self.report_generator.generate(fusion_result)

        # ==========================
        # Compatibility Output
        # ==========================

        risk_assessment = report.get(
            "risk_assessment",
            {
                "level": fusion_result.get("risk_level", "Unknown"),
                "score": fusion_result.get("final_risk_score", 0),
                "confidence": fusion_result.get("confidence", 0),
            },
        )

        detected_factors = {
            "emotion_score": emotion_score,
            "distress_score": distress_result.get("distress_score", 0),
            "crisis_score": crisis_result.get("crisis_probability", 0),
        }

        return {
            "system": report.get("system", "Mental Health Safety Analyzer"),
            "risk_assessment": risk_assessment,
            "detected_factors": detected_factors,
            "reasons": report.get("reasons", fusion_result.get("reasons", [])),
            "recommended_action": report.get(
                "recommended_action", fusion_result.get("recommended_action", "")
            ),
            "safety_note": report.get(
                "safety_note",
                (
                    "This system provides "
                    "risk assessment support "
                    "and does not provide "
                    "medical diagnosis."
                ),
            ),
            "privacy": privacy_result,
            "emotion": emotion_result,
            "distress": distress_result,
            "crisis": crisis_result,
            "fusion": fusion_result,
            "report": report,
        }
