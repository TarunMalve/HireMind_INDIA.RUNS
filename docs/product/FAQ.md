# Frequently Asked Questions

> **40+ questions answered across product, technical, AI, security, and career categories.**

---

## Table of Contents

- [General](#general)
- [For Recruiters](#for-recruiters)
- [For Candidates](#for-candidates)
- [AI & Scoring](#ai--scoring)
- [Technical & Developer](#technical--developer)
- [Security & Privacy](#security--privacy)
- [Deployment & Setup](#deployment--setup)
- [Future & Roadmap](#future--roadmap)

---

## General

**Q1: What is HireMind Elite?**

HireMind Elite is an AI-powered talent intelligence platform that replaces keyword-matching resume scores with a 6-factor **Hire Probability Engine**. It evaluates candidates across technical qualification, availability, engagement, legitimacy, growth trajectory, and initiative — and returns a transparent, explainable probability score.

---

**Q2: Who is HireMind for?**

HireMind serves two primary user types:
- **Recruiters & Talent Managers** who need to source, evaluate, and shortlist candidates efficiently
- **Candidates & Job Seekers** who want fair, intelligent evaluation and career guidance

---

**Q3: How is HireMind different from LinkedIn Recruiter or traditional ATS?**

Traditional ATS tools match resumes by keyword overlap. HireMind uses a **multiplicative 6-dimensional model** that:
- Recognizes adjacent/equivalent technologies (Vue ≈ React, GCP ≈ AWS)
- Penalizes unavailable candidates regardless of skill match
- Detects and flags keyword-stuffed "honeypot" resumes
- Surfaces hidden gems with unconventional but equivalent backgrounds
- Provides explainable AI reasoning for every score

---

**Q4: Is HireMind free?**

The current version (hackathon release) is open source and free to self-host. Future SaaS tiers are planned for the roadmap.

---

**Q5: What technology is HireMind built on?**

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Clerk
- **AI**: Gemini 1.5 / OpenAI GPT-4o (integration planned)
- **Deployment**: Vercel (frontend) + Railway/Render (backend)

---

## For Recruiters

**Q6: How does candidate ranking work?**

When a candidate applies to a job, the ranking engine calculates 6 probability scores (P-factors) and multiplies them together. This produces a Hire Probability from 0–100%. Candidates are then sorted by this score.

---

**Q7: What is a "Hidden Gem" candidate?**

A Hidden Gem is a candidate who doesn't exactly match the required keywords but has equivalent competencies in adjacent technologies and a strong growth trajectory. For example: a Vue.js expert applying for a React role would be flagged as a hidden gem rather than filtered out.

---

**Q8: What is a "Honeypot" candidate?**

A Honeypot candidate has a resume that exactly mirrors the job description's required skills — with no other skills listed. This pattern indicates keyword stuffing (copying skills from the JD into the resume). HireMind detects this and collapses the legitimacy score to near-zero.

---

**Q9: Can I invite candidates who haven't applied yet?**

Yes. From the job's candidate list, click **Invite Candidate** and enter their email. They receive an invitation to register and apply.

---

**Q10: How do I export candidate rankings?**

Click the **Export** button from any job's ranking view. A formatted XLSX file downloads with all candidate scores, AI explanations, and flags.

---

**Q11: What does "Second Chance" mean for a candidate?**

When you move a strong-but-not-quite-ready candidate to Second Chance instead of Rejected, HireMind:
1. Generates a personalized learning roadmap for them
2. Notifies them with constructive feedback
3. Tracks their progress over time
4. Automatically resurfaces them when new relevant roles open

---

**Q12: Can I use HireMind for multiple open roles simultaneously?**

Yes. Each job posting has its own candidate rankings, DNA views, and export. You can manage any number of concurrent active jobs.

---

**Q13: How fresh are candidate profiles?**

Profiles are as fresh as candidates keep them. The system uses profile recency as one signal in the P(Engageable) score — candidates with recently updated profiles score higher.

---

**Q14: Can I share rankings with my hiring manager?**

Yes. Export the XLSX report and share it. The report includes all score dimensions, AI summaries, and flags in a recruiter-friendly format.

---

**Q15: Does HireMind integrate with my existing ATS?**

Not yet. ATS marketplace integration is planned for Version 2 / Enterprise tier.

---

## For Candidates

**Q16: How is my profile scored?**

Your profile generates a **Hire Probability Score** for each job you apply to, based on:
- P(Qualified): Your skill and experience match
- P(Available): Signals that you're realistically looking
- P(Engageable): Activity and responsiveness signals
- P(Legitimate): Profile completeness and verification
- P(Growth): Career trajectory speed
- P(Scrappiness): Initiative and side projects

---

**Q17: Do I need to use exactly the same keywords as job descriptions?**

No. HireMind's skill adjacency system recognizes equivalent technologies. If a job requires React and you know Vue.js, you'll receive credit as an adjacent match — not zero.

---

**Q18: What is the Authenticity Challenge?**

The Authenticity Challenge is a set of 3 open-ended questions that verify your domain knowledge. Completing it boosts your P(Legitimate) score and gives you a ✅ VERIFIED badge visible to recruiters.

---

**Q19: Will my resume be shared publicly?**

No. Your resume and profile data are only shared with recruiters of jobs you've actively applied to.

---

**Q20: What is Career DNA?**

Career DNA is your 8-dimension competency profile, rendered as a radar chart. It shows your relative strengths across technical depth, problem solving, leadership, communication, creativity, adaptability, domain expertise, and growth trajectory.

---

**Q21: How do I improve my scores?**

- Complete your profile fully (all fields)
- Add LinkedIn and GitHub URLs (+5 credibility)
- Complete the Authenticity Challenge
- Add portfolio project links
- Keep your profile updated regularly
- List skills accurately (adjacent skills give partial credit)

---

**Q22: What happens if I'm rejected?**

If a recruiter moves you to "Second Chance" (instead of standard rejection), you receive:
- A personalized learning roadmap
- Specific milestones to reach the target role
- Automatic re-consideration when a matching role opens

---

**Q23: Can I see my own ranking for a job I applied to?**

Yes. From **My Applications**, you can see your match score for each job you've applied to.

---

**Q24: What do future role predictions mean?**

Based on your current growth trajectory and skill set, HireMind predicts which roles you'll be ready for in 12–24 months. These are probabilistic projections to guide your career development.

---

**Q25: Is my data ever used to train AI models?**

In the current version, no. All scoring is done via deterministic algorithms and external API calls. No user data is used for model training.

---

## AI & Scoring

**Q26: What AI models power HireMind?**

The core ranking engine is a deterministic TypeScript algorithm that requires no AI. LLM integrations (Gemini 1.5 / OpenAI GPT-4o) are planned for resume parsing, intent analysis, and natural language briefs.

---

**Q27: Why does HireMind use multiplication instead of averaging scores?**

Multiplication creates a **zero-killer rule** that mirrors real-world hiring logic. A candidate who is technically perfect but unavailable (P(A) = 0.05) produces a near-zero final score — because hiring them would waste everyone's time. Addition would still give them a high score.

---

**Q28: Can the AI get the score wrong?**

Yes, the current heuristic model has limitations. Scores are directional indicators, not absolute truths. Recruiters should use scores to prioritize — not to automatically accept or reject.

---

**Q29: How does the honeypot detector work?**

It checks two conditions:
1. Does the candidate's skill list exactly mirror the job's required skills with no additional skills?
2. Does the candidate's summary contain verbatim text from the job description?

If either condition is true, P(Legitimate) drops to 0.10.

---

**Q30: What is semantic matching vs. keyword matching?**

- **Keyword matching**: Requires exact string matches ("React" == "React")
- **Semantic matching** (planned): Understands meaning — "experience with cloud infrastructure" matches "deployed on GCP with Terraform" even without shared words

---

**Q31: How is the Hidden Gem score calculated?**

```
gemScore = 50 (base)
  + 25 (if adjacentCount >= 2)
  + 25 (if potentialScore >= 90)

isHiddenGem = (gemScore >= 85)
```

---

**Q32: Are scores biased toward specific universities or companies?**

No. HireMind does not factor in educational institution prestige or previous employer brand. Scores are based on skills, experience duration, trajectory, and verification — not pedigree.

---

**Q33: How accurate are career trajectory predictions?**

Current predictions are based on role title progression patterns and duration parsing. Future versions will incorporate outcome-based calibration as hiring data accumulates.

---

**Q34: What is the Candidate DNA overall score?**

The overall DNA score is a weighted average of the 8 DNA dimensions. It is a separate number from the Hire Probability — it measures overall capability, not job-specific fit.

---

## Technical & Developer

**Q35: Is the ranking engine open source?**

Yes. The core `rankingEngine.ts` is publicly available in the repository at `backend/src/services/rankingEngine.ts`. It is fully TypeScript, dependency-free, and documented.

---

**Q36: Can I integrate HireMind's ranking API into my own system?**

Yes. The `/api/ai/rank` endpoint accepts any candidate and job object and returns a full RankResult. See the [API Reference](../api/API_REFERENCE.md) for full documentation.

---

**Q37: What database does HireMind use?**

PostgreSQL, managed via Prisma ORM. The complete schema is documented in [DATABASE_SCHEMA.md](../architecture/DATABASE_SCHEMA.md).

---

**Q38: Does HireMind support multi-tenancy?**

Not in the current version. Multi-tenant row-level security is planned for the Enterprise tier.

---

**Q39: How do I run HireMind locally?**

See the [Installation Guide](../getting-started/INSTALLATION.md) and [Quick Start](../getting-started/QUICK_START.md) for full instructions.

---

**Q40: What are the API rate limits?**

AI endpoints (`/api/ai/*`) are rate-limited more strictly than standard endpoints. See [SECURITY.md](../architecture/SECURITY.md) for recommended configurations.

---

## Security & Privacy

**Q41: How are authentication tokens handled?**

All authentication is managed by Clerk. JWTs are verified on every API request using Clerk's JWKS endpoint. No tokens are stored in the database.

---

**Q42: Is resume data encrypted?**

Resume text is stored in PostgreSQL. In production, the database connection uses SSL. Database-at-rest encryption depends on the hosting provider (Railway, Supabase, etc. all support it).

---

**Q43: Can I delete my account and all my data?**

Yes. Deleting your User record triggers cascade deletes for all associated Candidate data, applications, DNA records, and notifications via Prisma's `onDelete: Cascade` rules.

---

**Q44: Is HireMind GDPR compliant?**

The current version implements the technical foundations for GDPR (cascade deletes, data minimization, server-side processing). A full GDPR compliance layer (data export, consent management) is planned for v2.0.

---

## Deployment & Setup

**Q45: What's the fastest way to deploy HireMind?**

Frontend on Vercel (zero config for Next.js), backend on Railway with their PostgreSQL add-on. Total setup: ~20 minutes. See [DEPLOYMENT.md](../getting-started/DEPLOYMENT.md).

---

**Q46: Do I need Pinecone to run HireMind?**

No. Pinecone is optional. The current version uses PostgreSQL for all data storage. Pinecone will be used for high-scale vector similarity search in future versions.

---

**Q47: Can I use MySQL or MongoDB instead of PostgreSQL?**

Not without modifying the Prisma schema. The schema uses PostgreSQL-specific features like `Float[]` arrays and `@db.Text`. MongoDB support is not planned.

---

## Future & Roadmap

**Q48: What's coming in Version 1.0?**

- Full LLM integration for resume parsing and intent analysis
- Real-time GitHub and LinkedIn signal scraping
- Production Pinecone vector search
- GDPR consent management
- ATS marketplace integrations

---

**Q49: Will there be a mobile app?**

A React Native mobile companion app is on the long-term roadmap (Version 3+).

---

**Q50: Is enterprise licensing available?**

Not yet. Enterprise tier with SSO, multi-tenancy, and SLA support is planned after MVP launch. Contact the team for early access.

---

## Related Documentation

- [Product Overview](PRODUCT_OVERVIEW.md) — Mission and features
- [Recruiter Guide](RECRUITER_GUIDE.md) — Recruiter workflows
- [Candidate Guide](CANDIDATE_GUIDE.md) — Candidate workflows
- [Future Roadmap](FUTURE_ROADMAP.md) — Full roadmap
- [API Reference](../api/API_REFERENCE.md) — Technical API docs
