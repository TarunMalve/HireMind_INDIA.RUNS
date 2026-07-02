# Installation Guide

> **Get HireMind Elite running in your local environment.** This guide covers every prerequisite, environment setup step, and common troubleshooting scenario.

---

## Table of Contents

- [Requirements](#requirements)
- [Supported Operating Systems](#supported-operating-systems)
- [Node.js Version](#nodejs-version)
- [Package Manager](#package-manager)
- [Clone Repository](#clone-repository)
- [Install Dependencies](#install-dependencies)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Run Frontend](#run-frontend)
- [Run Backend](#run-backend)
- [Run Both Simultaneously](#run-both-simultaneously)
- [Production Build](#production-build)
- [Troubleshooting](#troubleshooting)

---

## Requirements

Before you begin, ensure you have the following installed on your system:

| Requirement | Minimum Version | Recommended | Notes |
|---|---|---|---|
| **Node.js** | 18.x | 20.x LTS | Required for both frontend and backend |
| **npm** | 9.x | 10.x | Comes bundled with Node.js |
| **PostgreSQL** | 14.x | 16.x | Local or hosted (Railway, Supabase, Neon) |
| **Git** | 2.x | Latest | For cloning the repository |

### External Service Accounts

You will also need API keys for the following services:

| Service | Purpose | Free Tier? |
|---|---|---|
| **Clerk** | Authentication & user management | ✅ Yes |
| **OpenAI** or **Gemini** | AI resume analysis & chat | ✅ Limited |
| **Pinecone** | Vector embeddings (optional for v1) | ✅ Yes |

---

## Supported Operating Systems

| OS | Status | Notes |
|---|---|---|
| **macOS** (12+) | ✅ Fully supported | M1/M2/M3 Apple Silicon compatible |
| **Linux** (Ubuntu 20.04+) | ✅ Fully supported | Recommended for production |
| **Windows** (10/11) | ✅ Supported | Use PowerShell or WSL2 |

---

## Node.js Version

HireMind Elite requires **Node.js v18.x or v20.x LTS**.

### Install via nvm (Recommended)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc on macOS

# Install the recommended version
nvm install 20
nvm use 20

# Verify
node --version   # Should output v20.x.x
npm --version    # Should output 10.x.x
```

### Verify Existing Installation

```bash
node --version
npm --version
```

---

## Package Manager

HireMind uses **npm** as its package manager. The root workspace uses npm workspaces to orchestrate both `frontend/` and `backend/`.

> **Note:** Do not use `yarn` or `pnpm` unless you update the lockfile accordingly.

---

## Clone Repository

```bash
git clone https://github.com/TarunMalve/HireMind_INDIA.RUNS.git
cd HireMind_INDIA.RUNS
```

Your directory structure will look like:

```
HireMind_INDIA.RUNS/
├── frontend/          # Next.js 15 application
├── backend/           # Express + TypeScript API server
├── docs/              # Full documentation
├── package.json       # Root workspace
└── README.md
```

---

## Install Dependencies

### Step 1 — Root Dependencies

Install the root workspace tooling (`concurrently` for running both servers):

```bash
npm install
```

### Step 2 — Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 3 — Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

Or run all three in sequence:

```bash
npm install && cd backend && npm install && cd ../frontend && npm install && cd ..
```

---

## Environment Variables

### Backend `.env`

Copy the example file:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in your credentials:

```env
# ─── Database ───────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/hiremind?schema=public"

# ─── Authentication (Clerk) ─────────────────────
CLERK_SECRET_KEY="sk_test_..."
CLERK_PUBLISHABLE_KEY="pk_test_..."

# ─── AI Providers ───────────────────────────────
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="..."

# ─── Vector Database (Pinecone) ──────────────────
PINECONE_API_KEY="..."
PINECONE_INDEX="hiremind-embeddings"

# ─── Server ──────────────────────────────────────
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_API_URL=http://localhost:4000
```

> **Security:** Never commit `.env` files to version control. They are included in `.gitignore` by default.

---

## Database Setup

### Step 1 — Start PostgreSQL

Ensure your PostgreSQL server is running locally or that your `DATABASE_URL` points to a hosted instance.

```bash
# macOS with Homebrew
brew services start postgresql@16

# Linux (systemd)
sudo systemctl start postgresql

# Windows
# Start PostgreSQL from Services or pgAdmin
```

### Step 2 — Create the Database

```bash
psql -U postgres -c "CREATE DATABASE hiremind;"
```

### Step 3 — Generate Prisma Client

```bash
npm run db:generate
```

### Step 4 — Run Migrations

```bash
npm run db:migrate
```

This applies all schema migrations from `backend/prisma/schema.prisma` to your database.

### Optional — Open Prisma Studio

```bash
npm run db:studio
```

This opens a visual database browser at `http://localhost:5555`.

---

## Run Frontend

```bash
# From project root
npm run dev:frontend

# Or from the frontend directory
cd frontend && npm run dev
```

The Next.js app will be available at: **http://localhost:3000**

---

## Run Backend

```bash
# From project root
npm run dev:backend

# Or from the backend directory
cd backend && npm run dev
```

The Express API will be available at: **http://localhost:4000**

Health check endpoint: **http://localhost:4000/api/health**

---

## Run Both Simultaneously

The recommended development workflow — runs frontend and backend concurrently:

```bash
npm run dev
```

This uses `concurrently` to start both servers in parallel, streaming their logs to the same terminal.

Expected output:

```
[frontend] ▲ Next.js 15.x
[frontend] - Local:        http://localhost:3000
[frontend] ✓ Ready in 1234ms
[backend]  🚀 HireMind API running on port 4000
[backend]  📦 Database: Connected
```

---

## Production Build

### Build Both Services

```bash
npm run build
```

This runs:
- `cd frontend && npm run build` — Compiles Next.js to `.next/`
- `cd backend && npm run build` — Compiles TypeScript to `backend/dist/`

### Start Production Server

```bash
# Backend
cd backend && node dist/index.js

# Frontend
cd frontend && npm start
```

---

## Troubleshooting

### `Cannot connect to database`

- Ensure PostgreSQL is running and the `DATABASE_URL` is correct
- Verify the database `hiremind` exists: `psql -U postgres -c "\l"`
- Check port conflicts: `lsof -i :5432`

### `Invalid Clerk credentials`

- Ensure `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are correctly set
- Keys must match the same Clerk application (test keys start with `pk_test_` / `sk_test_`)

### `Port 3000 or 4000 already in use`

```bash
# Kill the process on the port
npx kill-port 3000
npx kill-port 4000
```

### `Prisma client not found`

```bash
npm run db:generate
```

### `Module not found` errors in backend

```bash
cd backend && npm install
```

### `next: command not found`

```bash
cd frontend && npm install
```

---

## Related Documentation

- [Quick Start Guide](QUICK_START.md) — Fastest path to first workflow
- [Local Setup](LOCAL_SETUP.md) — Deep-dive development environment
- [Deployment Guide](DEPLOYMENT.md) — Deploying to production
- [Environment Variables](../architecture/SECURITY.md) — Security & secrets management
