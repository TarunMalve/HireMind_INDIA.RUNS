# Tech Stack Selection — HireMind Elite

This document details the technologies chosen for the HireMind Elite platform, outlining the technical reasoning, engineering trade-offs, and benefits of each choice.

---

## 1. Architectural Stack Summary

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| **Frontend Core** | Next.js / React | `v15.3` / `v19` | Efficient static serving, fast routing, and clean framework wrappers. |
| **Frontend Logic** | Vanilla JS / CSS | Standard ES6 | Bypasses virtual DOM hydration latency; keeps dashboard page loads instant. |
| **Backend Core** | Node.js / Express | `v20.x` / `v4.19` | Highly asynchronous, non-blocking I/O event loops, easy REST routing. |
| **Database ORM** | Prisma ORM | `v5.x` | Strongly typed database schema mapping, auto migrations, clean syntax. |
| **Database Engine** | PostgreSQL | `v15` | Acid compliant, powerful JSONB indexing, reliable relational mappings. |
| **AI Processing** | OpenAI GPT-4o / Gemini 1.5 | API | Industry-leading text reasoning, semantic analysis, and JSON structure output. |
| **Styling System** | Vanilla CSS3 Custom Variables | - | Absolute styling control; avoids compile-time utility bloat (Tailwind). |

---

## 2. Frontend Choices & Trade-Offs

### Next.js 15 rewrite to index.html
- **Concept**: Next.js functions primarily as a static host rewrite mechanism for our Vanilla JS Single Page Application.
- **Reasoning**: Next.js provides excellent assets compression, code-splitting, and routing defaults. However, rather than building a standard server-side rendered (SSR) React app which introduces hydration delays and state complexity, we compile our frontend into a static `index.html` and let Vanilla JS manage DOM updates directly.
- **Trade-off**: Requires writing manual DOM manipulation code inside `app.js` and `landing.js`. However, it guarantees that dashboard transitions and visual renders (Three.js and Chart.js) load instantly without React component re-render overhead.

### CSS Custom Variables over Tailwind CSS
- **Concept**: Pure CSS variables (`--lp-bg`, `--lp-accent`) are declared globally to manage themes, glassmorphic shadows, and animations.
- **Reasoning**: Standard Tailwind utility compilation creates massive style strings. By using native CSS grids, variables, and transition declarations, we build custom micro-animations (like the marquee logo scroll and pulsating dot indicators) directly in standard stylesheets (`style.css` and `landing.css`) with zero performance overhead.

---

## 3. Backend & Database Architecture

### Node.js & Express
- **Concept**: Express acts as the lightweight router layer for API endpoints.
- **Reasoning**: Recruiting pipelines process high volumes of files (resumes, JDs). Node's non-blocking I/O loops enable backend services to parse text streams, trigger parallel LLM prompts, and log DB records concurrently without threading bottle-necks.
- **Trade-off**: Requires careful promise error handling to prevent server crashes.

### PostgreSQL & Prisma ORM
- **Concept**: Relational database mapping using TypeScript models.
- **Reasoning**: Sourcing databases require structured relations between Job descriptions, Candidate profiles, and Match SHORTLIST records. PostgreSQL offers robust SQL support, transactions safety, and high-performance querying on nested JSON columns (used to store parsed candidate history).
- **Benefits of Prisma**: Autogenerates TypeScript interfaces, making SQL query parameters type-safe.

---

## 4. AI & Sourcing Engines

### Multiplicative Scoring Engine
- **Concept**: Product-based evaluation: $Score = \prod P_i$.
- **Reasoning**: Traditional weighted linear additions allow candidates to get a high overall score simply by having perfect credentials, even if their availability is zero or their resume is falsified. Using a multiplicative scoring approach guarantees that if any key parameter collapses, the candidate is flagged and filtered out automatically.
- **LLM Integration**: LLMs (Gemini / OpenAI) are used exclusively for semantic extraction—converting unstructured resume text into structural JSON properties—while the math calculations are processed deterministically in TypeScript for predictability.