# 🗳️ ElectSmart — AI-Powered Election Guide

> **PromptWars 2026 · Challenge 2 Submission**  
> An interactive, intelligent assistant that helps citizens understand the election process, timelines, and voting steps in a clear and empowering way.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=flat-square&logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

---

## 📌 Chosen Vertical

**Election Process Guide** — A smart, dynamic assistant that demystifies the democratic election process for every citizen, with a focus on first-time voters and civic engagement.

---

## 🎯 Approach & Logic

### Problem
Many citizens, especially first-time voters, find the election process confusing — registration deadlines, polling procedures, EVM/VVPAT operation, valid ID requirements, and counting mechanisms are poorly understood by the general public.

### Solution
ElectSmart is a multi-feature interactive web app powered by **Google Gemini AI** that:

1. **AI Chat Assistant** — A Gemini-powered chatbot with a strict "Election Guide" persona. Uses server-side API routing to keep the API key secure. Maintains conversation history for contextual multi-turn dialogue.
2. **Visual Election Timeline** — An interactive 7-phase clickable timeline covering the complete Indian election lifecycle from announcement to government formation.
3. **First-Time Voter Guide** — A step-by-step wizard that walks users through registration → voter ID → finding a polling booth → casting a vote.
4. **FAQ Section** — Accordion-style answers to the most commonly misunderstood election questions (EVM, VVPAT, NOTA, valid ID alternatives, etc.).

### Decision Logic
- The AI assistant is **persona-locked**: it only answers election-related questions. Off-topic queries are gracefully redirected.
- **Context-aware**: The last 10 messages are passed as chat history to Gemini for coherent multi-turn conversations.
- **Non-partisan**: The system prompt explicitly instructs the AI to never favor any party or candidate.
- **Input validation**: All user input is validated (max 2000 chars) and sanitized on the server before being sent to the AI.

---

## 🏗️ How the Solution Works

```
User Browser
    │
    ├── /               → Main UI (Next.js App Router)
    │     ├── ChatInterface    → Calls /api/chat via fetch
    │     ├── ElectionTimeline → Static interactive component
    │     ├── VoterGuide       → Step-by-step wizard
    │     └── FAQ              → Accordion component
    │
    └── /api/chat (POST) → Next.js Server Route
          ├── Validates input
          ├── Reads GEMINI_API_KEY from server env (never exposed to client)
          ├── Calls Google Gemini API with system prompt + history
          └── Returns AI response
```

**Google Services Used:**
- **Google Gemini API** (`gemini-1.5-flash`) — Core AI brain of the assistant
- **Google Fonts** (`Inter`) — Typography via Next.js font optimization

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| AI | Google Gemini 1.5 Flash |
| Styling | Vanilla CSS (glassmorphism, dark mode) |
| Font | Google Fonts — Inter |
| Deployment | Vercel-ready |

---

## 🔒 Security

- `GEMINI_API_KEY` is stored in `.env.local` and **only accessed server-side** via Next.js API Route
- The API key is **never sent to the client browser**
- Input length is limited to 2000 characters
- Safety settings are configured on Gemini to block harmful content
- `.env.local` is listed in `.gitignore`

---

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key (free)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/election-assistant.git
cd election-assistant

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Gemini API key:
# GEMINI_API_KEY=your_key_here

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

---

## 📋 Assumptions Made

1. **India-centric context**: The app is optimized for Indian election processes (ECI, EVM, VVPAT, EPIC cards) but Gemini provides globally applicable information when asked general questions.
2. **Gemini Flash for efficiency**: `gemini-1.5-flash` is used over Pro for faster response times and lower cost, which is ideal for an interactive chatbot.
3. **No user authentication**: The app is intentionally open/public — no login required, consistent with civic education tools.
4. **Static timeline data**: Election phase data is hardcoded (not fetched from a live API) since this is a general educational guide, not a live election tracker.

---

## ✅ Evaluation Criteria Addressed

| Criteria | Implementation |
|----------|---------------|
| **Code Quality** | TypeScript, modular components, clear separation of concerns |
| **Security** | API key server-side only, input validation, safety settings |
| **Efficiency** | Gemini Flash model, only last 10 messages sent as history |
| **Testing** | Input validation, error handling with user-friendly messages |
| **Accessibility** | ARIA roles, labels, `role="tablist"`, `aria-expanded`, semantic HTML |
| **Google Services** | Gemini AI API + Google Fonts (Inter) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout with SEO metadata
│   ├── page.tsx           # Main page with tab navigation
│   ├── globals.css        # Global styles + design tokens
│   ├── components.css     # Component-specific styles
│   └── api/
│       └── chat/
│           └── route.ts   # Secure Gemini API route
└── components/
    ├── ChatInterface.tsx   # AI chat with history & suggestions
    ├── ElectionTimeline.tsx # 7-phase interactive timeline
    ├── VoterGuide.tsx      # Step-by-step first-voter wizard
    └── FAQ.tsx             # Accordion FAQ component
```

---

*Built with ❤️ for PromptWars 2026 · Powered by Google Gemini AI*
