# Dashboard Specification

## Purpose

The Dashboard is the heart of the Mental Health Safety Analyzer.

Its purpose is to provide professionals with a complete overview of a conversation in the shortest possible time while maintaining transparency, explainability, and trust.

The dashboard should answer three questions within five seconds:

1. What happened?
2. Why did it happen?
3. What should the professional do next?

The dashboard is not a control panel.

It is an AI-assisted clinical workspace.

---

# Design Goals

The dashboard should feel:

- Calm
- Professional
- Intelligent
- Explainable
- Fast
- Trustworthy

The interface should never overwhelm the user.

Information should be progressively disclosed.

Critical information always appears first.

# Overall Layout

Desktop Layout

Sidebar

↓

Top Navigation

↓

Main Workspace

The workspace is divided into three vertical zones:

Top Zone

Middle Zone

Bottom Zone

Each zone has a clear responsibility.

The dashboard should use a 12-column responsive grid.

Maximum content width:

1440px

Outer margin:

64px

Gap:

24px

# Sidebar

Purpose

Primary navigation.

Sections

- Dashboard
- New Analysis
- History
- Reports
- Documentation
- API
- Settings

Sidebar behavior

Desktop

Persistent

Tablet

Collapsible

Mobile

Drawer

The active page must always be visible.

# Top Navigation

Contains:

Project Logo

Project Name

Search

Notifications

User Profile

Theme Switch

Quick Actions

The navbar should remain sticky while scrolling.

Height

72px

# Top Zone

Purpose

Provide an immediate understanding of the conversation.

Contains

Conversation Summary Card

Overall Risk Card

Confidence Meter

Detected Signals

Recommendation Preview

These components must be visible without scrolling.

# Middle Zone

Purpose

Explain how the AI reached its conclusion.

Contains

Conversation Viewer

Emotion Timeline

Conversation Heatmap

Fusion Engine

Risk Timeline

Reason Graph

This section represents the reasoning process.

Users should be able to inspect every AI decision.

# Bottom Zone

Purpose

Support professional decision making.

Contains

Explainability Report

Clinical Summary

Suggested Actions

Human Review Panel

Notes

Export Report

The AI never replaces the human.

The final decision always belongs to the professional.

# Conversation Viewer

Displays the original conversation.

Features

Speaker Labels

Message Time

Emotion Marker

Distress Marker

Highlight High-Risk Messages

Hover Explanation

Search

Filter

Collapse Long Messages

The original conversation must always remain accessible.

# Risk Panel

Displays

Risk Level

Confidence

Trend

Supporting Signals

The Risk Panel should remain pinned while scrolling on desktop.

Risk is displayed using:

- Color
- Icon
- Label
- Confidence

Never color alone.

# AI Pipeline

Visualizes every processing stage.

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

Context Fusion

↓

Decision Engine

↓

Explainability

↓

Safe Response

Each module should animate sequentially.

The animation communicates thinking rather than decoration.

# AI Pipeline

Visualizes every processing stage.

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

Context Fusion

↓

Decision Engine

↓

Explainability

↓

Safe Response

Each module should animate sequentially.

The animation communicates thinking rather than decoration.

# Dashboard Charts

Emotion Timeline

Risk Timeline

Conversation Heatmap

Confidence Distribution

Fusion Contribution

Reason Graph

Charts should emphasize trends rather than isolated values.

# Human Review

Professionals can

Approve

Reject

Override

Annotate

Escalate

The dashboard should clearly distinguish:

AI Recommendation

Human Decision

These are never the same object.

# Empty States

New User

No Analysis

No Reports

No History

Loading

Error

Offline

Every empty state should guide the user toward the next action.

# Responsive Dashboard

Desktop

Three-zone layout

Tablet

Two-zone layout

Mobile

Single-column layout

Charts become vertically stacked.

Sidebar becomes a drawer.

No functionality should be removed on mobile.

# Interaction Rules

Hover

Reveal additional information.

Click

Navigate or expand.

Double Click

Never required.

Right Click

Optional contextual actions.

Animations should remain subtle.

Interaction should never surprise the user.

# Performance Goals

Dashboard First Paint

< 2 seconds

Navigation

< 150 ms

Interactions

< 100 ms

Charts

Smooth at 60 FPS

The dashboard should always feel responsive.

# Future Expansion

The dashboard architecture should support:

Real-time monitoring

Multiple conversation sessions

Patient timeline

Doctor workspace

Clinic management

Research mode

AI model comparison

Longitudinal analytics

These features should be addable without redesigning the dashboard.