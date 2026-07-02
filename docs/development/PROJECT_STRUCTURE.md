# Project Structure

> **A comprehensive guide to the HireMind Elite directory layout, files, and core components.**

---

## Table of Contents

- [Overview](#overview)
- [Root Directory](#root-directory)
- [Backend Subsystem (`backend/`)](#backend-subsystem-backend)
- [Frontend Subsystem (`frontend/`)](#frontend-subsystem-frontend)
- [Shared Module (`shared/`)](#shared-module-shared)
- [Documentation System (`docs/`)](#documentation-system-docs)
- [Build and Scripts](#build-and-scripts)

---

## Overview

HireMind Elite is organized as a monorepo consisting of:
1. A **Next.js 15 App Router** frontend (`frontend/`)
2. An **Express TypeScript** REST API backend (`backend/`)
3. A **Shared Module** containing TypeScript interfaces and types (`shared/`)
4. A **Prisma Schema** definition linking to PostgreSQL (`backend/prisma/`)

---

## Root Directory

The root folder orchestrates monorepo builds, development scripts, and versioning.

```
d:\INDIA.RUNS\
├── package.json              # Monorepo setup using concurrently
├── style.css                 # Legacy / Global CSS styles
├── app.js                    # Legacy entrypoint (deprecated)
├── mockData.js               # Mock data generator for testing
├── exportReport.js           # Core JS export script
├── threeBackground.js        # 3D interactive background assets
├── push_to_git.bat           # Utility git deployment helper
├── powershell.cmd            # PowerShell env initialization
├── assets/                   # High-res static images and visual assets
├── config/                   # Global configuration files
├── examples/                 # Sourcing and ranking scripts
└── docs/                     # Global startup-grade documentation
```

---

## Backend Subsystem (`backend/`)

The backend is a TypeScript Express application providing candidate evaluation, authentication check, and job management APIs.

```
backend/
├── prisma/
│   ├── schema.prisma         # Database model definitions
│   └── migrations/           # Database migration files
├── src/
│   ├── index.ts              # Express application entrypoint
│   ├── config/               # Database and authentication setups
│   ├── controllers/          # API Request handlers
│   │   ├── aiController.ts           # Resume parse, DNA, challenges
│   │   ├── applicationController.ts  # Pipeline updates and matches
│   │   ├── candidateController.ts    # Profile editing and upload
│   │   └── jobController.ts          # Job postings CRUD
│   ├── middleware/           # Auth and error middleware
│   │   ├── auth.ts                   # Clerk session validator
│   │   └── errorHandler.ts           # Global error translation
│   ├── routes/               # API route definitions
│   │   ├── ai.ts                     # AI evaluation endpoints
│   │   ├── applications.ts           # Job application paths
│   │   ├── candidates.ts             # Profile management routes
│   │   └── jobs.ts                   # Sourcing job listings
│   └── services/             # Core business logic
│       └── rankingEngine.ts          # ETV-RAVE multiplicative scorer
├── tsconfig.json             # TypeScript compiler settings
└── package.json              # Backend script & dependency manifest
```

---

## Frontend Subsystem (`frontend/`)

The frontend is built using Next.js 15 App Router, React 19, Tailwind CSS, and Clerk authentication.

```
frontend/
├── public/                   # Static browser-accessible assets
├── src/
│   ├── app/                  # App Router entrypoints
│   │   ├── layout.tsx                # Base page layout structure
│   │   ├── globals.css               # Global styling directives
│   │   ├── candidate/
│   │   │   └── page.tsx              # Candidate Workspace & Dashboard
│   │   └── recruiter/
│   │       └── page.tsx              # Recruiter Workspace & Dashboard
│   ├── components/           # Reusable UI component elements
│   │   └── ExportReportModal.tsx     # XLSX export settings modal
│   └── lib/                  # Sourcing helper libraries
│       └── exportHiringReport.ts     # Client-side ExcelJS generator
├── next.config.ts            # Next.js configurations
├── tailwind.config.ts        # Tailwind styling themes
├── tsconfig.json             # Frontend compiler options
└── package.json              # Frontend scripts and requirements
```

---

## Shared Module (`shared/`)

The `shared/` directory bridges the gap between frontend and backend models, ensuring type safety.

```
shared/
├── src/
│   └── index.ts              # In-app interfaces (DNA, RankResult, P-factors)
├── tsconfig.json             # Base tsconfig inherited by subsystems
└── package.json              # Shared package configuration
```

---

## Documentation System (`docs/`)

The startup-grade documentation follows a strict domain separation model:

```
docs/
├── getting-started/
│   ├── INSTALLATION.md       # Production setup
│   ├── QUICK_START.md        # 5-minute workspace setup
│   ├── LOCAL_SETUP.md        # Local environment configuration
│   └── DEPLOYMENT.md         # Railway + Vercel guides
├── architecture/
│   ├── SYSTEM_ARCHITECTURE.md# High-level flow & Auth
│   ├── DATABASE_SCHEMA.md    # Prisma models & relations
│   ├── DATA_PIPELINE.md      # Resume parsing pipeline
│   ├── AI_ENGINE.md          # Multi-layer intelligence model
│   ├── MATCHING_ENGINE.md    # Adjacent skill search logic
│   ├── SCORING_ENGINE.md     # Multiplicative P-factor guide
│   └── SECURITY.md           # JWT verification & CORS policies
├── product/
│   ├── PRODUCT_OVERVIEW.md   # Core vision and problems solved
│   ├── FEATURES.md           # Product feature breakdown
│   ├── RECRUITER_GUIDE.md    # Sourcing workflows
│   ├── CANDIDATE_GUIDE.md    # Profile building & challenge
│   ├── USER_JOURNEY.md       # Visual mermaid map flows
│   ├── FAQ.md                # 50-question developer/user FAQ
│   └── FUTURE_ROADMAP.md     # Future versions & ATS marketplace
└── development/
    ├── PROJECT_STRUCTURE.md  # [This File] Directory layout
    ├── TECH_STACK.md         # Technology decisions & versions
    ├── CODING_STANDARDS.md   # Rules for clean code
    ├── TESTING.md            # Sourcing quality assurance
    ├── CONTRIBUTING.md       # Guidelines for developers
    └── CHANGELOG.md          # Version history
```

---

## Build and Scripts

The root `package.json` coordinates tasks using `concurrently`:

```bash
# Start local development for both frontend and backend
npm run dev

# Compile both systems for production
npm run build

# Generate database client
npm run db:generate

# Execute database migrations
npm run db:migrate
```

---

## Related Documentation

- [Tech Stack](TECH_STACK.md) — System requirements and libraries
- [Coding Standards](CODING_STANDARDS.md) — Style guide
- [System Architecture](../architecture/SYSTEM_ARCHITECTURE.md) — How subsystems communicate
