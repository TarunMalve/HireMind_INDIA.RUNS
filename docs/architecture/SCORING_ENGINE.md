# Scoring Engine

> **A complete conceptual guide to every score HireMind generates — what it means, why it matters, and how it protects recruiters from bad hiring decisions.**

---

## Table of Contents

- [Overview](#overview)
- [The Multiplicative Model](#the-multiplicative-model)
- [P(Qualified) — Technical Fit](#pqualified--technical-fit)
- [P(Available) — Availability](#pavailable--availability)
- [P(Engageable) — Engagement](#pengageable--engagement)
- [P(Legitimate) — Legitimacy](#plegitimate--legitimacy)
- [P(Growth) — Growth Trajectory](#pgrowth--growth-trajectory)
- [P(Scrappiness) — Scrappiness & Initiative](#pscrappiness--scrappiness--initiative)
- [Candidate DNA Scores](#candidate-dna-scores)
- [Hire Probability Score](#hire-probability-score)
- [Zero-Killer Rules](#zero-killer-rules)
- [Score Interpretation Guide](#score-interpretation-guide)
- [Worked Examples](#worked-examples)

---

## Overview

HireMind replaces the single-dimensional ATS "match score" with a rich, 6-dimensional evaluation framework. Each dimension represents a **real-world hiring risk**:

| Dimension | Key Question | Consequence If Low |
|---|---|---|
| P(Qualified) | Can they do the job? | Hire won't perform |
| P(Available) | Will they actually leave? | Recruiter time wasted |
| P(Engageable) | Will they respond? | Outreach ignored |
| P(Legitimate) | Are their claims real? | Bad hire, wasted onboarding |
| P(Growth) | Will they improve over time? | Plateaus quickly |
| P(Scrappiness) | Do they have initiative? | Low ownership |

---

## The Multiplicative Model

### Why Not a Weighted Average?

Traditional ATS tools use additive scoring:

```
Score = w₁ × Skill + w₂ × Experience + w₃ × Education
```

**The problem**: A candidate with 100% skill match but 0% availability still scores 80%+. The recruiter wastes time chasing someone who won't respond.

### HireMind's Solution: Multiplication

```
Hire Probability = P(Q) × P(A) × P(E) × P(L) × P(G) × P(S)
```

When **any** factor collapses, the final score collapses proportionally. This mirrors real-world hiring logic: a fraudulent candidate is unhireable regardless of their skills.

### Score Ranges

All P-factors are bounded:
- **Minimum**: 0.05 (safety floor — no dimension is zero unless honeypot)
- **Maximum**: 1.00
- **Exception**: P(Legitimate) minimum = 0.10 when honeypot is detected

---

## P(Qualified) — Technical Fit

**"Can this candidate technically perform the job?"**

### Input Signals

- Exact skill matches between candidate and job requirements
- Adjacent/equivalent technology matches
- Total years of experience vs. role seniority level

### How It Works

Technical fit is computed from two sub-scores:

**Sub-score 1: Skill Match**
- Exact match = 1.0 point per skill
- Adjacent match = 0.7 points per skill
- Missing skill = 0.0 points

```
skillMatchScore = ((exactMatches × 1.0) + (adjacentMatches × 0.7)) / totalJobSkills × 100
```

**Sub-score 2: Experience Fit**
- Years of experience vs. expected years for role seniority

| Title Level | Expected Years |
|---|---|
| Junior / Mid | 2 years |
| Senior | 5 years |
| Lead / Principal | 8 years |
| Director / VP | 10 years |

**Final P(Q)**:
```
P(Q) = max(0.05, min(1.0, (skillMatch × 0.7 + experienceFit × 0.3) / 100))
```

### What a High Score Means

A high P(Q) means the candidate has the technical background and experience level to succeed in the role from day one.

---

## P(Available) — Availability

**"Is this candidate realistically available to make a move right now?"**

### Input Signals

- Job change frequency from experience timeline
- Behavioral intent score (external activity signals)
- Experience fit (over-experienced candidates may not be available)

### Conceptual Model

Candidates who recently joined a new company have low availability. Candidates actively seeking or unemployed have high availability. P(Available) captures this dimension.

**Inputs**:
- `behavioralIntent` score (0–100)
- `experienceFit` score (0–100)

```
P(A) = max(0.05, min(1.0, 
  0.4 + (behavioralIntent / 100) × 0.4 + (experienceFit / 100) × 0.2
))
```

### What a Low Score Means

A low P(A) means the candidate is unlikely to be actively looking or available for a move, regardless of their technical qualifications.

---

## P(Engageable) — Engagement

**"If we reach out, will this candidate respond and engage?"**

### Input Signals

- Behavioral activity signals (portfolio updates, GitHub activity)
- Communication quality indicators
- Resume recency and update frequency

### Conceptual Model

An engaged candidate is one who is actively presenting themselves — updating portfolios, contributing to open source, or recently refreshing their profile.

```
P(E) = max(0.05, min(1.0,
  0.5 + (behavioralIntent / 100) × 0.3 + (communicationScore / 100) × 0.2
))
```

### What a High Score Means

The candidate is likely to respond to recruiter outreach promptly and engage meaningfully in the hiring process.

---

## P(Legitimate) — Legitimacy

**"Are this candidate's claims authentic and trustworthy?"**

### Input Signals

- Authenticity challenge completion and score
- Profile completeness and consistency
- LinkedIn and GitHub URL presence
- Honeypot detection result

### Conceptual Model

Legitimacy protects against two types of dishonesty:
1. **Keyword stuffing** — gaming ATS systems with copy-pasted keywords
2. **Inflated claims** — listing technologies the candidate has never used

The authenticity challenge generates role-specific questions to verify domain knowledge. Failed challenges drop credibility significantly.

**Baseline**: 70 (unchallenged profile)
**Adjustment**: +5 if LinkedIn and/or GitHub URLs present
**Override**: 10 (0.10) if honeypot detected

```
P(L) = honeypotDetected ? 0.10 : max(0.05, min(1.0, credibilityScore / 100))
```

### Zero-Killer

This is the most powerful zero-killer dimension. A honeypot candidate scores at or near 0% regardless of all other factors.

---

## P(Growth) — Growth Trajectory

**"Is this candidate growing, and will they continue to grow in this role?"**

### Input Signals

- Career progression velocity (role transitions and seniority jumps)
- Learning velocity score
- Hidden gem indicator (adjacent skill breadth)

### Conceptual Model

Growth trajectory measures how quickly a candidate has been advancing. A developer who went from Junior to Senior in 3 years with expanding responsibilities scores higher than one who spent 5 years in the same role.

```
P(G) = max(0.05, min(1.0,
  (careerTrajectory × 0.8 + hiddenGemScore × 0.2) / 100
))
```

### What a High Score Means

The candidate is a fast learner who has demonstrated consistent career advancement. They are likely to grow into expanded responsibilities quickly.

---

## P(Scrappiness) — Scrappiness & Initiative

**"Does this candidate show initiative and ownership beyond their job description?"**

### Input Signals

- Open-source contributions (GitHub activity)
- Portfolio of side projects
- Hackathon participation
- Certifications and self-directed learning
- Adjacent technology exploration

### Conceptual Model

Scrappiness differentiates candidates who merely fulfill their job description from those who go further — contributing to open-source, building side projects, earning certifications on their own time.

```
P(S) = max(0.05, min(1.0,
  (hiddenGemScore × 0.6 + careerTrajectory × 0.4) / 100
))
```

### What a High Score Means

The candidate is a self-driven, initiative-taking individual who will likely go beyond their job description to deliver value.

---

## Candidate DNA Scores

CandidateDNA is a separate 8-dimension capability profile distinct from the 6 P-factors:

| DNA Dimension | Description | Score Range |
|---|---|---|
| `technicalDepth` | Engineering sophistication | 0.0–1.0 |
| `problemSolving` | Analytical reasoning | 0.0–1.0 |
| `leadership` | Team influence and authority | 0.0–1.0 |
| `communication` | Clarity and articulation | 0.0–1.0 |
| `creativity` | Novel problem approaches | 0.0–1.0 |
| `adaptability` | Flexibility and context switching | 0.0–1.0 |
| `domainExpertise` | Depth in a domain | 0.0–1.0 |
| `growthTrajectory` | Career advancement velocity | 0.0–1.0 |

The `overallScore` is a weighted summary of all 8 dimensions. These scores are visualized as a **radar chart**.

---

## Hire Probability Score

The final hire probability is the product of all 6 P-factors, scaled to 0–100:

```
hireProbability = round(P(Q) × P(A) × P(E) × P(L) × P(G) × P(S) × 100)
```

### Score Interpretation

| Range | Label | Recruiter Action |
|---|---|---|
| 80–100% | 🟢 Strong Hire | Prioritize immediately |
| 60–79% | 🟡 Likely Hire | Interview and evaluate |
| 40–59% | 🟠 Possible Hire | Consider with caveats |
| 20–39% | 🔴 Weak Fit | Deprioritize |
| 0–19% | ⛔ Do Not Contact | Skip (likely honeypot or mismatch) |

---

## Zero-Killer Rules

The multiplicative model enables **zero-killer rules** — conditions that dramatically reduce the final score regardless of all other dimensions:

| Trigger | Affected Factor | Result |
|---|---|---|
| Honeypot detected | P(Legitimate) → 0.10 | Final score near 0% |
| Unverified challenge | P(Legitimate) reduced | Score drops significantly |
| No skills in profile | P(Qualified) → minimum | Score ≤ 20% |
| No experience data | P(Available) penalized | Score reduced |

---

## Score Interpretation Guide

### Reading a Candidate Card

```
Candidate: Ana Pinto
Hire Probability: 72%

P(Q) = 0.87   ██████████████████░░  Skills: React ✅, TypeScript ✅, Node.js adjacent
P(A) = 0.90   ████████████████████  Available: Actively seeking new role
P(E) = 0.82   ████████████████░░░░  Engaged: GitHub updated last week
P(L) = 0.95   ███████████████████░  Verified: Challenge completed
P(G) = 0.75   ███████████████░░░░░  Growth: Mid-level to Senior in 3 years
P(S) = 0.68   █████████████░░░░░░░  Scrappiness: 2 portfolio projects, 1 OSS contribution

Strengths:
- Strong knowledge in React, TypeScript
- Active candidate, likely to respond
- Passed authenticity verification

Risks:
- Lacks direct experience with PostgreSQL (has MongoDB)
```

---

## Worked Examples

### Example A — Highly Qualified but Unavailable

| Factor | Score | Reasoning |
|---|---|---|
| P(Q) | 0.95 | GCP Cloud Architect, all required skills matched |
| P(A) | 0.20 | Joined new firm 2 months ago |
| P(E) | 0.80 | Active on GitHub |
| P(L) | 1.00 | Verified, consistent profile |
| P(G) | 0.90 | Strong trajectory |
| P(S) | 0.85 | OSS contributor |

```
Hire Probability = 0.95 × 0.20 × 0.80 × 1.00 × 0.90 × 0.85 ≈ 11.6%
```

**Outcome**: Ranked low. Despite excellent qualifications, this candidate is not realistically available for a move. The recruiter is protected from wasting time.

---

### Example B — Medium Skills, High Intent

| Factor | Score | Reasoning |
|---|---|---|
| P(Q) | 0.75 | Transferable Vue.js skills for React role |
| P(A) | 0.95 | Actively seeking, recently unemployed |
| P(E) | 0.90 | Active portfolio, recent updates |
| P(L) | 1.00 | Passed verification challenge |
| P(G) | 0.85 | Consistent upward trajectory |
| P(S) | 0.90 | 3 portfolio projects, hackathon winner |

```
Hire Probability = 0.75 × 0.95 × 0.90 × 1.00 × 0.85 × 0.90 ≈ 49.0%
```

**Outcome**: Ranked much higher than Example A, despite lower technical qualifications. This candidate is motivated, available, and growing quickly.

---

### Example C — Honeypot Candidate

| Factor | Score | Reasoning |
|---|---|---|
| P(Q) | 0.98 | Perfect keyword match |
| P(A) | 0.80 | Stable employment history |
| P(E) | 0.75 | Normal activity |
| **P(L)** | **0.10** | **Honeypot detected: exact JD keywords, no extras** |
| P(G) | 0.70 | Average trajectory |
| P(S) | 0.60 | Limited initiative signals |

```
Hire Probability = 0.98 × 0.80 × 0.75 × 0.10 × 0.70 × 0.60 ≈ 2.5%
```

**Outcome**: Near-zero score despite seemingly strong qualifications. The system correctly identifies this as a gaming attempt.

---

## Related Documentation

- [AI Engine](AI_ENGINE.md) — How AI feeds scoring signals
- [Matching Engine](MATCHING_ENGINE.md) — Skill matching implementation
- [Data Pipeline](DATA_PIPELINE.md) — Full resume-to-score pipeline
- [API Reference](../api/API_REFERENCE.md) — `/api/ai/rank` endpoint
