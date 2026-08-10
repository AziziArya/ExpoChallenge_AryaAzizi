# System Architecture

## Overview

Mental Health Safety Analyzer is a privacy-aware AI system designed to
analyze anonymous mental health conversations and identify emotional
distress, crisis indicators, and changes in conversation risk over time.

The project is designed as a modular pipeline where each component
performs a specific analysis task. The final decision is created by
combining multiple signals instead of relying on a single prediction.

The system is not a medical diagnosis tool. It is a safety assistance
prototype designed to support monitoring, early warning, and human
review.

------------------------------------------------------------------------

# High-Level Architecture

The complete processing flow is:

    Conversation Input

            ↓

    Privacy Guard Layer

            ↓

    Text Preprocessing

            ↓

    Emotion Analysis Module

            ↓

    Distress Detection Module

            ↓

    Crisis Detection Module

            ↓

    Conversation Pattern Analyzer

            ↓

    Context Fusion Engine

            ↓

    Risk Decision Engine

            ↓

    Explainable AI Report Generator

            ↓

    Safety Dashboard / API Output

------------------------------------------------------------------------

# Component Description

## 1. Conversation Input Layer

This layer receives the conversation data that needs to be analyzed,
regardless of how it arrives.

Supported input channels:

-   Typed text (single message or full conversation)
-   Uploaded conversation exports (Telegram JSON/TXT export, CSV)
-   Audio (uploaded file or live microphone recording, transcribed via
    the Speech-to-Text module before entering the pipeline)
-   Live chatbot conversation (each message enters the same pipeline
    in the background as the person chats)

Regardless of source, everything is normalized into the same internal
message format before reaching the Privacy Guard layer -- the rest of
the pipeline has no knowledge of where the text came from.

------------------------------------------------------------------------

## 2. Privacy Guard Layer

Privacy protection is one of the main requirements of the project.

Before any AI analysis happens, sensitive information is detected and
anonymized -- replaced with a category placeholder (e.g. `[PERSON]`,
`[EMAIL]`) rather than simply removed, so the surrounding sentence
structure is preserved for analysis.

Detection uses two combined layers:

-   **Regex** for deterministic patterns: emails, phone numbers, URLs,
    IP addresses.
-   **NER (spaCy)** for contextual entities: person names, locations,
    organizations. If the NER model isn't available in a given
    environment, the system logs a warning and falls back to
    regex-only detection rather than failing.

Both the original text and the anonymized text are preserved (the
anonymized version is what reaches every downstream model; the
original is retained for display and audit purposes), along with a
breakdown of exactly what was detected, by category.

------------------------------------------------------------------------

## 3. Text Preprocessing Layer

This module prepares the text for AI models.

Main operations:

-   Cleaning unnecessary characters
-   Normalizing text
-   Preparing model input
-   Tokenization

This step ensures that the input format is compatible with the analysis
models.

------------------------------------------------------------------------

## 4. Emotion Analysis Module

The emotion analysis component studies emotional signals inside the
conversation.

Detected emotional states may include:

-   Sadness
-   Fear
-   Anger
-   Happiness
-   Hopelessness
-   Emotional instability

Instead of analyzing a single message, the system can evaluate emotional
changes throughout the conversation.

------------------------------------------------------------------------

## 5. Distress Detection Module

This module focuses on identifying signs of emotional difficulty.

Examples:

-   High stress indicators
-   Severe sadness
-   Isolation signals
-   Loss of motivation
-   Emotional deterioration

The output is a distress level estimation.

------------------------------------------------------------------------

## 6. Crisis Detection Module

The crisis detector searches for stronger safety-related signals.

Examples:

-   Self-harm related expressions
-   Emergency situations
-   Extreme hopelessness
-   Dangerous escalation patterns

The goal is early identification of high-risk conversations.

------------------------------------------------------------------------

## 7. Conversation Pattern Analyzer

This module analyzes the overall structure of the conversation.

Important signals:

-   Emotional trend
-   Message length changes
-   Repeated negative patterns
-   Sudden tone changes
-   Increasing risk over time

This allows the system to understand conversation evolution instead of
isolated sentences.

------------------------------------------------------------------------

## 8. Context Fusion Engine

Different AI modules produce different signals.

The context fusion engine combines:

-   Emotion results
-   Distress score
-   Crisis indicators
-   Conversation patterns
-   Confidence values

The purpose is to create a more reliable final understanding.

------------------------------------------------------------------------

## 9. Risk Decision Engine

This module converts all collected information into a final safety
decision.

Possible outputs:

-   Safe
-   Mild Concern
-   Moderate Risk
-   High Risk
-   Critical Emergency

The decision engine also considers model confidence and uncertainty.

------------------------------------------------------------------------

## 10. Explainable AI Report Generator

The system should not only provide a result.

It should explain why the decision was made.

Generated explanations may include:

-   Important detected signals
-   Emotional changes
-   Risk factors
-   Confidence score
-   Recommended next action

This improves transparency and trust.

------------------------------------------------------------------------

## 11. Conversation File Import Module

Parses uploaded conversation exports into the same internal message
list every other input channel uses.

Supported formats:

-   Telegram Desktop JSON export (single chat, and the "all chats"
    multi-chat export wrapper)
-   Telegram Desktop plain-text export
-   Generic CSV with a `message`/`text` column

Service (non-service, e.g. joined chat / pinned message) events in
Telegram exports are filtered out before analysis, since they aren't
conversation content.

------------------------------------------------------------------------

## 12. Speech-to-Text Module

Converts an uploaded or recorded audio file into a transcript before
it enters the same pipeline used for typed text.

Engine chain, tried in order:

1.  **OpenAI Whisper API** -- only attempted if an API key is
    configured; highest accuracy.
2.  **Google Web Speech (free, keyless)** -- default engine, no API
    key or local model required.
3.  **Local Whisper (faster-whisper, CPU)** -- offline fallback,
    loaded lazily.

Each engine is independent; if one is unavailable in a given
environment, the chain falls through to the next rather than failing
the whole request.

------------------------------------------------------------------------

## 13. AI Chatbot with Background Safety Monitoring

A conversational assistant (OpenAI Responses API) that the person
chats with normally, while every message is transparently analyzed by
the *same* safety pipeline described above -- in parallel, not as a
separate feature bolted on afterward.

-   The chatbot's replies are generated independently of the safety
    decision; the current risk level only adjusts *tone* (e.g. more
    supportive, gently encouraging outside support at high risk) --
    the chatbot never announces that it detected anything or performs
    its own risk classification.
-   Each turn is persisted immediately (not just at the end of the
    conversation), so a session can always be resumed exactly where
    it was left.
-   If no API key is configured, or a call fails for any reason
    (invalid key, timeout, provider outage), the chatbot returns an
    explicit "connection failed" message rather than a disguised
    fallback reply -- failures are visible, not hidden.
-   Conversation history sent to the model is windowed (most recent
    ~20 messages) so cost and latency don't grow unbounded as a chat
    gets longer; the full history is still used for the safety
    analysis.

------------------------------------------------------------------------

The backend service is built to expose analysis functionality through
APIs.

Main responsibilities:

-   Receive conversation data
-   Execute the analysis pipeline
-   Return structured safety results
-   Provide explainable outputs

Technology:

-   FastAPI
-   Python
-   AI inference modules

------------------------------------------------------------------------

# Design Principles

## Modular Design

Each component is separated to allow:

-   Easier development
-   Independent testing
-   Future model replacement
-   Better maintainability

------------------------------------------------------------------------

## Privacy First

The system prioritizes:

-   Anonymous processing
-   Data minimization
-   Protection of sensitive information

------------------------------------------------------------------------

## Explainability

Every important decision should provide understandable reasons.

The system avoids becoming a black-box classifier.

------------------------------------------------------------------------

## Human Review Support

For uncertain or high-risk cases, the system supports human evaluation
instead of fully automated decisions.

------------------------------------------------------------------------

# Future Architecture Expansion

Implemented in this iteration (previously listed as future work):

-   ~~Multi-model AI fusion~~ -- done (Context Fusion Engine)
-   ~~Human review workflow~~ -- done (Decision Engine flags cases for review)

Remaining possible future improvements:

-   Live token-by-token streaming of chatbot replies to the UI
    (currently the Responses API stream is consumed server-side and
    returned as one complete reply)
-   Fairness evaluation module
-   Multilingual support
-   Real database migrations (Alembic is already a dependency but not
    yet wired in -- schema changes currently require deleting the
    SQLite file in development)
-   Federated / privacy-preserving learning for future model training
