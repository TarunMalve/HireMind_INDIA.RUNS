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

*   **Getting Started**
    *   [INSTALLATION.md](docs/getting-started/INSTALLATION.md) — Prerequisites, CLI tools, and installation script.
    *   [QUICK_START.md](docs/getting-started/QUICK_START.md) — 5-minute workspace startup.
    *   [LOCAL_SETUP.md](docs/getting-started/LOCAL_SETUP.md) — Database seeding, environment variables, and local verification.
    *   [DEPLOYMENT.md](docs/getting-started/DEPLOYMENT.md) — Vercel and Railway production guides.
*   **Core Architecture**
    *   [SYSTEM_ARCHITECTURE.md](docs/architecture/SYSTEM_ARCHITECTURE.md) — Multi-tier design, data flows, and middleware security.
    *   [DATABASE_SCHEMA.md](docs/architecture/DATABASE_SCHEMA.md) — Prisma models, PostgreSQL relational structure, and indexes.
    *   [DATA_PIPELINE.md](docs/architecture/DATA_PIPELINE.md) — End-to-end resume parse and match processing pipeline.
    *   [AI_ENGINE.md](docs/architecture/AI_ENGINE.md) — LLM layers, prompt engineering, and DNA radar analysis.
    *   [MATCHING_ENGINE.md](docs/architecture/MATCHING_ENGINE.md) — Semantic skill search and technology adjacency logic.
    *   [SCORING_ENGINE.md](docs/architecture/SCORING_ENGINE.md) — Multiplicative ETV-RAVE formulas and zero-killer rules.
    *   [SECURITY.md](docs/architecture/SECURITY.md) — JWT verification, Clerk integration, and API protection.
*   **Product Insights**
    *   [PRODUCT_OVERVIEW.md](docs/product/PRODUCT_OVERVIEW.md) — Mission statement, target users, and innovation value.
    *   [FEATURES.md](docs/product/FEATURES.md) — Features reference and functional capabilities.
    *   [RECRUITER_GUIDE.md](docs/product/RECRUITER_GUIDE.md) — Job management, rankings, and candidate profiling for recruiters.
    *   [CANDIDATE_GUIDE.md](docs/product/CANDIDATE_GUIDE.md) — Profile construction, DNA mapping, and learning roadmaps for candidates.
    *   [USER_JOURNEY.md](docs/product/USER_JOURNEY.md) — Visual recruiter, candidate, and system journey flows.
    *   [FAQ.md](docs/product/FAQ.md) — 50-question developer and user FAQ.
    *   [FUTURE_ROADMAP.md](docs/product/FUTURE_ROADMAP.md) — Planned milestones and ATS marketplace integrations.
*   **Development & QA**
    *   [PROJECT_STRUCTURE.md](docs/development/PROJECT_STRUCTURE.md) — Directory layout and codebase organization.
    *   [TECH_STACK.md](docs/development/TECH_STACK.md) — Monorepo packages, versions, and architectural decisions.
    *   [CODING_STANDARDS.md](docs/development/CODING_STANDARDS.md) — Styling, type safety, and PR submission guides.
    *   [TESTING.md](docs/development/TESTING.md) — QA checklist, manual engine verification, and automated testing roadmap.
    *   [CONTRIBUTING.md](docs/development/CONTRIBUTING.md) — Open source workflows and contribution steps.
    *   [CHANGELOG.md](docs/development/CHANGELOG.md) — Core release logs and version history.
*   **API Layer**
    *   [API_REFERENCE.md](docs/api/API_REFERENCE.md) — Endpoint specifications, JSON request/response schema.

---

## 👥 Contributors
- **Tarun Malve** — Lead Architect & Backend Developer
- **Mohit Malve** — Frontend & UI Engineer

## 📄 License
This project is licensed under the MIT License — see the [LICENSE.md](docs/LICENSE.md) file for details.