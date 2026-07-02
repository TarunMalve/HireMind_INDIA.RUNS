# Local Development Setup

> **A comprehensive guide for developers contributing to or running HireMind Elite locally.**

---

## Table of Contents

- [Overview](#overview)
- [Folder Overview](#folder-overview)
- [Running Individual Services](#running-individual-services)
- [Environment Configuration](#environment-configuration)
- [Database Tools](#database-tools)
- [Debugging](#debugging)
- [Development Workflow](#development-workflow)
- [Code Linting](#code-linting)
- [Hot Reload](#hot-reload)
- [Useful Commands](#useful-commands)

---

## Overview

HireMind Elite is a monorepo with two independently runnable services:

| Service | Tech | Port | Entry Point |
|---|---|---|---|
| **Frontend** | Next.js 15 + React 19 | `3000` | `frontend/src/app/layout.tsx` |
| **Backend** | Node.js + Express + TypeScript | `4000` | `backend/src/index.ts` |

Both are coordinated from the root `package.json` using `concurrently`.

---

## Folder Overview

```
HireMind_INDIA.RUNS/
│
├── frontend/                     # Next.js 15 App Router frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout with Clerk provider
│   │   │   ├── recruiter/
│   │   │   │   └── page.tsx      # Recruiter dashboard (main UI)
│   │   │   └── candidate/
│   │   │       └── page.tsx      # Candidate dashboard (main UI)
│   │   ├── components/
│   │   │   └── ExportReportModal.tsx  # XLSX export modal
│   │   └── lib/                  # Shared utilities
│   ├── public/                   # Static assets
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   ├── next.config.ts            # Next.js configuration
│   └── package.json
│
├── backend/                      # Express + TypeScript API
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── config/
│   │   │   └── database.ts       # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── aiController.ts   # AI endpoints handler
│   │   │   ├── applicationController.ts
│   │   │   ├── candidateController.ts
│   │   │   └── jobController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts           # Clerk JWT verification
│   │   │   ├── errorHandler.ts   # Global error handler
│   │   │   └── rateLimiter.ts    # Rate limiting middleware
│   │   ├── routes/
│   │   │   ├── index.ts          # Route aggregator
│   │   │   ├── ai.ts             # /api/ai/* routes
│   │   │   ├── candidates.ts     # /api/candidates/* routes
│   │   │   ├── jobs.ts           # /api/jobs/* routes
│   │   │   └── applications.ts   # /api/applications/* routes
│   │   └── services/
│   │       └── rankingEngine.ts  # Core 6-factor scoring engine
│   ├── prisma/
│   │   └── schema.prisma         # Database schema definition
│   ├── .env.example              # Environment variable template
│   └── package.json
│
├── docs/                         # Full documentation system
│   ├── getting-started/
│   ├── architecture/
│   ├── product/
│   ├── development/
│   ├── api/
│   ├── diagrams/
│   └── images/
│
├── assets/                       # Static media assets
├── config/                       # Root-level configuration
├── shared/                       # Shared types and utilities
├── package.json                  # Root workspace scripts
└── README.md
```

---

## Running Individual Services

### Frontend Only

```bash
cd frontend
npm run dev
```

Starts Next.js development server at `http://localhost:3000` with:
- Hot Module Replacement (HMR)
- Fast Refresh
- Error overlays

### Backend Only

```bash
cd backend
npm run dev
```

Starts the Express server at `http://localhost:4000` with:
- `ts-node-dev` for TypeScript hot reload
- Auto-restart on file changes

### Both Services

```bash
# From the project root
npm run dev
```

Uses `concurrently` to start both simultaneously. Logs are prefixed `[frontend]` and `[backend]`.

---

## Environment Configuration

### Backend Environment (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | ✅ | Backend Clerk secret |
| `CLERK_PUBLISHABLE_KEY` | ✅ | Frontend-safe Clerk key |
| `OPENAI_API_KEY` | ⚠️ Optional | OpenAI integration |
| `GEMINI_API_KEY` | ⚠️ Optional | Google Gemini integration |
| `PINECONE_API_KEY` | ⚠️ Optional | Vector search integration |
| `PINECONE_INDEX` | ⚠️ Optional | Pinecone index name |
| `PORT` | ✅ | API server port (default: `4000`) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `FRONTEND_URL` | ✅ | Frontend URL for CORS (default: `http://localhost:3000`) |

### Frontend Environment (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret (server-side) |
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL |

---

## Database Tools

### Prisma Studio — Visual DB Browser

```bash
npm run db:studio
```

Opens at `http://localhost:5555`. Browse, edit, and query all database tables via a GUI.

### Generate Prisma Client

Run after modifying `schema.prisma`:

```bash
npm run db:generate
```

### Run Migrations

Apply pending schema changes to the database:

```bash
npm run db:migrate
```

### Reset Database (Destructive)

```bash
cd backend
npx prisma migrate reset
```

> ⚠️ This drops all data. Use only in development.

### Inspect Database via psql

```bash
psql -U postgres -d hiremind

# List all tables
\dt

# Inspect a table
\d "Candidate"

# Query
SELECT * FROM "User" LIMIT 10;
```

---

## Debugging

### Backend Debugging (VS Code)

Add this to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["ts-node-dev", "--respawn", "src/index.ts"],
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

### Frontend Debugging

Next.js supports browser DevTools out of the box. Use:
- **React DevTools** browser extension for component inspection
- **Network tab** to inspect API calls to the backend
- `console.log` with the `[frontend]` prefix for clarity

### API Testing

Use [HTTPie](https://httpie.io/) or [Postman](https://www.postman.com/) to test backend routes:

```bash
# Health check
http GET localhost:4000/api/health

# With auth token
http GET localhost:4000/api/candidates \
  Authorization:"Bearer <clerk-jwt>"
```

---

## Development Workflow

### Recommended Git Flow

```
main                   ← Production-stable
  └── develop          ← Integration branch
        ├── feature/ai-matching
        ├── feature/recruiter-dashboard
        └── fix/score-calculation
```

### Typical Feature Development Cycle

```bash
# 1. Pull latest changes
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Start dev servers
npm run dev

# 4. Make your changes
# ... edit files ...

# 5. Lint before committing
npm run lint

# 6. Commit with conventional commit format
git commit -m "feat(ai): add learning roadmap generation"

# 7. Push and open PR
git push origin feature/your-feature-name
```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): short description
fix(scope): what was fixed
docs(scope): documentation changes
refactor(scope): code improvement without feature change
chore(scope): maintenance tasks
```

Examples:
```
feat(ranking): implement honeypot detection algorithm
fix(api): resolve CORS issue for production deployment
docs(architecture): add mermaid diagram for data pipeline
```

---

## Code Linting

### Run All Linters

```bash
npm run lint
```

### Frontend Linting (ESLint + Next.js)

```bash
npm run lint:frontend
```

### Backend Linting

```bash
npm run lint:backend
```

### Auto-fix Issues

```bash
cd frontend && npx eslint . --fix
```

---

## Hot Reload

| Service | Hot Reload Method | Scope |
|---|---|---|
| Frontend | Next.js Fast Refresh | Components, pages, styles |
| Backend | `ts-node-dev --respawn` | All TypeScript source files |
| Database | Manual `db:generate` | After `schema.prisma` changes |

---

## Useful Commands Reference

```bash
# ─── Development ─────────────────────────────────────────────
npm run dev                  # Start both services
npm run dev:frontend         # Frontend only
npm run dev:backend          # Backend only

# ─── Build ───────────────────────────────────────────────────
npm run build                # Build both
npm run build:frontend       # Next.js production build
npm run build:backend        # TypeScript compile

# ─── Database ────────────────────────────────────────────────
npm run db:generate          # Generate Prisma client
npm run db:migrate           # Run pending migrations
npm run db:studio            # Open Prisma Studio

# ─── Linting ─────────────────────────────────────────────────
npm run lint                 # Run all linters
npm run lint:frontend        # Frontend ESLint
npm run lint:backend         # Backend ESLint
```

---

## Related Documentation

- [Installation Guide](INSTALLATION.md) — Full setup instructions
- [Quick Start](QUICK_START.md) — First workflow in 5 minutes
- [Project Structure](../development/PROJECT_STRUCTURE.md) — Detailed folder breakdown
- [Coding Standards](../development/CODING_STANDARDS.md) — Code style guide
- [Contributing Guide](../development/CONTRIBUTING.md) — How to contribute
