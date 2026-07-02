# Coding Standards

> **Guidelines for code formatting, architecture, type-safety, and design patterns in the HireMind Elite repository.**

---

## Table of Contents

- [Core Principles](#core-principles)
- [TypeScript Guidelines](#typescript-guidelines)
- [Backend Development Standards](#backend-development-standards)
- [Frontend Development Standards](#frontend-development-standards)
- [Database & Prisma Patterns](#database--prisma-patterns)
- [Error Handling](#error-handling)
- [Git Commit Style](#git-commit-style)

---

## Core Principles

Every contribution to HireMind Elite must adhere to three core code principles:

1. **Strict Type Safety** — Avoid `any` whenever possible. Use TypeScript to prevent runtime errors.
2. **Defensive Programming** — Validate all inputs, gracefully handle timeouts, and log unexpected failures.
3. **Decoupled Architecture** — Keep API controllers thin, move business logic to services, and ensure UI pages are pure renderers.

---

## TypeScript Guidelines

### Strict Typing
Do not bypass type check rules. 
- Set `"strict": true` in `tsconfig.json`.
- Avoid explicit `any` types. If a type is unknown, use `unknown` and apply a type guard.
- Type assertions (`as Type`) should be minimized in favor of proper interfaces.

### Shared Interface Usage
Any structure sent across the network must reside in the shared module (`shared/src/index.ts`):

```typescript
// Correct: Import from shared
import { RankResult, CandidateDNA } from '@hiremind/shared';
```

---

## Backend Development Standards

The backend uses a standard controller-service pattern.

### 1. Controllers
Controllers handle HTTP parsing, role validation, and response formatting. They do not execute business logic.

```typescript
// Correct Controller Pattern
export const handleRankCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { candidateId, jobId } = req.body;
    if (!candidateId || !jobId) {
      throw new AppError('Candidate ID and Job ID are required', 400);
    }
    
    const result = await rankCandidateService(candidateId, jobId);
    return res.status(200).json(result);
  } catch (error) {
    next(error); // Delegate to error handler
  }
};
```

### 2. Services
Services implement the calculations, database operations, and external API requests. They are framework-independent.

### 3. Middleware
Use middleware for cross-cutting concerns (authentication, rate-limiting, validations).

---

## Frontend Development Standards

The frontend utilizes React 19 and Next.js 15 App Router conventions.

### 1. File Structure
- Keep routing files (`page.tsx`, `layout.tsx`) focused on page structure.
- Extract complex UI components to `src/components/`.
- Put reusable business hooks and API request functions in `src/lib/`.

### 2. Component Design
- Design components with responsiveness in mind (mobile-first breakpoints).
- Use **Tailwind CSS v4** utility classes. Avoid inline style blocks unless calculating dynamic positioning values (e.g., 3D graphics coordinates).
- Enforce clean styling variables. Prefer Tailwind classes over ad-hoc raw colors.

### 3. State Management
- Use **Zustand** for global interactive UI state (modal visibility, active workspace).
- Keep local state (toggles, input values) in React's `useState` hooks.

---

## Database & Prisma Patterns

### 1. Transaction Safety
When executing multiple operations that must succeed together, use Prisma transactions:

```typescript
await prisma.$transaction(async (tx) => {
  await tx.candidate.update({ ... });
  await tx.application.create({ ... });
});
```

### 2. Migration Hygiene
- Never modify the database schema directly in PostgreSQL. Always use `prisma migrate`.
- Keep migration names concise: `npx prisma migrate dev --name add_linkedin_field`.
- Ensure cascade deletes are explicitly defined in `schema.prisma` for dependent records.

---

## Error Handling

### Backend
All errors should be caught and routed to the central handler using `AppError` class:

```typescript
// AppError definition
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

Unexpected errors are automatically logged by `errorHandler.ts` and masked in production to avoid security leaks.

### Frontend
- Implement boundary components (`ErrorBoundary`) around high-risk views (like 3D graphics engines).
- Use user-friendly alert toasts or cards rather than blank screen errors.

---

## Git Commit Style

We follow the Conventional Commits specification:

| Format | Description | Example |
|---|---|---|
| `feat:` | A new feature | `feat: add honeypot alert badge to candidate card` |
| `fix:` | A bug fix | `fix: resolve divide-by-zero risk in technical fit calculation` |
| `docs:` | Documentation changes only | `docs: add coding standards guide` |
| `style:` | Code style tweaks (no logic changes) | `style: format imports and remove trailing whitespace` |
| `refactor:` | Refactoring existing code | `refactor: extract normalization to helper module` |
| `test:` | Adding or improving tests | `test: add unit tests for skill adjacency` |

---

## Related Documentation

- [Project Structure](PROJECT_STRUCTURE.md) — File layout
- [Tech Stack](TECH_STACK.md) — System requirements
- [Security](../architecture/SECURITY.md) — Safe programming practices
