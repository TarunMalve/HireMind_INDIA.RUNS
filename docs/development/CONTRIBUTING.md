# Contributing Guide

> **Guidelines for contributing to HireMind Elite — repository workflows, pull request standards, and code review criteria.**

---

## Table of Contents

- [Introduction](#introduction)
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Review Checklist](#code-review-checklist)
- [Bug Reports & Feature Requests](#bug-reports--feature-requests)

---

## Introduction

Thank you for your interest in contributing to HireMind Elite! As a Staff Documentation Engineer and GitHub OSS Maintainer, we want to ensure the contribution process is clear, welcoming, and productive.

By contributing to this repository, you help make candidate evaluations fairer, more transparent, and more evidence-driven.

---

## Code of Conduct

We expect all contributors to adhere to our standard open-source values:
- Use welcoming and inclusive language.
- Respect differing viewpoints and experiences.
- Gracefully accept constructive criticism.
- Focus on what is best for the developer community.

---

## How Can I Contribute?

There are many ways to contribute:
1. **Fix Bugs**: Find open issues marked `bug` and submit a fix.
2. **Implement Features**: Check the [Future Roadmap](../product/FUTURE_ROADMAP.md) for planned features.
3. **Improve Documentation**: Edit Markdown guides, add explanations, or fix typos.
4. **Suggest Enhancements**: Open an issue detailing a new capability.

---

## Development Workflow

### Step 1 — Fork and Clone
1. Fork the repository on GitHub.
2. Clone your fork locally:

```bash
git clone https://github.com/your-username/HireMind_INDIA.RUNS.git
cd HireMind_INDIA.RUNS
```

### Step 2 — Branching
Create a descriptive feature branch from `main`:

```bash
# For features
git checkout -b feat/add-honeypot-alert

# For bug fixes
git checkout -b fix/scoring-precision
```

### Step 3 — Coding & Formatting
Follow the rules in our [Coding Standards](CODING_STANDARDS.md) guide:
- Write TypeScript types for all new variables.
- Keep components small and focused.
- Run `npm run lint` before committing.

### Step 4 — Local Verification
Verify your changes locally:
- Run `npm run dev` and test the UI manually.
- Trigger calculations and ensure no console errors occur.
- Run the db seed to make sure schema upgrades succeed.

---

## Pull Request Guidelines

When you are ready to submit your changes:

### Title Format
Use Conventional Commit prefixes in your PR title:
- `feat: add email notification triggers`
- `fix: resolve crash when candidate skills list is empty`
- `docs: update deployment instructions`

### PR Template

```markdown
## Description
Describe what this change accomplishes and the rationale behind your technical decisions.

## Related Issue
Fixes #123

## Verification Done
- [ ] Ran local dev build
- [ ] Checked DNA Radar rendering
- [ ] Ran unit tests
```

---

## Code Review Checklist

Maintainers review pull requests against these criteria:

### 1. Code Quality
- [ ] Strict type safety applied (no `any`).
- [ ] Logic is clear and easy to follow.
- [ ] No hardcoded passwords or API keys (environment variables used).

### 2. Styling
- [ ] Enforces Tailwind CSS classes. No inline styles.
- [ ] Renders correctly across mobile, tablet, and desktop screens.

### 3. Testing
- [ ] Manual test verification described in PR.
- [ ] Mock data is updated if new schemas are introduced.

---

## Bug Reports & Feature Requests

### Reporting a Bug
Before opening an issue, search the issue tracker to check if it has already been reported. If not, open a new issue containing:
- A clear, concise summary of the issue.
- Step-by-step instructions to reproduce the behavior.
- Expected vs. actual outcomes.
- Screen recordings or error logs.

### Suggesting a Feature
To suggest a feature, open a feature request issue containing:
- The problem this feature solves.
- A description of the proposed solution.
- Mockups or workflow designs (if UI is affected).

---

## Related Documentation

- [Local Setup Guide](../getting-started/LOCAL_SETUP.md) — Local environment installation
- [Coding Standards](CODING_STANDARDS.md) — Coding conventions
- [Tech Stack](TECH_STACK.md) — Project dependencies
- [License](../../LICENSE.md) — Open source license
