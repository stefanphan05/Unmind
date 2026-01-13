# 🌟 Unmind: Your Personal AI Therapist

**The future of mental wellness, delivered instantly and confidentially.**

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=flat-square)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=flat-square)](https://www.python.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini-007A9B?logo=google&logoColor=white&style=flat-square)](https://ai.google.dev/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white&style=flat-square)](https://openai.com/)

---

## 💡 Overview

Unmind is a **pioneering application** designed to democratize access to mental health support. It operates as an empathetic, 24/7 AI-powered therapist, utilizing cutting-edge conversational models to provide personalized, immediate, and confidential therapeutic assistance.

Unmind moves beyond basic chatbots by focusing on a **natural, voice-first user experience**, ensuring conversations feel deeply human and non-judgmental.

## 🚀 Key Features

- **24/7 Instant Support:** Access therapeutic conversation anytime, removing barriers of scheduling or availability.
- **Voice-Enabled Interaction:** Seamless, natural spoken conversation powered by integrated Text-to-Speech (TTS) and Web Speech-to-Text (ASR) technologies.
- **Intelligent Dialogue:** Context-aware and empathetic responses driven by state-of-the-art LLMs (Google Gemini and OpenAI).
- **Robust Authentication:** Secure user management and login handled by a dedicated `AuthService` using SQLAlchemy and `werkzeug.security`.
- **Confidential Session Management:** Automated creation and management of individual therapy sessions and message history linked to user accounts.

## ⚙️ Technology Stack

Unmind is built on a modern, robust architecture for performance and scalability.

### Frontend

| Component     | Technology         | Purpose                                                                  |
| :------------ | :----------------- | :----------------------------------------------------------------------- |
| **Framework** | Next.js            | Server-rendered React application for high performance and fast loading. |
| **Language**  | TypeScript         | Ensures type safety and scalability across the large codebase.           |
| **Voice I/O** | Web Speech-to-Text | Captures user speech in real-time for conversational input.              |

### Backend (Python/Flask)

| Component         | Technology             | Purpose                                                           |
| :---------------- | :--------------------- | :---------------------------------------------------------------- |
| **API Framework** | Flask                  | Lightweight and flexible REST API service layer.                  |
| **Core AI**       | Google Gemini & OpenAI | Provides the core intelligence, empathy, and conversational flow. |
| **Database ORM**  | SQLAlchemy             | Manages database interactions for users, sessions, and messages.  |
| **Voice I/O**     | ElevenLabs             | Ensures ultra-realistic text-to-speech technology.                |
| **Security**      | `werkzeug.security`    | Handles secure password hashing and verification.                 |
