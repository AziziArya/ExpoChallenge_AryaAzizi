# Privacy and Safety

## Overview

Mental Health Safety Analyzer is designed as a privacy-aware artificial
intelligence prototype for analyzing anonymous conversations and
identifying possible emotional distress, crisis indicators, and changes
in conversation safety levels.

The system is designed to support safety monitoring and human review. It
is not a medical diagnostic system and does not replace professional
mental health services.

------------------------------------------------------------------------

## Privacy Protection Approach

Privacy is one of the main design goals of this project.

Before performing analysis, user conversations should pass through
privacy protection mechanisms to reduce the possibility of exposing
personal information.

The privacy layer focuses on:

-   Removing personally identifiable information (PII)
-   Protecting anonymous conversation data
-   Preventing unnecessary storage of sensitive information
-   Supporting safe AI analysis workflows

------------------------------------------------------------------------

## Personal Information Detection

Detection combines two layers, run together on every message before
any analysis model sees the text:

-   **Regex** for deterministic patterns: emails, phone numbers, URLs,
    IP addresses.
-   **NER (spaCy, `en_core_web_sm`)** for contextual entities: person
    names, locations, organizations. If the NER model isn't installed
    in a given environment, the system logs a warning and falls back
    to regex-only detection instead of failing the request.

Both the original message and the anonymized version are kept (the
anonymized version is what every downstream model -- emotion,
distress, crisis, and the chatbot's LLM calls -- actually sees), along
with a category breakdown of exactly what was found.

Example:

Before:

"Hello, my name is John Smith and my email is john@example.com."

After anonymization:

"Hello, my name is \[PERSON\] and my email is \[EMAIL\]."

Detected entities returned alongside the anonymized text:

```json
{
  "PERSON": ["John Smith"],
  "EMAIL": ["john@example.com"]
}
```

------------------------------------------------------------------------

## AI Safety Principles

The project follows several important safety principles:

### 1. Human Review Support

High-risk predictions should not automatically create final decisions.

The system provides analysis results that can support human evaluation.

### 2. Avoiding False Alarms

Mental health conversations are complex. The system should avoid
treating every negative emotion as a crisis.

Risk decisions should consider:

-   Context
-   Conversation history
-   Emotional changes
-   Confidence score

### 3. Explainable Decisions

The system should provide explanations for predictions.

Examples:

-   Increased hopelessness indicators
-   Crisis-related language patterns
-   Negative emotional progression
-   Sudden conversation deterioration

------------------------------------------------------------------------

## Risk Classification Safety

The analyzer uses risk categories instead of direct medical conclusions.

Example categories:

-   Safe
-   Mild Concern
-   Moderate Risk
-   High Risk
-   Critical Emergency

These categories represent AI confidence levels and safety signals, not
clinical diagnoses.

------------------------------------------------------------------------

## Privacy Across Every Input Channel

Privacy protection isn't limited to typed messages -- it applies
uniformly to every way text can enter the system:

-   **Typed text and pasted conversations** -- anonymized before
    analysis, as described above.
-   **Uploaded files (Telegram exports, CSV)** -- each parsed message
    goes through the same Privacy Guard before analysis.
-   **Audio** -- the transcript produced by the Speech-to-Text module
    is treated exactly like typed text; nothing about the audio
    pipeline bypasses anonymization.
-   **The AI chatbot** -- this is the one channel that sends text to
    an external third-party API (the configured LLM provider). The
    Privacy Guard runs *before* that call, so **the LLM provider only
    ever receives the anonymized version of the person's message**,
    never the raw text with names, emails, or other PII intact.

------------------------------------------------------------------------

## API Key and Secrets Handling

-   `OPENAI_API_KEY` and other configuration values are read from
    environment variables (a `.env` file), never hardcoded in source.
-   If the chatbot's API key is missing, invalid, rate-limited, or the
    provider is unreachable, the chatbot responds with an explicit
    "connection failed" message and logs the failure -- it does not
    crash, and no other feature of the system depends on this key.
-   Every feature except the chatbot (Privacy Guard, file/Telegram
    analysis, speech-to-text) works fully with no external API key
    configured at all.

The system should be evaluated to reduce possible bias caused by:

-   Writing style differences
-   Language patterns
-   Age-related communication differences
-   Gender-related language differences
-   Cultural expression differences

Evaluation should focus on consistent performance across different
conversation styles.

------------------------------------------------------------------------

## Data Handling

Recommended practices:

-   Use anonymized datasets
-   Avoid storing raw private conversations
-   Store only required analysis results
-   Remove unnecessary metadata
-   Protect generated reports

------------------------------------------------------------------------

## Limitations

This system has important limitations:

-   AI predictions can contain errors.
-   Emotional language can have different meanings depending on context.
-   Human supervision is required for sensitive situations.
-   The system cannot understand personal situations like a professional
    counselor.

------------------------------------------------------------------------

## Future Safety Improvements

Implemented in this iteration (previously listed as future work):

-   ~~Advanced privacy-preserving detection~~ -- done (NER + regex
    Privacy Guard, applied uniformly across text, file, audio, and
    chatbot input)

Remaining possible improvements:

-   Better bias evaluation across writing styles and languages
-   Human feedback loops for reviewed cases
-   Improved uncertainty estimation
-   More robust crisis detection models
-   Secure, hosted deployment practices (this prototype currently runs
    locally; a hosted deployment would need its own secrets management
    beyond a local `.env` file)

------------------------------------------------------------------------

## Conclusion

Mental Health Safety Analyzer aims to demonstrate how artificial
intelligence can assist in safer conversation monitoring while
respecting privacy, transparency, and responsible AI principles.
