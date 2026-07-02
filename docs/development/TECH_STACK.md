# Technology Stack

> **A detailed breakdown of the tools, frameworks, libraries, and architectural decisions powering the HireMind Elite ecosystem.**

---

## Table of Contents

- [Core Technology Stack](#core-technology-stack)
- [Frontend Stack details](#frontend-stack-details)
- [Backend Stack details](#backend-stack-details)
- [Database Stack details](#database-stack-details)
- [Third-Party Services](#third-party-services)
- [Monorepo Tooling](#monorepo-tooling)
- [Architectural Decisions & Rationale](#architectural-decisions--rationale)

---

## Core Technology Stack

| Layer | Technology | Version | Description |
|---|---|---|---|
| **Frontend Framework** | Next.js 15 (App Router) | `^15.3.0` | React server-side rendering & optimized routing |
| **Frontend Library** | React 19 | `^19.0.0` | Core UI render engine |
| **Backend Runtime** | Node.js | `^20.x` | Scalable JavaScript runtime environment |
| **Backend Framework** | Express.js | `^4.19.2` | Robust REST API server |
| **Database ORM** | Prisma | `^5.14.0` | Type-safe database client and migration manager |
| **Database System** | PostgreSQL | `15+` | Primary relational data store |
| **Authentication** | Clerk | Next/Express SDKs | Secure identity, RBAC, and session management |
| **Programming Language** | TypeScript | `^5.x` | Strict type safety across the monorepo |

---

## Frontend Stack Details

The frontend combines cutting-edge interface libraries with high-performance animations and 3D graphics.

### State & Sourcing
- **Zustand** (`^5.0.0`) — Lightweight, developer-friendly client state management. Used for filter selections, workspace toggles, and matching options.
- **Axios** (`^1.7.0`) — Promise-based HTTP client for talking to the Express backend.

### Styling & Graphics
- **Tailwind CSS v4** (`^4.0.0`) — Modern utility-first CSS framework for layout and styling.
- **Three.js** (`^0.172.0`) & **React Three Fiber** (`^9.0.0`) — WebGL renderer used to power interactive 3D particle backgrounds.
- **Framer Motion** (`^12.0.0`) & **GSAP** (`^3.12.0`) — High-fidelity layouts and micro-animations for responsive cards, drawers, and modal transitions.
- **Lucide React** (`^0.468.0`) — Standardized developer icon library.

### Reporting
- **ExcelJS** (`^4.4.0`) — Client-side XLSX generation. Enables recruiters to configure columns and download formatted spreadsheet reports in one click.

---

## Backend Stack Details

The backend provides a fast, secure API layer focused on candidate scoring and verification.

### Core Web Framework
- **Express.js** (`^4.19.2`) — Handles API routing, controllers, and middleware pipes.
- **tsx** (`^4.7.2`) — Direct execution of TypeScript files during development, eliminating build steps.

### Security & Middleware
- **Helmet** (`^7.1.0`) — Automatically sets security-related HTTP headers to prevent basic attacks (XSS, clickjacking).
- **Cors** (`^2.8.5`) — Restricts request origins to the authorized Next.js frontend domain.
- **Express Rate Limit** (`^8.5.2`) — Rate-limits endpoints to protect expensive AI parsing engines from abuse.
- **Morgan** (`^1.10.0`) — HTTP request logging middleware.

### AI Integrations (Planned)
- **OpenAI Node SDK** (`^4.40.0`) — Ready for semantic parsing, vector embeddings, and intent scoring.

---

## Database Stack Details

### PostgreSQL
The relational database storing structured tables:
- **`User`** — Identifies registered recruiters, candidates, and admins.
- **`Job`** — Job descriptions, requirements, and embeddings.
- **`Candidate`** — Stated skills, parsing metrics, and resume text.
- **`Application`** — Ranking outcomes, stage statuses, and AI summaries.
- **`CandidateDNA`** — Radar chart dimension scores.
- **`LearningRoadmap`** — Milestone items and progress tracking.

### Prisma ORM
- Pre-compiled prepared queries protect against SQL injection.
- Direct relation mapping: `Candidate` ↔ `Application` ↔ `Job`.
- Cascade deletions (`onDelete: Cascade`) guarantee data cleaning on account deletion.

---

## Third-Party Services

### Clerk Auth
- **Backend**: `@clerk/express` verifies incoming Bearer JWTs using JWKS public keys.
- **Frontend**: `@clerk/nextjs` handles login, registration, and session token storage.
- Clerk handles all password storage, OAuth links, and MFA workflows.

### AI Foundation (Planned)
- **OpenAI API** — `text-embedding-ada-002` for semantic indexing.
- **Gemini 1.5 Pro / Flash** — Text extraction, intent analysis, and structured candidate reviews.

### Vector Storage (Planned)
- **Pinecone DB** — High-scale indexing of 1536-dimension float arrays for semantic matching.

---

## Monorepo Tooling

The monorepo uses simple, lightweight orchestration:

- **Concurrently** (`^9.1.0`) — Launches frontend dev server, backend dev server, and TypeScript watchers simultaneously with prefix-labeled logs.
- **TypeScript Project References** — Enforces boundary rules between the shared type module and executable subsystems.

---

## Architectural Decisions & Rationale

### Rationale 1: Next.js + Express Separation
While Next.js supports API routes, we chose an independent Express API backend to:
1. Support high-frequency background workloads (sourcing scripts, ML pipelines) without blockages.
2. Keep business logic and scoring algorithms decoupled from page rendering frameworks.
3. Allow easy migration of the API to separate compute structures (ECS, Kubernetes) if needed.

### Rationale 2: Relational Schema for Match Scoring
We utilize PostgreSQL instead of a NoSQL structure because the candidate ranking engine requires complex joins between `Job`, `Candidate`, `Application`, and `CandidateDNA` tables. Relational consistency ensures scores remain synchronized.

### Rationale 3: Client-Side XLSX Compilation
Using `ExcelJS` on the client side avoids server CPU spikes during large report exports and keeps candidate files out of temp directories, supporting our security posture.

---

## Related Documentation

- [Project Structure](PROJECT_STRUCTURE.md) — Directory layout
- [System Architecture](../architecture/SYSTEM_ARCHITECTURE.md) — Sourcing flow diagrams
- [Security](../architecture/SECURITY.md) — Clerk integration details
- [API Reference](../api/API_REFERENCE.md) — API interfaces
