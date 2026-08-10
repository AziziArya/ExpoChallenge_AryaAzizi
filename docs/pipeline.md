# AI Analysis Pipeline

## Overview

The Mental Health Safety Analyzer uses a multi-stage AI pipeline to
transform raw conversation data into a structured safety analysis
result.

The pipeline is designed to avoid relying on a single model decision.
Instead, multiple analysis stages generate signals that are combined to
create a safer and more explainable output.

This same pipeline runs regardless of how a message enters the system --
typed text, an uploaded conversation export (Telegram/CSV), a
transcribed audio recording, or a live chatbot conversation all reach
"Raw Conversation" below in the same internal format.

------------------------------------------------------------------------

# Pipeline Flow

    Raw Conversation

            ↓

    Privacy Protection

            ↓

    Text Processing

            ↓

    AI Feature Extraction

            ↓

    Emotion Analysis

            ↓

    Distress Detection

            ↓

    Crisis Detection

            ↓

    Conversation Trend Analysis

            ↓

    Risk Score Calculation

            ↓

    Safety Decision

            ↓

    Explainable Report

------------------------------------------------------------------------

# 1. Input Processing

The pipeline starts by receiving conversation data.

Supported inputs:

-   Anonymous chat messages
-   Conversation history
-   Text-based interactions

The input is validated before entering the analysis system.

Main goals:

-   Ensure correct format
-   Remove invalid data
-   Prepare information for processing

------------------------------------------------------------------------

# 2. Privacy Protection Stage

Before any AI model receives the text, privacy processing is performed.

This stage identifies sensitive information and removes or anonymizes
it.

Protected information includes:

-   Personal names
-   Phone numbers
-   Email addresses
-   Addresses
-   Identification information

This prevents unnecessary exposure of private user data.

------------------------------------------------------------------------

# 3. Text Preparation Stage

The cleaned conversation is prepared for AI analysis.

Operations include:

-   Text normalization
-   Removing unnecessary noise
-   Token preparation
-   Formatting model inputs

The goal is to create consistent input for different AI components.

------------------------------------------------------------------------

# 4. Emotion Analysis

The emotion analysis module evaluates the emotional state of the
conversation.

The system analyzes signals related to:

-   Sadness
-   Fear
-   Anger
-   Happiness
-   Hopelessness
-   Emotional instability

Instead of checking only one sentence, the pipeline can evaluate
emotional changes across multiple messages.

Output example:

    Emotion:
    Sadness: High
    Fear: Medium
    Hope: Low

------------------------------------------------------------------------

# 5. Distress Detection

This stage focuses on detecting emotional distress patterns.

The module evaluates:

-   Stress indicators
-   Negative emotional patterns
-   Isolation signals
-   Loss of motivation
-   Emotional decline

Output:

    Distress Level:
    Low
    Medium
    High

------------------------------------------------------------------------

# 6. Crisis Detection

The crisis detection module searches for serious safety indicators.

Examples:

-   Self-harm related language
-   Extreme hopelessness
-   Emergency expressions
-   Dangerous escalation patterns

This stage provides important signals for risk assessment.

------------------------------------------------------------------------

# 7. Conversation Pattern Analysis

The pipeline also analyzes how the conversation changes over time.

Important factors:

-   Emotional direction
-   Sudden mood changes
-   Repeated negative statements
-   Message behavior changes
-   Escalation speed

This prevents decisions based only on isolated words.

------------------------------------------------------------------------

# 8. Risk Scoring Engine

All previous outputs are combined into a final risk estimation.

Inputs:

-   Emotion scores
-   Distress score
-   Crisis indicators
-   Conversation trends
-   Model confidence

Possible risk categories:

## Safe

Normal conversation without significant safety concerns.

## Mild Concern

Small emotional difficulties detected.

## Moderate Risk

Clear distress signals requiring attention.

## High Risk

Strong indicators of possible crisis.

## Critical Emergency

Immediate safety concern detected.

------------------------------------------------------------------------

# 9. Decision Layer

The decision layer converts analysis results into an understandable
response.

The output includes:

-   Risk level
-   Confidence score
-   Main detected factors
-   Suggested action

The system supports human review for uncertain cases.

------------------------------------------------------------------------

# 10. Explainability Layer

A key part of the pipeline is explaining the final decision.

The report can include:

-   Why the risk level was selected
-   Important conversation signals
-   Emotional changes
-   Confidence information

This makes the AI decision more transparent.

------------------------------------------------------------------------

# Multi-Model Approach

The architecture supports combining different AI models:

Examples:

-   Emotion classification model
-   Distress detection model
-   Crisis detection model
-   Language understanding model

Their outputs can be combined through a decision fusion mechanism.

Benefits:

-   Better reliability
-   Reduced false alarms
-   More balanced predictions

------------------------------------------------------------------------

# Safety-Oriented Design

The pipeline follows several principles:

## No Medical Diagnosis

The system identifies safety signals only.

## Human Support

High-risk or uncertain cases should be reviewed by humans.

## Privacy Preservation

Personal information should not be required for analysis.

## Explainable Decisions

Every important output should have understandable reasoning.

------------------------------------------------------------------------

# Current Implementation Status

Implemented components:

-   API pipeline
-   Privacy layer
-   Safety analysis workflow
-   Risk decision system
-   Automated testing
-   Explainable output structure

Future improvements:

-   Advanced transformer models
-   Real-time dashboard
-   Multi-model fusion
-   Continuous risk tracking
