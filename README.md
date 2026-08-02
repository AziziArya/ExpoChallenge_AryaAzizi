# Mental Health Safety Analyzer

![Python](https://img.shields.io/badge/Python-3.10-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Release](https://img.shields.io/github/v/release/AziziArya/ExpoChallenge_AryaAzizi)
![Tests](https://img.shields.io/badge/Tests-12%2F12-success)
![Coverage](https://img.shields.io/badge/Coverage-80%25-brightgreen)
![CI](https://github.com/AziziArya/ExpoChallenge_AryaAzizi/actions/workflows/tests.yml/badge.svg)
![Code Quality](https://github.com/AziziArya/ExpoChallenge_AryaAzizi/actions/workflows/code_quality.yml/badge.svg)

An AI-powered mental health conversation safety analysis system designed to detect emotional distress, crisis signals, conversation deterioration, and generate explainable safety decisions.

This research prototype focuses on privacy-aware AI assistance for mental health safety monitoring. It supports human review and **does not replace professional mental health care**.

---

# Project Status

Current development phase:

- ✅ Backend Architecture
- ✅ AI Pipeline
- ✅ Automated Testing
- ✅ Documentation
- ✅ Frontend Dashboard
- ✅ Interactive Demo

---

# Documentation

Detailed documentation is available inside the **docs/** directory.

Main documentation areas:

- docs/design/        UX specifications and frontend architecture
- backend/            API, database, and service implementation
- src/                AI analysis pipeline modules
- tests/              Automated testing suite

---

# Main Features

- Emotion Analysis
- Distress Detection
- Crisis Detection
- Conversation Pattern Analysis
- Risk Escalation Detection
- Context Memory
- Context Fusion Engine
- Safety Decision Engine
- Explainable AI Reports
- Privacy Guard
- Safe Response Generation

---

# Installation

```bash
git clone https://github.com/AziziArya/ExpoChallenge_AryaAzizi.git

cd ExpoChallenge_AryaAzizi

pip install -r requirements.txt
```
Initialize the database:

```bash
python backend/database/init_db.py
```

Run the backend server:

```bash
python backend/app.py
```

Backend API:

```
http://127.0.0.1:8000
```

---


## Frontend

The React dashboard source code is located in:

```
mhsa-frontend-source/mhsa-frontend
```

Run it using:

```bash
cd mhsa-frontend-source/mhsa-frontend

npm install

npm run dev

npm run build
```

Default frontend:

```
http://localhost:5173
``` 
---

# Demo

The project includes:

- FastAPI backend API
- React dashboard interface
- Explainable risk analysis reports

Backend:
http://127.0.0.1:8000


Frontend:
http://localhost:5173


API Documentation:
http://127.0.0.1:8000/docs

The demo can be tested locally by running both backend and frontend services.

# Running Tests

Run all tests using:

```bash
pytest -v
```

Current testing status:

- ✅ 12 / 12 Tests Passed
- ✅ Approximately 80% Test Coverage

---

## API Example

Analyze a conversation:

```http
POST /analyze
```

Example body:

```json
{
  "messages":[
    "I feel exhausted.",
    "I don't enjoy anything anymore.",
    "Sometimes I think disappearing would be easier."
  ]
}
```

The API returns:

- Timeline analysis
- Overall risk
- Explainability report
- Recommended actions
- Safety response

## Project Structure

```
backend/
    FastAPI application

src/
    AI pipeline modules

tests/
    Unit tests

docs/
    Design and architecture

mhsa-frontend-source/
    React dashboard
```

# Technology Stack

- Python 3.10
- FastAPI
- SQLAlchemy
- PyTest
- Transformers
- Scikit-learn
- Pandas
- NumPy
- React
- TypeScript
- Vite
- Tailwind CSS

---

# System Architecture

The project consists of multiple AI modules working together:

- Emotion Analyzer
- Distress Detector
- Crisis Detector
- Conversation Pattern Analyzer
- Context Memory
- Context Fusion Engine
- Explainability Module
- Privacy Guard
- Safe Response Generator
- Final Decision Engine

The final risk assessment is produced by combining outputs from multiple analysis modules rather than relying on a single model.

---

# Research Focus

This project investigates AI-assisted mental health conversation safety by combining multiple NLP analysis stages into a single explainable pipeline.

The goal is to support early risk identification while maintaining privacy and providing transparent decision explanations.

---

# Future Clinical Vision

Beyond conversation safety analysis, the architecture of this project has been designed with future clinical integration in mind.

A possible future deployment scenario allows patients to interact with the AI assistant between therapy sessions while the system continuously analyzes emotional trends, distress progression, crisis indicators, and long-term conversation patterns.

Instead of replacing psychologists, the platform is intended to generate explainable conversation summaries and safety reports that help mental health professionals better understand a patient's condition before each session.

The final diagnosis, treatment decisions, and clinical responsibility always remain under human supervision.

---


# Limitations

This system:

- Does **not** provide medical diagnosis.
- Does **not** replace psychologists, psychiatrists, or licensed mental health professionals.
- Is designed solely as an AI-assisted conversation safety analysis and decision-support tool.
- Requires human review and professional judgment for medium and high-risk conversations.

Future versions aim to support clinicians by providing explainable conversation summaries, emotional trend analysis, longitudinal risk monitoring, and AI-assisted clinical decision support while preserving privacy and ensuring that all final decisions remain under human supervision.

---

# Repository

GitHub Repository

https://github.com/AziziArya/ExpoChallenge_AryaAzizi

Latest Release

https://github.com/AziziArya/ExpoChallenge_AryaAzizi/releases

---

# Author

Arya Azizi

GitHub

https://github.com/AziziArya

Portfolio

https://aryahub.ir

---

# Challenge Submission

This repository contains my submission for the Innoverse Programming Challenge.

The project provides an end-to-end AI-assisted Mental Health Safety Analysis platform including:

- Backend risk analysis engine
- Explainable AI decision pipeline
- REST API
- Interactive React dashboard
- Human review workflow

The solution implements an AI-powered Mental Health Safety Analyzer capable of:

- Emotional distress detection
- Crisis signal analysis
- Conversation pattern analysis
- Explainable risk assessment
- Safety response generation
- Human review recommendations

The system was designed as a decision-support prototype and does not replace professional mental health services.

# License

MIT License

Copyright © 2026 Arya Azizi
