# Changelog

> **Release history and migration updates for the HireMind Elite platform.**

---

## [2.0.0] — 2026-07-02

### Added
- **6-Factor Multiplicative Ranking Engine**: Core evaluation system calculating hire probability across 6 dimensions.
- **Candidate DNA Profiler**: Multi-dimensional capability maps rendered as interactive radar charts.
- **Hidden Gem Sourcing**: Detection of adjacent skill sets to bypass traditional ATS keyword limitations.
- **Honeypot Alert Badge**: Automated detection of keyword-stuffed resumes with safety penalty.
- **Clerk Session Security**: Role-based access control (RBAC) middleware verifying session tokens on all protected routes.
- **XLSX Report Export**: Custom ExcelJS script supporting customizable columns and recruiter notes download.
- **Second Chance Roadmaps**: Dynamic learning paths and milestones for near-miss candidate growth.
- **Authenticity Challenge System**: Knowledge verification quiz to confirm stated skills.

### Changed
- **Next.js 15 Migration**: Ported frontend to Next.js 15 App Router and React 19.
- **Tailwind CSS v4 Integration**: Upgraded CSS build system to Tailwind v4.
- **Prisma PostgreSQL Engine**: Consolidated relational schema with cascade deletion rules.

### Fixed
- Fixed divide-by-zero risk in technical fit score calculation when candidate has no skills.
- Resolved token verification issues with Clerk middleware during high-frequency requests.

---

## [1.5.0] — 2026-05-12

### Added
- Initial candidate dashboard layout with profile builder and resume upload panel.
- Initial recruiter dashboard with active job listings grid.
- Basic database seeding script containing mock candidates.

### Changed
- Refactored API routing structure: divided into `/api/candidates`, `/api/jobs`, `/api/applications`.

---

## [1.0.0] — 2026-03-01

### Added
- First public release of HireMind prototype.
- Core Express REST API.
- Basic candidate profile view.
- Static HTML export options.

---

## Versioning Policy

HireMind Elite adheres to **Semantic Versioning (SemVer)**:

```
MAJOR.MINOR.PATCH
```

- **MAJOR** version bumps imply incompatible API changes (e.g., breaking database schema changes).
- **MINOR** version bumps add functionality in a backward-compatible manner (e.g., new adjacent skill mappings).
- **PATCH** version bumps include backward-compatible bug fixes.

---

## Related Documentation

- [Future Roadmap](../product/FUTURE_ROADMAP.md) — Upcoming releases
- [Project Structure](PROJECT_STRUCTURE.md) — Monorepo layout
- [Tech Stack](TECH_STACK.md) — Dependency versions
