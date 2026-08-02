# Product Vision

## Overview

Mental Health Safety Analyzer is an AI-assisted conversation safety platform designed to help professionals better understand mental health conversations through explainable artificial intelligence.

The system is not designed to replace psychologists or psychiatrists.

Instead, it acts as an intelligent analysis assistant that processes conversations, detects emotional and behavioral patterns, evaluates safety risks, and produces transparent reports that support human decision making.

Unlike traditional chatbots, the platform combines multiple specialized AI modules—including emotion analysis, distress detection, crisis detection, conversation pattern recognition, context memory, and fusion-based decision making—into a single explainable analysis pipeline.

The long-term vision is to evolve the platform into a Clinical Decision Support System (CDSS) capable of assisting mental health professionals by summarizing conversations, monitoring emotional evolution across multiple sessions, and highlighting potential safety concerns before therapy sessions.

At every stage, diagnosis, treatment, and all clinical decisions remain entirely under the responsibility of qualified healthcare professionals.

## Core Philosophy

Artificial Intelligence should assist professionals.

Artificial Intelligence should never replace professionals.

The platform prioritizes:

- Transparency
- Explainability
- Privacy
- Human Supervision
- Responsible AI
- Ethical Decision Support

# Product Goals

## Primary Goal

The primary goal of the platform is to assist mental health professionals by transforming long and complex conversations into structured, explainable, and safety-oriented insights.

The system should help professionals quickly understand emotional progression, distress indicators, crisis signals, and conversation dynamics without replacing clinical judgment.

---

## Secondary Goals

The platform should:

- Detect emotional patterns.
- Detect distress indicators.
- Detect crisis signals.
- Monitor emotional evolution.
- Analyze long conversations.
- Combine multiple AI modules into a single explainable decision.
- Protect user privacy.
- Generate transparent reports.
- Support responsible AI practices.

---

## Non Goals

The platform is NOT intended to:

- Diagnose mental illnesses.
- Replace psychologists.
- Replace psychiatrists.
- Provide medical treatment.
- Make autonomous clinical decisions.
- Replace emergency services.

---

## Product Principles

Every feature developed for the platform should satisfy the following principles:

1. Explainability before complexity.

Every AI decision must be understandable.

2. Human supervision before automation.

The AI assists professionals but never replaces them.

3. Privacy by design.

Personal information should always be protected before analysis.

4. Safety first.

Whenever uncertainty exists, the platform should prioritize human review.

5. Clinical usability.

Every output should help professionals make faster and better-informed decisions.

6. Modular AI architecture.

Every AI module should be replaceable without affecting the overall system architecture.

---

## Success Criteria

A successful version of the platform should enable professionals to:

- Understand conversation risks within seconds.
- Identify emotional deterioration.
- Detect possible crisis situations.
- Review explainable reasoning behind every decision.
- Receive structured reports instead of reading hundreds of raw messages.

---

## Long-Term Mission

To build one of the most transparent, explainable, privacy-preserving, and clinically useful AI conversation safety platforms for mental health support.

# User Personas

## Primary Persona

### Mental Health Professional

Role:
Psychologist, Psychiatrist, Therapist, Counselor

Goals:

- Quickly understand long conversations.
- Monitor emotional progression.
- Detect crisis indicators.
- Review explainable AI analysis.
- Save time before therapy sessions.

Pain Points:

- Reading long conversations is time-consuming.
- Important emotional changes may be missed.
- Difficult to monitor long-term progression.

The platform should present information clearly, visually, and without overwhelming the professional.

---

## Secondary Persona

### AI Researcher

Role:
Machine Learning Researcher

Goals:

- Analyze model outputs.
- Evaluate explainability.
- Compare AI module performance.
- Inspect Fusion Engine behavior.
- Test research ideas.

The interface should expose detailed technical information when needed.

---

## Third Persona

### Software Developer

Role:
Backend / Frontend Developer

Goals:

- Test APIs.
- Debug responses.
- Validate pipeline outputs.
- Inspect JSON responses.
- Extend the platform.

The platform should remain modular and API-first.

------------------------------------------------------------------------

# User Journey

## Clinical Workflow

Conversation

↓

AI Analysis

↓

Emotion Detection

↓

Distress Detection

↓

Crisis Detection

↓

Context Fusion

↓

Risk Assessment

↓

Explainable Report

↓

Psychologist Review

↓

Clinical Decision

---

The interface should support this flow visually and naturally.

------------------------------------------------------------------------

# Information Architecture

Landing

Dashboard

Conversation Analysis

Conversation History

Risk Timeline

Explainability Report

Generated Reports

API Documentation

Project Documentation

About

Settings

404

Loading

------------------------------------------------------------------------

# Page Hierarchy

Landing

↓

Dashboard

├── Conversation Analysis

├── Risk Overview

├── Emotion Timeline

├── Explainability

├── Reports

├── History

└── Settings

The Dashboard acts as the central hub of the platform.

Every major feature should be reachable within one or two interactions.

Navigation should remain minimal, clean, and highly focused.

------------------------------------------------------------------------

# Feature Map

The platform is composed of multiple independent but connected AI modules.

Core Features:

- Conversation Analysis
- Emotion Analysis
- Distress Detection
- Crisis Detection
- Conversation Pattern Analysis
- Context Memory
- Context Fusion
- Final Decision Engine
- Explainability
- Privacy Guard
- Safe Response Generation
- Report Generation

Every feature should be represented as an independent UI module while remaining connected through a unified workflow.

The interface must clearly visualize how information flows from one module to another instead of presenting isolated results.

------------------------------------------------------------------------

# Backend Integration Rules

The frontend must be designed as an API-first application.

No component should generate artificial or hardcoded data.

Every visual element should receive its information from backend responses.

General Flow

Frontend

↓

API

↓

Backend

↓

AI Pipeline

↓

Database

↓

JSON Response

↓

UI Components

Every component must be reusable and driven by API responses.

Examples:

Risk Card

Source:

decision.final_level

Emotion Timeline

Source:

emotion_history

Conversation Viewer

Source:

messages

Explainability Panel

Source:

xai.reasons

Distress Card

Source:

distress.score

Fusion Summary

Source:

fusion.summary

Report Page

Source:

report_generator

The frontend should remain independent of the internal implementation of the AI models.

Only documented API responses should be used.

------------------------------------------------------------------------

# UX Principles

The platform follows a Human-Centered AI philosophy.

The interface should always prioritize clarity over decoration.

Core UX Principles

1. Explain before displaying.

Every AI decision should include an explanation.

2. Reduce cognitive load.

Large conversations should be transformed into meaningful summaries.

3. Progressive disclosure.

Show essential information first.

Advanced technical details should appear only when requested.

4. Clinical workflow oriented.

The interface should match the natural workflow of mental health professionals.

5. Never overwhelm the user.

Only display the information required for the current decision.

6. Visual hierarchy.

Critical alerts should immediately attract attention.

Normal information should remain visually calm.

7. AI should feel trustworthy.

Animations, colors, typography, and layout should communicate confidence and stability rather than entertainment.

8. Every interaction must have purpose.

No unnecessary buttons, cards, or animations should exist.

Every UI element should directly support conversation understanding or clinical decision support.

------------------------------------------------------------------------

# UI Philosophy

The user interface should communicate professionalism, trust, intelligence, and simplicity.

The platform is not a social application, chatbot, or medical software.

It is an AI-assisted decision support platform.

The interface should feel:

- Calm
- Clean
- Modern
- Minimal
- Professional
- Explainable
- Data-driven

Visual inspiration comes from products such as:

- OpenAI Platform
- ChatGPT
- Linear
- Vercel
- Notion
- Raycast

Avoid:

- Material Design appearance
- Overly colorful interfaces
- Gaming-style effects
- Medical dashboard stereotypes
- Heavy gradients
- Unnecessary glassmorphism

Every screen should communicate confidence and clarity.

------------------------------------------------------------------------

# Visual Identity

Design Keywords

- Modern
- Minimal
- Professional
- AI-native
- Trustworthy
- Clinical
- Elegant
- Focused

The interface should prioritize whitespace and readability over decorative elements.

Every screen should have a single visual focus.

The AI should appear intelligent through organization rather than visual complexity.

------------------------------------------------------------------------

# Color System

Primary

Blue

Purpose:

Trust

Artificial Intelligence

Technology

Professionalism

Secondary

Purple

Purpose:

Explainability

AI Processing

Fusion Engine

Accent

Cyan

Purpose:

Interactive Elements

Highlights

Information

Success

Green

Purpose:

Safe

Completed

Healthy

Warning

Amber

Purpose:

Attention Required

Moderate Risk

Danger

Red

Purpose:

High Risk

Critical Emergency

Background

Very Light Gray

or

Pure White

Dark Mode

Deep Gray

instead of pure black.

Never use saturated colors for large surfaces.

Colors should primarily communicate system state rather than decoration.

------------------------------------------------------------------------

# Typography

Primary Font

Inter

Fallback

Segoe UI

Helvetica

Arial

Hierarchy

H1

Large

Bold

Dashboard Titles

H2

Section Titles

H3

Component Titles

Body

Regular

Readable

Caption

Small

Muted

Numbers

Risk Score

Confidence

Statistics

Should use tabular figures whenever possible.

Text should remain highly readable on both desktop and laptop displays.

Avoid decorative typography.

------------------------------------------------------------------------

# Layout Rules

The interface should be designed using a dashboard-first approach.

Every page should have one clear primary purpose.

Large empty spaces are encouraged.

Content should breathe.

Avoid crowded layouts.

Each page should contain:

- One primary section
- One secondary section
- One optional side panel

Maximum content width:

1440px

Content Container

Centered

Responsive

Never stretch content across the entire screen.

------------------------------------------------------------------------

# Grid System

Desktop

12-column grid

Tablet

8-column grid

Mobile

4-column grid

Recommended spacing between columns:

24px

Outer margins:

Desktop

64px

Tablet

40px

Mobile

20px

Cards should align perfectly with the grid.

No arbitrary positioning.

------------------------------------------------------------------------

# Spacing System

Use an 8-point spacing system.

Spacing Scale

4

8

12

16

24

32

40

48

64

80

96

128

Every padding and margin should use this scale.

Never use random values.

------------------------------------------------------------------------

# Border Radius

Cards

20px

Buttons

14px

Inputs

14px

Modal

24px

Charts

20px

Images

20px

Avoid sharp corners.

Avoid extremely rounded components.

The overall appearance should feel modern and premium.

------------------------------------------------------------------------

# Elevation & Shadows

Use very soft shadows.

Never use heavy shadows.

Cards

Small shadow

Hover

Medium shadow

Modal

Large soft shadow

Danger Cards

Slight red glow

Success Cards

Slight green glow

Critical Alerts

Soft red border

instead of aggressive shadows.

The interface should feel lightweight and elegant.

------------------------------------------------------------------------

# Responsive Rules

Desktop is the primary target.

Tablet support is mandatory.

Mobile support should preserve functionality without removing critical information.

Cards should stack vertically on small screens.

Charts should become scrollable instead of shrinking excessively.

The Sidebar should collapse into a navigation drawer on tablet and mobile devices.

------------------------------------------------------------------------

# Interaction Rules

Every interactive element must provide feedback.

Hover

Elevation increase

Click

Subtle scale animation

Loading

Skeleton

Success

Smooth transition

Errors

Clear message

No interaction should feel abrupt.

------------------------------------------------------------------------

# State Design

Every screen should support the following states.

Loading

Empty

Success

Error

Offline

No page should ever appear blank.

------------------------------------------------------------------------

# Component Library

The platform should be built using reusable components.

Every component must be independent, modular, and backend-driven.

No component should depend on hardcoded values.

All components receive data through API responses.

------------------------------------------------------------------------

# Navigation

Top Navigation

Purpose

Global navigation

Contains

- Logo
- Current page
- Search
- Theme switch
- User menu

Behavior

Sticky

Always visible

------------------------------------------------------------------------

# Sidebar

Purpose

Primary navigation

Contains

- Dashboard
- Conversation Analysis
- Reports
- History
- Documentation
- Settings

Behavior

Collapsible

Responsive

------------------------------------------------------------------------

# Button

Variants

Primary

Secondary

Ghost

Danger

Success

Loading

Disabled

Animations

Hover

Active

Loading

------------------------------------------------------------------------

# Input

Supports

- Text
- Search
- Password
- Email

Validation

Real-time

Error State

Success State

Disabled State

------------------------------------------------------------------------

# Search Box

Supports

Conversation Search

Patient Search

Keyword Search

Should include keyboard shortcut support.

------------------------------------------------------------------------

# Card

Base component for the entire platform.

Variants

Default

Interactive

Report

Statistics

AI

Critical

Cards should never exceed one primary purpose.

------------------------------------------------------------------------

# Badge

Variants

Safe

Low Risk

Moderate

High

Critical

Processing

Completed

Failed

------------------------------------------------------------------------

# Alert

Variants

Info

Warning

Success

Error

Critical

Alerts should never block the workflow unnecessarily.

------------------------------------------------------------------------

# Modal

Used for

Reports

Details

Settings

Export

Should support keyboard navigation.

------------------------------------------------------------------------

# Tooltip

Explain AI terminology.

Explain metrics.

Explain confidence.

Should appear instantly without delay.

------------------------------------------------------------------------

# Loading Skeleton

Every page must have skeleton loading.

Never show empty white screens.

------------------------------------------------------------------------

# Empty State

Every empty page should explain

Why it is empty

How to continue

Recommended next action

------------------------------------------------------------------------

# Toast Notification

Success

Warning

Error

Info

Should automatically disappear.

------------------------------------------------------------------------

# Tabs

Used for

Conversation

Timeline

Report

Explainability

History

API

------------------------------------------------------------------------

# Accordion

Used for

Detailed explanations

Advanced AI reasoning

Technical information

------------------------------------------------------------------------

# Progress Indicator

Used during

Conversation Analysis

Pipeline Execution

Report Generation

Should visualize progress rather than simply spinning.

------------------------------------------------------------------------

# Divider

Use subtle separators.

Never use heavy borders.

Whitespace is preferred.

------------------------------------------------------------------------

# AI Components

Unlike traditional dashboards, this platform should visualize how artificial intelligence reaches its final decision.

The AI itself should become part of the user experience.

The goal is not only to display the result, but also to explain the reasoning process.

------------------------------------------------------------------------

# AI Pipeline Viewer

Purpose

Visualize the complete AI analysis pipeline.

Pipeline

Conversation

↓

Privacy Guard

↓

Emotion Analysis

↓

Distress Detection

↓

Crisis Detection

↓

Conversation Pattern Analysis

↓

Context Memory

↓

Fusion Engine

↓

Decision Engine

↓

Explainability

↓

Safe Response

Each module should activate sequentially during analysis.

Completed modules become highlighted.

The currently running module should display subtle animation.

------------------------------------------------------------------------

# Emotion Timeline

Purpose

Visualize emotional evolution throughout the conversation.

Display

Positive

Neutral

Sadness

Fear

Anger

Hopelessness

Stress

Hovering over any point should display the corresponding conversation message.

------------------------------------------------------------------------

# Risk Meter

Purpose

Display the overall conversation risk.

Risk Levels

Safe

Low

Moderate

High

Critical

Instead of displaying only percentages, combine

Color

Label

Confidence

Trend

The component should immediately communicate urgency.

------------------------------------------------------------------------

# Distress Card

Display

Distress Score

Severity

Primary Indicators

Detected Signals

Trend

------------------------------------------------------------------------

# Crisis Detector Panel

Display

Detected crisis phrases

Critical keywords

Confidence

Detected evidence

The panel should clearly explain why the conversation was classified as high risk.

------------------------------------------------------------------------

# Fusion Engine Card

Purpose

Show how different AI modules contributed to the final decision.

Example

Emotion

32%

Distress

25%

Crisis

28%

Conversation Pattern

15%

↓

Final Decision

This should visually communicate that the platform combines multiple AI systems instead of relying on a single model.

------------------------------------------------------------------------

# Explainability Panel

Purpose

Provide transparent reasoning.

Display

Top contributing factors

Detected emotional progression

Conversation deterioration

Detected crisis evidence

Decision explanation

Confidence explanation

The explanation should be written in natural language.

------------------------------------------------------------------------

# Confidence Indicator

Purpose

Display model confidence.

Low confidence should encourage human review.

High confidence should still remind users that AI is an assistant rather than a decision maker.

------------------------------------------------------------------------

# Conversation Heatmap

Purpose

Highlight the emotional intensity of different conversation segments.

Each message should receive an intensity color.

Users should immediately identify where emotional escalation occurred.

------------------------------------------------------------------------

# Clinical Summary Card

Purpose

Generate a concise summary for professionals.

Sections

Conversation Summary

Emotional Trend

Main Concerns

Detected Risks

Recommended Human Review

Time Saved

The summary should be readable within one minute.

------------------------------------------------------------------------

# Session Evolution Chart

Purpose

Compare multiple conversations over time.

Display

Average Risk

Average Emotion

Distress Trend

Number of Crisis Alerts

This component supports long-term monitoring.

------------------------------------------------------------------------

# AI Reason Graph

Purpose

Visualize relationships between detected signals.

Example

Hopelessness

↓

Loneliness

↓

Distress

↓

Crisis

↓

High Risk

This graph should help professionals understand why the AI reached its conclusion.

------------------------------------------------------------------------

# Human Review Panel

Purpose

Support collaboration between AI and professionals.

Display

AI Decision

↓

Psychologist Notes

↓

Final Decision

↓

Review Status

The platform should always encourage human supervision.

------------------------------------------------------------------------

# Privacy Status

Purpose

Show that conversation privacy has been preserved.

Display

Personal Information Removed

Anonymous Processing Enabled

Privacy Layer Completed

The interface should reinforce user trust.

------------------------------------------------------------------------

# Emotional Design Principles

The platform should feel calm, intelligent, reassuring, and trustworthy.

It must never feel stressful, noisy, or overwhelming.

Unlike traditional healthcare software, the interface should reduce anxiety instead of increasing it.

The visual experience should communicate that the AI is assisting the professional—not replacing them.

------------------------------------------------------------------------

# Emotional Goals

Every interaction should reinforce the following emotions:

- Trust
- Clarity
- Confidence
- Calmness
- Transparency
- Focus

The interface should never create uncertainty through unnecessary complexity.

------------------------------------------------------------------------

# Emotional States

Safe Conversations

Visual feeling:

Calm

Minimal

Bright

Stable

Soft blue accents.

Low Risk

Slight attention.

Small visual emphasis.

No aggressive warnings.

Moderate Risk

Gentle amber highlights.

The interface should encourage investigation rather than panic.

High Risk

Stronger contrast.

Important information becomes visually prioritized.

Critical Risk

Immediate attention.

However, avoid flashing effects.

Avoid alarming animations.

The interface should communicate urgency professionally.

------------------------------------------------------------------------

# AI Personality

The AI should feel:

Professional

Respectful

Objective

Supportive

Calm

Never emotional.

Never dramatic.

Never conversational for the sake of conversation.

The AI communicates like a highly experienced clinical assistant.

------------------------------------------------------------------------

# AI Thinking Experience

When the system analyzes conversations, users should feel that the AI is carefully evaluating multiple perspectives.

Instead of generic loading indicators, the interface should visualize analysis progress through intelligent module activation.

Users should understand that reasoning takes place before conclusions.

------------------------------------------------------------------------

# Transparency

Every important decision must answer three questions:

What was detected?

Why was it detected?

How confident is the AI?

The user should never wonder where a decision came from.

------------------------------------------------------------------------

# Human-Centered Design

The interface should continuously reinforce that final responsibility belongs to the professional.

AI recommendations should appear as guidance rather than commands.

Clinical expertise always comes first.

------------------------------------------------------------------------

# Cognitive Load

The platform should minimize unnecessary thinking.

Large reports should become concise summaries.

Complex AI outputs should be progressively disclosed.

The interface should allow professionals to understand the overall situation within seconds.

------------------------------------------------------------------------

# Visual Rhythm

The interface should guide attention naturally.

Primary information

↓

Secondary information

↓

Technical details

↓

Raw data

Never display everything simultaneously.

------------------------------------------------------------------------

# Ethical Design

The platform should never manipulate user emotions.

Visual design should remain neutral, respectful, and clinically appropriate.

Trust should emerge through transparency—not decoration.

------------------------------------------------------------------------

# Product Feeling

If users could describe the product in one sentence, it should be:

"It feels like working with an experienced AI clinical assistant."

------------------------------------------------------------------------

# Design Anti-Patterns

The following design patterns must NEVER be used anywhere in the product.

------------------------------------------------------------------------

# Avoid Generic Dashboards

Do not create interfaces that resemble generic admin panels.

Avoid designs similar to:

- Bootstrap Admin
- Material Dashboard
- Traditional CRM
- Generic Analytics Dashboard

The platform should feel like an AI product rather than enterprise software.

------------------------------------------------------------------------

# Avoid Information Overload

Never display all information simultaneously.

Users should progressively discover details.

Important information must always appear before technical information.

------------------------------------------------------------------------

# Avoid Card Explosion

Do not fill screens with dozens of cards.

Every card must have a clear purpose.

Whitespace is more valuable than additional cards.

------------------------------------------------------------------------

# Avoid Decoration

Do not add visual elements without functional purpose.

Avoid:

- Decorative gradients
- Random icons
- Unnecessary illustrations
- Floating objects
- Decorative lines

Every visual element must communicate information.

------------------------------------------------------------------------

# Avoid Aggressive Colors

Never use highly saturated colors for large areas.

Danger colors should indicate urgency, not panic.

Critical alerts should remain professional.

------------------------------------------------------------------------

# Avoid Heavy Shadows

Shadows should be subtle.

The platform should feel lightweight.

------------------------------------------------------------------------

# Avoid Excessive Glassmorphism

Small glass effects are acceptable.

Entire interfaces built with glassmorphism are prohibited.

------------------------------------------------------------------------

# Avoid Unnecessary Animations

Animations should support understanding.

Animations must never exist purely for decoration.

Every animation should communicate:

- Progress
- Transition
- Hierarchy
- State Change

------------------------------------------------------------------------

# Avoid Long Forms

Long input forms reduce usability.

Break large workflows into logical steps.

------------------------------------------------------------------------

# Avoid Hidden Navigation

Important features should never be difficult to find.

Navigation should always remain predictable.

------------------------------------------------------------------------

# Avoid Technical Language

Unless the user explicitly opens developer mode.

Clinical users should see natural language instead of implementation details.

------------------------------------------------------------------------

# Avoid Hardcoded Content

Every displayed value should originate from backend APIs.

The frontend must remain completely data-driven.

------------------------------------------------------------------------

# Avoid Modal Overuse

Do not stack multiple dialogs.

Prefer inline expansion whenever possible.

------------------------------------------------------------------------

# Avoid AI Hype

Never present the AI as magical.

The interface should communicate intelligence through transparency rather than marketing language.

------------------------------------------------------------------------

# Avoid Medical Appearance

The platform should not resemble hospital software.

It should feel modern, calm, intelligent, and approachable.

------------------------------------------------------------------------

# Golden Rule

Whenever there is a choice between:

More UI

or

More Clarity

Always choose Clarity.

------------------------------------------------------------------------

# Creative Constraints

The interface must be unique.

It may be inspired by world-class products, but it should never resemble an existing application.

The goal is to create a recognizable identity for Mental Health Safety Analyzer.

------------------------------------------------------------------------

# Original Design Language

Avoid copying layouts from existing AI products.

Instead, combine inspiration from multiple sources to create a new visual language.

Reference products may inspire:

- OpenAI
- Linear
- Vercel
- Notion
- Raycast
- Arc Browser

However, the final interface must have its own identity.

------------------------------------------------------------------------

# AI-Centered Layout

The artificial intelligence is the core of the product.

Every screen should communicate that analysis is actively taking place.

The user should always understand:

Where the data comes from.

Which AI modules are active.

How the final decision was produced.

------------------------------------------------------------------------

# Information Before Decoration

Information hierarchy is more important than visual complexity.

Visual beauty should emerge from organization, spacing, typography, and motion rather than decorative graphics.

------------------------------------------------------------------------

# Every Screen Needs a Hero Component

Each page should contain one dominant component.

Examples:

Dashboard

→ Risk Overview

Conversation Page

→ Conversation Viewer

Explainability

→ AI Reason Graph

Reports

→ Clinical Summary

No page should feel visually flat.

------------------------------------------------------------------------

# Dynamic AI Experience

The interface should constantly communicate system activity.

Examples:

Animated pipeline

Module activation

Timeline progression

Confidence visualization

Context accumulation

Users should feel that the AI is continuously reasoning rather than instantly producing answers.

------------------------------------------------------------------------

# Invisible Complexity

The platform internally performs complex AI analysis.

The interface should simplify this complexity.

Users should never feel overwhelmed.

Complex processing should appear effortless.

------------------------------------------------------------------------

# Consistency Above Creativity

Creativity should never reduce usability.

Every page must feel like part of the same product.

Spacing

Typography

Animation

Cards

Navigation

Interactions

should all remain consistent.

------------------------------------------------------------------------

# Premium Product Feeling

The platform should feel like commercial enterprise software rather than an academic project.

Quality indicators:

Large whitespace

Perfect alignment

Consistent spacing

Soft motion

Elegant typography

Balanced composition

Minimal distractions

------------------------------------------------------------------------

# Long-Term Scalability

Future modules should be insertable without redesigning the interface.

Every page should support expansion.

The design system should remain modular.

------------------------------------------------------------------------

# Signature Experience

The user should immediately recognize the product by:

Animated AI Pipeline

Explainability-first layout

Conversation Heatmap

Risk Timeline

Fusion Visualization

Clinical Summary

These components should become the visual identity of the platform.

------------------------------------------------------------------------

# Final Creative Rule

Do not design a dashboard.

Design an AI Decision Support Experience.

The product should feel like an intelligent workspace where artificial intelligence and human expertise collaborate naturally.

------------------------------------------------------------------------

# Motion Language

Motion should communicate intelligence.

Motion should never exist only for decoration.

Every animation must have purpose.

------------------------------------------------------------------------

# Motion Philosophy

The interface should feel alive but never distracting.

Animations should communicate:

- Thinking
- Progress
- Relationships
- Focus
- Confidence

The experience should resemble an intelligent system processing information rather than a traditional website.

------------------------------------------------------------------------

# Global Motion Rules

Duration

Fast

120ms

Normal

220ms

Slow

350ms

Maximum

600ms

Avoid animations longer than one second.

------------------------------------------------------------------------

# Easing

Primary

ease-out

Secondary

ease-in-out

Spring

Used only for important components.

Never use bouncy animations.

------------------------------------------------------------------------

# Hover Motion

Buttons

Slight brightness increase

Scale

1.02

Cards

Lift

4px

Soft shadow increase

Icons

Rotate

3°

Maximum

Micro interactions only.

------------------------------------------------------------------------

# Click Motion

Buttons

Scale

0.98

Duration

120ms

Feedback should feel immediate.

------------------------------------------------------------------------

# Page Transition

Pages should fade rather than slide.

Duration

250ms

Opacity

0 → 100%

Small upward movement

12px

Avoid dramatic page transitions.

------------------------------------------------------------------------

# Section Reveal

Each section appears progressively while scrolling.

Animation

Fade

TranslateY

20px

Duration

300ms

Stagger

80ms

------------------------------------------------------------------------

# Card Appearance

Cards should softly appear.

Opacity

0 → 100

TranslateY

16px

Duration

250ms

Cards should never pop abruptly.

------------------------------------------------------------------------

# Sidebar Animation

Expand

220ms

Collapse

180ms

Width changes should remain smooth.

------------------------------------------------------------------------

# Modal Animation

Fade

Scale

0.96 → 1

Duration

220ms

Backdrop blur

Small

------------------------------------------------------------------------

# Loading Animation

Never use generic spinning loaders.

Prefer

Skeleton

Progress Line

Module Activation

Pipeline Progress

------------------------------------------------------------------------

# AI Thinking Animation

When AI starts analyzing

Modules activate sequentially.

Conversation

↓

Emotion

↓

Distress

↓

Crisis

↓

Fusion

↓

Decision

↓

Explainability

Each module softly lights up before passing control to the next.

This should become the signature animation of the product.

------------------------------------------------------------------------

# Risk Meter Animation

Risk gauge should animate smoothly.

Needle movement

Continuous

Color transition

Smooth

No sudden jumps.

------------------------------------------------------------------------

# Emotion Timeline Animation

Charts should draw progressively.

Points appear sequentially.

Hover reveals conversation excerpts.

------------------------------------------------------------------------

# Fusion Visualization

Every AI module sends a flowing connection toward the Fusion Engine.

Small animated particles travel through the connections.

The Fusion Engine softly pulses when receiving data.

After processing, the Decision Engine becomes active.

------------------------------------------------------------------------

# Explainability Animation

Reasons appear one after another.

Instead of showing everything immediately.

Each explanation fades into view.

This creates the feeling of reasoning.

------------------------------------------------------------------------

# Micro Interactions

Every important interaction should provide subtle feedback.

Examples

Hover

Focus

Selection

Expansion

Completion

Success

Warning

Error

No interaction should feel dead.

------------------------------------------------------------------------

# Motion Accessibility

Respect reduced motion preferences.

If Reduce Motion is enabled

Disable

Particles

Large transitions

Pipeline animation

Replace them with simple fade transitions.

------------------------------------------------------------------------

# Signature Motion

The most recognizable motion of the platform should be

Animated AI Pipeline

↓

Fusion Engine Pulse

↓

Risk Meter Update

↓

Explainability Reveal

This sequence should immediately communicate

"The AI is reasoning."

instead of

"The page is loading."

------------------------------------------------------------------------

# Premium UI Rules

The interface should feel like a premium AI product rather than a traditional dashboard.

Every screen should be intentionally designed.

Nothing should exist by accident.

------------------------------------------------------------------------

# One Hero Per Screen

Every page must contain one dominant visual component.

Examples

Dashboard

→ Risk Overview

Conversation

→ Conversation Viewer

Explainability

→ AI Reason Graph

Reports

→ Clinical Summary

This creates immediate visual hierarchy.

------------------------------------------------------------------------

# Eye Flow

The user's eye should naturally move through the interface.

Recommended order

Primary Focus

↓

Supporting Information

↓

Charts

↓

Technical Details

↓

Raw Data

Users should never search for important information.

------------------------------------------------------------------------

# Information Density

Avoid overly dense layouts.

Ideal ratio

40% whitespace

60% content

Whitespace is an active design element.

------------------------------------------------------------------------

# Content Balance

Every screen should contain a balance between:

Text

Visualization

Interactive Components

Avoid pages made entirely of text or entirely of charts.

------------------------------------------------------------------------

# Focus Points

Every screen should answer one question immediately.

Dashboard

How risky is the conversation?

Conversation

What happened?

Explainability

Why did AI decide this?

Reports

What should the professional know?

If users cannot answer the page's purpose within three seconds, the layout should be simplified.

------------------------------------------------------------------------

# Visual Consistency

All pages should share the same visual rhythm.

Consistent

Spacing

Typography

Cards

Buttons

Colors

Motion

The user should never feel they moved into another application.

------------------------------------------------------------------------

# Data Visualization Rules

Charts should simplify data.

Never decorate charts.

Preferred chart types

Line Chart

Area Chart

Timeline

Progress Bar

Heatmap

Relationship Graph

Avoid

3D charts

Pie charts

Complex radar charts

Decorative graphs

------------------------------------------------------------------------

# AI Visualization Rules

Artificial Intelligence should always be visualized.

Examples

Pipeline

Reason Graph

Fusion Engine

Confidence

Timeline

Never display only numbers.

Explain the reasoning visually.

------------------------------------------------------------------------

# Empty Space

Do not fear empty space.

Large whitespace increases trust.

Large whitespace improves readability.

Large whitespace makes AI outputs appear more important.

------------------------------------------------------------------------

# Accessibility

Minimum contrast ratio

WCAG AA

Interactive elements

Minimum touch target

44px

Keyboard navigation

Fully supported

Visible focus indicators

Required

Color should never be the only indicator of meaning.

------------------------------------------------------------------------

# Professional Appearance

The interface should resemble enterprise software trusted by hospitals, research institutions, and clinical environments.

The design should communicate quality before functionality is even explored.

------------------------------------------------------------------------

# Scalability

Future AI modules should integrate naturally without redesigning existing pages.

The design system should support growth over many years.

------------------------------------------------------------------------

# Final Design Principle

The interface should never compete with the conversation.

The conversation is the most important element.

Artificial Intelligence exists to clarify it.

The interface exists to support both.

Everything else is secondary.

------------------------------------------------------------------------

# Success Definition

A successful interface is one where:

The psychologist understands the conversation faster.

The AI reasoning is immediately visible.

The risk is immediately understandable.

The interface feels calm.

The user trusts the system.

The design disappears, allowing the analysis to become the focus.