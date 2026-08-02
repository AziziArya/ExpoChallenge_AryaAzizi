# Design Tokens

## Purpose

This document defines the visual foundation of the Mental Health Safety Analyzer.

Every UI element must use these tokens.

No component should introduce arbitrary values.

Design Tokens guarantee:

- Visual consistency
- Scalable design
- Easier maintenance
- Better accessibility
- Faster development
- Predictable UI behavior

These tokens are the single source of truth for the entire frontend.

---

# Design Principles

The visual system should communicate:

- Trust
- Calmness
- Professionalism
- Intelligence
- Transparency
- Precision

The interface should never feel:

- Aggressive
- Noisy
- Playful
- Clinical
- Corporate
- Robotic

Instead, it should feel like:

> A premium AI platform built for professionals working in sensitive situations.

# Color Tokens

## Primary

Primary / 50
Primary / 100
Primary / 200
Primary / 300
Primary / 400
Primary / 500
Primary / 600
Primary / 700
Primary / 800
Primary / 900

Used for:

- Primary actions
- Navigation
- Important highlights
- AI identity

---

## Secondary

Purple Scale

Used for:

- Explainability
- AI Fusion
- Reason Graphs
- AI Pipeline

---

## Accent

Cyan Scale

Used only for:

- Active states
- Hover highlights
- Data visualization accents

---

## Success

Green Scale

Used for:

- Safe conversations
- Successful operations
- Completed actions

---

## Warning

Amber Scale

Used for:

- Medium Risk
- Attention Required

---

## Danger

Red Scale

Used for:

- High Risk
- Critical Emergency

Danger colors must never dominate the interface.

They appear only where required.

---

## Neutral

Gray Scale

Neutral colors define:

- Backgrounds
- Cards
- Borders
- Typography
- Dividers

# Semantic Tokens

Background / Primary

Background / Secondary

Surface

Surface Elevated

Surface Hover

Border

Border Strong

Text Primary

Text Secondary

Text Muted

Text Inverse

Link

Disabled

Overlay

Skeleton

Divider

# Typography Tokens

Display XL

Display L

Heading XL

Heading L

Heading M

Heading S

Body XL

Body L

Body M

Body S

Caption

Label

Button

Code

Numbers

The interface should always use tabular numbers for metrics, confidence values, and AI scores.

# Spacing Tokens

2

4

8

12

16

20

24

32

40

48

64

80

96

128

Spacing follows an 8-point grid.

No custom spacing values should be introduced.

# Radius Tokens

XS

S

M

L

XL

2XL

Round

Cards use Large radius.

Dialogs use XL.

Buttons use Medium.

# Elevation Tokens

Shadow 1

Shadow 2

Shadow 3

Shadow 4

Shadow 5

Elevation should remain subtle.

Heavy shadows are prohibited.

# Motion Tokens

Instant

Fast

Normal

Slow

Page Transition

Modal Transition

Chart Animation

Pipeline Animation

Reduced Motion

All animations must automatically respect the user's prefers-reduced-motion settings.

# Layer Tokens

Base

Dropdown

Sticky

Overlay

Modal

Toast

Tooltip

Emergency Alert

# Opacity Tokens

Disabled

Muted

Overlay

Hover

Pressed

# Blur Tokens

Small

Medium

Large

Glass surfaces should use blur conservatively.

Avoid excessive glassmorphism.

# Icon Tokens

XS

S

M

L

XL

All icons should follow the same visual weight.

# Data Visualization Tokens

Emotion Line

Risk Line

Grid

Axis

Positive

Negative

Neutral

Hover

Selected

Animation Duration

Charts should prioritize readability over decoration.

# AI Visualization Tokens

AI Primary

AI Secondary

Fusion Node

Reason Edge

Confidence Fill

Risk Gradient

Conversation Heat

Pipeline Active

Pipeline Complete

Pipeline Waiting

# Golden Rules

Never hardcode values.

Every visual decision should reference a Design Token.

Components inherit Tokens.

Pages inherit Components.

The design system remains the single source of truth for the entire product.