# HireMind Elite — AI-Powered Talent Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](docs/LICENSE.md)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](docs/INSTALLATION.md)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-blue.svg)](docs/TECH_STACK.md)
[![Express](https://img.shields.io/badge/Backend-Node%20%2F%20Express-lightgrey.svg)](docs/TECH_STACK.md)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20Prisma-blue.svg)](docs/TECH_STACK.md)

> **Stop matching keywords. Start predicting real-world hiring success.**
> HireMind Elite is the world's first Evidence-Driven Hire Probability Engine designed to identify, rank, and engage the most hireable and realistically available candidates for any job description.

---

## 💡 The Core Problem

Traditional Applicant Tracking Systems (ATS) and hiring processes are fundamentally broken:
1. **Keyword Overlap Abuse**: Candidates game the system by stuffing resumes with buzzwords, leading to high resume match scores but poor interview performance.
2. **Pedigree Bias**: Algorithmic filters discard non-traditional backgrounds, missing self-taught geniuses, open-source contributors, and fast learners.
3. **Data graveyards**: Once a candidate is rejected, their profile is buried in an ATS database, never to be re-assessed for future matching opportunities.
4. **Honeypot Claims**: Over-inflated resume details and AI-generated achievements pass keyword filters without verification, wasting recruiter time.

### Our Solution
HireMind Elite replaces resume similarity with **Hire Probability**. It evaluates candidates across 6 independent, evidence-driven dimensions using a **multiplicative scoring model** where low integrity or low availability collapses the candidate's final probability score—protecting recruiters from bad hires.

---

## 🚀 Product Overview

*   **Hire Probability Engine**: Multiplicative scoring logic ($P(Q) \times P(A) \times P(E) \times P(L) \times P(G) \times P(S)$) that evaluates qualification, availability, engagement, legitimacy, growth, and scrappiness.
*   **Candidate DNA Profiler**: Multi-dimensional capability maps showing candidate strengths, risks, and career trajectories in space-efficient radar visuals.
*   **AI Recruiter Copilot**: Context-aware drawer assistant capable of summarizing DNA briefs, identifying hidden talent, and answering structured sourcing queries.
*   **Behavioral Intelligence**: Scraping public signal data (GitHub velocity, LinkedIn updates, portfolio additions) to estimate candidate availability and interest.
*   **Honeypot & Legitimacy Checks**: Inline verification quizzes that prompt candidates to prove resume claims, dropping unverified candidate scores to near-zero.
*   **Second Chance AI**: Generates custom learning roadmaps for unsuccessful applicants, tracking their improvements and auto-rematching them to new openings.

---

## 📸 Interface Preview

Below are placeholders and layout structures for the key interface panels. Refer to the [User Guide](docs/USER_GUIDE.md) for full screenshots and interaction walkthroughs.

| Section | Preview Mockup | Description |
|---|---|---|
| **Landing Page** | `[Landing Page Hero View]` | Rebuilt V2 dark-first SaaS landing page featuring floating badges, counters, and glassmorphism. |
| **Recruiter Dashboard** | `[Recruiter Workspace Mock]` | Dashboard showing active pipeline health, match distribution, and candidate короткие карточки. |
| **Candidate DNA** | `[DNA Radar Panel View]` | Visualization showing multi-dimensional competency scores with recruiter briefs and risk summaries. |
| **Explainable AI** | `[AI Formula Chain Mock]` | Transparent look at the multiplicative P-factor equations showing the exact score breakdown. |

---

## 🛠️ Architecture Overview

```
                      +-----------------------------+
                      |     Client Web Browser      |
                      | (Vanilla JS + Next.js SPA)  |
                      +--------------+--------------+
                                     |
                             REST / WebSockets
                                     |
                                     v
                      +--------------+--------------+
                      |    Node.js Express Server   |
                      |       (REST APIs)           |
                      +--------------+--------------+
                                     |
                       Prisma ORM    |    LLM APIs
                      +--------------+    +--------------+
                      |              |    |              |
                      v              |    v              v
            +---------+---------+    |  +-+--------------+-+
            |  PostgreSQL Database|    |  | Gemini / OpenAI|
            | (Candidate Profiles|    |  |   API Layer    |
            |     & Job Ads)    |    |  +---------------+
            +-------------------+    |
                                     v
                       +-------------+-------------+
                       |  Multiplicative Scoring   |
                       |  & Ranking Engine (Core)  |
                       +---------------------------+
```

1.  **Frontend Layer**: Static SPA served via Next.js rewrites at `/` (located in `frontend/public/`). Next.js is configured to serve static assets efficiently with fallback routes.
2.  **Backend Layer**: Express API server written in TypeScript (located in `backend/src/`). Connects endpoints to DB services and AI modules.
3.  **AI & Scoring Layer**: Evaluates candidate resumes against parsed JDs, calculates the 6 P-factors, and builds natural-language recruiter summaries.

---

## ⚡ Tech Stack Summary

*   **Frontend**: Next.js 15, Vanilla JS, CSS3 Variables, Three.js (Background Constellations), Lucide Icons, Chart.js.
*   **Backend**: Node.js, Express, TypeScript, Prisma ORM.
*   **Database**: PostgreSQL.
*   **AI Engine**: Gemini 1.5 / OpenAI GPT-4o, Custom Multiplicative Ranking Pipeline.
*   **Deployment**: Vercel (Frontend SPA), Railway / Render (Express API Server), Docker containerization.

---

## 🏃 Quick Start

### 1. Prerequisites
- Node.js (v18.x or v20.x recommended)
- PostgreSQL Database Instance

### 2. Clone the Repository
```bash
git clone https://github.com/TarunMalve/HireMind_INDIA.RUNS.git
cd HireMind_INDIA.RUNS
```

### 3. Setup Environment Variables
Create `.env` files in both `backend` and `config` folders (refer to [env.example](config/env.example) for variables):
```bash
cp config/env.example backend/.env
```

### 4. Install Dependencies & Build
Install workspace dependencies:
```bash
# In Root
npm install
npm run db:generate # Generate Prisma client
```

### 5. Run the Application
Run both frontend and backend development servers simultaneously:
```bash
npm run dev
```
The frontend will be served at `http://localhost:3000` and backend APIs at `http://localhost:5000`.

---

## 📚 Documentation Map

Explore the detailed architecture, guides, and engineering logs of the HireMind platform:

*   **Core Systems**
    *   [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture, database mapping, and data flow.
    *   [TECH_STACK.md](docs/TECH_STACK.md) — Technical choices, trade-offs, and software choices.
    *   [SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md) — Scalability, optimization, vector indexes, and caching.
*   **Engines & Algorithms**
    *   [AI_ENGINE.md](docs/AI_ENGINE.md) — LLM prompt designs, semantic parsing, and reasoning generation.
    *   [SCORING_ENGINE.md](docs/SCORING_ENGINE.md) — Mathematical formula breakdown, P-factors, and zero-killer rules.
*   **Operations & Developer Guides**
    *   [INSTALLATION.md](docs/INSTALLATION.md) — Step-by-step local developer environment installation.
    *   [DEPLOYMENT.md](docs/DEPLOYMENT.md) — Production deployment instructions (Vercel, Railway, Render).
    *   [API_REFERENCE.md](docs/API_REFERENCE.md) — Endpoint specifications, JSON request/response structures.
*   **Product Manuals**
    *   [USER_GUIDE.md](docs/USER_GUIDE.md) — User interface controls, buttons, theme switches.
    *   [RECRUITER_GUIDE.md](docs/RECRUITER_GUIDE.md) — Sourcing, shortlisting, and candidate analytics.
    *   [CANDIDATE_GUIDE.md](docs/CANDIDATE_GUIDE.md) — Profiling, roadmap goals, and resume validation.
*   **Platform Governance & Pitch**
    *   [HACKATHON_SUBMISSION.md](docs/HACKATHON_SUBMISSION.md) — Dedicated guide for hackathon judges & sponsors.
    *   [ROADMAP.md](docs/ROADMAP.md) — System features planned for future quarters.
    *   [SECURITY.md](docs/SECURITY.md) — Data encryption, GDPR compliance, rate limits, JWT.

---

## 👥 Contributors
- **Tarun Malve** — Lead Architect & Backend Developer
- **Mohit Malve** — Frontend & UI Engineer

## 📄 License
This project is licensed under the MIT License — see the [LICENSE.md](docs/LICENSE.md) file for details.