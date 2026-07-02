# Features Reference

> **Every feature in HireMind Elite, explained by purpose, the problem it solves, and the value it delivers.**

---

## Table of Contents

- [Hire Probability Engine](#hire-probability-engine)
- [Candidate DNA Profiler](#candidate-dna-profiler)
- [AI Recruiter Copilot](#ai-recruiter-copilot)
- [Hidden Gem Detection](#hidden-gem-detection)
- [Honeypot & Legitimacy Check](#honeypot--legitimacy-check)
- [Authenticity Challenge System](#authenticity-challenge-system)
- [Skill Adjacency Matching](#skill-adjacency-matching)
- [Second Chance AI](#second-chance-ai)
- [Talent Twin Discovery](#talent-twin-discovery)
- [Future Role Matching](#future-role-matching)
- [Learning Roadmap Generator](#learning-roadmap-generator)
- [Candidate Intent Analysis](#candidate-intent-analysis)
- [Recruiter Dashboard](#recruiter-dashboard)
- [Candidate Dashboard](#candidate-dashboard)
- [Export XLSX Reports](#export-xlsx-reports)
- [Notification System](#notification-system)
- [Job Management](#job-management)
- [Application Pipeline Tracking](#application-pipeline-tracking)

---

## Hire Probability Engine

### Purpose
Calculate a comprehensive, honest probability that a given candidate will succeed in a specific role — and that both parties will follow through on the hiring process.

### Problem Solved
Traditional ATS keyword scores are gamed by candidates and ignore real-world hiring friction (availability, intent, legitimacy).

### User Benefit
Recruiters get a single, trustworthy number that reflects real hire probability — not resume keyword density.

### How It Works
Six independent P-factors are computed and **multiplied** together:

```
P(Hire) = P(Qualified) × P(Available) × P(Engageable) × P(Legitimate) × P(Growth) × P(Scrappiness)
```

### Screens
- Candidate ranking cards on Recruiter Dashboard
- Hire probability breakdown panel per candidate
- Export XLSX with all P-factor columns

### Future Improvements
- Real-time availability signals from LinkedIn API
- GitHub commit frequency as scrappiness signal
- Calibration against historical hiring outcomes

### Related Features
- [Candidate DNA Profiler](#candidate-dna-profiler)
- [Honeypot & Legitimacy Check](#honeypot--legitimacy-check)
- [Skill Adjacency Matching](#skill-adjacency-matching)

---

## Candidate DNA Profiler

### Purpose
Generate a multi-dimensional competency fingerprint for every candidate, visualized as an interactive radar chart.

### Problem Solved
Job titles and years of experience are poor proxies for actual capability. "3 years of React" doesn't tell a recruiter whether the candidate can architect systems, mentor others, or communicate requirements clearly.

### User Benefit
Recruiters see the *shape* of a candidate's capabilities at a glance. Candidates understand their own strengths and growth areas.

### Dimensions

| Dimension | Measures |
|---|---|
| Technical Depth | Engineering sophistication |
| Problem Solving | Analytical reasoning |
| Leadership | Team influence |
| Communication | Clarity and articulation |
| Creativity | Novel approaches |
| Adaptability | Context switching |
| Domain Expertise | Industry/tech specialization |
| Growth Trajectory | Career advancement velocity |

### Screens
- Radar chart on Recruiter Dashboard (candidate cards)
- Full DNA panel on Candidate Dashboard
- DNA comparison view (side-by-side)

### Future Improvements
- LLM-generated narrative DNA brief
- Domain-specific DNA profiles (e.g., Frontend DNA vs. Data Engineering DNA)
- Historical DNA evolution tracking

### Related Features
- [Hire Probability Engine](#hire-probability-engine)
- [Candidate Intent Analysis](#candidate-intent-analysis)

---

## AI Recruiter Copilot

### Purpose
A context-aware AI assistant inside the recruiter dashboard that summarizes candidate DNA, identifies hidden talent, and answers sourcing queries.

### Problem Solved
Recruiters spend hours reading resumes. A copilot surfaces the key insights instantly.

### User Benefit
"Brief me on the top 5 candidates for this React role" returns a plain-language summary in seconds.

### Capabilities
- Candidate DNA summaries
- Hidden gem identification
- Comparative analysis ("Ana vs. Rajan for this role?")
- Role-based sourcing recommendations

### Screens
- Slide-out copilot drawer on Recruiter Dashboard

### Future Improvements
- Real-time conversation with memory across sessions
- Integration with calendar for interview scheduling
- Proactive alerts when new matching candidates apply

### Related Features
- [Candidate DNA Profiler](#candidate-dna-profiler)
- [Hidden Gem Detection](#hidden-gem-detection)

---

## Hidden Gem Detection

### Purpose
Surface high-capability candidates who would be filtered out by traditional keyword-matching ATS due to non-matching skill terminology.

### Problem Solved
A Vue.js expert applying for a React role is rejected by ATS. HireMind recognizes their equivalent competency.

### User Benefit
Recruiters discover excellent candidates they would otherwise never see. Talent pool expands without additional sourcing cost.

### Detection Logic
A candidate is flagged as a Hidden Gem when:
1. They lack 2+ exact skill matches
2. But have 2+ adjacent/equivalent technology matches
3. AND their career trajectory score is ≥ 90

### Screens
- 💎 Hidden Gem badge on candidate cards
- Dedicated "Hidden Gems" filter tab on Rankings view
- AI explanation: *"Ana has Vue.js (equivalent to React) and strong growth velocity"*

### Future Improvements
- Cross-domain hidden gem detection (e.g., data scientist → ML engineer)
- Historical hidden gem hire success tracking

### Related Features
- [Skill Adjacency Matching](#skill-adjacency-matching)
- [Hire Probability Engine](#hire-probability-engine)

---

## Honeypot & Legitimacy Check

### Purpose
Automatically detect and flag resume profiles that appear to have been keyword-stuffed or AI-generated to game ATS systems.

### Problem Solved
AI-generated resumes and keyword-stuffed profiles waste recruiter time and lead to bad hires.

### User Benefit
Suspicious profiles are automatically flagged with a ⚠️ CRITICAL alert, protecting recruiters from wasted effort.

### Detection Signals
1. **Perfect keyword mirror**: Candidate lists exactly every job skill with no additional skills
2. **Verbatim JD copy**: Candidate summary contains the first 50+ chars of the job description

### Penalty
When detected: P(Legitimate) collapses to 0.10, causing final hire probability to drop to near-zero.

### Screens
- 🚨 CRITICAL risk badge on candidate card
- "Honeypot Alert" in AI explanation
- Red flag in export XLSX

### Future Improvements
- NLP-based detection of AI-generated text patterns
- Cross-application honeypot pattern tracking
- Automated candidate disqualification with audit log

### Related Features
- [Authenticity Challenge System](#authenticity-challenge-system)
- [Hire Probability Engine](#hire-probability-engine)

---

## Authenticity Challenge System

### Purpose
Verify that candidates genuinely possess the skills they claim by presenting domain-specific knowledge challenges.

### Problem Solved
Resumes can claim any skill. Challenges force proof-of-knowledge, separating genuine experts from resume inflators.

### User Benefit
Candidates who pass challenges receive a ✅ VERIFIED badge, increasing recruiter confidence and their own P(Legitimate) score.

### Challenge Flow
1. System generates 3 open-ended questions based on candidate skills
2. Candidate submits answers via dashboard
3. AI evaluates response quality (planned)
4. Status updated: `PENDING → VERIFIED / FAILED`

### Screens
- Challenge prompt on Candidate Dashboard
- Challenge status (PENDING/VERIFIED/FAILED) on Recruiter view
- ✅ Verified badge on candidate cards

### Future Improvements
- AI-evaluated answer scoring (Gemini integration)
- Time-boxed live challenges
- Code submission challenges for engineering roles

### Related Features
- [Honeypot & Legitimacy Check](#honeypot--legitimacy-check)
- [Hire Probability Engine](#hire-probability-engine)

---

## Skill Adjacency Matching

### Purpose
Recognize technology equivalences so candidates with equivalent but non-identical skills receive fair evaluation.

### Problem Solved
"Must know AWS" should not disqualify a GCP expert. ATS tools don't know these technologies are equivalent.

### User Benefit
Broader talent pool. Fairer evaluations. More qualified candidates surfaced.

### Adjacency Map (Sample)

| Required Skill | Recognized Equivalent |
|---|---|
| React | Vue, Svelte, Angular |
| AWS | GCP, Azure |
| Kubernetes | Docker, ECS, Nomad |
| PostgreSQL | MySQL, MongoDB, SQLite |
| Python | R, Julia |

### Screens
- Strength tags: *"Vue.js (equivalent to React)"*
- Hidden Gem badge when multiple adjacent matches found

### Future Improvements
- Graph-based dynamic skill network
- Industry-specific adjacency maps
- User-submitted adjacency suggestions

---

## Second Chance AI

### Purpose
Generate personalized learning roadmaps for rejected candidates, track their growth, and automatically re-match them to new openings.

### Problem Solved
Rejected candidates disappear from talent pipelines forever, even when they're "almost ready" and improving rapidly.

### User Benefit

**For Candidates**: A concrete, personalized path from "rejected" to "hired" with trackable milestones.

**For Recruiters**: A self-improving talent pool that automatically resurfaces previously rejected candidates when they've grown.

### Data Model
`LearningRoadmap` stores:
- Target role
- Ordered milestones
- Estimated weeks to completion
- Progress percentage

### Screens
- Learning Roadmap panel on Candidate Dashboard
- Progress tracking visualization
- Re-match notification when roadmap is completed

### Future Improvements
- Curated course recommendations per milestone
- Auto-trigger re-application on roadmap completion
- Peer learning communities

---

## Talent Twin Discovery

### Purpose
Identify pairs of candidates with similar competency DNA profiles.

### User Benefit

**For Recruiters**: When a star candidate declines, quickly find a near-identical alternative.

**For Candidates**: Understand where they fit in the talent market relative to peers.

### How It Works
DNA embedding vectors are compared using cosine similarity. Candidates with similarity score ≥ 0.85 are marked as Talent Twins.

### Data Model
`TalentTwin` stores similarity score, shared strengths, and key differentiators.

---

## Future Role Matching

### Purpose
Predict the most likely next career role for each candidate based on trajectory analysis.

### User Benefit
Recruiters can identify candidates who are not ready *today* but will be perfect for a role in 12–24 months, enabling proactive pipeline building.

### Data Model
`FutureMatch` stores:
- Predicted role title
- Match probability
- Required growth areas
- Timeframe in months

### Screens
- "Future Roles" panel on Candidate Dashboard
- 12-month and 24-month career projections

---

## Learning Roadmap Generator

### Purpose
Create a structured, milestone-based learning plan to bridge the gap between a candidate's current profile and their target role.

### User Benefit
Candidates get a concrete, actionable growth path. Not just "improve your skills" — but specific milestones with estimated timeframes.

### Roadmap Structure

```json
{
  "title": "Path to Senior Full-Stack Engineer",
  "targetRole": "Senior Full-Stack Engineer",
  "estimatedWeeks": 16,
  "milestones": [
    { "week": 1-4,  "goal": "Master TypeScript generics and advanced patterns" },
    { "week": 5-8,  "goal": "Complete PostgreSQL performance optimization course" },
    { "week": 9-12, "goal": "Build a production-grade side project" },
    { "week": 13-16,"goal": "Contribute to 2 open-source projects" }
  ]
}
```

---

## Candidate Intent Analysis

### Purpose
Analyze signals to estimate how genuinely interested and available a candidate is for the role.

### Data Model
`IntentAnalysis` stores:
- Intent score (0–1)
- Genuine interest signal
- Cultural alignment score
- Long-term fit indicator

### Future Signals
- LinkedIn activity patterns
- Time between application and profile update
- Response rate to recruiter messages

---

## Recruiter Dashboard

### Purpose
The central workspace for recruiters to manage jobs, review candidates, and generate rankings.

### Key Panels
- **Job Pipeline**: Active, paused, closed job postings
- **Candidate Rankings**: Sorted by hire probability
- **DNA Radar Charts**: Visual competency maps per candidate
- **AI Copilot Drawer**: AI assistant for sourcing queries
- **Hidden Gems Tab**: Filtered view of surfaced non-obvious candidates
- **Honeypot Alerts**: Flagged suspicious profiles
- **Export Button**: One-click XLSX download

---

## Candidate Dashboard

### Purpose
The personal workspace for candidates to manage their profile, resume, and applications.

### Key Panels
- **Profile Editor**: Skills, experience, education, links
- **Resume Upload**: PDF processing and skill extraction
- **Career DNA**: Personal 8-dimension radar chart
- **Job Board**: Browse and apply to open positions
- **Applications Tracker**: Status of submitted applications
- **Learning Roadmap**: Personalized growth milestones
- **Future Roles**: AI-predicted career trajectory
- **Authenticity Challenge**: Verification quiz

---

## Export XLSX Reports

### Purpose
Generate professional spreadsheet reports of ranked candidates for sharing, analysis, and record-keeping.

### Generated Columns
Rank, Name, Email, Hire Probability, P(Q), P(A), P(E), P(L), P(G), P(S), Hidden Gem, Honeypot Risk, AI Summary

### Technology
`ExcelJS` runs entirely client-side — no file generation server needed.

### Screens
- Export modal with column selection
- Instant download in browser

---

## Notification System

### Purpose
Keep both recruiters and candidates informed about status changes, matches, challenges, and roadmap milestones.

### Notification Types

| Type | Recipient | Trigger |
|---|---|---|
| `MATCH` | Candidate | New job match found |
| `STATUS_UPDATE` | Candidate | Application status changed |
| `CHALLENGE` | Candidate | Authenticity challenge generated |
| `LEARNING` | Candidate | Roadmap milestone reached |
| `FUTURE_ROLE` | Candidate | New future role prediction |
| `SYSTEM` | All | Platform announcements |

---

## Job Management

### Purpose
Full CRUD management for job listings with draft/active/paused/closed status workflow.

### Status Flow
```
DRAFT → ACTIVE → PAUSED → CLOSED
```

### Access Control
- Recruiters can create, update, and delete their own jobs
- Candidates can view ACTIVE jobs only
- Admins have full access

---

## Application Pipeline Tracking

### Purpose
Track the full lifecycle of a candidate application through the hiring pipeline.

### Pipeline Stages
```
APPLIED → SCREENING → INTERVIEW → OFFER → HIRED
                                         ↓
                                      REJECTED
                                         ↓
                                  SECOND_CHANCE
```

The `SECOND_CHANCE` status is unique to HireMind — it triggers the learning roadmap generation for strong-but-not-ready candidates.

---

## Related Documentation

- [Product Overview](PRODUCT_OVERVIEW.md) — Vision and mission
- [Recruiter Guide](RECRUITER_GUIDE.md) — Step-by-step recruiter workflow
- [Candidate Guide](CANDIDATE_GUIDE.md) — Step-by-step candidate workflow
- [Scoring Engine](../architecture/SCORING_ENGINE.md) — P-factor details
- [Future Roadmap](FUTURE_ROADMAP.md) — Upcoming features
