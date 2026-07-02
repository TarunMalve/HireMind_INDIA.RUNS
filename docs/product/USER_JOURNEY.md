# User Journey Maps

> **Visual step-by-step journeys for every user type in HireMind Elite.**

---

## Table of Contents

- [Recruiter Journey](#recruiter-journey)
- [Candidate Journey](#candidate-journey)
- [Admin Journey](#admin-journey)
- [End-to-End Hiring Flow](#end-to-end-hiring-flow)

---

## Recruiter Journey

```mermaid
journey
    title Recruiter Journey — From Job Post to Hire
    section Onboarding
        Create Account: 5: Recruiter
        Set Up Company Profile: 4: Recruiter
        Land on Dashboard: 5: Recruiter
    section Job Management
        Post First Job: 4: Recruiter
        Fill Job Details + Skills: 3: Recruiter
        Publish to Active: 5: Recruiter
    section Sourcing
        Invite Candidates: 3: Recruiter
        View Incoming Applications: 4: Recruiter
        Refresh Rankings: 5: Recruiter
    section Evaluation
        Review Ranked Candidate List: 5: Recruiter
        Open Candidate DNA Chart: 5: Recruiter
        Review AI Recruiter Brief: 5: Recruiter
        Check Hidden Gems Tab: 4: Recruiter
        Flag Honeypot Profiles: 3: Recruiter
    section Decision
        Compare Top 3 Candidates: 4: Recruiter
        Move to Interview Stage: 5: Recruiter
        Extend Offer: 5: Recruiter
        Export XLSX Report: 4: Recruiter
    section Follow-Up
        Move Rejected to Second Chance: 4: Recruiter
        Track Candidate Growth: 3: Recruiter
```

### Detailed Recruiter Workflow

```mermaid
flowchart TD
    A["🔐 Sign In\n(Clerk Auth)"]
    --> B["🏠 Recruiter Dashboard\n(Pipeline overview)"]
    --> C["➕ Post New Job\n(Title, Skills, JD, Location)"]
    --> D["📢 Job Published\n(Status: ACTIVE)"]
    --> E["📩 Candidates Apply\n(Auto-ranking triggered)"]
    --> F["📊 Review Rankings\n(Sorted by Hire Probability)"]

    F --> G{"Any Honeypots?"}
    G -->|Yes| H["🚨 Flag Honeypot\n(Do not contact)"]
    G -->|No| I["💎 Check Hidden Gems\n(Adjacent-skill candidates)"]

    I --> J["🧬 Open DNA Panel\n(Radar chart + AI brief)"]
    --> K["↔️ Compare Top Candidates"]
    --> L{"Decision?"}

    L -->|Interview| M["📅 Move to INTERVIEW\n(Notification sent)"]
    L -->|Reject| N["📚 Move to SECOND_CHANCE\n(Roadmap generated)"]

    M --> O["✅ Extend Offer\n(Move to OFFER → HIRED)"]
    O --> P["📤 Export XLSX\n(Full ranking report)"]
```

---

## Candidate Journey

```mermaid
journey
    title Candidate Journey — From Registration to Hired
    section Registration
        Create Account: 5: Candidate
        Select Candidate Role: 4: Candidate
        Complete Basic Profile: 4: Candidate
    section Profile Building
        Upload Resume: 4: Candidate
        Review AI-Extracted Skills: 4: Candidate
        Add Experience Details: 3: Candidate
        Link GitHub + LinkedIn: 5: Candidate
    section AI Analysis
        View Career DNA Radar: 5: Candidate
        Read AI Strengths Analysis: 5: Candidate
        Review Growth Areas: 4: Candidate
        Complete Authenticity Challenge: 3: Candidate
    section Job Search
        Browse Job Board: 4: Candidate
        Apply to Matched Jobs: 4: Candidate
        View Own Match Score: 4: Candidate
    section Growth
        View Learning Roadmap: 4: Candidate
        Track Roadmap Progress: 3: Candidate
        View Future Role Predictions: 5: Candidate
    section Outcome
        Receive Interview Invitation: 5: Candidate
        Accept Offer: 5: Candidate
```

### Detailed Candidate Workflow

```mermaid
flowchart TD
    A["🔐 Sign Up\n(Clerk Auth)"]
    --> B["👤 Create Profile\n(Skills, Experience, Education)"]
    --> C["📄 Upload Resume\n(PDF → AI extraction)"]
    --> D["🔍 AI Parses Resume\n(Skills, Experience, Summary)"]
    --> E["🧬 Career DNA Generated\n(8-dimension radar chart)"]

    E --> F["🎯 Take Authenticity Challenge\n(Verify claimed skills)"]
    F --> G{"Result?"}
    G -->|Verified| H["✅ P(Legitimate) High\n(Better rankings)"]
    G -->|Failed| I["⚠️ P(Legitimate) Reduced\n(Re-attempt available)"]

    H & I --> J["🔍 Browse Job Board\n(Filtered by match score)"]
    --> K["📝 Apply to Job\n(Instant 6-factor scoring)"]
    --> L["📊 View My Ranking\n(Where do I stand?)"]

    L --> M{"Application Status?"}
    M -->|Interview| N["📅 Interview Scheduled\n(Notification received)"]
    M -->|Rejected| O["📚 Second Chance\n(Learning roadmap created)"]
    M -->|Offered| P["🎉 Offer Accepted → HIRED"]

    O --> Q["📈 Follow Roadmap\n(Track progress)"]
    --> R["🔄 Re-Matched to Future Job\n(Auto-surfaced when ready)"]
```

---

## Admin Journey

```mermaid
flowchart TD
    A["🔐 Sign In\n(Admin Credentials)"]
    --> B["📊 Admin Dashboard\n(Platform overview)"]
    
    B --> C["👥 User Management"]
    C --> C1["View All Users"]
    C --> C2["Assign Roles"]
    C --> C3["Deactivate Accounts"]

    B --> D["📋 Job Oversight"]
    D --> D1["View All Job Listings"]
    D --> D2["Moderate Posted Jobs"]
    D --> D3["Access Ranking Data"]

    B --> E["🧬 Candidate Pool"]
    E --> E1["View All Candidate Profiles"]
    E --> E2["Review DNA Analytics"]
    E --> E3["Export Platform Reports"]

    B --> F["⚙️ System Administration"]
    F --> F1["Monitor API Health"]
    F --> F2["Review Rate Limit Logs"]
    F --> F3["Database Maintenance"]
```

---

## End-to-End Hiring Flow

The complete interaction between all system actors:

```mermaid
sequenceDiagram
    participant C as Candidate
    participant FE as Frontend
    participant API as Express API
    participant RE as Ranking Engine
    participant DB as PostgreSQL
    participant R as Recruiter

    Note over C: Registration
    C->>FE: Sign Up (Clerk)
    FE->>API: Create User Profile
    API->>DB: Store User + Candidate

    Note over C: Profile Building
    C->>FE: Upload Resume
    FE->>API: POST /api/ai/analyze-resume
    API-->>FE: Extracted Skills + Experience
    FE->>API: Update Candidate Profile
    API->>DB: Save Skills, Experience, DNA

    Note over R: Job Posting
    R->>FE: Post Job Description
    FE->>API: POST /api/jobs
    API->>DB: Create Job with Skills

    Note over C: Application
    C->>FE: Apply to Job
    FE->>API: POST /api/applications
    API->>RE: rankCandidate(candidate, job)
    RE-->>API: RankResult + DNA + Reasoning
    API->>DB: Save Application Scores
    API-->>FE: Application confirmed

    Note over R: Evaluation
    R->>FE: Open Job Rankings
    FE->>API: GET /api/applications/matches/:jobId
    API->>DB: Fetch All Applications
    API-->>FE: Sorted Ranked List
    FE-->>R: Dashboard with DNA Charts

    Note over R: Decision
    R->>FE: Move Candidate to INTERVIEW
    FE->>API: PUT /api/applications/:id/status
    API->>DB: Update Status
    API->>DB: Create Notification
    DB-->>C: Notification: Interview Scheduled
```

---

## Journey Summary

| Journey | Key Decision Points | AI Touchpoints |
|---|---|---|
| **Recruiter** | Post job, review rankings, shortlist, extend offer | Hidden gem detection, DNA generation, honeypot alerts |
| **Candidate** | Build profile, take challenge, apply, track status | Resume parsing, DNA analysis, authenticity challenge, roadmap |
| **Admin** | User management, platform oversight | Platform health monitoring |

---

## Related Documentation

- [Recruiter Guide](RECRUITER_GUIDE.md) — Detailed recruiter workflow
- [Candidate Guide](CANDIDATE_GUIDE.md) — Detailed candidate workflow
- [Features](FEATURES.md) — Feature-by-feature breakdown
- [Data Pipeline](../architecture/DATA_PIPELINE.md) — Technical pipeline behind each step
