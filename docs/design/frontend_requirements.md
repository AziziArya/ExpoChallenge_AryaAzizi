# Frontend Engineering Requirements

---

# Purpose

This document defines the engineering standards, development rules, architectural principles, and implementation requirements for the frontend of the Mental Health Safety Analyzer.

Unlike the Design System, which focuses on visual language and user experience, this document defines how the frontend must be engineered.

Every UI component, page, animation, API integration, and interaction must follow these requirements.

These rules are considered mandatory.

The AI assistant should never ignore them unless explicitly instructed.

---

# Frontend Philosophy

The frontend is not a marketing website.

It is a professional AI-powered clinical decision support interface.

Every design decision should prioritize:

- clarity
- speed
- reliability
- trust
- accessibility
- usability
- cognitive simplicity

The interface should feel similar to enterprise software used in healthcare, finance, and mission-critical systems rather than consumer social applications.

Users must immediately understand:

- what happened
- why it happened
- what should happen next

The interface should reduce cognitive load instead of increasing it.

---

# Development Principles

The frontend must always satisfy these principles.

## 1. Clarity First

Never sacrifice clarity for visual effects.

Information must always be easier to understand than it is beautiful.

---

## 2. Explainability

Every AI decision shown to the user must include visual reasoning.

The interface should never display unexplained AI results.

---

## 3. Progressive Disclosure

Complex information should be revealed gradually.

Never overload users with unnecessary details.

Advanced information should remain accessible but secondary.

---

## 4. Consistency

Every page must follow identical interaction patterns.

Buttons, cards, spacing, animations, typography, colors, and layouts must remain consistent across the application.

---

## 5. Reliability

The interface should always communicate system status.

Users should never wonder:

- Is it loading?
- Did it fail?
- Is it processing?
- Is it finished?

Every important action must provide immediate feedback.

---

## 6. Human-Centered AI

Artificial Intelligence exists to support human decision-making.

The UI should reinforce that:

AI assists.

Humans decide.

Never design interactions suggesting that AI replaces mental health professionals.

---

# Technology Stack

The frontend must use the following technologies.

Framework

- React 19

Application Framework

- Next.js (App Router)

Language

- TypeScript

Styling

- Tailwind CSS v4

Component Library

- shadcn/ui

Animations

- Framer Motion

Charts

- Recharts

Icons

- Lucide Icons

State Management

- React Context
- TanStack Query (if server state becomes complex)

Forms

- React Hook Form

Validation

- Zod

API Communication

- Fetch API
or
- Axios

Theme

- CSS Variables
- Tailwind Theme Tokens

Package Manager

- pnpm

---

# General Development Rules

Every component must be:

- reusable
- modular
- predictable
- maintainable

Avoid duplicated code whenever possible.

Avoid unnecessary abstractions.

Prefer composition over inheritance.

Prefer readability over cleverness.

The generated code should resemble production-ready enterprise software.

---

# File Organization

Every page must live inside:

app/

Reusable UI components:

components/

Business logic:

lib/

Utilities:

utils/

API helpers:

services/

Types:

types/

Hooks:

hooks/

Constants:

constants/

Never mix unrelated responsibilities inside one directory.

---

# Naming Convention

Components

PascalCase

Example

ConversationCard

EmotionTimeline

RiskGauge

Files

kebab-case

Example

conversation-card.tsx

risk-gauge.tsx

Variables

camelCase

Constants

UPPER_SNAKE_CASE

Interfaces

PascalCase

Types

PascalCase

Enums

PascalCase

---

# Component Rules

Each component should have one responsibility.

Large components must be decomposed into smaller components.

Prefer many small components over few massive components.

A component should ideally stay below 250 lines.

Pages should mostly compose components rather than contain business logic.

Business logic belongs inside hooks or services.

---

# TypeScript Rules

TypeScript is mandatory.

Never use:

any

unless absolutely unavoidable.

Prefer:

interfaces

for component props.

Prefer:

type

for unions.

Avoid unnecessary casting.

Always type API responses.

Every exported function must have explicit return types.

---

# Frontend and Backend Integration

The frontend must communicate with the backend through clearly defined API contracts.

The frontend must never assume backend behavior.

All API communication must be:

- typed
- validated
- predictable
- error-aware

The frontend should treat backend responses as external data sources.

---

# API Communication Principles

All backend communication must happen through a dedicated service layer.

Do not call APIs directly inside UI components.

Incorrect:

```tsx
function Component() {
  fetch("/api/analyze")
}
```

Correct:

```tsx
import { analyzeConversation } from "@/services/analyzer"
```

UI components should only handle:

- displaying data
- user interaction
- visual states

Business communication logic belongs in services.

---

# API Service Layer

All API requests must be organized inside:

```
services/
```

Example:

```
services/
|
├── analyzer.service.ts
├── conversation.service.ts
├── privacy.service.ts
└── report.service.ts
```

Each service should have a clear responsibility.

---

# API Types

Every API response must have a TypeScript definition.

Example:

```ts
interface RiskAnalysisResponse {
  riskLevel: string;
  confidence: number;
  emotions: EmotionResult[];
  explanation: string[];
}
```

Never use untyped API responses.

Avoid:

```ts
const data = await response.json()
```

without validation.

---

# Data Validation

External API data must be validated before usage.

Preferred tools:

- Zod
- TypeScript validation schemas

Example:

```ts
const response = RiskSchema.parse(data)
```

The UI should never crash because of unexpected backend data.

---

# Mental Health Data Handling Rules

The frontend handles sensitive information.

Therefore:

- Never store private conversations unnecessarily.
- Never expose sensitive information in logs.
- Never display personally identifiable information without authorization.
- Avoid saving AI analysis results permanently on the client.

The frontend must follow privacy-first principles.

---

# AI Result Display Rules

AI outputs must never appear as absolute truth.

Avoid:

"User is suicidal"

Prefer:

"Potential crisis indicators detected"

Avoid:

"The model diagnosed depression"

Prefer:

"Detected emotional distress patterns"

The UI language must remain:

- supportive
- cautious
- explainable
- non-diagnostic

---

# Risk Level Visualization

Risk information should always include context.

Never show only:

```
High Risk
```

Always provide:

- risk level
- confidence
- detected signals
- explanation
- recommended next action

---

# Error Handling

Every API operation must handle:

- network errors
- timeout errors
- invalid responses
- authentication failures
- server errors

Errors must never create broken UI states.

---

# Error UI Requirements

Every important operation requires:

## Error State

Must include:

- clear message
- recovery action
- retry option when possible

Example:

"Analysis failed. Please try again."

Button:

"Retry Analysis"

---

# Loading States

Every asynchronous operation must have a loading state.

Never show empty screens while waiting.

Loading states must include:

- skeletons
- progress indicators
- meaningful feedback

Avoid generic infinite spinners when possible.

---

# AI Processing Experience

For long AI operations, show system progress.

Example:

```
Preparing conversation

↓

Analyzing emotions

↓

Detecting risk patterns

↓

Generating explanation
```

The user should understand what the system is doing.

---

# Empty States

Every empty state must explain:

- why there is no data
- what the user can do next

Example:

"No conversations analyzed yet."

Action:

"Start New Analysis"

---

# Retry Strategy

Failed requests should support retry when appropriate.

Retry logic should include:

- limited attempts
- user feedback
- graceful failure

Never create infinite retry loops.

---

# Network Awareness

The frontend should handle unstable connections.

Required behaviors:

- detect failed requests
- show connection problems
- preserve user context when possible

---

# Backend Compatibility

The frontend must remain compatible with the existing backend architecture.

Before creating frontend API calls, inspect:

- backend routes
- request schemas
- response schemas
- validation rules

Never invent API endpoints.

---

# React Architecture

The frontend must follow a modern React architecture.

Every feature should be built using small, reusable, and predictable components.

Avoid monolithic pages.

Pages should compose components rather than implement business logic.

---

# Component Philosophy

Every component should have exactly one responsibility.

Bad example

ConversationCard

↓

Contains

- API requests
- state management
- rendering
- routing
- business logic

Good example

ConversationCard

↓

Only renders conversation information.

Business logic belongs elsewhere.

---

# Component Categories

Components should be separated into categories.

## UI Components

Pure visual components.

Examples

- Button
- Badge
- Card
- Avatar
- Dialog
- Tooltip

---

## Shared Components

Reusable business-independent components.

Examples

- Header
- Sidebar
- Navbar
- Footer
- Search Box

---

## Feature Components

Components dedicated to one feature.

Examples

- EmotionTimeline
- RiskGauge
- ConversationViewer
- RecommendationPanel

---

## Layout Components

Responsible only for layout.

Examples

- DashboardLayout
- SettingsLayout
- AnalysisLayout

---

# Component Size

Target size

100–200 lines

Maximum

300 lines

If a component grows larger than this it should be decomposed.

---

# Composition

Prefer composition.

Avoid inheritance.

Bad

BaseCard

↓

EmotionCard extends BaseCard

Good

<Card>

↓

Emotion Content

---

# Component API

Every component should expose a minimal API.

Bad

50 props

Good

5–10 meaningful props

Components should remain easy to understand.

---

# Props Rules

Component props must be:

- typed
- documented
- predictable

Avoid boolean explosion.

Bad

```
<Button
primary
danger
large
rounded
animated
loading
outlined
>
```

Prefer expressive variants.

---

# State Management

Keep state as close as possible to where it is used.

Local state

↓

Context

↓

Server State

Avoid unnecessary global state.

---

# Server State

Remote data belongs to server state.

Preferred

TanStack Query

Never duplicate server data into multiple local states.

---

# React Context

Context should only store:

- authentication
- theme
- user preferences
- application configuration

Avoid storing large datasets inside Context.

---

# Hooks

Business logic should be extracted into hooks.

Examples

useConversation()

useRiskAnalysis()

useEmotionTimeline()

useDashboard()

Hooks should never return JSX.

---

# Custom Hooks

Every custom hook should have one purpose.

Bad

useEverything()

Good

useConversationHistory()

useAnalysis()

useEmotionData()

---

# Side Effects

All side effects should remain inside

useEffect

or dedicated hooks.

Avoid side effects during rendering.

---

# Async Logic

Async operations belong in:

services

or

hooks

Never inside UI rendering.

---

# Routing

Routing must use the Next.js App Router.

Avoid manual routing logic.

Each page should have one clear URL.

Example

/analyze

/history

/report

/settings

---

# Client Components

Only use Client Components when interaction requires it.

Examples

Forms

Animations

Charts

Search

Dialogs

Everything else should remain a Server Component whenever possible.

---

# Forms

All forms should use

React Hook Form

Validation

↓

Zod

Never validate forms manually.

---

# Controlled Components

Inputs should remain controlled whenever practical.

Avoid mixing controlled and uncontrolled inputs.

---

# Derived State

Never store values that can be derived.

Bad

Store

riskColor

Good

Compute

riskColor

from

riskLevel

---

# Memoization

Memoization is not the default.

Only use

memo

useMemo

useCallback

when profiling shows a measurable improvement.

---

# Lists

Lists require stable keys.

Never use

index

as key.

Always use stable identifiers.

---

# Conditional Rendering

Prefer explicit rendering.

Bad

Nested ternaries

Good

Small helper components

Readable conditions

---

# Error Boundaries

Critical UI sections must use Error Boundaries.

Examples

Charts

Reports

Explainability

Timeline

A failure in one area must not crash the entire dashboard.

---

# Reusability

Every new component should answer:

Can this be reused elsewhere?

If yes

Move it into

components/

Avoid duplicate implementations.

---

# Code Readability

Readable code is preferred over clever code.

Future contributors should understand a component within minutes.

Avoid unnecessary abstraction.

Prefer explicitness.

---

# Documentation

Complex components should include a short description explaining:

- purpose
- expected props
- important behaviors

This improves maintainability over time.

---

# AI Dashboard Principles

The dashboard is the heart of the application.

Its purpose is not decoration.

Its purpose is supporting decision making.

The dashboard should answer these questions immediately:

- What happened?
- Why did it happen?
- How confident is the AI?
- What changed?
- What should the user do next?

Everything else is secondary.

---

# Dashboard Layout

The dashboard should always follow a predictable structure.

Top Area

- Conversation Summary
- Overall Risk Level
- Confidence

Middle Area

- Emotion Timeline
- Risk Timeline
- Conversation Evolution

Bottom Area

- Explainability
- AI Recommendation
- Suggested Human Action

The layout should never change between analyses.

---

# Information Priority

The interface should display information in this order.

1.
Risk Level

2.
Confidence

3.
Detected Signals

4.
Explanation

5.
Conversation History

6.
Technical Information

Users should never search for the most important information.

---

# Data Visualization

Numbers alone are difficult to understand.

Every important metric should have visual support.

Preferred visualization:

- Progress Bars
- Timelines
- Heatmaps
- Trend Lines
- Status Indicators
- Circular Gauges

Avoid unnecessary pie charts.

Avoid decorative charts.

Every visualization must improve understanding.

---

# Risk Visualization

Risk levels should always be represented using multiple signals.

Example

Text

High Risk

+

Color

Orange

+

Icon

Alert Triangle

+

Progress Indicator

+

Explanation

Never rely on color alone.

---

# Emotion Timeline

Emotion changes should be visualized chronologically.

Users should immediately see whether emotions are:

- improving
- stable
- worsening

Do not show isolated emotion scores.

Always emphasize progression.

---

# Conversation Timeline

Messages should be displayed in chronological order.

Important messages should automatically receive emphasis.

Examples:

- crisis signals
- emotional spikes
- escalation points

The timeline should support quick scanning.

---

# Explainability Panel

Every AI decision must have an explanation panel.

Required sections:

Detected Signals

Reasoning

Confidence

Recommendation

The explanation must use natural language.

Avoid technical terminology whenever possible.

---

# Confidence Display

Confidence should always be visible.

Preferred format:

87%

or

High Confidence

Never hide confidence values.

Users should understand uncertainty.

---

# Recommendation Cards

Recommendations should always appear after explanations.

Example

AI Suggests

↓

Human Review Recommended

↓

Emergency Contact Suggested

↓

Continue Monitoring

Never present recommendations before context.

---

# Expandable Sections

Complex information should remain collapsible.

Examples

Conversation Details

Emotion Scores

Raw AI Output

Technical Metadata

The default view should remain clean.

---

# Accessibility

Accessibility is mandatory.

The application must satisfy WCAG AA standards.

---

# Keyboard Navigation

Every interactive element must be reachable using the keyboard.

Users should never require a mouse.

Required support:

Tab

Shift + Tab

Enter

Escape

Arrow Keys where appropriate

---

# Screen Readers

Interactive components must include:

aria-label

aria-labelledby

role

Semantic HTML should always be preferred over generic div elements.

---

# Color Accessibility

Never communicate meaning using color only.

Every status should include:

- text
- icon
- shape
- color

---

# Motion Accessibility

Respect the user's system settings.

If

prefers-reduced-motion

is enabled

Animations should become minimal.

Never force animations.

---

# Responsive Design

The application is desktop-first.

However it must fully support:

Desktop

Laptop

Tablet

Mobile

---

# Breakpoints

Recommended breakpoints

640

768

1024

1280

1536

Avoid creating custom breakpoints without justification.

---

# Mobile Behaviour

Cards become stacked.

Charts become simplified.

Sidebars become drawers.

Tables become cards.

Never shrink desktop layouts into mobile.

Redesign them.

---

# Performance

Target

First Paint

< 1 second

Interactive

< 2 seconds

Lazy load heavy components.

Charts

Conversation History

Large Reports

should never load before necessary.

---

# Bundle Optimization

Prefer tree-shakeable libraries.

Avoid importing entire packages.

Incorrect

import * from library

Correct

Import only required modules.

---

# Rendering Strategy

Use:

Server Components

when possible.

Use:

Client Components

only when interaction requires them.

Do not make everything a Client Component.

---

# Re-render Optimization

Avoid unnecessary renders.

Use

memo

useMemo

useCallback

only where they actually improve performance.

Never optimize prematurely.

Profile first.

---

# Virtualization

Large conversation histories should use virtualization.

Do not render hundreds of messages simultaneously.

---

# Error Boundaries

Critical sections must use React Error Boundaries.

Failures should isolate themselves.

One broken chart must not crash the dashboard.

---

# Logging

Frontend logging should remain minimal.

Never expose:

API Keys

Conversation Content

Private Information

Stack traces to users.

Logs should support debugging while protecting privacy.