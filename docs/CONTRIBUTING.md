# Contributing Guidelines — HireMind Elite

Welcome to the HireMind Elite developer community! We appreciate your contributions. Please follow this guide to maintain clean, production-level code.

---

## 1. Branch Strategy

We use a Gitflow-inspired branching model:
-  `main`: Production releases only.
-  `develop`: Default development branch; target for integration feature branches.
-  `feature/<feature-name>`: Isolation branch for new capabilities.
-  `bugfix/<bug-name>`: Patch branches for resolving pipeline errors.

---

## 2. Commit Message Convention

Follow standard Conventional Commits rules:
-  `feat: <desc>`: A new capability (e.g. `feat: Add candidate verification quiz`).
-  `fix: <desc>`: Resolving an error (e.g. `fix: Repair chart load on light theme`).
-  `docs: <desc>`: Editing readme or markdown files.
-  `style: <desc>`: Whitespace changes, CSS formatting.

---

## 3. Pull Request Guidelines

-  Ensure all tests build successfully (`npm run build`).
-  Keep pull requests focused on a single feature.
-  Link related issue tickets in the description (e.g. `Resolves #34`).
-  Request reviews from at least one core maintainer before merging.