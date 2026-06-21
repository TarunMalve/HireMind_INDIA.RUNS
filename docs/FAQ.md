# Platform FAQ — HireMind Elite

This document answers 30+ frequently asked questions about the HireMind Elite platform.

---

## 1. General & Platform Usage

### Q1: What is HireMind Elite?
HireMind Elite is a talent intelligence platform that uses a multiplicative Hire Probability Engine to rank candidates based on actual employability signals rather than keyword matching.

### Q2: How does the pricing model work?
We offer a Starter (Free) plan, a Growth Plan (₹4,999/month), and custom Enterprise plans. See the [Pricing Page](docs/USER_GUIDE.md) for details.

### Q3: How do I switch between dark and light themes?
Click the Sun/Moon icon in the upper-right corner of the navbar or header dashboard to toggle themes. Your choice is saved automatically in `localStorage`.

### Q4: Can I run this platform locally without internet access?
The UI, database, and scoring calculations operate offline. However, file parsing and semantic analysis require API connections to Gemini or OpenAI services.

### Q5: Is my resume data sold to third parties?
No. All candidate profiles are encrypted, protected by JWT access tokens, and stored in a private database instance.

### Q6: How do I contact support?
Enterprise users have a dedicated CSM. Standard users can open issues on the GitHub repository or contact `support@hiremind.ai`.

---

## 2. The AI & Scoring Engine

### Q7: Why does HireMind use a multiplicative scoring model?
Linear models allow weak dimensions (like zero availability or resume fraud) to be masked by high match scores. Multiplicative logic ensures that if any critical parameter falls, the overall candidate score drops dramatically.

### Q8: What are the 6 P-factors evaluated?
We evaluate: $P(Qualified)$, $P(Available)$, $P(Engageable)$, $P(Legitimate)$, $P(Growth)$, and $P(Scrappiness)$.

### Q9: What is the "Zero-Killer Alert"?
If any P-factor drops below $15\%$, a red warning banner is triggered in the recruiter quickview panel, indicating a critical risk.

### Q10: How does the system detect "Hidden Gems"?
The engine identifies candidate records where $P(Growth)$ and $P(Scrappiness)$ are high (based on commit activity, trajectory speed, and certification velocity), even if they lack pedigree company names.

### Q11: What is a Honeypot candidate?
A profile flagged with fake projects or inconsistent timelines. The system collapses their $P(Legitimate)$ score to $0.10$, reducing their overall score to $5\%$.

### Q12: How are verification quizzes generated?
Our AI agent scans the candidate's resume, identifies declared frameworks, and extracts realistic questions to test their conceptual knowledge.

### Q13: Can a candidate retake a failed quiz?
Yes, after a cooldown period of 24 hours. The dashboard recommends specific learning materials based on missed questions.

### Q14: How does the "Second Chance AI" work?
If a recruiter rejects a candidate, the system generates a custom training roadmap. As the candidate completes steps, they can get auto-rematched to future job ads.

### Q15: What LLM models do you use?
We interface with Gemini 1.5 Flash and OpenAI GPT-4o depending on prompt complexity.

### Q16: How do you handle LLM prompt hallucinations?
We enforce strict JSON output schemas in system prompts and run schema validation in backend parser routes before writing data to database records.

---

## 3. Database & System Design

### Q17: What database does HireMind use?
We use PostgreSQL mapped with Prisma ORM.

### Q18: Are database queries fast on large talent pools?
Yes, we use indices on database records, such as GIN index structures on jsonb skills columns.

### Q19: Does the platform use caching?
Yes, shortlist endpoints are cached using a Redis layer with invalidation triggers when profiles change.

### Q20: Can I import candidates from an ATS?
Yes, we support bulk CSV candidate uploads and direct API sync integrations.

---

## 4. Troubleshooting & Installation

### Q21: Why does `npm run dev` fail?
Ensure you have run `npm install` in the root, generated the Prisma client, and configured the database parameters in your `.env` file.

### Q22: What Node.js versions are supported?
We support Node.js v18.x and v20.x.

### Q23: Why do I get a "Prisma Client not found" error?
Run `npx prisma generate` in the backend directory to compile the query client models.

### Q24: How do I resolve database connection timeouts?
Verify that your PostgreSQL server is active and that your `DATABASE_URL` matches the target credentials.

### Q25: Why is my Three.js background not loading?
Ensure your browser supports WebGL and has hardware acceleration enabled in the settings panel.

---

## 5. Security & Privacy

### Q26: Is HireMind GDPR compliant?
Yes. Candidates must consent to processing and can delete their records permanently from the dashboard.

### Q27: How are API keys secured?
Keys are managed in environment variables and never committed to version control.

### Q28: How does the system handle CORS issues?
The backend Express server has CORS middleware configured to allow requests only from verified domain origins.

### Q29: Can I toggle blind recruitment?
Yes, a toggle in recruiter settings masks candidate names, genders, and avatars to ensure unbiased ranking.

### Q30: How is candidate authentication managed?
We use Clerk for production, and custom JWT authorization middleware for development environments.