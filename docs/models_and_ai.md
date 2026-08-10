# Models and AI Components

## Overview

The Mental Health Safety Analyzer is designed to work with modern
artificial intelligence techniques for understanding emotional states,
detecting distress signals, and supporting safer conversation analysis.

The project architecture allows AI models to be replaced or improved
without changing the complete system.

The current version focuses on a modular AI approach where different
models can provide different analysis signals.

------------------------------------------------------------------------

# AI Model Strategy

Instead of depending on one single prediction model, the system follows
a multi-component approach.

Each AI component analyzes a specific aspect of the conversation:

    Emotion Model

            +

    Distress Detection Model

            +

    Crisis Detection Model

            +

    Context Analysis

            ↓

    Final Safety Decision

This approach improves reliability because safety decisions are based on
multiple indicators.

------------------------------------------------------------------------

# 1. Emotion Analysis Model

## Purpose

The emotion model identifies emotional signals inside conversation text.

The goal is not only detecting one emotion but understanding the
emotional condition of the conversation.

Possible detected emotions:

-   Sadness
-   Fear
-   Anger
-   Happiness
-   Hopelessness
-   Emotional instability

------------------------------------------------------------------------

## Output Example

The emotion model is a real transformer, not a placeholder: the
GoEmotions-tuned `SamLowe/roberta-base-go_emotions` model (via Hugging
Face `transformers`), run as a multi-label classifier so more than one
emotion can be detected per message.

Example output:

    Emotion Analysis:

    Sadness: 0.82

    Fear: 0.45

    Hope: 0.20

    Anger: 0.15

These values are used by later stages of the pipeline.

------------------------------------------------------------------------

# 2. Distress Detection Model

## Purpose

The distress model evaluates whether the conversation contains signs of
emotional difficulty.

Signals include:

-   High stress
-   Negative thinking patterns
-   Isolation
-   Loss of motivation
-   Emotional decline

------------------------------------------------------------------------

## Output

Example:

    Distress Score:

    0.76

    Level:

    High Distress

The distress score becomes one of the inputs for risk calculation.

------------------------------------------------------------------------

# 3. Crisis Detection Model

## Purpose

The crisis detection component focuses on identifying severe
safety-related signals.

Examples:

-   Self-harm related expressions
-   Extreme hopelessness
-   Emergency situations
-   Dangerous escalation patterns

------------------------------------------------------------------------

## Safety Considerations

This model does not diagnose a person.

It only detects language patterns that may require additional attention
or human review.

------------------------------------------------------------------------

# 4. Language Processing Models

Models actually used in this pipeline, by task:

| Task | Model / Library |
|---|---|
| Emotion classification | `SamLowe/roberta-base-go_emotions` (Transformers) |
| Personal information detection (NER) | spaCy `en_core_web_sm` |
| Speech-to-text (best case) | OpenAI Whisper API |
| Speech-to-text (default, free) | Google Web Speech (via `SpeechRecognition`) |
| Speech-to-text (offline fallback) | `faster-whisper` (local, CPU) |
| Chatbot conversational replies | Configurable LLM via the OpenAI Responses API (any OpenAI-compatible provider) |

Distress and crisis detection currently use rule/lexicon-based scoring
rather than a dedicated trained model -- see "Future Model
Improvements" below for the planned upgrade path.

------------------------------------------------------------------------

# 4a. Privacy Guard NER Model

Personal information detection (names, locations, organizations) uses
spaCy's `en_core_web_sm` statistical NER model, combined with regex for
deterministic patterns (emails, phone numbers, URLs, IPs). If the
spaCy model isn't installed in a given environment, the system falls
back to regex-only detection rather than failing -- this is a
deliberate resilience choice, not a bug: partial PII protection is
better than none, and the failure is logged clearly either way.

------------------------------------------------------------------------

# 4b. Speech-to-Text Models

Three engines, tried in order, each independent of the others:

1.  **OpenAI Whisper API** -- highest accuracy, only attempted if
    `OPENAI_API_KEY` is configured.
2.  **Google Web Speech** -- free, no API key or local model, the
    default engine for this project.
3.  **Local Whisper (`faster-whisper`, `tiny` model, CPU)** -- fully
    offline fallback, loaded lazily on first use.

Whichever engine actually produces the transcript is reported back in
the API response (`engine: "openai_whisper_api" | "google_free" |
"local_whisper"`), so it's always clear which one was used.

------------------------------------------------------------------------

# 4c. Chatbot Language Model

The chatbot uses OpenAI's **Responses API** (`client.responses.create`,
with `stream=True`), which is the current recommended interface for
the GPT-5.6 model family. The model, temperature, timeout, and even
the API base URL are all configuration (environment variables), not
hardcoded -- the same code works against any OpenAI-compatible
endpoint (e.g. Google Gemini's OpenAI-compatible endpoint) by changing
`OPENAI_BASE_URL` and `OPENAI_CHAT_MODEL`, with no code changes.

The chatbot does not perform its own risk classification. The current
risk level from the safety pipeline is passed into its system prompt
as context, which only ever adjusts *tone* -- the chatbot never
announces that it detected a specific risk level or condition.

------------------------------------------------------------------------

# 5. Model Fusion System

A major part of the architecture is combining multiple AI outputs.

Example:

    Emotion Score       35%

    Distress Score      40%

    Crisis Score        25%

            ↓

    Risk Calculation

            ↓

    Final Result

The fusion system reduces dependency on a single model.

Advantages:

-   Better accuracy
-   Lower false alarms
-   More stable decisions

------------------------------------------------------------------------

# 6. Explainable AI (XAI)

The system is designed to provide explanations with predictions.

Instead of only returning:

    Risk: High

The system can provide:

    Risk: High

    Reasons:

    - Increased hopelessness detected
    - Negative emotional trend observed
    - Crisis-related expressions identified

    Confidence:

    87%

This improves transparency.

------------------------------------------------------------------------

# 7. Confidence Estimation

Every prediction should include a confidence value.

Example:

    Prediction:

    Moderate Risk

    Confidence:

    74%

If confidence is low:

-   The system should avoid strong conclusions.
-   Human review can be recommended.

------------------------------------------------------------------------

# 8. Future Model Improvements

Implemented in this iteration (previously listed as future work):

-   ~~Deep learning emotion model~~ -- done (`roberta-base-go_emotions`)
-   ~~NER-based entity detection~~ -- done (spaCy Privacy Guard)
-   ~~Speech-to-text integration~~ -- done (3-tier engine chain)
-   ~~Conversational AI integration~~ -- done (chatbot via OpenAI
    Responses API)

Remaining possible upgrades:

## Trained Distress/Crisis Models

Replacing the current rule/lexicon-based distress and crisis scoring
with models fine-tuned on labeled mental-health-safety data.

## Fine-Tuned Safety Models

Training specialized models on mental health safety datasets.

## Multi-Model Ensemble

Combining several independent models for stronger predictions.

## Continuous Learning

Improving performance using new evaluation data.

------------------------------------------------------------------------

# Current AI Implementation Status

Current system capabilities:

-   Real transformer-based emotion classification (not a placeholder)
-   NER-based personal information detection with regex fallback
-   Rule-based distress and crisis scoring, fused with emotion signals
-   Three-tier speech-to-text engine chain (paid → free → offline)
-   Configurable, provider-agnostic chatbot LLM integration
-   Explainable safety outputs with confidence and reasons
-   Modular architecture -- every model above can be swapped
    independently without touching the rest of the pipeline

Future versions can integrate more advanced trained models (see
below) while keeping the same pipeline design.
