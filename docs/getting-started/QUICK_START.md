# Quick Start Guide

> **From zero to your first AI-powered candidate ranking in under 5 minutes.**

---

## Table of Contents

- [Prerequisites Checklist](#prerequisites-checklist)
- [Setup in Under 5 Minutes](#setup-in-under-5-minutes)
- [First Recruiter Workflow](#first-recruiter-workflow)
- [First Candidate Workflow](#first-candidate-workflow)
- [Upload First Resume](#upload-first-resume)
- [Upload First Job Description](#upload-first-job-description)
- [Generate Rankings](#generate-rankings)
- [Export Results](#export-results)

---

## Prerequisites Checklist

Before starting, confirm:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] PostgreSQL running and accessible
- [ ] Clerk account created at [clerk.com](https://clerk.com)
- [ ] OpenAI or Gemini API key obtained
- [ ] Repository cloned and dependencies installed

> If you haven't completed setup, start with the [Installation Guide](INSTALLATION.md).

---

## Setup in Under 5 Minutes

```bash
# 1. Clone
git clone https://github.com/TarunMalve/HireMind_INDIA.RUNS.git
cd HireMind_INDIA.RUNS

# 2. Install all dependencies
npm install && cd backend && npm install && cd ../frontend && npm install && cd ..

# 3. Setup environment
cp backend/.env.example backend/.env
# → Edit backend/.env with your credentials

# 4. Setup database
npm run db:generate
npm run db:migrate

# 5. Start development servers
npm run dev
```

Open **http://localhost:3000** — HireMind is running.

---

## First Recruiter Workflow

### Step 1 — Sign Up as a Recruiter

1. Navigate to **http://localhost:3000**
2. Click **Get Started** or **Sign Up**
3. Complete Clerk authentication (email, Google, or GitHub)
4. When prompted for role, select **Recruiter**
5. Enter your **company name** and **department**
6. You will land on the **Recruiter Dashboard**

### Step 2 — Create Your First Job

1. From the Dashboard, click **Post a Job** or **+ New Job**
2. Fill in the job details:
   - **Title**: e.g., `Senior Full-Stack Engineer`
   - **Company**: Your company name
   - **Location**: e.g., `Remote` or `Bangalore, India`
   - **Description**: Paste or type the full job description
   - **Required Skills**: e.g., `React, TypeScript, Node.js, PostgreSQL`
   - **Nice to Have**: e.g., `GraphQL, Docker`
3. Click **Post Job**

### Step 3 — Review Candidate Rankings

1. From the Dashboard, open the job you just created
2. Click **View Candidates** or **Rankings**
3. The AI engine scores each applicant across 6 P-factors
4. Hidden Gems and Honeypot alerts are flagged automatically

### Step 4 — Inspect Candidate DNA

1. Click any candidate card to open their full profile
2. Review the **DNA Radar Chart** — a 6-dimension competency map
3. Read the **AI Recruiter Brief** — plain-language hiring summary
4. View **Strengths**, **Risks**, and **Transferable Skills**

### Step 5 — Export Results

1. Click **Export** from the rankings view
2. Select **XLSX** format
3. Download includes all scores, rankings, and AI explanations

---

## First Candidate Workflow

### Step 1 — Register as a Candidate

1. Navigate to **http://localhost:3000**
2. Click **Get Started as Candidate**
3. Complete Clerk authentication
4. Select **Candidate** as your role
5. You land on the **Candidate Dashboard**

### Step 2 — Complete Your Profile

1. Add your **headline** (e.g., `Full-Stack Engineer with 4 years experience`)
2. Add your **skills** (comma-separated)
3. Add **work experience** entries
4. Add **education** entries
5. (Optional) Add LinkedIn and GitHub profile URLs

### Step 3 — Upload Your Resume

1. Click **Upload Resume** from your dashboard
2. Drag and drop or select a PDF file
3. The AI engine will:
   - Parse your resume text
   - Extract skills automatically
   - Generate your **Candidate DNA** profile
4. Review the extracted data and correct any errors

### Step 4 — View Your Career DNA

1. From your dashboard, click **Career DNA**
2. View your multi-dimensional profile:
   - Technical Depth
   - Problem Solving
   - Leadership
   - Communication
   - Creativity
   - Adaptability
3. Review your **AI-generated strengths** and **growth areas**

### Step 5 — Apply to Jobs

1. Browse available job postings from the **Jobs** section
2. Click **Apply** on any listing
3. The system matches your profile to the job description
4. View your match score and how you rank against other candidates

---

## Upload First Resume

### Via Candidate Dashboard

```
Candidate Dashboard → Upload Resume → Select PDF → Submit
```

The system processes the resume and:

1. Extracts raw text using the document parser
2. Identifies skills, experience entries, and education records
3. Calculates years of experience from duration strings
4. Detects LinkedIn and GitHub URLs
5. Generates Candidate DNA scores

### Via API (Developer Mode)

```bash
curl -X POST http://localhost:4000/api/ai/analyze-resume \
  -H "Authorization: Bearer <your-clerk-token>" \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "John Doe, Senior Engineer, 5 years React, TypeScript..."}'
```

---

## Upload First Job Description

### Via Recruiter Dashboard

```
Recruiter Dashboard → + New Job → Fill Form → Post Job
```

### Via API

```bash
curl -X POST http://localhost:4000/api/jobs \
  -H "Authorization: Bearer <your-clerk-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full-Stack Engineer",
    "company": "Acme Corp",
    "description": "We are looking for...",
    "skills": ["React", "TypeScript", "Node.js"],
    "location": "Remote",
    "locationType": "REMOTE"
  }'
```

---

## Generate Rankings

### Automatic (Recommended)

Rankings are generated automatically when a candidate applies to a job. The 6-factor scoring engine runs in the background.

### Manual (Via API)

```bash
curl -X POST http://localhost:4000/api/ai/rank \
  -H "Authorization: Bearer <your-clerk-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "cand_abc123",
    "jobId": "job_xyz456"
  }'
```

### Sample Response

```json
{
  "success": true,
  "data": {
    "match_score": 62,
    "hire_probability": {
      "qualified": 0.87,
      "available": 0.80,
      "engageable": 0.78,
      "legitimate": 0.95,
      "growth": 0.75,
      "scrappiness": 0.68,
      "hire_score": 62
    },
    "hidden_gem": false,
    "honeypot_risk": false,
    "strengths": [
      "Strong knowledge in React",
      "Strong knowledge in TypeScript"
    ],
    "risks": [],
    "reasoning": "Candidate shows a robust 62% hire probability score..."
  }
}
```

---

## Export Results

### From the Dashboard

1. Open any job's candidate ranking view
2. Click the **Export** button (top right)
3. Choose **Export as XLSX**
4. The file downloads with:
   - Candidate name, email, rank
   - All 6 P-factor scores
   - Hire probability percentage
   - AI reasoning text
   - Hidden gem / honeypot flags

### Exported Fields

| Column | Description |
|---|---|
| Rank | Final ranking position |
| Name | Candidate full name |
| Email | Contact email |
| Hire Probability | Final multiplicative score (%) |
| P(Qualified) | Technical & experience fit |
| P(Available) | Job change availability |
| P(Engageable) | Activity & engagement signals |
| P(Legitimate) | Credibility & authenticity |
| P(Growth) | Career trajectory score |
| P(Scrappiness) | Open-source & initiative |
| Hidden Gem | Yes/No flag |
| Honeypot Risk | Yes/No flag |
| AI Summary | Recruiter brief text |

---

## What's Next?

| Guide | Link |
|---|---|
| Full Installation | [INSTALLATION.md](INSTALLATION.md) |
| Local Dev Setup | [LOCAL_SETUP.md](LOCAL_SETUP.md) |
| Recruiter Guide | [../product/RECRUITER_GUIDE.md](../product/RECRUITER_GUIDE.md) |
| Candidate Guide | [../product/CANDIDATE_GUIDE.md](../product/CANDIDATE_GUIDE.md) |
| AI Engine Deep Dive | [../architecture/AI_ENGINE.md](../architecture/AI_ENGINE.md) |
| API Reference | [../api/API_REFERENCE.md](../api/API_REFERENCE.md) |
