# Recruiter Guide

> **A complete step-by-step guide for talent managers and recruiters using HireMind Elite to source, evaluate, and hire the best candidates.**

---

## Table of Contents

- [Getting Started](#getting-started)
- [Login & Dashboard](#login--dashboard)
- [Creating a Job](#creating-a-job)
- [Importing Candidates](#importing-candidates)
- [Generating Rankings](#generating-rankings)
- [Reviewing Hidden Gems](#reviewing-hidden-gems)
- [Viewing Candidate DNA](#viewing-candidate-dna)
- [Comparing Candidates](#comparing-candidates)
- [Export XLSX Report](#export-xlsx-report)
- [Inviting Candidates](#inviting-candidates)
- [Managing Applications](#managing-applications)
- [Understanding Score Alerts](#understanding-score-alerts)
- [Best Practices](#best-practices)

---

## Getting Started

### What You Need

- A HireMind account with **Recruiter** role
- At least one job description ready to post
- Candidates who have applied or been invited

### First-Time Setup

1. Navigate to the HireMind platform URL
2. Click **Sign Up** or **Get Started**
3. Complete authentication via Clerk (email, Google, or GitHub)
4. When prompted for role, select **Recruiter**
5. Enter your **Company Name** and **Department**
6. You'll be taken directly to the **Recruiter Dashboard**

---

## Login & Dashboard

### Logging In

1. Go to the platform URL
2. Click **Sign In**
3. Complete Clerk authentication
4. You'll land on the **Recruiter Dashboard**

### Dashboard Overview

The Recruiter Dashboard is your central workspace:

```
┌─────────────────────────────────────────────────────────┐
│  HireMind Elite  │  Jobs (3) │  Candidates │  Export    │
├─────────────────────────────────────────────────────────┤
│  📊 Pipeline Health     │  🏆 Top Candidates            │
│  Active: 3 jobs         │  [Ranked candidate cards]     │
│  Applied: 47            │                               │
│  Screening: 12          │  💎 Hidden Gems (3)           │
│  Interview: 5           │                               │
├─────────────────────────────────────────────────────────┤
│  💬 AI Copilot Drawer (→)                               │
└─────────────────────────────────────────────────────────┘
```

---

## Creating a Job

### Step 1 — Open Job Creation

From the Dashboard, click **+ New Job** or **Post a Job**.

### Step 2 — Fill In Job Details

| Field | Required | Tips |
|---|---|---|
| **Job Title** | ✅ | Be specific: "Senior React Engineer" not just "Engineer" |
| **Company** | ✅ | Auto-filled from your recruiter profile |
| **Location** | ✅ | City or "Remote" |
| **Location Type** | ✅ | Remote / Hybrid / Onsite |
| **Description** | ✅ | Paste full JD — the AI parses it for requirements |
| **Required Skills** | ✅ | Comma-separated: `React, TypeScript, Node.js` |
| **Nice to Have** | ⚠️ | Optional: `GraphQL, Docker` |
| **Salary Range** | ⚠️ | Optional but improves candidate matching |

### Step 3 — Review & Publish

Click **Post Job**. The job status is set to `ACTIVE` by default.

### Managing Job Status

| Status | Description |
|---|---|
| `DRAFT` | Not yet visible to candidates |
| `ACTIVE` | Accepting applications |
| `PAUSED` | Temporarily not accepting applications |
| `CLOSED` | Position filled or cancelled |

---

## Importing Candidates

### From the Application Pool

Candidates who have applied appear automatically in the **Candidates** tab of each job.

### Via Direct Invitation

1. From the job's candidate list, click **Invite Candidate**
2. Enter their email address
3. They receive an invitation to create a profile and apply

### Bulk Import (Future Feature)

Version 1.5 will support CSV upload of candidate emails for bulk invitation.

---

## Generating Rankings

Rankings are generated **automatically** when candidates apply to a job.

### Manual Ranking Trigger

To re-rank all candidates for a job:
1. Open the job's candidate list
2. Click **Refresh Rankings** (re-runs the 6-factor engine for all applicants)

### Understanding the Ranking View

Each candidate card shows:

```
┌───────────────────────────────────────────┐
│  Rank: #1  |  Ana Pinto                   │
│  Hire Probability: 78%  🟢                │
│                                           │
│  P(Q): 87%  P(A): 90%  P(E): 82%         │
│  P(L): 95%  P(G): 75%  P(S): 68%         │
│                                           │
│  ✅ Strengths:                             │
│  • Strong knowledge in React, TypeScript  │
│  • Active candidate, likely to respond    │
│                                           │
│  ⚠️ Risks: None                           │
│                                           │
│  [View DNA]  [View Profile]  [Move Stage] │
└───────────────────────────────────────────┘
```

### Sorting & Filtering

- **Sort by**: Hire Probability, P(Qualified), P(Growth)
- **Filter by**: Hidden Gems only, Honeypot alerts, Status
- **Search**: Filter by name or skill

---

## Reviewing Hidden Gems

Hidden Gems are candidates with **adjacent technology skills** who would be filtered out by keyword-only ATS.

### Accessing Hidden Gems

1. On the job's ranking view, click the **💎 Hidden Gems** tab
2. All candidates flagged as hidden gems appear here

### Reading a Hidden Gem Card

```
💎 HIDDEN GEM DETECTED

Ana has Vue.js (equivalent to React) and outstanding career 
progression velocity. While missing exact React keyword match, 
her competency profile suggests rapid onboarding capability.

Adjacent Skills: Vue.js → React, GCP → AWS
Career Trajectory: 92/100 (Top 10%)
```

### Best Practice

> Always review Hidden Gems before finalizing your shortlist. In competitive markets, these candidates have higher availability and motivation than keyword-perfect candidates who are receiving multiple offers.

---

## Viewing Candidate DNA

The Candidate DNA Profiler provides a multi-dimensional view of each candidate's capabilities.

### Opening the DNA Panel

Click **View DNA** on any candidate card.

### DNA Radar Chart

The radar chart shows 8 dimensions:

```
              Technical Depth (0.87)
                    ◆
         Growth ──────── Problem Solving
          (0.85)   ╲  ╱   (0.82)
                    ╲╱
    Domain  ──────── Communication
    (0.69)           (0.71)
                    ╱╲
         Creativity ── Leadership
          (0.74)        (0.65)
                    ◆
              Adaptability (0.88)
```

### AI Recruiter Brief

Below the chart, an AI-generated brief summarizes:
- Top 3 strengths with evidence
- Top 3 growth areas
- Cultural fit indicators
- Recommended interview focus areas

---

## Comparing Candidates

### Side-by-Side Comparison

1. Select two candidates using the comparison checkbox
2. Click **Compare Selected**
3. View a side-by-side DNA radar overlay

### What to Look For

| Scenario | Recommendation |
|---|---|
| Two similar DNA profiles | Choose the one with higher P(Growth) for long-term value |
| Strong tech, low intent | Deprioritize — they may not move |
| Medium tech, high P(L) | Verified candidate — reliable |
| Hidden gem vs. exact match | Interview both — hidden gems often outperform |

---

## Export XLSX Report

### Generating the Report

1. From the job's ranking view, click **Export**
2. The **Export Modal** opens
3. Select which columns to include
4. Click **Download XLSX**

### Default Columns

| Column | Source |
|---|---|
| Rank | Final ranking position |
| Candidate Name | Full name |
| Email | Contact email |
| Hire Probability | Final score (%) |
| P(Qualified) | Technical + experience fit |
| P(Available) | Availability signal |
| P(Engageable) | Activity level |
| P(Legitimate) | Credibility score |
| P(Growth) | Career trajectory |
| P(Scrappiness) | Initiative score |
| Hidden Gem | Yes / No |
| Honeypot Risk | Yes / No |
| AI Summary | Recruiter brief text |

### Sharing Reports

Download the XLSX and share with:
- Hiring managers for final decision review
- HR leadership for approval
- Interview panels for preparation

---

## Inviting Candidates

### Individual Invitation

1. From the job's candidate list, click **Invite Candidate**
2. Enter their email address
3. They receive a Clerk-powered invitation link
4. Once they register and apply, they appear in rankings

### Via LinkedIn (Future Feature)

Version 2.0 will include LinkedIn profile import to directly add candidates to a job's pool.

---

## Managing Applications

### Application Pipeline Stages

Move candidates through the hiring pipeline:

```
APPLIED → SCREENING → INTERVIEW → OFFER → HIRED
                                        ↓
                                     REJECTED
                                        ↓
                                 SECOND_CHANCE
```

### Moving a Candidate

1. Click **Move Stage** on a candidate card
2. Select the next pipeline stage
3. The candidate receives an automatic notification

### The Second Chance Stage

When moving a strong candidate to `REJECTED`:
- Click **Move to Second Chance** instead
- HireMind generates a personalized learning roadmap for them
- They're tracked and automatically re-surfaced for future roles

---

## Understanding Score Alerts

### 🟢 Strong Hire (80–100%)
Prioritize immediately. High fit, available, and verified.

### 🟡 Likely Hire (60–79%)
Good candidate. Interview and evaluate further. May have one weak dimension worth probing.

### 🟠 Possible Hire (40–59%)
Worth considering with caveats. Check which dimension is low and assess risk.

### 🔴 Weak Fit (20–39%)
Likely mismatch. Only proceed if you have unique context about this candidate.

### ⛔ Do Not Contact (0–19%)
Strong likelihood of mismatch, unavailability, or honeypot profile. Skip.

### 🚨 CRITICAL — Honeypot Alert
Resume appears to have been keyword-stuffed. Do not contact without further verification.

---

## Best Practices

> **Tip**: Always look at Hidden Gems before finalizing a shortlist. In a competitive talent market, they often have more availability and motivation.

> **Tip**: P(Available) is your most important filter for time-sensitive roles. A perfect resume with low P(A) means the candidate likely won't move.

> **Tip**: If a candidate has low P(Legitimate), check whether they've completed an Authenticity Challenge. If not, send them one before making a decision.

> **Tip**: Export your rankings after every review cycle. XLSX reports are your audit trail and decision documentation.

> **Tip**: Use "Second Chance" generously. Candidates who are 70% ready now and receiving a roadmap will be 100% ready in 3–6 months — and they'll remember that you invested in their growth.

---

## Related Documentation

- [Candidate Guide](CANDIDATE_GUIDE.md) — See the candidate perspective
- [Scoring Engine](../architecture/SCORING_ENGINE.md) — Understand P-factor mathematics
- [AI Engine](../architecture/AI_ENGINE.md) — How rankings are generated
- [API Reference](../api/API_REFERENCE.md) — Programmatic access to rankings
- [User Journey](USER_JOURNEY.md) — Visual recruiter journey map
