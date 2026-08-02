# UI Components Specification

This document defines every reusable component used across the Mental Health Safety Analyzer.

Its purpose is to ensure visual consistency, accessibility, predictability, scalability, and maintainability.

Every UI component must follow the rules defined here.

No component should be created without first checking this document.

---

# Component Philosophy

Every component should solve one problem.

A component must:

- be reusable
- be predictable
- have one responsibility
- support accessibility
- support responsive layouts
- support theming
- support future scalability

Components should never contain business logic.

Business logic belongs to hooks or services.

---

# Component Categories

All components belong to one of the following groups.

## Foundations

Small reusable primitives.

Examples

Button

Badge

Icon

Avatar

Chip

Divider

Progress

Spinner

Skeleton

Tooltip

Popover

---

## Inputs

Input components.

Examples

Text Input

Search

Textarea

Checkbox

Radio

Toggle

Select

Multi Select

Date Picker

Time Picker

File Upload

---

## Navigation

Sidebar

Navbar

Breadcrumb

Tabs

Pagination

Command Palette

Menu

Dropdown

---

## Feedback

Toast

Alert

Dialog

Confirmation

Snackbar

Loading Overlay

Status Indicator

---

## Data Display

Card

Table

Timeline

Accordion

List

Statistics

Chart Container

Empty State

Metric Card

---

## AI Components

These are unique to this project.

Emotion Card

Risk Gauge

Confidence Meter

Conversation Bubble

Conversation Viewer

Conversation Timeline

Explainability Panel

Recommendation Panel

Conversation Summary

AI Report Card

Signal Card

Risk Indicator

Human Review Card

Emergency Alert Card

Privacy Warning

Safety Recommendation

---

## Layout Components

Dashboard Layout

Analysis Layout

Settings Layout

Split View

Resizable Panels

Scrollable Sections

---

# Component Naming Convention

Components must use PascalCase.

Examples

Button

RiskGauge

EmotionTimeline

ConversationViewer

ExplainabilityPanel

Avoid abbreviations.

Bad

RG

EV

CV

---

# Folder Structure

components/

ui/

inputs/

charts/

dashboard/

conversation/

analysis/

layout/

feedback/

navigation/

providers/

---

# Component File Structure

Each component should contain

Component.tsx

styles.ts

types.ts

index.ts

tests/

Optional

hooks/

constants/

utils/

---

# Component Requirements

Every component must support

Dark Theme

Light Theme

Keyboard Navigation

Screen Readers

Responsive Layout

Loading State

Error State

Empty State

Disabled State

Focus State

Hover State

Active State

---

# Component Quality Checklist

Before a component is considered complete it must satisfy

Responsive

Accessible

Reusable

Typed

Documented

Animated correctly

Performance optimized

No duplicated code

Consistent spacing

Consistent typography

---

# Button

## Purpose

Buttons trigger user actions.

Buttons should always be easy to identify.

Only one Primary Button should exist in each action group.

---

## Variants

Primary

Secondary

Ghost

Outline

Danger

Success

Warning

Text

Icon Button

Floating Action Button

Split Button

Loading Button

---

## Sizes

Extra Small

Height

28 px

Small

36 px

Medium

44 px

Large

52 px

Extra Large

60 px

---

## Width

Auto

Fit Content

Full Width

Never create arbitrary widths.

---

## Shape

Rounded

12 px

Pill

999 px

Square

Only for icon buttons.

---

## States

Default

Hover

Pressed

Focused

Disabled

Loading

Success

Error

---

## Hover

Elevation

+2

Scale

1.02

Transition

180 ms

Cursor

Pointer

---

## Pressed

Scale

0.98

Shadow

Reduced

---

## Focus

Must always display a visible focus ring.

Never remove outlines.

Focus ring

2 px

Accessible contrast

Required

---

## Disabled

Opacity

40%

No hover

No shadow

Cursor

Not Allowed

---

## Loading

Spinner replaces the icon.

Button width must never change.

Text should remain visible whenever possible.

---

## Icons

Icons should always be aligned vertically.

Spacing

8 px

Icon size

18–20 px

---

## Typography

Font Weight

600

Letter Spacing

0

No uppercase.

---

## Padding

Horizontal

20 px

Vertical

12 px

---

## Animation

Buttons should never bounce.

Animations

Fade

Scale

Elevation

Only

---

## Accessibility

Minimum height

44 px

Keyboard accessible

Required

Screen reader label

Required

Color must never be the only indicator.

---

## Usage Rules

Primary button

One per screen.

Danger button

Only destructive actions.

Ghost button

Secondary interactions.

Text button

Low emphasis.

---

## Anti Patterns

Never use more than two primary buttons together.

Never animate continuously.

Never use flashing colors.

Never use gradients for normal actions.

Never create custom button colors.

Always use design tokens.

---

## Component Props

Variant

Size

Icon

Loading

Disabled

FullWidth

OnClick

Children

AriaLabel

---

## Future Extensions

Support keyboard shortcuts.

Support long press.

Support AI quick actions.

Support contextual commands.

---

# Card

## Purpose

Cards are the primary information containers throughout the application.

Almost every screen should be composed of Cards.

Cards group related information into a visually organized block.

Examples

Conversation Card

Emotion Card

Risk Card

Recommendation Card

Timeline Card

Statistics Card

Report Card

Explainability Card

Model Status Card

Patient Summary Card

---

## Philosophy

Cards should feel:

Stable

Clean

Modern

Professional

Lightweight

Cards should never feel decorative.

Every Card exists to improve readability.

---

## Variants

Default Card

Elevated Card

Interactive Card

Glass Card

Compact Card

Report Card

Dashboard Widget

Conversation Card

Expandable Card

Transparent Card

---

## Sizes

Small

280 px

Medium

360 px

Large

520 px

Extra Large

Fluid

Responsive

Cards should scale naturally.

Avoid fixed heights whenever possible.

---

## Structure

Card

↓

Header

↓

Content

↓

Optional Divider

↓

Footer

Every Card should follow this hierarchy.

---

## Header

Contains

Title

Subtitle

Icon

Status

Actions

Headers should remain minimal.

---

## Content

The primary information area.

Spacing

24 px

Never overcrowd.

Prefer whitespace.

---

## Footer

Contains

Buttons

Metadata

Timestamp

Actions

Never place large text inside footers.

---

## Padding

Desktop

24 px

Tablet

20 px

Mobile

16 px

---

## Border Radius

16 px

Cards should share the same radius throughout the application.

---

## Border

1 px

Neutral Border

Only using Design Tokens.

---

## Shadow

Default

Soft

Hover

Medium

Pressed

Reduced

Never use heavy shadows.

---

## Background

Surface

Primary

Glass

Overlay

Depending on context.

---

## Hover

Only Interactive Cards animate.

Animation

Lift

2 px

Scale

1.01

Duration

180 ms

---

## Selection

Selected Cards display

Primary Border

Primary Glow

Slight Elevation

---

## Expandable Cards

Expandable Cards animate smoothly.

Never abruptly resize.

Duration

240 ms

---

## Interactive Cards

Interactive Cards should:

Show Pointer

Support Keyboard

Support Focus

Support Hover

Support Press

---

## Charts Inside Cards

Charts should never touch card borders.

Minimum margin

24 px

---

## Text Alignment

Always Left

Except numerical KPI values.

---

## Empty Cards

When empty display

Illustration

Short explanation

Primary Action

Never leave blank spaces.

---

## Loading Cards

Skeleton Layout

No jumping

No layout shift

---

## Error Cards

Contain

Error Icon

Title

Description

Retry Action

---

## Accessibility

Minimum Contrast

WCAG AA

Keyboard Focus

Required

Screen Reader Labels

Required

---

## Responsive Behaviour

Desktop

Grid Layout

Tablet

2 Columns

Mobile

Single Column

Cards should never overflow horizontally.

---

## Motion

Cards only animate on

Hover

Expand

Appear

Disappear

Never animate continuously.

---

## Card Actions

Top Right

Icon Buttons

Maximum

3 actions

Overflow actions belong inside a menu.

---

## AI Cards

Special Cards include

Emotion Summary

Risk Summary

Confidence

Explainability

Recommendation

Conversation Summary

These cards have colored accents but still follow the same layout system.

---

## Anti Patterns

Never nest more than two Cards.

Never create Cards with random padding.

Never mix multiple shadow styles.

Never use gradients as Card backgrounds.

Never place large paragraphs inside one Card.

Split information into multiple Cards.

---

## Props

Variant

Padding

Shadow

Interactive

Expandable

Loading

Selected

Disabled

Header

Footer

Children

AriaLabel

---

## Future Extensions

Resizable Cards

Drag & Drop Cards

Realtime Updating Cards

AI Generated Cards

Pinned Cards